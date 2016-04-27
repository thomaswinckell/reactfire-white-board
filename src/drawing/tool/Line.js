import Tool from './Tool';

export default class Line extends Tool {

    onMouseDown( event ) {
        this.isDragging = true;
        this.initialPosition = { pageX : event.pageX, pageY : event.pageY };
    }

    onMouseMove( event, color, bgcolor, lineWidth ) {
        if ( this.isDragging ) {
            this.context.clearRect( 0, 0, this.context.canvas.width, this.context.canvas.height );
            this.context.beginPath();
            this.context.lineCap = 'round';
    		this.context.moveTo( this.initialPosition.pageX, this.initialPosition.pageY );
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
        }
    }
}
