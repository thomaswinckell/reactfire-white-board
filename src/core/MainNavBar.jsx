import $                                from 'jquery';
import React, { Component, PropTypes }  from 'react';

import * as DrawingActions              from 'core/BackgroundDrawingActions';
import * as BoardActions                from 'core/BoardActions';
import NavBar, { NavBarElement }        from 'component/NavBar';
import ConfirmDialog                    from 'component/ConfirmDialog';
import WidgetNavBar                     from 'core/WidgetNavBar';
import DrawerNavBar                     from 'core/DrawerNavBar';

import Styles from './MainNavBar.scss';


const Mode = {
    widgets : 0,
    drawer  : 1
};

export default class MainNavBar extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            mode : Mode.widgets
        };
    }

    setDrawerMode() {
        if ( this.state.mode === Mode.widgets ) {
            DrawingActions.enable();
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
                        DrawingActions.disable();
                    } else {
                        this.setState( { confirmDialog : false } );
                    }
                }
            } } );
        }
    }

    saveDrawing() {
        DrawingActions.save();
        DrawingActions.disable();
        this.setState( { mode : Mode.widgets  } );
    }

    clearBoard() {
        this.setState( { confirmDialog : {
            message   : "Are you sure you want to clear the board ?",
            onClose : confirm => {
                if ( confirm ) {
                    BoardActions.clearBoard();
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
                    DrawingActions.clear();
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
        return null;
    }

    render() {

        let elements = [
        //new NavBarElement( 'Logout', 'sign-out', ::AuthActions.logout ),
            new NavBarElement( 'Paint mode',    'format_paint',        ::this.setDrawerMode,    this.state.mode === Mode.drawer ? 'active' : '', 'bottom' ),
            new NavBarElement( 'Widgets mode',  'dashboard',           ::this.saveDrawing,      this.state.mode === Mode.widgets ? 'active' : '', 'bottom' ),
        ];

        let zoomElements = [
            new NavBarElement( 'Zoom in', 'zoom_in', BoardActions.zoomIn,       '', 'left' ),
            new NavBarElement( 'Zoom out', 'zoom_out', BoardActions.zoomOut,    '', 'left' )
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
            <div className={ Styles.wrapper }>
                <NavBar elements={ elements } className={ Styles.navbar } />
                { this.state.mode === Mode.widgets ? <WidgetNavBar/> : null }
                { this.state.mode === Mode.drawer ? <DrawerNavBar/> : null }
                <div className={ Styles.zoomNavbar }>
                    { zoomElements.map( ( e, key ) => e.render( key ) ) }
                </div>
                <div className={ Styles.clearNavbar }>
                    { clearElements.map( ( e, key ) => e.render( key ) ) }
                </div>
                { this.renderConfirmDialog() }
            </div>
        );
    }
}
