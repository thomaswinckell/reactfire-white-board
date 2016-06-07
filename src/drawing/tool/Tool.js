export default class Tool {

    constructor( context , name) {
        this.context = context;
        if( !name ) throw new ReferenceError('Missing Tool name parameter');
        this.name = name;
    }

    /*
    get name() {
        return this.name;
    }
*/
    /**
     * @abstract
     */
    onMouseDown( event ) {
        throw `The component ${this.name} should implement the method onMouseDown !`;
    }

    /**
     * @abstract
     */
    onMouseMove( event ) {
        throw `The component ${this.name} should implement the method onMouseMove !`;
    }

    /**
     * @abstract
     */
    onMouseUp( event ) {
        throw `The component ${this.name} should implement the method onMouseUp !`;
    }
}
