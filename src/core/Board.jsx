import _                        from 'lodash';
import $                        from 'jquery';
import React,
       { Component, PropTypes } from 'react';
import ReactDOM                 from 'react-dom';

import AuthStore                from './AuthStore';
import * as Actions             from './BoardActions';
import WidgetWrapper            from '../widget/Wrapper';
import WidgetClone              from '../widget/Clone';
import BoardStore               from './BoardStore';

import Styles from './Board.scss';

/**
 * Construct a board with background drawing and image
 * plus render a list of widgets *
 */
export default class Board extends Component {

    /**
     * Subscribe to Actions fired by children's component to update his state
     * @param  {[type]} props [description]
     * @return {[type]}       [description]
     */
    constructor( props ) {
        super( props );
        this.state = {};

        this.unsub = [];

        this.unsub.push( Actions.setIsDrawing.listen( this.setIsDrawing.bind( this ) ) ) ;
        this.unsub.push( Actions.zoomOut.listen( this.zoomOut.bind( this ) ) );
        this.unsub.push( Actions.zoomIn.listen( this.zoomIn.bind( this ) ) );
        this.unsub.push( Actions.addWidgetClone.listen( this.addWidget.bind( this ) ) );
        this.unsub.push( Actions.updateSize.listen( this.updateSize.bind( this ) ) );
    }

    /**
     * size Getter return the current size of the board
     * @return {Object} {x: Integer, y : Integer}
     */
    get size() { return BoardStore.size || { width : $( document ).width(), height : $( document ).height() }; }

    /**
     * Add a listener on resize to the window to update the board size
     */
    componentDidMount() {
        $( window ).resize( this.updateSize.bind( this ) );
        this.updateSize();
    }

    /**
    * Remove the resize listener from the window
    */
    componentWillUnmount(){
        $( window ).off("resize");
        this.unsub.forEach( unsub => {
            unsub();
        });
    }

    setIsDrawing( isDrawing ) {
        this.setState( { isDrawing } );
    }

    addWidget( type, props = {} ) {
        const widgetToAdd = { type, props };
        this.setState( { widgetToAdd } );
    }

    /**
     * Prepare the event and function for the autoScroll when mousedown
     */
    onMouseDown( event ) {
        this._startX = event.screenX;
        this._startY = event.screenY;
        this._startScrollLeft = $( 'body' ).scrollLeft();
        this._startScrollTop = $( 'body' ).scrollTop();

        ReactDOM.findDOMNode( this ).addEventListener( 'mousemove', this.onMouseMove );
        ReactDOM.findDOMNode( this ).addEventListener( 'mouseup', this.onMouseUp );
    }

    /**
     * If the cursor is on one side of the screen scroll in this direction
     */
    onMouseMove = ( event ) => {
        console.log('moving');
        let newScrollTop = this._startScrollTop - ( event.screenY - this._startY );
        let newScrollLeft = this._startScrollLeft - ( event.screenX - this._startX );

        let scrollHeight = $( document ).height() - $( window ).height();
        let scrollWidth = $( document ).width() - $( window ).width();

        let { height, width } = this.size;

        if (scrollHeight < newScrollTop) {
            height = parseInt( height ) + newScrollTop - scrollHeight;
        }

        if (scrollWidth < newScrollLeft) {
            width = parseInt( width ) + newScrollLeft - scrollWidth;
        }

        Actions.setSize( { height, width } );

        $( 'body' ).scrollTop( newScrollTop );
        $( 'body' ).scrollLeft( newScrollLeft );
    };

    /**
     * remove the listeners on mouseup & mouseup
     */
    onMouseUp = ( event ) => {
        ReactDOM.findDOMNode( this ).removeEventListener( 'mousemove', this.onMouseMove );
        ReactDOM.findDOMNode( this ).removeEventListener( 'mouseup', this.onMouseUp );
    };

