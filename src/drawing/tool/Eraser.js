import Tool from './Tool';

export default class Eraser extends Tool {

    constructor( context ){
        super( context , 'Eraser');
    }

    onMouseDown( event ) {

        this.isDragging = true;
        this.context.beginPath();
		this.context.moveTo( event.pageX, event.pageY );
    }

    onMouseMove( event, color, bgcolor, lineWidth ) {
        if ( this.isDragging ) {
            this.context.globalCompositeOperation = 'destination-out';
            this.context.lineTo( event.pageX, event.pageY );
            this.context.strokeStyle = color;
            this.context.lineWidth = lineWidth;
            this.context.stroke();
        }
    }

    onMouseUp( event ) {
        if ( this.isDragging ) {
            this.onMouseMove( event );
            this.isDragging = false;
            this.context.globalCompositeOperation = 'source-over';
        }
    }
}
