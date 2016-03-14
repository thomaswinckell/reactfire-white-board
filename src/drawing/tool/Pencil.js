import Tool from 'drawing/tool/Tool';

export default class Pencil extends Tool {

    onMouseDown( event ) {
        this.isDragging = true;
        this.context.beginPath();
		this.context.moveTo( event.pageX, event.pageY );
    }

    onMouseMove( event, color ) {
        if ( this.isDragging ) {
            this.context.lineTo( event.pageX, event.pageY );
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
