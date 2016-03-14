import Tool from 'drawing/tool/Tool';

export default class Circle extends Tool {

    onMouseDown( event ) {
        this.isDragging = true;
        this.initialPosition = { pageX : event.pageX, pageY : event.pageY };
    }

    onMouseMove( event, color, backgroundColor ) {
        if ( this.isDragging ) {
            this.context.clearRect( 0, 0, this.context.canvas.width, this.context.canvas.height );
            this.context.beginPath();
            const radius = Math.sqrt( Math.pow( this.initialPosition.pageX - event.pageX, 2 ) + Math.pow( this.initialPosition.pageY - event.pageY, 2 ) );
            this.context.arc( this.initialPosition.pageX, this.initialPosition.pageY, radius, 0, 2 * Math.PI );
            this.context.fillStyle = backgroundColor;
            this.context.fill();
            this.context.strokeStyle = color;
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
