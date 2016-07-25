import React,
       { Component, PropTypes } from 'react';
import Firebase                 from 'firebase';
import _                        from 'lodash';
import classNames               from 'classnames';
import ReactDOM                 from 'react-dom';

import * as BoardActions        from '../core/BoardActions';
import BoardStore               from '../core/BoardStore';
import WidgetActions            from './Actions';
import WidgetFactory            from './Factory';
import AuthStore                from '../core/AuthStore';
import Resizer                  from '../component/Resizer';
import Blur                     from '../component/Blur';
import ConfirmDialog            from '../component/ConfirmDialog';

import translations             from '../i18n/messages/messages';

import {Motion , spring}        from 'react-motion';

import Styles       from './Wrapper.scss';

const LoadingStatus = {
    init        : 0,
    loading     : 1,
    loaded      : 2,
    error       : 3
};

/**
 * Wrapper for widget contains utility method used by all widgets
 */
export default class WidgetWrapper extends Component {

    static contextTypes = {
        intl : PropTypes.object
    };

    constructor( props ) {
        super( props );
        this.state = {
            position    : {},
            size        : {},
            status      : LoadingStatus.init,
            onEnter     : true
        };
        this.actions = new WidgetActions();

        this.actions.setEditMode.listen( this.setEditMode.bind( this ) );
        this.actions.setViewMode.listen( this.setViewMode.bind( this ) );
        this.actions.deleteWidget.listen( this.deleteWidget.bind( this ) );
        this.actions.select.listen( this.select.bind( this ) );
        this.actions.unselect.listen( this.unselect.bind( this ) );

        this.updateData = this.updateData.bind( this );
    }

    componentWillMount() {
        this.base = new Firebase( this.props.baseUrl );
        this.isLockedByRef = new Firebase( this.props.baseUrl + '/isLockedBy' );
        this.isEditingByRef = new Firebase( this.props.baseUrl + '/isEditingBy' );
    }

    /**
     * Create Firebase ref to the widget
     */
    componentDidMount() {

        this.isRemoved = false;

        document.addEventListener( 'focusin', this.onFocusIn );

        this.base.on( "value", dataSnapshot => {

            let val = dataSnapshot.val();
            const { onEnter, onLeave, confirmDialog } = this.state;

            if ( val && !this.isRemoved ) {
                val.status = LoadingStatus.loaded;
                this.setState( _.merge( {}, val, { onEnter, onLeave, confirmDialog } ) );
            } else {
                this.setState( _.merge( { status : LoadingStatus.error }, val, { onEnter, onLeave, confirmDialog } ) );
            }
        });
    }

    componentWillUnmount() {
        document.removeEventListener( 'focusin', this.onFocusIn );
        this.base.off();
    }

    componentWillReceiveProps( nextProps ) {
        if ( nextProps.widgetType === undefined ) {
            this.isRemoved = true;
        }
    }

    /**
     * Update props of the widget
     * Add a onDisconnect event to remove the lock in case of not clean disconnect
     * @param  data -> the new data to modify
     */
    updateData( data ) {
        if ( !this.isRemoved ) {
            if( data.isLockedBy !== false ){
                this.isLockedByRef.onDisconnect().set(false);
            }
            if( data.isEditingBy !== false ){
                this.isEditingByRef.onDisconnect().set(false);
            }
            this.base.set( _.merge( {}, this.state, data, { status : null, onEnter : null, onLeave : null, confirmDialog : null } ) );
        }
    }

    onFocusIn = (event) => {
        // if the focusin event NOT occurs in a child element of this element (or this element)
        if ( event.path.indexOf( ReactDOM.findDOMNode( this ) ) === -1 ) {
            if ( this.isEditingByCurrentUser() ) {
                this.setViewMode();
            }
        }
    }

    isLockedByCurrentUser() {
        return AuthStore.isCurrentUser( this.state.isLockedBy );
    }

    isLockedByAnotherUser() {
        return this.state.isLockedBy && !this.isLockedByCurrentUser()
    }

    isEditingByCurrentUser() {
        return AuthStore.isCurrentUser( this.state.isEditingBy );
    }

    isEditingByAnotherUser() {
        return this.state.isEditingBy && !this.isEditingByCurrentUser()
    }

    setEditMode() {
        if(!this.isLockedByAnotherUser())
        this.updateData( {
            isLockedBy  : AuthStore.currentUser,
            isEditingBy : AuthStore.currentUser
        } );
    }

    /**
     * Remove the onDisconnect event that set lockedBy and editingBy to false
     */
    removeOnDisconnectHandler(){
        this.isEditingByRef.onDisconnect().cancel();
        this.isLockedByRef.onDisconnect().cancel();
    }

    setViewMode() {
        this.updateData( { isEditingBy : false, isLockedBy : false } );
        this.removeOnDisconnectHandler();
    }

    select() {
        this.updateData( { isLockedBy: AuthStore.currentUser } );
        BoardStore.getLatestIndex( ( error, committed, snapshot ) => {
            if ( !error && committed ) {
                this.updateData( { index: snapshot.val() } );
            } else {
                // TODO : how to handle error ?
            }
        } );
    }

