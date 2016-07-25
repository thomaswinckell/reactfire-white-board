import { Store }                        from 'airflux';
import Firebase                         from 'firebase';

import AuthStore                        from './AuthStore';
import * as Actions                     from './BoardActions';
import * as NotificationActions         from '../core/NotificationActions';

class BoardStore extends Store {

    state = {
        widgets : [],
        authStoreState : '',
        zoom : 1,
    };

    constructor() {
        super();

        this.listenTo( AuthStore, this._onAuthSuccess.bind( this ) );

        Actions.setSize.listen( this._setSize.bind( this ) );
        Actions.addWidget.listen( this._addWidget.bind( this ) );
        Actions.removeWidget.listen( this._removeWidget.bind( this ) );
        Actions.clearBoard.listen( this._clearBoard.bind( this ) );
        Actions.setZoom.listen( this._setZoom.bind( this ) );
        Actions.addWidgetPanel.listen( this._addWidgetPanel.bind( this ) );
        Actions.removeWidgetPanel.listen( this._removeWidgetPanel.bind( this ) );
        Actions.updatePosition.listen( this._updatePosition.bind( this ) );
    }

    get size() { return this.state.size; }

    get zoom() { return this.state.zoom || 1; }

    get panels() { return this.getPanels() || []; }

    destroy() {
        this.boardSizeRef.off();
        this.widgetsRef.off();
        this.latestIndexRef.off();
    }

    _setZoom( zoom ) {
        this.state.zoom = zoom;
    }

    // FIXME : use promise
    getLatestIndex( callback ) {
        this.latestIndexRef.transaction( latestIndex => ( latestIndex || 0 ) + 1, callback );
    }

    getPanels = () => {
        return this.state.widgets.filter( widget =>
            widget.val.type === 'PanelWidget'
        )
    }

    _onAuthSuccess( authStoreState ) {
        const { firebaseUrl , boardKey } = authStoreState.appConfig;
        this.authStoreState = authStoreState;

        this.boardSizeRef = new Firebase( `${firebaseUrl}/boards/${boardKey}/size` );
        this.widgetsRef = new Firebase( `${firebaseUrl}/widgets/${boardKey}` );
        this.latestIndexRef = new Firebase( `${firebaseUrl}/boards/${boardKey}/latestWidgetIndex` );

        this.widgetsRef.off();
        this.boardSizeRef.off();
        this.state.widgets = [];

        this.widgetsRef.on( 'child_added', this._onAddWidget.bind( this ) );
        this.widgetsRef.on( 'child_changed', this._onChangeWidget.bind( this ) );
        this.widgetsRef.on( 'child_removed', this._onRemoveWidget.bind( this ) );
        this.boardSizeRef.on( 'value', this._onNewSize.bind( this ) );

        //Counter for ppl on
        this.presenceRef = new Firebase( `https://${firebaseUrl}/presence/${boardKey}/${this.authStoreState.currentUser.uid}` );
        // this.userRef = this.presenceRef.push();
        this.connectedRef = new Firebase( `${firebaseUrl}/.info/connected` );
        this.connectedRef.on("value", ( snap ) => {
            if( snap.val() ){
                //remove ourselves when we disconnect
                this.presenceRef.onDisconnect().remove();
                this.presenceRef.set({
                    picture : this.authStoreState.currentUser.profileImageURL,
                    name    : this.authStoreState.currentUser.name
                });
            }
        });
    }

    _addWidgetPanel( panelKey, widgetKey ) {
        const { firebaseUrl , boardKey } = this.authStoreState.appConfig;
        const panelRef = new Firebase( `${firebaseUrl}/widgets/${boardKey}/${panelKey}/props/widgets/${widgetKey}` );
        panelRef.set( true );
    }

    _updatePosition( widgetKey, x, y ){
        const { firebaseUrl , boardKey } = this.authStoreState.appConfig;
        const widgetRef = new Firebase( `${firebaseUrl}/widgets/${boardKey}/${widgetKey}/props/position` );
        widgetRef.transaction( currentPos => {
            currentPos.x = currentPos.x -x;
            currentPos.y = currentPos.y -y;
            return currentPos;
        })
    }

    _removeWidgetPanel( panelKey, widgetKey ){
        const { firebaseUrl , boardKey } = this.authStoreState.appConfig;
        const panelRef = new Firebase( `${firebaseUrl}/widgets/${boardKey}/${panelKey}/props/widgets/${widgetKey}` );
        panelRef.remove();
        panelRef.off();
    }

     /**
     * Add a widget to widgets list and if it is a panel to panels list
     * @param dataSnapshot firebase object with key and val
     * @private
     */
    _onAddWidget( dataSnapshot ) {
        let { widgets } = this.state;
        widgets.push( { key : dataSnapshot.key(), val : dataSnapshot.val() } );
        this.state.widgets = widgets;
        this.publishState();
    }

    _onChangeWidget( dataSnapshot ){
        if( dataSnapshot.val().type !== 'PanelWidget') {
            return ;
        }
        const index = this.state.widgets.findIndex( widget => widget.key === dataSnapshot.key() );
        this.state.widgets[index].val = dataSnapshot.val();
        this.publishState();
    }

    _onRemoveWidget( oldDataSnapshot ) {
        const widgetKey = oldDataSnapshot.key();
        let { widgets } = this.state;
        _.remove( widgets, w => { return w.key === widgetKey; } );
        this.state.widgets = widgets;
        this.publishState();
    }

    _onNewSize( dataSnapshot ) {
       const size = dataSnapshot.val();
       if ( size ) {
           this.state.size = size;
           this.publishState();
       }
   }

   _addWidget( widget ) {
       this.getLatestIndex( ( error, committed, snapshot ) => {
           if ( !error && committed ) {
               widget.props.index = snapshot.val();
               widget.props.isEditingBy = AuthStore.currentUser;
               this.widgetsRef.push( widget, (error) => {
                    if (error){
                        console.log(error);
                        NotificationActions.pushNotif({
                            type     : 'error',
                            message  : error
                        });
                    } else {
                        NotificationActions.pushNotif({
                            type        : 'success',
                            message     : 'widgetAdded',
                            typeWidget  : widget.type
                        });
                    }
               });
           } else {
               // TODO : handle error ?
               console.log(error);
               NotificationActions.pushNotif({
                   type     : 'error',
                   message  : error
               });
           }
       });
   }

    /**
     * Remove a widget from firebase
     * /!\ DO NOT REMOVE IT FROM THE STATE
     * @param widgetKey
     * @private
     */
    _removeWidget( widgetKey ) {
        const { firebaseUrl , boardKey } = this.authStoreState.appConfig;
        let widgetBase = new Firebase( `${firebaseUrl}/widgets/${boardKey}/${widgetKey}` );
        widgetBase.remove();
        widgetBase.off();
        NotificationActions.pushNotif({
            type     : 'success',
            message  : 'widgetRemoved'
        });
    }

    _clearBoard() {
        this.widgetsRef.remove();
        this.latestIndexRef.remove();
    }

    _setSize( size ) {
        this.boardSizeRef.set( size );
    }
}

export default new BoardStore();
