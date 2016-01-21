class AuthenticationService {

    constructor() {
        this.currentUser = {};
    }

    isCurrentUser( user ) {
        if ( !user ) {
            return false;
        }
        return this.currentUser.uid === user.uid;
    }
}

export default new AuthenticationService();
