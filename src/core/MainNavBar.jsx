import React, { Component, PropTypes }  from 'react';

import * as DrawingActions              from '../drawing/BackgroundDrawingActions';
import * as BoardActions                from './BoardActions';
import NavBar, { NavBarElement }        from '../component/NavBar';
import ConfirmDialog                    from '../component/ConfirmDialog';
import DrawingNavBar                    from '../drawing/DrawingNavBar';

import ButtonMenu                       from '../component/ButtonMenu';


import Styles from './MainNavBar.scss';


const Mode = {
    widgets : 0,
    drawing : 1
};

export default class MainNavBar extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            mode : Mode.widgets
        };
    }

    setDrawingMode = () => {
        if ( this.state.mode === Mode.widgets ) {
            DrawingActions.enable();
            this.setState( { mode : Mode.drawing } );
        } else {
            this.setWidgetMode();
        }
    }

    cancelDrawing = () => {
        if ( this.state.mode === Mode.drawing ) {

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

    saveDrawing = () => {
        DrawingActions.save();
    }

    setWidgetMode = () => {
        if ( this.state.mode === Mode.drawing ) {
            DrawingActions.disable();
            this.setState( { mode : Mode.widgets  } );
        }
    }

    clearBoard = () => {
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

    clearDrawing = () => {
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
        //new NavBarElement( 'Logout', 'sign-out', AuthActions.logout.bind( this ) ),
            new NavBarElement( 'Paint mode',    'format_paint',        this.setDrawingMode,    this.state.mode === Mode.drawing ? 'active' : '', 'bottom' ),
           // new NavBarElement( 'Widgets mode',  'dashboard',           this.setWidgetMode.bind( this ),      this.state.mode === Mode.widgets ? 'active' : '', 'bottom' ),
        ];

        let zoomElements = [
            new NavBarElement( 'Zoom in', 'zoom_in', BoardActions.zoomIn,       '', 'left' ),
            new NavBarElement( 'Zoom out', 'zoom_out', BoardActions.zoomOut,    '', 'left' )
        ];

        let clearElements = [
        ];

        if ( this.state.mode === Mode.drawing ) {
            clearElements.push(
                new NavBarElement( 'Save drawing',      'save',   this.saveDrawing,      '', 'bottom' ),
                new NavBarElement( 'Clear drawing',     'clear',  this.clearDrawing,      '', 'bottom' ),
                new NavBarElement( 'Cancel',            'undo',   this.cancelDrawing,    '', 'bottom' ),
            );
        } else {
            clearElements.push(
                new NavBarElement( 'Clear board',       'clear',  this.clearBoard,        '', 'bottom' ),
            );
        }

        return (
            <div className={ Styles.root }>
                <NavBar elements={ elements } className={ Styles.navbar } />
                <ButtonMenu elements={this.props.elements} onClick={ this.setWidgetMode }/>
                { this.state.mode === Mode.drawing ? <DrawingNavBar/> : null }
                <div className={ Styles.zoomNavbar }>
                    { zoomElements.map( ( e, key ) => e.render( key ) ) }
                </div>
                <div className={ Styles.clearNavbar }>
                    <ul>
                    { clearElements.map( ( e, key ) => e.render( key ) ) }
                    </ul>
                </div>
                { this.renderConfirmDialog() }
            </div>
        );
    }
}