    /**
     * Called when positioning a new widget
     * Fire Actions.addWidget with the new widget to create
     * @param  {event} used for the position of the click
     */
    onClick( event ) {
        const { widgetToAdd } = this.state;
        if ( widgetToAdd ) {
            let widget = widgetToAdd;
            widget.props.position = { x: event.pageX, y: event.pageY };
            Actions.addWidget( widget );
            this.setState( { widgetToAdd : null } );
        }
    }

    /**
     * Getter which return the current zoom on the board
     * default value is 1
     * @return {int} the css value of the zoom
     */
    getZoom() {
        const boardElement = ReactDOM.findDOMNode( this )
        return +$( boardElement ).css( 'zoom' );
    }

    /**
     * add 0.1 to the current zoom
     */
    zoomIn() {
        $( ReactDOM.findDOMNode( this ) ).css( { zoom : this.getZoom() + 0.1 } );
        Actions.setZoom( this.getZoom() );
    }

    /**
     * remove 0.1 to the current zoom if the zoom if higher than 0.1
     */
    zoomOut() {
        const oldZoom = this.getZoom();
        if ( oldZoom > 0.1 ) {
            $( ReactDOM.findDOMNode( this ) ).css( { zoom : oldZoom - 0.1 } );
            Actions.setZoom( this.getZoom() );
            this.updateSize();
        }
    }

    /**
     * update the size of the board
     */
    updateSize() {

        let shouldUpdate = false;
        let zoom = this.getZoom();
        zoom = zoom > 1 ? 1 : zoom;

        const windowSize = {
            height  : $( window ).height(),
            width   : $( window ).width()
        };

        const documentSize = {
            height : Math.max( $( ReactDOM.findDOMNode( this ) ).height(), windowSize.height / zoom ),
            width  : Math.max( $( ReactDOM.findDOMNode( this ) ).width(), windowSize.width / zoom )
        };

        let { width, height } = this.size;

        if ( width <= documentSize.width ) {
            width = documentSize.width;
            shouldUpdate = true;
        }

        if ( height <= documentSize.height ) {
            height = documentSize.height;
            shouldUpdate = true;
        }

        if ( shouldUpdate ) {
            Actions.setSize( { width, height } );
        }
    }

    /**
    * create the JSX element to render a Widget
    *  key is the id of the widget in the list of widget
    *  baseKey is widgetKey in firebase
    * @param  {widget} The widget to render
    * @return {JSX} Widget wrapper with props needed for the widget
    */
    renderWidget( widget ) {
        const baseKey = widget.key;
        const { firebaseUrl , boardKey } = AuthStore.appConfig;
        const baseUrl = `${firebaseUrl}/widgets/${boardKey}/${baseKey}/props`;
        return <WidgetWrapper key={ baseKey } baseKey={ baseKey } widgetType={ widget.val.type } baseUrl={ baseUrl } />
    }

    render() {
        // FIXME : do we really need to show the background drawing here ???
        const { widgets, backgroundDrawing, backgroundImage } = this.props;
        const { widgetToAdd, isDrawing } = this.state;

        const drawingBackgroundStyle = backgroundDrawing ? _.merge( {}, {
            background: `url(${backgroundDrawing})`,
            backgroundRepeat : 'no-repeat'
        }, this.size ) : {};

        const boardBackgroundStyle = backgroundImage ? {
            background : `url(${backgroundImage})`,
            backgroundSize : 'cover'
        } : {};

        return (
            <div className={ Styles.root } tabIndex="1" style={ this.size } onClick={ this.onClick.bind( this ) } onMouseDown={ this.onMouseDown.bind( this ) }>
                { widgets.map( this.renderWidget.bind( this ) ) }
                { widgetToAdd ? <WidgetClone widgetType={ widgetToAdd.type } widgetProps={ widgetToAdd.props }/> : null  }
                { !isDrawing && backgroundDrawing ? <div className={ Styles.drawingBackground } style={ drawingBackgroundStyle } /> : null }
                <div className={ Styles.background } style={ boardBackgroundStyle }></div>
            </div>
        );
    }
}
