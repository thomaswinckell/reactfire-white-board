import React, { Component, PropTypes }  from 'react';
import NotificationSystem               from 'react-notification-system';

import translations                     from '../i18n/messages/messages';

/**
 * Wrapper of NotificationSystem to display Notification
 */
export default class Notification extends Component {

    static contextTypes = {
        intl : PropTypes.object
    };

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
          message : this.context.intl.formatMessage( translations.Notification[notif.val.message], notif.val ),
          level   : notif.val.type,
          uid     : notif.key,
          position : 'br'
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
