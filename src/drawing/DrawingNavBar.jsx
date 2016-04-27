import $                                from 'jquery';
import React, { Component, PropTypes }  from 'react';
import ReactDOM                         from 'react-dom';
import ColorPicker                      from 'react-color';

import * as DrawingActions              from './BackgroundDrawingActions';
import NavBar, { NavBarElement }        from '../component/NavBar';
import Pencil                           from './tool/Pencil';
import Rectangle                        from './tool/Rectangle';
import Line                             from './tool/Line';
import Circle                           from './tool/Circle';


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
            displayBackgroundColorPicker    : false,
            displayLineWidthPicker          : false,
            lineWidth                       : 10,
            tool                            : Pencil
        };
    }

    componentWillUnmount() {
        this.onClose();
    }

    setTool( tool ) {
        DrawingActions.setTool( tool );
        this.setState( { tool } );
    }

    isActiveTool( tool ) {
        return tool === this.state.tool;
    }

    onChangeColor( color ) {
        DrawingActions.setColor( `#${color.hex}` );
    }

    onChangeBackgroundColor( color ) {
        DrawingActions.setBackgroundColor( `#${color.hex}` );
    }

    onLineWidthChange ( width ) {
        this.setState({ lineWidth : width.target.value });
        DrawingActions.setLineWidth( this.state.lineWidth );
    }

    hideLinewidthPicker(){
        this.setState({ displayLineWidthPicker : false });
    }

    onClose() {
        this.setState( { displayColorPicker : false, displayBackgroundColorPicker : false, displayLineWidthPicker : false } );
    }

    toggleColor() {
        this.setState( { displayColorPicker : !this.state.displayColorPicker, displayBackgroundColorPicker : false } );
    }

    toggleBackgroundColor() {
        this.setState( { displayColorPicker : false, displayBackgroundColorPicker : !this.state.displayBackgroundColorPicker } );
    }

    updateBackgroundImage() {
        ReactDOM.findDOMNode( this.refs.fileUpload ).click();
    }

    onUpload( event ) {
        const file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
        if ( file ) {
            let reader = new FileReader();
            reader.onload = e => DrawingActions.setBackgroundImage( e.target.result );
            reader.readAsDataURL( file );
        }
    }

    render() {

        const elements = [
            new NavBarElement( 'Pencil',            'brush',     () => this.setTool( Pencil ), this.isActiveTool( Pencil ) ? "active" : "" ),
            new NavBarElement( 'Line',              'line',      () => this.setTool( Line ), this.isActiveTool( Line ) ? "active" : "" ),
            new NavBarElement( 'Rectangle',         'check_box_outline_blank',     () => this.setTool( Rectangle ), this.isActiveTool( Rectangle ) ? "active" : "" ),
            new NavBarElement( 'Circle',            'radio_button_unchecked',     () => this.setTool( Circle ), this.isActiveTool( Circle ) ? "active" : "" ),
            //new NavBarElement( 'Text',              'text_fields' /* TODO */ ),

            new NavBarElement( 'Line width',        'line_weight', () => this.setState( { displayLineWidthPicker : !this.state.displayLineWidthPicker } ) ),
            new NavBarElement( 'Color',             'colorize',     () => this.setState( { displayColorPicker : !this.state.displayColorPicker } ) ),

            new NavBarElement( 'Background color',  'format_color_fill', this.toggleBackgroundColor.bind( this ) ),

            new NavBarElement( 'Background image',  'image',             this.updateBackgroundImage.bind( this ) ),

            /* Text */
            //new NavBarElement( 'Font',              'text_format' /* TODO */ ),
            //new NavBarElement( 'Font size',         'format_size' /* TODO */ ),
            //new NavBarElement( 'Bold',              'format_bold' /* TODO */ ),
            //new NavBarElement( 'Underline',         'format_underlined' /* TODO */ ),
            //new NavBarElement( 'Strike through',    'format_strikethrough' /* TODO */ ),
            //new NavBarElement( 'Italic',            'format_italic' /* TODO */ )
        ];

        const colorPosition = {
            position: 'fixed',
            top: '160px',
            left: '60px',
            zIndex: 2147483647
        };

        const bgColorPosition = {
            position: 'fixed',
            top: '191px',
            left: '60px',
            zIndex: 2147483647
        };

        const LinePickerPosition = {
            position: 'fixed',
            top: '235px',
            left: '70px',
            zIndex: 2147483647
        };

        return (
            <div>
                 { /* color={ FIXME this.state.displayColorPicker ? DrawingActions.getColor() : DrawingActions.getBackgroundColor() } */ }
                {this.state.displayLineWidthPicker ? <input type='number' onKeyPress={ e => e.charCode === 13 ? this.hideLinewidthPicker() : null}value ={this.state.lineWidth}style= {LinePickerPosition} onChange={ this.onLineWidthChange.bind(this) } /> : null }
                <ColorPicker type="chrome"
                             display={ this.state.displayColorPicker || this.state.displayBackgroundColorPicker }
                             positionCSS={ this.state.displayColorPicker ? colorPosition : bgColorPosition }
                             onClose={ this.onClose.bind( this ) }
                             onChange={ this.state.displayColorPicker ? this.onChangeColor.bind( this ) : this.onChangeBackgroundColor.bind( this ) }/>
                         <input type="file" style={ { display : 'none' } } ref="fileUpload" onChange={ this.onUpload.bind( this ) } accept="image/*"/>
                 <NavBar elements={ elements } position={ this.props.position } horizontal={ true } />
            </div>
        );
    }
}
