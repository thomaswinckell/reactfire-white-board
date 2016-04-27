import _                        from 'lodash';
import $                        from 'jquery';

import Pencil                   from './tool/Pencil';

import Styles from './DrawingSurface.scss';

// FIXME : react component

export default class DrawingSurface {

    constructor( id, size, oldImage = false, toolType = Pencil, color = '', backgroundColor = 'transparent' ) {
        this.size = size;

        this.oldCanvas = document.createElement( 'canvas' );
        this.oldCanvas.id = `${id}-old`;
        this.oldCanvas.className = Styles.oldCanvas;
        this.oldCanvas.width = size.width;
        this.oldCanvas.height = size.height;

        $( 'body' ).append( this.oldCanvas );

        this.oldContext = this.oldCanvas.getContext( '2d' );
        if ( oldImage ) {
            this.drawOldImageFromDataUrl( oldImage );
        }

        this.canvas = document.createElement( 'canvas' );
        this.canvas.id = id;
        this.canvas.className = Styles.canvas;
        this.canvas.width = size.width;
        this.canvas.height = size.height;

        $( 'body' ).append( this.canvas );

        this.context = this.canvas.getContext( '2d' );

        this.toolType = toolType;
        this.color = color;
        this.backgroundColor = backgroundColor;
        this.tool = new toolType( this.context );

        this.canvas.addEventListener( 'mousedown',  this.onMouseDown );
        this.canvas.addEventListener( 'mousemove',  this.onMouseMove );
        this.canvas.addEventListener( 'mouseup',    this.onMouseUp );
    }

    drawOldImageFromDataUrl( dataUrl ) {
        var img = new Image();
        img.src = dataUrl;
        img.addEventListener( 'load', () => this.oldContext.drawImage( img, 0, 0 ), false );
    }

    onDrawEnd() {
        this.drawOldImageFromDataUrl( this.getImageAsDataUrl() );
        this.clear();
    }

    setTool( toolType ) {
        if ( toolType !== this.toolType ) {
            this.onDrawEnd();
            this.toolType = toolType;
            this.tool = new toolType( this.context );
        }
    }

    setColor( color ) {
        this.color = color;
    }

    setBackgroundColor( backgroundColor ) {
        this.backgroundColor = backgroundColor;
    }

    setLineWidth ( width ) {
        this.lineWidth = width;
    }

    onMouseDown = ( event ) => {
        if ( this.tool && this.tool.onMouseDown ) {
            this.tool.onMouseDown( event, this.color, this.backgroundColor, this.lineWidth );
        }
    };

    onMouseMove = ( event ) => {
        if ( this.tool && this.tool.onMouseMove ) {
            this.tool.onMouseMove( event, this.color, this.backgroundColor, this.lineWidth );
        }
    };

    onMouseUp = ( event ) => {
        if ( this.tool && this.tool.onMouseUp ) {
            this.tool.onMouseUp( event, this.color, this.backgroundColor, this.lineWidth );
            this.onDrawEnd();
        }
    };

    clear() {
        this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    }

    destroy() {
        $( `#${this.canvas.id}` ).remove();
        $( `#${this.oldCanvas.id}` ).remove();
        this.canvas.removeEventListener( 'mousedown',  this.onMouseDown );
        this.canvas.removeEventListener( 'mousemove',  this.onMouseMove );
        this.canvas.removeEventListener( 'mouseup',    this.onMouseUp );
    }

    getImageAsDataUrl( type = 'image/png', qualityRatio = 1.0 ) {
        return this.canvas.toDataURL( type, qualityRatio );
    }

    getResultAsDataUrl( type = 'image/png', qualityRatio = 1.0 ) {
        return this.oldCanvas.toDataURL( type, qualityRatio );
    }
}
