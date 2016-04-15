
export default class AppConfig {
    firebaseUrl : string;
    gmapsApiKey : string;
    boardKey    : string;

    constructor( firebaseUrl : string, gmapsApiKey : string, boardKey : string ) {
        this.firebaseUrl = firebaseUrl;
        this.gmapsApiKey = gmapsApiKey;
        this.boardKey   = boardKey;
    }
}
