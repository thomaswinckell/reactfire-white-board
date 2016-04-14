import { Store }            from 'airflux';
import Firebase             from 'firebase';

import * as ConfigActions   from '../config/ConfigActions';


class AuthStore extends Store {

    state = {};

    constructor() {
        super();
        ConfigActions.loadConfig.listen( this.onConfigLoaded.bind( this ) );
    }

    get currentUser() { return this.state.currentUser || {}; }

    get appConfig() { return this.state.appConfig || {}; }

    destroy() {
        if ( this.baseRef ) {
            this.baseRef.off();
        }
    }

    onConfigLoaded( appConfig : AppConfig ) {
        this.baseRef = new Firebase( appConfig.firebaseUrl );
        this.baseRef.onAuth( authData => this.onAuth( authData, appConfig ) );
    }

    onAuth( authData, appConfig ) {
        if ( authData ) {
            this.onAuthSuccess( authData, appConfig );
        } else {
            this.onAuthFailure();
        }
    }

    onAuthSuccess( authData, appConfig ) {
        const currentUser = {
            uid             : authData.uid,
            displayName     : authData.google.displayName || 'Guest',
            profileImageURL : authData.google.profileImageURL || 'img/default_profile.png', // TODO : A DEFAULT picture image
            locale          : authData.google.cachedUserProfile && authData.google.cachedUserProfile.locale ? authData.google.cachedUserProfile.locale : 'en'
        };
        this.state = { currentUser, appConfig };
        this.publishState();
    }

    onAuthFailure() {
        const options = {
            remember: 'sessionOnly',
            scope   : 'email'
        };
        // FIXME
        // TODO : propose other ways to authenticate : twitter, github and facebook (maybe anonymous too)
        this.baseRef.authWithOAuthRedirect( 'google', function(error) {
            if ( error ) {
                console.log( 'Login Failed !', error );
            } else {
                // We'll never get here, as the page will redirect on success.
            }
        }, options );
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
