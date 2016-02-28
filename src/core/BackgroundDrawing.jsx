import { firebaseUrl }                  from 'config/AppConfig';
import React, { Component, PropTypes }  from 'react';

import * as Actions                     from 'core/BackgroundDrawingActions';
import * as BoardActions                from 'core/BoardActions';
import BoardStore                       from 'core/BoardStore';
import Drawer                           from 'drawer/Drawer';


export default class BackgroundDrawing extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            enabled      : false
        };

        Actions.save.listen( ::this.save );
        Actions.clear.listen( ::this.clear );
        Actions.enable.listen( ::this.enable );
        Actions.disable.listen( ::this.disable );
        Actions.setTool.listen( ::this.setTool );
        Actions.setColor.listen( ::this.setColor );
        Actions.setBackgroundColor.listen( ::this.setBackgroundColor );
    }

    componentWillUnmount() {
        this.drawer.destroy();
    }

    enable() {
        this.drawer = new Drawer( 'canvas-drawer-background', BoardStore.size, this.props.imageContent );
        BoardActions.setIsDrawing( true );
    }

    disable() {
        if ( this.drawer ) {
            this.drawer.clear();
            this.drawer.destroy();
            this.drawer = null;
            BoardActions.setIsDrawing( false );
        }
    }

    save() {
        if ( this.drawer ) {
            Actions.setBackgroundDrawing( this.drawer.getResultAsDataUrl() );
        }
    }

    clear() {
        if ( this.drawer ) {
            // TODO : confirm
            const oldTool = this.drawer.toolType;
            const oldColor = this.drawer.toolColor;
            this.drawer.clear();
            this.drawer.destroy();
            this.drawer = new Drawer( 'canvas-drawer-background', BoardStore.size, false, oldTool, oldColor );
        }
    }

    setTool( tool ) {
        if ( this.drawer ) {
            this.drawer.setTool( tool );
        }
    }

    getColor() {
        if ( this.drawer ) {
            return this.drawer.color
        }
        return null;
    }

    setColor( color ) {
        if ( this.drawer ) {
            this.drawer.setColor( color );
        }
    }

    getBackgroundColor() {
        if ( this.drawer ) {
            return this.drawer.backgroundColor;
        }
        return null;
    }

    setBackgroundColor( backgroundColor ) {
        if ( this.drawer ) {
            this.drawer.setBackgroundColor( backgroundColor );
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
