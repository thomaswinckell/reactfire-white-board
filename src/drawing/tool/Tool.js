export default class Tool {

    constructor( context ) {
        this.context = context;
    }

    /**
     * @abstract
     */
    onMouseDown( event ) {
        throw `The component ${this.constructor.name} should implement the method onMouseDown !`;
    }

    /**
     * @abstract
     */
    onMouseMove( event ) {
        throw `The component ${this.constructor.name} should implement the method onMouseMove !`;
    }

    /**
     * @abstract
     */
    onMouseUp( event ) {
        throw `The component ${this.constructor.name} should implement the method onMouseUp !`;
    }
}
