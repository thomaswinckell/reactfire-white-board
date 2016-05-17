import { Store }                from 'airflux';
import Firebase                 from 'firebase';
import AuthStore                from './AuthStore';

import * as NotificationActions from './NotificationActions';

class NotificationStore extends Store {


    constructor() {
        super();
        this.state = {
            notifs : []
        };

        this.listenTo( AuthStore, this._onAuthSuccess.bind( this ) );

        NotificationActions.pushNotif.listen( this._pushNotif.bind( this ) );
        NotificationActions.removeNotif.listen( this._removeNotif.bind( this ) );

    }

    _onAuthSuccess( authStoreState ) {
        const { firebaseUrl , boardKey } = authStoreState.appConfig;

        this.notifRef = new Firebase( `${firebaseUrl}/notifications/${boardKey}` );

        this.notifRef.off();

        this.notifRef.on( 'child_added', this._onAddNotif.bind( this ) );
        this.notifRef.on( 'child_removed', this._onRemoveNotif.bind( this ) );

        this.state.interval = setInterval( this.removeOldNotif.bind( this ), 1000 );

    }

    removeOldNotif(){
        var now = Date.now();
        var cutoff = now - 7 * 1000;
        var old = this.notifRef.orderByChild('timestamp').endAt(cutoff).limitToLast(1);
        var listener = old.on('child_added', function(snapshot) {
            snapshot.ref().remove();
        });
    }

    _onAddNotif( dataSnapshot ){
        let { notifs } = this.state;
        notifs.push( { key : dataSnapshot.key(), val : dataSnapshot.val() } );
        this.state.notifs = notifs;
        this.publishState();
    }

    _onRemoveNotif( oldDataSnapshot ) {
        const notifKey = oldDataSnapshot.key();
        let { notifs } = this.state;
        _.remove( notifs , n => { return n.key === notifKey; } );
        this.state.notifs = notifs;
        this.publishState();
    }

    _pushNotif( notif ){
        notif.user = AuthStore.currentUser;
        notif.timestamp = Date.now();
        this.notifRef.push( notif, (error) => {
            error ? console.log(error) : null;
        });
    }

    _removeNotif(){
        const { firebaseUrl , boardKey } = this.authStoreState.appConfig;
        let notif = new Firebase( `${firebaseUrl}/notifications/${boardKey}/${notifKey}` );
        notif.remove();
        notif.off();
    }

}

export default new NotificationStore();
