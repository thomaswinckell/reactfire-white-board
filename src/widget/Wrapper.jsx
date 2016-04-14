import React,
       { Component, PropTypes } from 'react';
import Firebase                 from 'firebase';
import _                        from 'lodash';
import $                        from 'jquery';
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

import Styles       from './Wrapper.scss';

const LoadingStatus = {
    init        : 0,
    loading     : 1,
    loaded      : 2,
    error       : 3
};


export default class WidgetWrapper extends Component {

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
        return this.state.isEditingBy && this.state.isEditingBy.id && !this.isLockedByCurrentUser();
    }

    isEditingByCurrentUser() {
        return AuthStore.isCurrentUser( this.state.isEditingBy );
    }

    setEditMode() {
        this.updateData( {
            isLockedBy  : AuthStore.currentUser,
            isEditingBy : AuthStore.currentUser
        } );
    }

    setViewMode() {
        this.updateData( { isEditingBy : false, isLockedBy : false } );
    }

    select() {
        BoardStore.getLatestIndex( ( error, committed, snapshot ) => {
            if ( !error && committed ) {
                this.updateData( { isLockedBy: AuthStore.currentUser, index: snapshot.val() } );
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
            message   : 'Are you sure you want to delete this widget ?',
            onClose : confirm => {
                if ( confirm ) {
                    BoardActions.removeWidget( this.props.baseKey );
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
      this.updateData( { isLockedBy: AuthStore.currentUser } );
    }

    onResizeEnd( event ) {
        this.isResizing = false;
        this.updateData( { isLockedBy: false } );
    }

    onMouseDown( event ) {
        event.stopPropagation();
    }

    renderWidgetView() {
        const props = _.extend( {}, this.state, {
            valueLink   : this.updateData.bind( this ),
            actions     : this.actions
        } );
        return WidgetFactory.createWidgetView( this.props.widgetType, props );
    }

    renderWidgetEditor() {
        const props = _.extend( {}, this.state, {
            valueLink   : this.updateData.bind( this ),
            actions     : this.actions
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

        return (
            <div tabIndex="1000"
                 className={ className }
                 style={ styleWidget }
                 onMouseDown={ this.onMouseDown.bind( this ) }>

                 <Blur/>

                { isEditingByCurrentUser ? this.renderWidgetEditor() : this.renderWidgetView() }

                <Resizer valueLink={this.link('size')}
                         index={this.state.index + 2000}
                         onResizeStart={this.onResizeStart.bind( this ) } onResizeEnd={this.onResizeEnd.bind( this ) }
                         canResize={ () => !this.isLockedByAnotherUser() }/>

                 { this.renderConfirmDialog() }
            </div>
        );
    }
}
