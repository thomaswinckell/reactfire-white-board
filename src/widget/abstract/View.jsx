import React, { Component, PropTypes }      from 'react';
import classNames                           from 'classnames';
import $                                    from 'jquery';
import ReactDOM                             from 'react-dom';

import * as BoardActions                    from 'core/BoardActions';
import { timeBeforeHideMenu,
         spaceBetweenBorderToLaunchScroll } from 'config/WidgetConfig';
import { gridWidth }                        from 'config/BoardConfig';
import Menu                                 from '../Menu';

import Styles   from './View.scss';


export default class AbstractWidgetView extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            canDrag     : true,
            displayMenu : false
        };
        this.onDrag = ::this.onDrag;
        this.onDragEnd = ::this.onDragEnd;
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
                text        : "Edit",
                icon        : "edit"
            },{
                action      : this.props.actions.deleteWidget,
                text        : "Delete",
                icon        : "delete"
            }
        ];
    }

    onDoubleClick( event ) {
        event.preventDefault();
        // FIXME
        //if ( !this.context.widget.isLockedByAnotherUser() ) {
            this.props.actions.setEditMode();
        //}
    }

    onMouseDown( event ) {
        // FIXME
        //if ( !this.context.widget.isLockedByAnotherUser() ) {
            this.onDragStart( event );
        //}
    }

    getInvertedZoom() {
        // FIXME
        //const zoom = BoardStore.getZoom();
        //return zoom >= 1 ? 1 - ( zoom - 1 ) : 1 + ( 1 - zoom );
    }

    onDragStart( event ) {
        if ( !this.state.canDrag ) {
            return;
        }

        const inversedZoom = this.getInvertedZoom();

        this._startX = ( event.pageX * inversedZoom ) - this.props.position.x;
        this._startY = ( event.pageY * inversedZoom ) - this.props.position.y;

        this.isDragging = true;

        document.addEventListener( 'mousemove', this.onDrag );
        document.addEventListener( 'mouseup', this.onDragEnd );

        this.forceUpdate();

        this.props.actions.select();
    }

    onDrag( event ) {

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

        var y = event.pageY - this._startY;
        var x = event.pageX - this._startX;

        x = x > 0 ? x : 0;
        y = y > 0 ? y : 0;

        const inversedZoom = this.getInvertedZoom();

        x = x * inversedZoom;
        y = y * inversedZoom;

        if ( ( Math.abs( this.props.position.x - x ) >= gridWidth ) ||
             ( Math.abs( this.props.position.y - y ) >= gridWidth ) ) {

            x = x - x % gridWidth;
            y = y - y % gridWidth;

            this.link( 'position' ).requestChange( { x, y } );
        }
    }

    onDragEnd( event ) {
        this.isDragging = false;
        document.removeEventListener( 'mousemove', this.onDrag );
        document.removeEventListener( 'mouseup', this.onDragEnd );
        this.props.actions.unselect();
    }

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
        return (
            <div></div>
        );
    }

    render() {

        const className = classNames( Styles.wrapper, {
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

        return (
            <div tabIndex="1000"
                 style={ style }
                 className={ className }
                 onMouseDown={ ::this.onMouseDown }
                 onDoubleClick={ ::this.onDoubleClick }
                 onMouseOver={ ::this.onMouseOver }
                 onMouseOut={ ::this.onMouseOut } >

                 <Menu ref="menu" menuElements={ this.getMenuElements() }
                   position={ this.props.position }
                   display={ !!this.state.displayMenu } />

               { this.renderView() }
           </div>
        );
    }
}
