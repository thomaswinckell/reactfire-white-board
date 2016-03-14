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

        Actions.save.listen( this.save.bind( this ) );
        Actions.clear.listen( this.clear.bind( this ) );
        Actions.enable.listen( this.enable.bind( this ) );
        Actions.disable.listen( this.disable.bind( this ) );
        Actions.setTool.listen( this.setTool.bind( this ) );
        Actions.setColor.listen( this.setColor.bind( this ) );
        Actions.setBackgroundColor.listen( this.setBackgroundColor.bind( this ) );
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
