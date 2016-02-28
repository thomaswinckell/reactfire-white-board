import _                        from 'lodash';
import { FluxComponent }        from 'airflux';
import $                        from 'jquery';
import React,
       { Component, PropTypes } from 'react';
import ReactDOM                 from 'react-dom';

import { firebaseUrl }          from 'config/AppConfig';
import * as Actions             from 'core/BoardActions';
import BackgroundDrawingStore   from 'core/BackgroundDrawingStore';
import BoardStore               from 'core/BoardStore';
import AuthStore                from 'core/AuthStore';
import MainNavBar               from 'core/MainNavBar';
import BackgroundDrawing        from 'core/BackgroundDrawing';
import WidgetContainer          from 'widget/Container';
import WidgetClone              from 'widget/Clone';

import Styles from './Board.scss';

@FluxComponent
export default class Board extends Component {

    constructor( props ) {
        super( props );
        this.state = {};

        this.connectStore( AuthStore,               'authStore' );
        this.connectStore( BoardStore,              'boardStore' );
        this.connectStore( BackgroundDrawingStore,  'backgroundDrawingStore' );

        Actions.setIsDrawing.listen( ::this.setIsDrawing );
        Actions.zoomOut.listen( ::this.zoomOut );
        Actions.zoomIn.listen( ::this.zoomIn );
        Actions.addWidgetClone.listen( ::this.addWidget );
        Actions.updateSize.listen( ::this.updateSize );
    }

    get size() { return this.state.boardStore.size || { width : $( document ).width(), height : $( document ).height() };  }

    componentDidMount() {
        $( window ).resize( ::this.updateSize );
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

        ReactDOM.findDOMNode( this.refs.boardElement ).addEventListener( 'mousemove', this.onMouseMove );
        ReactDOM.findDOMNode( this.refs.boardElement ).addEventListener( 'mouseup', this.onMouseUp );
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
        ReactDOM.findDOMNode( this.refs.boardElement ).removeEventListener( 'mousemove', this.onMouseMove );
        ReactDOM.findDOMNode( this.refs.boardElement ).removeEventListener( 'mouseup', this.onMouseUp );
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
        const boardElement = ReactDOM.findDOMNode( this.refs.boardElement )
        return +$( boardElement ).css( 'zoom' );
    }

    zoomIn() {
        $( ReactDOM.findDOMNode( this.refs.boardElement ) ).css( { zoom : this.getZoom() + 0.1 } );
    }

    zoomOut() {
        const oldZoom = this.getZoom();
        if ( oldZoom > 0.1 ) {
            $( ReactDOM.findDOMNode( this.refs.boardElement ) ).css( { zoom : oldZoom - 0.1 } );
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
            height : Math.max( $( ReactDOM.findDOMNode( this.refs.boardElement ) ).height(), windowSize.height / zoom ),
            width  : Math.max( $( ReactDOM.findDOMNode( this.refs.boardElement ) ).width(), windowSize.width / zoom )
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
        const baseKey = widget.key;
        const baseUrl = `${firebaseUrl}/board/widget/${baseKey}/props`;
        return <WidgetContainer key={ baseKey } baseKey={ baseKey } widgetType={ widget.val.type } baseUrl={ baseUrl } />
    }

    renderLoading() {
        return (
            <span>Loading...</span>
        );
    }

    render() {
        const { currentUser } = this.state.authStore;
        const { widgets } = this.state.boardStore;
        const { backgroundDrawing, backgroundImage } = this.state.backgroundDrawingStore;
        const { widgetToAdd, isDrawing } = this.state;

        if ( !currentUser ) {
            return this.renderLoading();
        }

        const drawingBackgroundStyle = backgroundDrawing ? _.merge( {}, {
            background: `url(${backgroundDrawing})`,
            backgroundRepeat : 'no-repeat'
        }, this.size ) : {};

        const boardBackgroundStyle = backgroundImage ? {
            background : `url(${backgroundImage})`,
            backgroundSize : 'cover'
        } : {};

        return (
            <div>
                <div className={ Styles.wrapper } tabIndex="1" ref="boardElement" style={ this.size } onClick={ ::this.onClick } onMouseDown={ ::this.onMouseDown }>
                    { widgets.map( ::this.renderWidget ) }
                    { widgetToAdd ? <WidgetClone widgetType={ widgetToAdd.type } widgetProps={ widgetToAdd.props }/> : null  }
                    { !isDrawing && backgroundDrawing ? <div className={ Styles.drawingBackground } style={ drawingBackgroundStyle } /> : null }
                    <div className={ Styles.background } style={ boardBackgroundStyle }></div>
                </div>
                <BackgroundDrawing imageContent={ backgroundDrawing }>
                    <MainNavBar/>
                </BackgroundDrawing>
            </div>
        );
    }
}
