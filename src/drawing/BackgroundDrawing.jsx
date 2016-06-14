import React, { Component, PropTypes }  from 'react';

import * as BoardActions                from '../core/BoardActions';
import BoardStore                       from '../core/BoardStore';
import * as Actions                     from './BackgroundDrawingActions';
import * as NotificationActions         from '../core/NotificationActions';
import DrawingSurface                   from './DrawingSurface';
import { ChromePicker }                 from 'react-color';

/**
 * Manage the drawing Canvas
 */
export default class BackgroundDrawing extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            enabled      : false,
            displayColorPicker : false
        };

        this.unsub = [];

        this.unsub.push( Actions.save.listen( this.save.bind( this ) ) ) ;
        this.unsub.push( Actions.clear.listen( this.clear.bind( this ) ) ) ;
        this.unsub.push( Actions.enable.listen( this.enable.bind( this ) ) ) ;
        this.unsub.push( Actions.disable.listen( this.disable.bind( this ) ) ) ;
        this.unsub.push( Actions.setTool.listen( this.setTool.bind( this ) ) ) ;
        this.unsub.push( Actions.setColor.listen( this.setColor.bind( this ) ) ) ;
        this.unsub.push( Actions.setBackgroundColor.listen( this.setBackgroundColor.bind( this ) ) ) ;
        this.unsub.push( Actions.setLineWidth.listen( this.setLineWidth.bind( this ) ) ) ;
        this.unsub.push( Actions.setText.listen( this.setText.bind( this ) ) ) ;
        this.unsub.push( Actions.setBold.listen( this.setBold.bind( this ) ) ) ;
        this.unsub.push( Actions.setFontSize.listen( this.setFontSize.bind( this ) ) ) ;
        this.unsub.push( Actions.setItalic.listen( this.setItalic.bind( this ) ) ) ;
        this.unsub.push( Actions.setUnderline.listen( this.setUnderline.bind( this ) ) ) ;
        this.unsub.push( Actions.setStrikeThrough.listen( this.setStrikeThrough.bind( this ) ) ) ;
        this.unsub.push( Actions.endText.listen( this.endText.bind( this ) ) ) ;
    }

    /**
     * Unsubscribe all the actions on Unmount and destroy the canvas is there is one
     */
    componentWillUnmount() {
        this.unsub.forEach( unsub => {
            unsub();
        });
        if ( this.drawingSurface ) {
            this.drawingSurface.destroy();
        }
    }

    /**
     * Create the drawing Canvas
     * and fire an action to notify we can draw on the canvas
     */
    enable() {
        this.drawingSurface = new DrawingSurface( 'canvas-drawing-surface', BoardStore.size, this.props.imageContent );
        BoardActions.setIsDrawing( true );
    }

    /**
     * Remove the canvas and desable drawing
     */
    disable() {
        if ( this.drawingSurface ) {
            this.drawingSurface.clear();
            this.drawingSurface.destroy();
            this.drawingSurface = null;
            BoardActions.setIsDrawing( false );
        }
    }

    /**
     * Save drawing and push a notif
     */
    save() {
        if ( this.drawingSurface ) {
            Actions.setBackgroundDrawing( this.drawingSurface.getResultAsDataUrl() );
            NotificationActions.pushNotif({
                type        : 'success',
                message     : 'Drawing saved !'
            });
        }
    }

    /**
     * Clear the drawing surface by removing the old one
     * and creating a new one with some properties from the old one
     */
    clear() {
        if ( this.drawingSurface ) {
            const oldTool = this.drawingSurface.toolType;
            const oldColor = this.drawingSurface.toolColor;
            this.drawingSurface.clear();
            this.drawingSurface.destroy();
            this.drawingSurface = new DrawingSurface( 'canvas-drawingSurface-background', BoardStore.size, false, oldTool, oldColor );
            NotificationActions.pushNotif({
                type        : 'success',
                message     : 'drawing cleared !'
            });
        }
    }

    setTool( tool ) {
        if ( this.drawingSurface ) {
            this.drawingSurface.setTool( tool );
        }
    }

    setBold( bold ){
        this.drawingSurface.setBold( bold );
    }

    setFontSize( fontSize ){
        this.drawingSurface.setFontSize( fontSize );
    }

    setUnderline( underline ){
        this.drawingSurface.setUnderline( underline);
    }

    setItalic( italic ){
        this.drawingSurface.setItalic( italic );
    }

    setStrikeThrough( strikeThrough ){
        this.drawingSurface.setStrikeThrough( strikeThrough );
    }

    endText(){
        this.drawingSurface.endText();
    }

    getColor() {
        if ( this.drawingSurface ) {
            return this.drawingSurface.color
        }
        return null;
    }

    setColor() {
        this.setState({ displayColorPicker : !this.state.displayColorPicker})
    }

    displayColorPicker(){
        const colorPosition = {
            position: 'fixed',
            top: '160px',
            left: '60px',
            zIndex: 2147483647
        };

        const popover = {
            position: 'absolute',
            zIndex: 200,
        }
        const cover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        }

        if ( this.drawingSurface && this.state.displayColorPicker ) {
            return(
                <div style={ colorPosition }>
                    <div style={ cover } onClick={ this.onClose }/>
                    <ChromePicker onChange={ this.handleColorChange }/>
                </div>
            )
        }
    }

    handleColorChange = ( color ) => {
        this.drawingSurface.setColor( `${color.hex}` )
    }

    onClose = () => {
        this.setState( { displayColorPicker : false } )
    }

    getBackgroundColor() {
        if ( this.drawingSurface ) {
            return this.drawingSurface.backgroundColor;
        }
        return null;
    }

    setBackgroundColor( backgroundColor ) {
        if ( this.drawingSurface ) {
            this.drawingSurface.setBackgroundColor( backgroundColor );
        }
    }

    setLineWidth( width ) {
        if ( this.drawingSurface ) {
            this.drawingSurface.setLineWidth( width );
        }
    }

    setText( text ) {
        if ( this.drawingSurface ){
            this.drawingSurface.setText( text );
        }
    }

    render() {
        return (
            <div>
                { this.displayColorPicker() }
            </div>
        );
    }
}
