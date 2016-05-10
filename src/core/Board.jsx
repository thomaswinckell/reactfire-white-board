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


export default class Board extends Component {

    constructor( props ) {
        super( props );
        this.state = {};

        Actions.setIsDrawing.listen( this.setIsDrawing.bind( this ) );
        Actions.zoomOut.listen( this.zoomOut.bind( this ) );
        Actions.zoomIn.listen( this.zoomIn.bind( this ) );
        Actions.addWidgetClone.listen( this.addWidget.bind( this ) );
        Actions.updateSize.listen( this.updateSize.bind( this ) );
    }

    get size() { return BoardStore.size || { width : $( document ).width(), height : $( document ).height() }; }

    componentDidMount() {
        $( window ).resize( this.updateSize.bind( this ) );
        this.updateSize();
    }

    setIsDrawing( isDrawing ) {
        this.setState( { isDrawing } );
    }

    addWidget( type, props = {} ) {
        const widgetToAdd = { type, props };
        this.setState( { widgetToAdd } );
    }

    onMouseDown( event ) {
        this._startX = event.screenX;
        this._startY = event.screenY;
        this._startScrollLeft = $( 'body' ).scrollLeft();
        this._startScrollTop = $( 'body' ).scrollTop();

        ReactDOM.findDOMNode( this ).addEventListener( 'mousemove', this.onMouseMove );
        ReactDOM.findDOMNode( this ).addEventListener( 'mouseup', this.onMouseUp );
    }

    onMouseMove = ( event ) => {
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

    onMouseUp = ( event ) => {
        ReactDOM.findDOMNode( this ).removeEventListener( 'mousemove', this.onMouseMove );
        ReactDOM.findDOMNode( this ).removeEventListener( 'mouseup', this.onMouseUp );
    };

    onClick( event ) {
        const { widgetToAdd } = this.state;
        if ( widgetToAdd ) {
            let widget = widgetToAdd;
            widget.props.position = { x: event.pageX, y: event.pageY };
            Actions.addWidget( widget );
            this.setState( { widgetToAdd : null } );
        }
    }

    getZoom() {
        const boardElement = ReactDOM.findDOMNode( this )
        return +$( boardElement ).css( 'zoom' );
    }

    zoomIn() {
        $( ReactDOM.findDOMNode( this ) ).css( { zoom : this.getZoom() + 0.1 } );
        Actions.setZoom( this.getZoom() );
    }

    zoomOut() {
        const oldZoom = this.getZoom();
        if ( oldZoom > 0.1 ) {
            $( ReactDOM.findDOMNode( this ) ).css( { zoom : oldZoom - 0.1 } );
            Actions.setZoom( this.getZoom() );
            this.updateSize();
        }
    }

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

    renderWidget( widget ) {
        //FIXME on clear board it seems all widget are re-added to firebase without
        //their type so I delete this stupid copy here ...
        if( widget.val.type === undefined){
            Actions.removeWidget( widget.key);
            return null;
        }
        const baseKey = widget.key;
        const { firebaseUrl , boardKey } = AuthStore.appConfig;
        const baseUrl = `${firebaseUrl}/widgets/${boardKey}/${baseKey}/props`;
        //const baseUrl = `${firebaseUrl}/boards/${boardKey}/widget/${baseKey}/props`;
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
