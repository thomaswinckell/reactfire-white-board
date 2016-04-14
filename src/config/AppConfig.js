
export default class AppConfig {
    firebaseUrl : string;
    gmapsApiKey : string;

    constructor( firebaseUrl : string, gmapsApiKey : string ) {
        this.firebaseUrl = firebaseUrl;
        this.gmapsApiKey = gmapsApiKey;
    }
}
