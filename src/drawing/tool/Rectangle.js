import Tool from './Tool';


export default class Rectangle extends Tool {

    onMouseDown( event ) {
        this.isDragging = true;
		this.x0 = event.pageX;
		this.y0 = event.pageY;
    }

    onMouseMove( event, color, backgroundColor , lineWidth ) {
        if ( this.isDragging ) {
            const x = Math.min( event.pageX, this.x0 ),
			y = Math.min( event.pageY, this.y0 ),
			w = Math.abs( event.pageX - this.x0 ),
			h = Math.abs( event.pageY - this.y0 );

    		this.context.clearRect( 0, 0, this.context.canvas.width, this.context.canvas.height );

    		if ( !w || !h ) {
    			return;
    		}

            this.context.fillStyle = backgroundColor;
            this.context.fillRect( x, y, w, h );
            this.context.strokeStyle = color;
            this.context.lineWidth = lineWidth;
    		this.context.strokeRect( x, y, w, h );
        }
    }

    onMouseUp( event ) {
        if ( this.isDragging ) {
            this.onMouseMove( event );
            this.isDragging = false;
        }
    }
}
