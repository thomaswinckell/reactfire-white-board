import React,
       { Component, PropTypes } from 'react';
import Firebase                 from 'firebase';
import _                        from 'lodash';
import $                        from 'jquery';
import classNames               from 'classnames';
import ReactDOM                 from 'react-dom';

import { firebaseUrl }          from 'config/AppConfig';
import AuthenticationService    from 'service/AuthenticationService';
import WidgetFactory            from 'core/WidgetFactory';
import Resizer                  from 'component/Resizer';
import Blur                     from 'component/Blur';
import ConfirmDialog            from 'component/ConfirmDialog';

const LoadingStatus = {
    init        : 0,
    loading     : 1,
    loaded      : 2,
    error       : 3
};


export default class WidgetContainer extends Component {

    static contextTypes = {
        board   : PropTypes.object
    }

    static childContextTypes = {
        board : PropTypes.object,
        widget: PropTypes.object
    }

    constructor( props ) {
        super( props );
        this.state = {
            position    : {},
            size        : {},
            status      : LoadingStatus.init,
            onEnter     : true
        };
        this.onFocusIn = ::this.onFocusIn;
    }

    getChildContext() {
        const widget = {
            deleteWidget            : ::this.deleteWidget,
            setEditMode             : ::this.setEditMode,
            setViewMode             : ::this.setViewMode,
            isLockedByAnotherUser   : ::this.isLockedByAnotherUser,
            select                  : ::this.select,
            unselect                : ::this.unselect
        };

        return { widget, board : this.context.board };
    }

    componentWillMount() {
        this.base = new Firebase( this.props.baseUrl );
    }

    componentDidMount() {

        document.addEventListener( 'focusin', this.onFocusIn );

        //this.setState( { status : LoadingStatus.loading } );

        setTimeout( () => {
            this.setState( { onEnter : false } );
        }, 500 );

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
        // WARNING : do not trigger updateData here !!!

        // TODO : remove lock
        //this.setViewMode();
        document.removeEventListener( 'focusin', this.onFocusIn );
        this.base.off();
    }

    componentWillReceiveProps( nextProps ) {
        if ( nextProps.widgetType === undefined ) {
            this.isRemoved = true;
        }
    }

    updateData( data ) {
        if ( !this.isRemoved ) {
            this.base.set( _.merge( {}, this.state, data, { status : null, onEnter : null, onLeave : null, confirmDialog : null } ) );
        }
    }

    onFocusIn(event) {
        // if the focusin event NOT occurs in a child element of this element (or this element)
        if ( event.path.indexOf( ReactDOM.findDOMNode( this ) ) === -1 ) {
            if ( this.isEditingByCurrentUser() ) {
                this.setViewMode();
            }
        }
    }

    isLockedByCurrentUser() {
        return AuthenticationService.isCurrentUser( this.state.isLockedBy );
    }

    isLockedByAnotherUser() {
        return this.state.isEditingBy && this.state.isEditingBy.id && !this.isLockedByCurrentUser();
    }

    isEditingByCurrentUser() {
        return AuthenticationService.isCurrentUser( this.state.isEditingBy );
    }

    setEditMode() {
        this.updateData( {
            isLockedBy  : AuthenticationService.currentUser,
            isEditingBy : AuthenticationService.currentUser
        } );
    }

    setViewMode() {
        this.updateData( { isEditingBy : false, isLockedBy : false } );
    }

    select() {
        this.context.board.getLatestIndex( ( error, committed, snapshot ) => {
            if ( !error && committed ) {
                this.updateData( { isLockedBy: AuthenticationService.currentUser, index: snapshot.val() } );
            } else {
                // TODO : how to handle error ?
            }
        } );
    }

    unselect() {
        this.updateData( { isLockedBy: false } );
    }

    deleteWidget() {
        this.setState( { confirmDialog : {
            message   : "Are you sure you want to delete this widget ?",
            onClose : confirm => {
                if ( confirm ) {
                    this.context.board.removeWidget( this.props.baseKey );
                    this.isRemoved = true;
                    this.setState( { confirmDialog : false, onLeave : true }, () => setTimeout( () => {
                        this.setState( { onLeave : false } );
                    }, 500 ) );
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
      this.updateData( { isLockedBy: AuthenticationService.currentUser } );
    }

    onResizeEnd( event) {
        this.isResizing = false;
        this.updateData( { isLockedBy: false } );
    }

    renderWidgetView() {
        return WidgetFactory.createWidgetView( this.props.widgetType, _.extend( {}, this.state, { valueLink: ::this.updateData } ) );
    }

    renderWidgetEditor() {
        return WidgetFactory.createWidgetEditor( this.props.widgetType, _.extend( {}, this.state, { valueLink: ::this.updateData } ) );
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
            this.context.board.size,
            {
                top     : -this.state.position.y,
                left    : -this.state.position.x
            }
        );

        const isEditingByCurrentUser = this.isEditingByCurrentUser();

        const className = classNames( 'widget', {
            'resizing'                  : this.isResizing,
            'locked-by-current-user'    : this.isLockedByCurrentUser(),
            'locked-by-another'         : this.isLockedByAnotherUser(),
            'onEnter'                   : this.state.onEnter,
            'onLeave'                   : this.state.onLeave
        } );

        return (
            <div tabIndex="1000"
                 className={ className }
                 style={ styleWidget } >

                 <Blur/>

                { isEditingByCurrentUser ? this.renderWidgetEditor() : this.renderWidgetView() }

                <Resizer valueLink={this.link('size')}
                         index={this.state.index + 2000}
                         onResizeStart={::this.onResizeStart} onResizeEnd={::this.onResizeEnd}
                         canResize={ () => !this.isLockedByAnotherUser() }/>

                 { this.renderConfirmDialog() }
            </div>
        );
    }
}
