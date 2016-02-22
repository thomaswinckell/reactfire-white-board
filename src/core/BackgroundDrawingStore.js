import { Store }        from 'airflux';
import Firebase         from 'firebase';

import { firebaseUrl }  from 'config/AppConfig';
import AuthStore        from './AuthStore';

class BackgroundDrawingStore extends Store {

    constructor() {
        super();
        this.backgroundDrawingRef = new Firebase( `${firebaseUrl}/board/backgroundDrawing` );
        this.backgroundImageRef = new Firebase( `${firebaseUrl}/board/backgroundImage` );

        this.state = {};

        this.listenTo( AuthStore, this.onAuthSuccess );
    }

    destroy() {
        this.backgroundDrawingRef.off();
        this.backgroundImageRef.off();
    }

    onAuthSuccess() {

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

    setBackgroundDrawing( data ) {
        this.backgroundDrawingRef.set( data );
    }

    setBackgroundImage( data ) {
        this.backgroundImageRef.set( data );
    }
}

export default new BackgroundDrawingStore();
