import { Store }        from 'airflux';
import Firebase         from 'firebase';

import { firebaseUrl }  from 'config/AppConfig';
import AuthStore        from './AuthStore';

class BoardStore extends Store {

    constructor() {
        super();
        this.boardSizeRef = new Firebase( `${firebaseUrl}/board/size` );
        this.widgetsRef = new Firebase( `${firebaseUrl}/board/widget` );
        this.latestIndexRef = new Firebase( `${firebaseUrl}/board/latestWidgetIndex` );

        this.state = {
            widgets : []
        };

        this.listenTo( AuthStore, this.onAuthSuccess );
    }

    get size() { return this.state.size; }

    destroy() {
        this.boardSizeRef.off();
        this.widgetsRef.off();
        this.latestIndexRef.off();
    }

    onAuthSuccess() {
        this.widgetsRef.on( 'child_added', ::this.onAddWidget );
        this.widgetsRef.on( 'child_removed', ::this.onRemoveWidget );
        this.boardSizeRef.on( 'value', ::this.onNewSize );
    }

    onAddWidget( dataSnapshot ) {
        let { widgets } = this.state;
        widgets.push( { key : dataSnapshot.key(), val : dataSnapshot.val() } );
        this.state.widgets = widgets;
        this.publishState();
    }

    onRemoveWidget( oldDataSnapshot ) {
        const widgetKey = oldDataSnapshot.key();
        let { widgets } = this.state;
        _.remove( widgets, w => { return w.key === widgetKey; } );
        this.state.widgets = widgets;
        this.publishState();
    }

    onNewSize( dataSnapshot ) {
       const size = dataSnapshot.val();
       if ( size ) {
           this.state.size = size;
           this.publishState();
       }
   }

   addWidget( widget ) {
       console.log(widget)
       this.getLatestIndex( ( error, committed, snapshot ) => {
           if ( !error && committed ) {
               widget.props.index = snapshot.val();
               widget.props.isEditingBy = AuthStore.currentUser;
               this.widgetsRef.push( widget );
           } else {
               // TODO : handle error ?
           }
       });
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

    // FIXME : use promise
    getLatestIndex( callback ) {
        this.latestIndexRef.transaction( latestIndex => ( latestIndex || 0 ) + 1, callback );
    }

    setSize( size ) {
        this.boardSizeRef.set( size );
    }
}

export default new BoardStore();
