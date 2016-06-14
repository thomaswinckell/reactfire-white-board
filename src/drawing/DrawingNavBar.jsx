import $                                from 'jquery';
import React, { Component, PropTypes }  from 'react';
import ReactDOM                         from 'react-dom';
import { ChromePicker }                 from 'react-color';

import * as DrawingActions              from './BackgroundDrawingActions';
import * as TextToolActions             from './tool/TextToolActions';
import NavBar, { NavBarElement }        from '../component/NavBar';
import Pencil                           from './tool/Pencil';
import Rectangle                        from './tool/Rectangle';
import Line                             from './tool/Line';
import Circle                           from './tool/Circle';
import TextTool                         from './tool/TextTool';
import Eraser                           from './tool/Eraser';

export default class DrawingNavBar extends Component {

    static propTypes = {
        position    : PropTypes.object
    }

    static defaultProps = {
        position : {
            x : '1.5em',
            y : '7.5em'
        }
    }

    constructor( props ) {
        super( props );
        this.state = {
            displayColorPicker              : false,
            tool                            : Pencil,
        };
    }

    componentWillUnmount() {
        this.onClose();
    }

    setTool( tool ) {
        this.onClose();
        DrawingActions.setTool( tool );
        this.setState( { tool } );
    }

    isActiveTool( tool ) {
        return tool === this.state.tool;
    }

    onChangeColor( color ) {
        DrawingActions.setColor( `${color.hex}` );
    }

    onClose = () => {
        this.setState( { displayColorPicker : false } );
    }

    render() {

        const elements = [
            new NavBarElement( 'Pencil',            'brush',     () => this.setTool( Pencil ), this.isActiveTool( Pencil ) ? "active" : "" ),
            new NavBarElement( 'Line',              'line',      () => this.setTool( Line ), this.isActiveTool( Line ) ? "active" : "" ),
            new NavBarElement( 'Rectangle',         'check_box_outline_blank',     () => this.setTool( Rectangle ), this.isActiveTool( Rectangle ) ? "active" : "" ),
            new NavBarElement( 'Color',             'colorize',     () => this.setState( { displayColorPicker : !this.state.displayColorPicker } ) ),
        ];

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
        return (
            <div>
                { this.state.displayColorPicker ? <div style={ colorPosition }>
                 <div style={ cover } onClick={ this.onClose }/>
                  <ChromePicker onChange={ this.state.displayColorPicker ? this.onChangeColor.bind( this ) : this.onChangeBackgroundColor.bind( this ) }/>
                </div> : null }
                 <NavBar elements={ elements } position={ this.props.position } horizontal={ true } />
            </div>
        );
    }
}
