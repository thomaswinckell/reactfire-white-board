import Tool from './Tool';


export default class TextTool extends Tool {

    onMouseDown( event ) {
        this.x = event.pageX;
        this.y = event.pageY;
    }

    onMouseMove( event, color, bgcolor, lineWidth ) {
    }

    onMouseUp( event ) {
    }

    onNewText ( text , fontParams ){
        if(this.x && this.y){
            //erase the previous text
            this.context.clearRect( 0, 0, this.context.canvas.width, this.context.canvas.height );

            this.context.font = this.buildfont( fontParams );
            console.log(this.context.font);

            if( fontParams.underline ){
                this.underline( text );
            }

            this.context.strokeText( text , this.x, this.y);
        }
    }

    /*
        Create the ctx.font attribute
     */
    buildfont( fontParams ){
        let font = fontParams.fontSize;
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
        console.log('x and y ', x_under, y_under)
        this.context.beginPath();
        //this.context.lineWidth = 3;
        this.context.moveTo(x_under,y_under);
        this.context.lineTo(x_under+width,y_under);
        this.context.stroke();

    }

}
