export default class Tool {

    constructor( context ) {
        this.context = context;
    }

    /**
     * @abstract
     */
    onMouseDown( event ) {
    }

    /**
     * @abstract
     */
    onMouseMove( event ) {
    }
    
    /**
     * @abstract
     */
    onMouseUp( event ) {
    }
}
