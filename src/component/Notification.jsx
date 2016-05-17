import React, { Component, PropTypes }  from 'react';
import classNames                       from 'classnames';
import ReactCSSTransitionGroup          from 'react-addons-css-transition-group';

import Styles   from './Notification.scss';

export default class Notification extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            onEnter : true
        };
    }

    componentWillMount() {
        setTimeout( () => {
            this.setState( { onEnter : false } );
        }, 200 );
    }

    close( result ) {
        this.setState( { onLeave : true }, () => setTimeout( () => {
            this.props.onClose( result );
        }, 500 ) );
    }

    render() {

        const rootClassName = classNames( Styles.root, {
            [ Styles.onEnter ] : this.state.onEnter,
            [ Styles.onLeave ] : this.state.onLeave
        } );

        var notifs = this.props.notifs.map( (notif) => {
            const notifClassName = classNames ( Styles.content, {
                [ Styles.success ] : notif.val.type === 'success',
                [ Styles.info    ] : notif.val.type === 'info',
                [ Styles.warning ] : notif.val.type === 'warning',
                [ Styles.error   ] : notif.val.type === 'error'
            } );
            return(
                    <div className={ notifClassName } key={notif.key} >
                        { notif.val.message }
                    </div>
            );
        })

        return (
            <div className={ rootClassName }>
                <ReactCSSTransitionGroup transitionName="notif" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                    { notifs }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}
