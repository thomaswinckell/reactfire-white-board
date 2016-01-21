import $                                from 'jquery';
import React, { Component, PropTypes }  from 'react';

import NavBar, { NavBarElement }        from 'component/NavBar';
import ConfirmDialog                    from 'component/ConfirmDialog';
import WidgetNavBar                     from 'core/WidgetNavBar';
import DrawerNavBar                     from 'core/DrawerNavBar';

const Mode = {
    widgets : 0,
    drawer  : 1
};

export default class MainNavBar extends Component {

    static contextTypes = {
        board   : PropTypes.object,
        drawing : PropTypes.object
    }

    constructor( props ) {
        super( props );
        this.state = {
            mode : Mode.widgets
        };
    }

    setDrawerMode() {
        if ( this.state.mode === Mode.widgets ) {
            this.context.drawing.enable();
            this.setState( { mode : Mode.drawer } );
        }
    }

    cancelDrawing() {
        if ( this.state.mode === Mode.drawer ) {

            this.setState( { confirmDialog : {
                message   : "Are you sure you want to cancel ?",
                onClose : confirm => {
                    if ( confirm ) {
                        this.setState( { confirmDialog : false, mode : Mode.widgets } );
                        this.context.drawing.disable();
                    } else {
                        this.setState( { confirmDialog : false } );
                    }
                }
            } } );
        }
    }

    saveDrawing() {
        this.context.drawing.save();
        this.context.drawing.disable();
        this.setState( { mode : Mode.widgets  } );
    }

    clearBoard() {
        this.setState( { confirmDialog : {
            message   : "Are you sure you want to clear the board ?",
            onClose : confirm => {
                if ( confirm ) {
                    this.context.board.clearBoard();
                }
                this.setState( { confirmDialog : false } );
            }
        } } );
    }

    clearDrawing() {
        this.setState( { confirmDialog : {
            message   : "Are you sure you want to clear this drawing ?",
            onClose : confirm => {
                if ( confirm ) {
                    this.context.drawing.clear();
                }
                this.setState( { confirmDialog : false } );
            }
        } } );
    }

    renderConfirmDialog() {
        if ( this.state.confirmDialog ) {
            return (
                <ConfirmDialog message={ this.state.confirmDialog.message } onClose={ this.state.confirmDialog.onClose } />
            );
        }
    }

    render() {

        let elements = [
            //new NavBarElement( 'Logout', 'sign-out', ::this.context.board.logout ),
            new NavBarElement( 'Paint mode',    'format_paint',        ::this.setDrawerMode,    this.state.mode === Mode.drawer ? 'active' : '', 'bottom' ),
            new NavBarElement( 'Widgets mode',  'dashboard',           ::this.saveDrawing,      this.state.mode === Mode.widgets ? 'active' : '', 'bottom' ),
        ];

        let zoomElements = [
            new NavBarElement( 'Zoom in', 'zoom_in', ::this.context.board.zoomIn,       '', 'left' ),
            new NavBarElement( 'Zoom out', 'zoom_out', ::this.context.board.zoomOut,    '', 'left' )
        ];

        let clearElements = [
        ];

        if ( this.state.mode === Mode.drawer ) {
            clearElements.push(
                new NavBarElement( 'Clear drawing',     'clear',  ::this.clearDrawing,      '', 'bottom' ),
                new NavBarElement( 'Cancel',            'undo',   ::this.cancelDrawing,    '', 'bottom' ),
            );
        } else {
            clearElements.push(
                new NavBarElement( 'Clear board',       'clear',  ::this.clearBoard,        '', 'bottom' ),
            );
        }

        return (
            <div className="navbar-wrapper">
                <NavBar elements={ elements } className="main-navbar" />
                { this.state.mode === Mode.widgets ? <WidgetNavBar/> : null }
                { this.state.mode === Mode.drawer ? <DrawerNavBar/> : null }
                <div className="main-navbar-zoom">
                    { zoomElements.map( ( e, key ) => e.render( key ) ) }
                </div>
                <div className="main-navbar-clear">
                    { clearElements.map( ( e, key ) => e.render( key ) ) }
                </div>
                { this.renderConfirmDialog() }
            </div>
        );
    }
}
