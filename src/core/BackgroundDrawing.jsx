import { firebaseUrl }                  from 'config/AppConfig';
import React, { Component, PropTypes }  from 'react';

import Drawer                           from 'drawer/Drawer';


export default class BackgroundDrawing extends Component {

    static contextTypes = {
        board               : PropTypes.object
    }

    static childContextTypes = {
        drawing   : PropTypes.object,
        board     : PropTypes.object
    }

    constructor( props ) {
        super( props );
        this.state = {
            enabled      : false
        };
    }

    getChildContext() {
        const drawing = {
            save                : ::this.save,
            clear               : ::this.clear,
            enable              : ::this.enable,
            disable             : ::this.disable,
            setTool             : ::this.setTool,
            setColor            : ::this.setColor,
            setBackgroundColor  : ::this.setBackgroundColor,
            getColor            : ::this.getColor,
            getBackgroundColor  : ::this.getBackgroundColor
        };

        return { drawing, board : this.context.board };
    }

    componentWillUnmount() {
        this.drawer.destroy();
    }

    enable() {
        this.drawer = new Drawer( 'canvas-drawer-background', this.context.board.size, this.props.imageContent );
        this.context.board.setIsDrawing( true );
    }

    disable() {
        if ( this.drawer ) {
            this.drawer.clear();
            this.drawer.destroy();
            this.drawer = null;
            this.context.board.setIsDrawing( false );
        }
    }

    save() {
        if ( this.drawer ) {
            this.context.board.setBackgroundDrawing( this.drawer.getResultAsDataUrl() );
        }
    }

    clear() {
        if ( this.drawer ) {
            // TODO : confirm
            const oldTool = this.drawer.toolType;
            const oldColor = this.drawer.toolColor;
            this.drawer.clear();
            this.drawer.destroy();
            this.drawer = new Drawer( 'canvas-drawer-background', this.context.board.size, false, oldTool, oldColor );
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
