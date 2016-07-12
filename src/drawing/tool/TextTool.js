import Tool                     from './Tool';
import * as TextToolActions     from './TextToolActions';

export default class TextTool extends Tool {

    constructor( context ){
        super( context , 'TextTool');
    }

    onMouseDown( event ) {
        this.x = event.pageX;
        this.y = event.pageY;
        TextToolActions.onMouseDown(this.x, this.y);
    }

    onMouseMove( event, color, bgcolor, lineWidth ) {
    }

    onMouseUp( event ) {
    }

    onNewText ( text , color, fontParams ){
        if(this.x && this.y){
            //erase the previous text
            this.context.clearRect( 0, 0, this.context.canvas.width, this.context.canvas.height );
            this.context.strokeStyle = color;
            this.context.font = this.buildfont( fontParams );

            if( fontParams.underline ){
                this.underline( text );
            }
            if( fontParams.strikeThrough ){
                this.strikeThrough( text, fontParams.fontSize);
            }

            this.context.strokeText( text , this.x, this.y);
        }
    }

    /*
        Create the ctx.font attribute
     */
    buildfont( fontParams ){
        let font = fontParams.fontSize + 'px';
        font += ' ' + fontParams.font;
        fontParams.italic        ? font = 'italic '        + font            : null;
        fontParams.bold          ? font = 'bold '          + font            : null;
        return font;
    }

    /*
        Since there is no built-in method to underline a text in canvas
        check : http://stackoverflow.com/questions/4627133/is-it-possible-to-draw-text-decoration-underline-etc-with-html5-canvas-text
     */
    underline( text ){
        var width = this.context.measureText( text ).width;
        let x_under = this.x , y_under = this.y;
        switch(this.context.textAlign){
            case "center":
            x_under -= (width/2); break;
            case "right":
            x_under -= width; break;
        }

        y_under += 10;
        this.context.beginPath();
        this.context.moveTo(x_under,y_under);
        this.context.lineTo(x_under+width,y_under);
        this.context.stroke();

    }

    strikeThrough( text, fontSize ){
        var width = this.context.measureText( text ).width;
        let x_under = this.x , y_middle = this.y;
        switch(this.context.textAlign){
            case "center":
            x_under -= (width/2); break;
            case "right":
            x_under -= width; break;
        }

        y_middle -= fontSize/3;

        this.context.beginPath();
        //this.context.lineWidth = 3;
        this.context.moveTo(x_under,y_middle);
        this.context.lineTo(x_under+width,y_middle);
        this.context.stroke();

    }

}
