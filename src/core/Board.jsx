import Firebase                 from 'firebase';
import _                        from 'lodash';
import $                        from 'jquery';
import React,
       { Component, PropTypes } from 'react';
import ReactDOM                 from 'react-dom';

import { firebaseUrl }          from 'config/AppConfig';
import AuthenticationService    from 'service/AuthenticationService';
import WidgetContainer          from 'core/WidgetContainer';
import MainNavBar               from 'core/MainNavBar';
import BackgroundDrawing        from 'core/BackgroundDrawing';
import WidgetClone              from 'core/WidgetClone';

import Styles from './Board.scss';

export default class Board extends Component {

    static childContextTypes = {
        board : PropTypes.object
    }

    constructor( props ) {
        super( props );
        this.state = {
            widgets : [],
            size    : {
                height  : $( document ).height(),
                width   : $( document ).width()
            }
        };
        this.onMouseMove = ::this.onMouseMove;
        this.onMouseUp = ::this.onMouseUp;
    }

    componentWillMount() {
        this.baseRef = new Firebase( firebaseUrl );
        this.boardSizeRef = new Firebase( `${firebaseUrl}/board/size` );
        this.widgetsRef = new Firebase( `${firebaseUrl}/board/widget` );
        this.latestIndexRef = new Firebase( `${firebaseUrl}/board/latestWidgetIndex` );
        this.backgroundDrawingRef = new Firebase( `${firebaseUrl}/board/backgroundDrawing` );
        this.backgroundImageRef = new Firebase( `${firebaseUrl}/board/backgroundImage` );
    }

    componentDidMount() {
        this.baseRef.onAuth( authData => this.onAuth( authData ) );
    }

    componentWillUnmount() {
        this.baseRef.off();
        this.boardSizeRef.off();
        this.widgetsRef.off();
        this.latestIndexRef.off();
        this.backgroundDrawingRef.off();
        this.backgroundImageRef.off();
    }

    getChildContext() {
        const board = {
            size                    : this.state.size,
            updateSize              : ::this.updateSize,
            clearBoard              : ::this.clearBoard,
            logout                  : ::this.logout,
            getLatestIndex          : ::this.getLatestIndex,
            addWidget               : ::this.addWidget,
            removeWidget            : ::this.removeWidget,
            setBackgroundDrawing    : ::this.setBackgroundDrawing,
            setIsDrawing            : ::this.setIsDrawing,
            getZoom                 : ::this.getZoom,
            zoomOut                 : ::this.zoomOut,
            zoomIn                  : ::this.zoomIn,
            setBackgroundImage      : ::this.setBackgroundImage,
        };

        return { board };
    }

    onAuth( authData ) {
        if ( authData ) {

            this.widgetsRef.on( 'child_removed', oldDataSnapshot => this._removeWidgetFromBase( oldDataSnapshot.key() ) );

            this.widgetsRef.on( 'child_added', ::this._addWidgetFromBase );

            this.boardSizeRef.on( 'value', dataSnapshot => {
                const size = dataSnapshot.val();
                if ( size ) {
                    this.setState( { size } );
                }
                this.updateSize();
            } );

            this.backgroundDrawingRef.on( 'value', dataSnapshot => {
                const backgroundDrawing = dataSnapshot.val();
                if ( backgroundDrawing ) {
                    this.setState( { backgroundDrawing } );
                }
            } );

            this.backgroundImageRef.on( 'value', dataSnapshot => {
                const backgroundImage = dataSnapshot.val();
                if ( backgroundImage ) {
                    this.setState( { backgroundImage } );
                }
            } );

            $( window ).resize( ::this.updateSize );

            AuthenticationService.currentUser = {
                uid: authData.uid,
                displayName: authData.google.displayName || 'Guest',
                profileImageURL: authData.google.profileImageURL || 'img/default_profile.png', // TODO : A DEFAULT picture image
                locale: authData.google.cashedUserProfile && authData.google.cashedUserProfile.locale ? authData.google.cashedUserProfile.locale : 'en'
            };

        } else {

            // TODO : propose other ways to authenticate : twitter, github and facebook (maybe anonymous too)
            this.baseRef.authWithOAuthRedirect("google", function(error) {
                if (error) {
                    console.log("Login Failed !", error);
                } else {
                    // We'll never get here, as the page will redirect on success.
                }
            });
        }
    }

    setIsDrawing( isDrawing ) {
        this.setState( { isDrawing } );
    }

    setBackgroundDrawing( data ) {
        this.backgroundDrawingRef.set( data );
    }

    setBackgroundImage( data ) {
        this.backgroundImageRef.set( data );
    }

    addWidget( type, props = {} ) {
        const widgetToAdd = { type, props };
        this.setState( { widgetToAdd } );
    }

    _addWidgetFromBase( dataSnapshot ) {
        let { widgets } = this.state;
        widgets.push( { key: dataSnapshot.key(), val: dataSnapshot.val() } );
        this.setState( { widgets } );
    }

