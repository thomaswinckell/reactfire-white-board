import { Store }        from 'airflux';
import Firebase         from 'firebase';

import { firebaseUrl }  from 'config/AppConfig';


class AuthStore extends Store {

    constructor() {
        super();
        this.state = {};
        this.baseRef = new Firebase( firebaseUrl );
        this.baseRef.onAuth( authData => this.onAuth( authData ) );
    }

    get currentUser() { return this.state.currentUser || {}; }

    destroy() {
        if ( this.baseRef ) {
            this.baseRef.off();
        }
    }

    onAuth( authData ) {
        if ( authData ) {
            this.onAuthSuccess( authData );
        } else {
            this.onAuthFailure();
        }
    }

    onAuthSuccess( authData ) {
        this.state.currentUser = {
            uid             : authData.uid,
            displayName     : authData.google.displayName || 'Guest',
            profileImageURL : authData.google.profileImageURL || 'img/default_profile.png', // TODO : A DEFAULT picture image
            locale          : authData.google.cashedUserProfile && authData.google.cashedUserProfile.locale ? authData.google.cashedUserProfile.locale : 'en'
        };
        this.publishState();
    }

    onAuthFailure() {
        // FIXME
        // TODO : propose other ways to authenticate : twitter, github and facebook (maybe anonymous too)
        this.baseRef.authWithOAuthRedirect("google", function(error) {
            if (error) {
                console.log("Login Failed !", error);
            } else {
                // We'll never get here, as the page will redirect on success.
            }
        });
    }

    isCurrentUser( user ) {
        const { currentUser } = this.state;
        if ( !user || !currentUser ) {
            return false;
        }
        return currentUser.uid === user.uid;
    }

    logout() {
        this.baseRef.unauth();
    }
}

export default new AuthStore();