    unselect() {
        this.updateData( { isLockedBy: false } );
        this.removeOnDisconnectHandler();
    }

    //TODO translate
    deleteWidget() {
        this.setState( { confirmDialog : {
            message   : this.context.intl.formatMessage( translations.mainNavBar.sureToDelete ),
            onClose : confirm => {
                if ( confirm ) {
                    this.isRemoved = true;
                    //FIXME warning calling setState after unmounted component
                    this.setState( { confirmDialog : false, onLeave : true }, () => setTimeout( () => {
                        this.setState( { onLeave : false } );
                    }, 500 ) );
                    this.removeOnDisconnectHandler();
                    BoardActions.removeWidget( this.props.baseKey );
                } else {
                    this.setState( { confirmDialog : false } );
                }
            }
        } } );
    }

    link( prop ) {
        return {
            value: this.state[ prop ],
            requestChange: value => this.updateData( { [prop] : value } )
        }
    }

    onResizeStart( event ) {
      this.isResizing = true;
      this.updateData( { isLockedBy: AuthStore.currentUser } );
    }

    onResizeEnd( event ) {
        this.isResizing = false;
        if( !this.isEditingByCurrentUser() ) {
            this.updateData( { isLockedBy: false } );
            this.removeOnDisconnectHandler();
        }
    }

    onMouseDown( event ) {
        event.stopPropagation();
    }

    addToPanel = ( panelKey ) => {
        BoardActions.addWidgetPanel( panelKey , this.props.baseKey );
    }

    removeFromPanel = ( panelKey ) => {
        BoardActions.removeWidgetPanel( panelKey , this.props.baseKey );
    }

    renderWidgetView() {
        const props = _.extend( {}, this.state, {
            valueLink   : this.updateData,
            actions     : this.actions,
            type        : this.props.widgetType,
            isLockedByAnotherUser : this.isLockedByAnotherUser(),
            isEditingByAnotherUser : this.isEditingByAnotherUser(),
            lockName               : this.isLockedByAnotherUser() ? this.state.isLockedBy.name : null,
            isEditingBy            : this.isEditingByAnotherUser() ? this.state.isEditingBy.name : null,
            addToPanel             : this.addToPanel,
            removeFromPanel        : this.removeFromPanel
        } );
        return WidgetFactory.createWidgetView( this.props.widgetType, props );
    }

    renderWidgetEditor() {
        const props = _.extend( {}, this.state, {
            valueLink   : this.updateData.bind( this ),
            actions     : this.actions,
            isLockedByAnotherUser : this.isLockedByAnotherUser(),
            lockName    : this.isLockedByAnotherUser() ? this.state.isLockedBy.name : null
        } );
        return WidgetFactory.createWidgetEditor( this.props.widgetType, props );
    }

    renderConfirmDialog() {
        if ( this.state.confirmDialog ) {
            return (
                <ConfirmDialog message={ this.state.confirmDialog.message } onClose={ this.state.confirmDialog.onClose } />
            );
        }
    }

    render() {
        if ( this.state.status !== LoadingStatus.loaded ) {
            return null;
        }

        const styleWidget = {
            zIndex  : this.state.index + 1000,
            top     : this.state.position.y,
            left    : this.state.position.x,
            width   : this.state.size.width,
            height  : this.state.size.height
        };

        const styleBoardBackground = _.extend(
            {},
            BoardStore.size,
            {
                top     : -this.state.position.y,
                left    : -this.state.position.x
            }
        );

        const isEditingByCurrentUser = this.isEditingByCurrentUser();

        const className = classNames( Styles.root, {
            /*'resizing'                  : this.isResizing,
            'locked-by-current-user'    : this.isLockedByCurrentUser(),
            'locked-by-another'         : this.isLockedByAnotherUser(),
            'onEnter'                   : this.state.onEnter,
            'onLeave'                   : this.state.onLeave*/
        } );

        const rigid = { stiffness: 652, damping: 25 };
        return (
            <Motion
                style={ { left: spring( this.state.position.x , rigid ), top: spring( this.state.position.y , rigid ) } }>
                {interpolatingStyle =>
                    <div tabIndex="1000"
                         className={ className }
                         style={ {
                             zIndex  : this.state.index + 1000,
                             top     : `${interpolatingStyle.top}px`,
                             left    : `${interpolatingStyle.left}px`,
                             width   : this.state.aggregate ? this.state.aggregate.width : this.state.size.width,
                             height  : this.state.aggregate ? this.state.aggregate.height : this.state.size.height
                         } }
                         onMouseDown={ this.onMouseDown.bind( this ) }>

                         <Blur isLockedByAnotherUser = { this.isLockedByAnotherUser() } />

                        { isEditingByCurrentUser ? this.renderWidgetEditor() : this.renderWidgetView() }

                        <Resizer valueLink={this.link('size')}
                                 index={this.state.index + 2000}
                                 onResizeStart={this.onResizeStart.bind( this ) } onResizeEnd={this.onResizeEnd.bind( this ) }
                                 canResize={ () => !this.isLockedByAnotherUser() }/>

                         { this.renderConfirmDialog() }
                    </div>
                }
            </Motion>
        );
    }
}
