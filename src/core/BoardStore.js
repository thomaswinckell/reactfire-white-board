import { Store }            from 'airflux';
import Firebase             from 'firebase';

import AuthStore            from './AuthStore';
import * as Actions         from './BoardActions';

class BoardStore extends Store {

    state = {
        widgets : [],
        authStoreState : '',
        zoom : 1
    };

    constructor() {
        super();

        this.listenTo( AuthStore, this._onAuthSuccess.bind( this ) );

        Actions.setSize.listen( this._setSize.bind( this ) );
        Actions.addWidget.listen( this._addWidget.bind( this ) );
        Actions.removeWidget.listen( this._removeWidget.bind( this ) );
        Actions.clearBoard.listen( this._clearBoard.bind( this ) );
        Actions.setZoom.listen( this._setZoom.bind(this ) );
    }

    get size() { return this.state.size; }

    get zoom() { return this.state.zoom || 1; }

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

    _onAuthSuccess( authStoreState ) {
        const { firebaseUrl , boardKey } = authStoreState.appConfig;
        this.authStoreState = authStoreState;
        //this.boardSizeRef = new Firebase( `${firebaseUrl}/boards/${boardKey}/size` );
        //this.widgetsRef = new Firebase( `${firebaseUrl}/boards/${boardKey}/widget` );
        //this.latestIndexRef = new Firebase( `${firebaseUrl}/boards/${boardKey}/latestWidgetIndex` );

        this.boardSizeRef = new Firebase( `${firebaseUrl}/boards/${boardKey}/size` );
        this.widgetsRef = new Firebase( `${firebaseUrl}/widgets/${boardKey}` );
        this.latestIndexRef = new Firebase( `${firebaseUrl}/boards/${boardKey}/latestWidgetIndex` );

        this.widgetsRef.on( 'child_added', this._onAddWidget.bind( this ) );
        this.widgetsRef.on( 'child_removed', this._onRemoveWidget.bind( this ) );
        this.boardSizeRef.on( 'value', this._onNewSize.bind( this ) );
    }

    _onAddWidget( dataSnapshot ) {
        let { widgets } = this.state;
        widgets.push( { key : dataSnapshot.key(), val : dataSnapshot.val() } );
        this.state.widgets = widgets;
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
                    error ? console.log(error) : null;
               });
           } else {
               // TODO : handle error ?
               console.log(error);
           }
       });
   }

    _removeWidget( widgetKey ) {
        const { firebaseUrl , boardKey } = this.authStoreState.appConfig;
        let widgetBase = new Firebase( `${firebaseUrl}/widgets/${boardKey}/${widgetKey}` );
        widgetBase.remove();
        widgetBase.off();
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
