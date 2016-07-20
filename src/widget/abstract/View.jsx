import React, { Component, PropTypes }      from 'react';
import classNames                           from 'classnames';
import $                                    from 'jquery';

import * as BoardActions                    from '../../core/BoardActions';
import { timeBeforeHideMenu,
         spaceBetweenBorderToLaunchScroll } from '../../config/WidgetConfig';
import { gridWidth }                        from '../../config/BoardConfig';
import Menu                                 from '../Menu';
import BoardStore                           from '../../core/BoardStore';

import translations                         from '../../i18n/messages/messages';

import * as Styles   from './View.scss';

/**
 * Manage drag & drop and all others actions common to all widgets in view mode
 */
export default class AbstractWidgetView extends Component {

    static contextTypes = {
        intl : PropTypes.object
    };

    constructor( props ) {
        super( props );
        this.state = {
            canDrag     : true,
            displayMenu : false
        };
    }

    //catch panels list
    componentDidMount(){
        this.state.panels = BoardStore.panels;
    }

    link( prop ) {
        return {
            value           : this.props[ prop ],
            requestChange   : value => this.props.valueLink( { [ prop ] : value } )
        };
    }

    getMenuElements() {
        return [
            {
                action      : this.props.actions.setEditMode,
                text        : this.context.intl.formatMessage( translations.widgetElement.Menu.Edit ),
                icon        : "edit"
            }, {
                action      : this.props.actions.deleteWidget,
                text        : this.context.intl.formatMessage( translations.widgetElement.Menu.Delete ),
                icon        : "delete"
            }
        ];
    }

    /**
     * If widgets is not locked set edit mode
     */
    onDoubleClick( event ) {
        event.preventDefault();
        if ( !this.props.isLockedByAnotherUser ) {
            this.props.actions.setEditMode();
        }
    }

    /**
     * start drag & drop on Mouse Down if is not locked
     */
    onMouseDown( event ) {
        if ( !this.props.isLockedByAnotherUser ) {
            this.onDragStart( event );
        }
    }

    /**
     * @return Boolean
     * True if widget is in panel
     */
    isInPanel = (panel, x, y) => {
        const pos = panel.val.props.position;
        const size = panel.val.props.size;
        return pos.x < x && x < (pos.x+size.width) && pos.y < y && y < (pos.y+size.height);
    }

    /**
     * check if the widget should go into a panel
     * @param x
     * @param y
     */
    checkPanels = (x, y) => {
        if( this.props.type === 'PanelWidget'){
            return ;
        }

        this.state.panels.map( (panel) => {
             if( this.isInPanel( panel, x, y) ){
                 console.log('yeah');
             }
        })

    };

    /**
     * Init D&D
     * stores initial position of mouse cursor and widget
     * @param  {event} event mouseClick event
     */
    onDragStart( event ) {
        if ( !this.state.canDrag ) {
            return;
        }

        this.initialEventX = event.pageX;
        this.initialEventY = event.pageY;

        this.initialPropsX = this.props.position.x
        this.initialPropsY = this.props.position.y

        this.isDragging = true;

        document.addEventListener( 'mousemove', this.onDrag );
        document.addEventListener( 'mouseup', this.onDragEnd );

        this.forceUpdate();

        this.props.actions.select();
    }

    /**
     * Formula to compute position of the widgets and consider the zoom
     * @param event
     */
    computePositionZoom = ( event ) => {

        const zoom = BoardStore.zoom;

        var x = this.initialPropsX + ((event.pageX - this.initialEventX) / zoom);
        var y = this.initialPropsY + ((event.pageY - this.initialEventY) / zoom);

        x = x > 0 ? x : 0;
        y = y > 0 ? y : 0;

        /*
         round up values of x & y
         example x: 478.5 y : 201 ==> x : 470 y : 200
         */
        if ( ( Math.abs( this.props.position.x - x ) >= gridWidth ) ||
            ( Math.abs( this.props.position.y - y ) >= gridWidth ) ) {

            x = x - x % gridWidth;
            y = y - y % gridWidth;

            return [x, y];
        }
            return [x, y];
    };

    /**
     * Manage D&D
     * @param  {event} event New position of the cursor
     */
    onDrag = ( event ) => {

        this.clearScrollTimeouts();

        if ( ( event.clientX + spaceBetweenBorderToLaunchScroll ) >= $( window ).width() ) {
            this.scrollLeft( false );
        } else if ( ( event.clientX - spaceBetweenBorderToLaunchScroll ) <= 0 ) {
            this.scrollLeft( true );
        }

        if ( ( event.clientY + spaceBetweenBorderToLaunchScroll ) >= $( window ).height() ) {
            this.scrollTop( false );
        } else if ( ( event.clientY - spaceBetweenBorderToLaunchScroll ) <= 0 ) {
            this.scrollTop( true );
        }

        const [x, y] = this.computePositionZoom( event );

        this.link( 'position' ).requestChange( { x, y } );

    };