    _removeWidgetFromBase( widgetKey ) {
        let { widgets } = this.state;
        _.remove( widgets, w => { return w.key === widgetKey; } );
        this.setState( { widgets } );
    }

    removeWidget( widgetKey ) {
        let widgetBase = new Firebase( `${firebaseUrl}/board/widget/${widgetKey}` );
        widgetBase.remove();
        widgetBase.off();
    }

    clearBoard() {
        this.widgetsRef.remove();
        this.latestIndexRef.remove();
    }

    getLatestIndex( callback ) {
        this.latestIndexRef.transaction( latestIndex => ( latestIndex || 0 ) + 1, callback );
    }

    onMouseDown( event ) {
        this._startX = event.screenX;
        this._startY = event.screenY;
        this._startScrollLeft = $( 'body' ).scrollLeft();
        this._startScrollTop = $( 'body' ).scrollTop();

        ReactDOM.findDOMNode( this.refs.boardElement ).addEventListener( 'mousemove', this.onMouseMove );
        ReactDOM.findDOMNode( this.refs.boardElement ).addEventListener( 'mouseup', this.onMouseUp );
    }

    onMouseMove( event ) {
        let newScrollTop = this._startScrollTop - ( event.screenY - this._startY );
        let newScrollLeft = this._startScrollLeft - ( event.screenX - this._startX );

        let scrollHeight = $( document ).height() - $( window ).height();
        let scrollWidth = $( document ).width() - $( window ).width();

        let { size : { height, width } } = this.state;

        if (scrollHeight < newScrollTop) {
            height = parseInt( this.state.size.height ) + newScrollTop - scrollHeight;
        }

        if (scrollWidth < newScrollLeft) {
            width = parseInt( this.state.size.width ) + newScrollLeft - scrollWidth;
        }

        this.setState( { size : { height, width } } );

        $( 'body' ).scrollTop( newScrollTop );
        $( 'body' ).scrollLeft( newScrollLeft );
    }

    onMouseUp( event ) {
        ReactDOM.findDOMNode( this.refs.boardElement ).removeEventListener( 'mousemove', this.onMouseMove );
        ReactDOM.findDOMNode( this.refs.boardElement ).removeEventListener( 'mouseup', this.onMouseUp );
    }

    onClick( event ) {

        if ( this.state.widgetToAdd ) {

            let widget = this.state.widgetToAdd;
            widget.props.position = { x: event.pageX, y: event.pageY };

            this.setState( { widgetToAdd : null } );

            this.getLatestIndex( ( error, committed, snapshot ) => {
                if ( !error && committed ) {
                    widget.props.index = snapshot.val();
                    widget.props.isEditingBy = AuthenticationService.currentUser;
                    this.widgetsRef.push( widget );
                } else {
                    // TODO : handle error ?
                }
            });
        }
    }

    logout() {
        this.baseRef.unauth();
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

        let { size } = this.state;

        if ( size.width <= documentSize.width ) {
            size.width = documentSize.width;
            shouldUpdate = true;
        }

        if ( size.height <= documentSize.height ) {
            size.height = documentSize.height;
            shouldUpdate = true;
        }

        if ( shouldUpdate ) {
            this.boardSizeRef.set( size );
        }
    }

    renderWidget( widget ) {
        const baseKey = widget.key;
        const baseUrl = `${firebaseUrl}/board/widget/${baseKey}/props`;
        return <WidgetContainer key={ baseKey } baseKey={ baseKey } widgetType={ widget.val.type } baseUrl={ baseUrl } />
    }

    render() {

        const drawingBackgroundStyle = this.state.backgroundDrawing ? _.merge( {}, {
            background: `url(${this.state.backgroundDrawing})`,
            backgroundRepeat : 'no-repeat'
        }, this.state.size ) : {};

        const boardBackgroundStyle = this.state.backgroundImage ? {
            background : `url(${this.state.backgroundImage})`,
            backgroundSize : 'cover'
        } : {};

        return (
            <div>
                <div className={ Styles.wrapper } tabIndex="1" ref="boardElement" style={ this.state.size } onClick={ ::this.onClick } onMouseDown={ ::this.onMouseDown }>
                    { this.state.widgets.map( ::this.renderWidget ) }
                    { this.state.widgetToAdd ? <WidgetClone widgetType={ this.state.widgetToAdd.type } widgetProps={ this.state.widgetToAdd.props }/> : null  }
                    { !this.state.isDrawing && this.state.backgroundDrawing ? <div className={ Styles.drawingBackground } style={ drawingBackgroundStyle } /> : null }
                    <div className={ Styles.background } style={ boardBackgroundStyle }></div>
                </div>
                <BackgroundDrawing imageContent={ this.state.backgroundDrawing }>
                    <MainNavBar/>
                </BackgroundDrawing>
            </div>
        );
    }
}
