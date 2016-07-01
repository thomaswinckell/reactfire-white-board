import React, { Component, PropTypes }  from 'react';
import NotificationSystem               from 'react-notification-system';

/**
 * Wrapper of NotificationSystem to display Notification
 */
export default class Notification extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            _notificationSystem : null
        };
    }

    /**
     * Initialise the ref to the component to call his Method
     */
    componentDidMount () {
        this._notificationSystem = this.refs.notificationSystem;
    }

    /**
     * Method of NotificationSystem to add a notif to the component
     * @param { notif with message and type ( level ) } notif
     */
    _addNotification ( notif ) {
        this._notificationSystem.addNotification({
          message : notif.val.message,
          level   : notif.val.type,
          uid     : notif.key
        });
  }

  /**
   * Add our notifs to react-notification-system
   * @param  {Array of notifs} nextProps
   */
  componentWillReceiveProps( nextProps ){
      var notifs = nextProps.notifs.map( ( notif ) => {
          this._addNotification( notif );
      });
  }


    render() {
        return (
            <NotificationSystem ref='notificationSystem' />
        );
    }
}
