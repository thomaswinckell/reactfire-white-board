import { Store }        from 'airflux';
import Firebase         from 'firebase';

import AuthStore        from 'core/AuthStore';

import * as Actions     from 'drawing/BackgroundDrawingActions';


class BackgroundDrawingStore extends Store {

    state = {};

    constructor() {
        super();

        this.listenTo( AuthStore, this._onAuthSuccess.bind( this ) );

        Actions.setBackgroundDrawing.listen( this._setBackgroundDrawing.bind( this ) );
        Actions.setBackgroundImage.listen( this._setBackgroundImage.bind( this ) );
    }

    destroy() {
        this.backgroundDrawingRef.off();
        this.backgroundImageRef.off();
    }

    _onAuthSuccess( authStoreState ) {
        const { firebaseUrl } = authStoreState.appConfig;

        this.backgroundDrawingRef = new Firebase( `${firebaseUrl}/board/backgroundDrawing` );
        this.backgroundImageRef = new Firebase( `${firebaseUrl}/board/backgroundImage` );

        this.backgroundDrawingRef.on( 'value', dataSnapshot => {
            const backgroundDrawing = dataSnapshot.val();
            if ( backgroundDrawing ) {
                this.state.backgroundDrawing = backgroundDrawing;
                this.publishState();
            }
        } );

        this.backgroundImageRef.on( 'value', dataSnapshot => {
            const backgroundImage = dataSnapshot.val();
            if ( backgroundImage ) {
                this.state.backgroundImage = backgroundImage;
                this.publishState();
            }
        } );
    }

    _setBackgroundDrawing( data ) {
        this.backgroundDrawingRef.set( data );
    }

    _setBackgroundImage( data ) {
        this.backgroundImageRef.set( data );
    }
}

export default new BackgroundDrawingStore();
