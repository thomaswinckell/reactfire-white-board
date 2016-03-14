import { firebaseUrl }                  from 'config/AppConfig';
import React, { Component, PropTypes }  from 'react';

import * as BoardActions                from 'core/BoardActions';
import BoardStore                       from 'core/BoardStore';
import * as Actions                     from 'drawing/BackgroundDrawingActions';
import DrawingSurface                   from 'drawing/DrawingSurface';


export default class BackgroundDrawing extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            enabled      : false
        };

        Actions.save.listen( this.save.bind( this ) );
        Actions.clear.listen( this.clear.bind( this ) );
        Actions.enable.listen( this.enable.bind( this ) );
        Actions.disable.listen( this.disable.bind( this ) );
        Actions.setTool.listen( this.setTool.bind( this ) );
        Actions.setColor.listen( this.setColor.bind( this ) );
        Actions.setBackgroundColor.listen( this.setBackgroundColor.bind( this ) );
    }

    componentWillUnmount() {
        this.drawingSurface.destroy();
    }

    enable() {
        this.drawingSurface = new DrawingSurface( 'canvas-drawing-surface', BoardStore.size, this.props.imageContent );
        BoardActions.setIsDrawing( true );
    }

    disable() {
        if ( this.drawingSurface ) {
            this.drawingSurface.clear();
            this.drawingSurface.destroy();
            this.drawingSurface = null;
            BoardActions.setIsDrawing( false );
        }
    }

    save() {
        if ( this.drawingSurface ) {
            Actions.setBackgroundDrawing( this.drawingSurface.getResultAsDataUrl() );
        }
    }

    clear() {
        if ( this.drawingSurface ) {
            // TODO : confirm
            const oldTool = this.drawingSurface.toolType;
            const oldColor = this.drawingSurface.toolColor;
            this.drawingSurface.clear();
            this.drawingSurface.destroy();
            this.drawingSurface = new DrawingSurface( 'canvas-drawingSurface-background', BoardStore.size, false, oldTool, oldColor );
        }
    }

    setTool( tool ) {
        if ( this.drawingSurface ) {
            this.drawingSurface.setTool( tool );
        }
    }

    getColor() {
        if ( this.drawingSurface ) {
            return this.drawingSurface.color
        }
        return null;
    }

    setColor( color ) {
        if ( this.drawingSurface ) {
            this.drawingSurface.setColor( color );
        }
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

    render() {
        return (
            <div>
                { this.props.children }
            </div>
        );
    }
}