    /**
     * Remove listener and unlock widget
     */
    onDragEnd = ( event ) => {

        const [x, y] = this.computePositionZoom( event );
        this.checkPanels(x, y );

        this.isDragging = false;
        document.removeEventListener( 'mousemove', this.onDrag );
        document.removeEventListener( 'mouseup', this.onDragEnd );
        this.props.actions.unselect();
    };

    scrollLeft( negativeScroll : boolean ) {

        let x = negativeScroll ? this.props.position.x - spaceBetweenBorderToLaunchScroll : this.props.position.x + spaceBetweenBorderToLaunchScroll;

        if ( x < 0 ) {
            x = 0;
        }

        this.link( 'position' ).requestChange( { x } );

        if (  x === 0 ) {
            return;
        }

        const scrollValue = negativeScroll ? $( 'body' ).scrollLeft() - spaceBetweenBorderToLaunchScroll : $("body").scrollLeft() + spaceBetweenBorderToLaunchScroll;

        $( 'body' ).scrollLeft( scrollValue );

        this._lastTimeoutScrollLeft = setTimeout( () => this.isDragging ? this.scrollLeft( negativeScroll ) : null, 100 );

        BoardActions.updateSize();
    }

    scrollTop( negativeScroll : boolean ) {

        let y = negativeScroll ? this.props.position.y - spaceBetweenBorderToLaunchScroll : this.props.position.y + spaceBetweenBorderToLaunchScroll;

        if ( y < 0 ) {
            y = 0;
        }

        this.link( 'position' ).requestChange( { y } );

        if (  y === 0 ) {
            return;
        }

        const scrollValue = negativeScroll ? $( 'body' ).scrollTop() - spaceBetweenBorderToLaunchScroll : $( 'body' ).scrollTop() + spaceBetweenBorderToLaunchScroll;

        $( 'body' ).scrollTop( scrollValue );

        this._lastTimeoutScrollTop = setTimeout( () => this.isDragging ? this.scrollTop( negativeScroll ) : null, 100 );

        BoardActions.updateSize();
    }

    clearScrollTimeouts() {
        clearTimeout( this._lastTimeoutScrollLeft );
        clearTimeout( this._lastTimeoutScrollTop );
    }

    onMouseOver() {
        clearTimeout( this._mouseOutTimeout );
        this.setState( { displayMenu : true } );
    }

    onMouseOut() {
        this._mouseOutTimeout = setTimeout( () =>
            this.setState( { displayMenu : false }
        ), timeBeforeHideMenu );
    }

    /**
     * @abstract
     */
    renderView() {
        throw `The component ${this.constructor.name} should implement the method renderView !`;
    }

    render() {

        const className = classNames( Styles.root, {
            [ Styles.dragging ] : this.isDragging
        });

        const style = {
            width : this.props.size.width - 30, // FIXME
            height : this.props.size.height - 65
        };

        if ( this.props.displayOnly ) {
            return (
                <div tabIndex="1000"
                     style={ style }
                     className={ className } >
                   { this.renderView() }
               </div>
            );
        }

        if( this.props.isEditingByAnotherUser ){
            return (
                <div tabIndex="1000"
                     style={ style }
                     className={ className } >
                  <div className={ Styles.isEditingByAnotherUser }>
                        { this.props.isEditingBy } is editing...
                  </div>

                   <Menu ref="menu"
                     position = { this.props.position }
                     lock     = { true }
                     display  = { true }
                     lockName = { this.props.lockName }/>
               </div>
            );
        }

        if( this.props.isLockedByAnotherUser ){
            return (
                <div tabIndex="1000"
                     style={ style }
                     className={ className } >
                   { this.renderView() }

                   <Menu ref="menu"
                     position = { this.props.position }
                     lock     = { true }
                     display  = { true }
                     lockName   = { this.props.lockName }/>
               </div>
            );
        }


        return (
            <div tabIndex="1000"
                 style={ style }
                 className={ className }
                 onMouseDown={ this.onMouseDown.bind( this )  }
                 onDoubleClick={ this.onDoubleClick.bind( this )  }
                 onMouseOver={ this.onMouseOver.bind( this )  }
                 onMouseOut={ this.onMouseOut.bind( this )  } >

                 <Menu ref="menu" menuElements={ this.getMenuElements() }
                   position={ this.props.position }
                   display={ !!this.state.displayMenu } />
               <div style={{postion: 'fixed', top:'1%', right:'1%'}}>
                   {this.state.event ? this.state.event.pageX : null }
               </div>
               { this.renderView() }
           </div>
        );
    }
}
