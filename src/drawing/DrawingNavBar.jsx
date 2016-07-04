import $                                from 'jquery';
import React, { Component, PropTypes }  from 'react';
import ReactDOM                         from 'react-dom';
import { ChromePicker }                 from 'react-color';
import Rcslider                         from 'rc-slider';

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
            displayBackgroundColorPicker    : false,
            displayLineWidthPicker          : false,
            displayFontSizePicker           : false,
            displayText                     : false,
            text                            : '',
            lineWidth                       : 10,
            tool                            : Pencil,
            fontSize                        : 24,
            bold                            : false,
            italic                          : false,
            underline                       : false,
            strikeThrough                   : false,
            x                               : 580,
            y                               : 85
        };

        TextToolActions.onMouseDown.listen( this._onMouseDown.bind( this ) );
    }

    componentWillUnmount() {
        this.onClose();
    }

    setTool( tool ) {
        this.onClose();
        DrawingActions.setTool( tool );
        this.setState( { tool } );
    }

    setText() {
        this.setState({ displayText : !this.state.displayText });
        DrawingActions.endText();
        this.setTool( TextTool );
    }

    onTextChange( event ) {
        this.setState({ text : event.target.value });
        DrawingActions.setText( event.target.value );
    }

    /**
     * return value of state propertie
     * @param  {String} prop the field of state to test
     */
    isActiveState = ( prop ) => {
        return this.state[prop];
    }

    isActiveTool( tool ) {
        return tool === this.state.tool;
    }

    setBold(){
        this.setState( { bold : !this.state.bold } );
        DrawingActions.setBold( this.state.bold );
    }

    setItalic(){
        this.setState( { italic : !this.state.italic } )
        DrawingActions.setItalic( this.state.italic );
    }

    setUnderline(){
        this.setState( { underline : !this.state.underline } )
        DrawingActions.setUnderline( this.state.underline );
    }

    setStrikeThrough(){
        this.setState( { strikeThrough : !this.state.strikeThrough } )
        DrawingActions.setStrikeThrough( this.state.strikeThrough );
    }

    onFontSizeChange ( size ) {
        this.setState({ fontSize : size.target.value });
        DrawingActions.setFontSize( size.target.value );
    }

    onChangeColor( color ) {
        DrawingActions.setColor( `${color.hex}` );
    }

    onChangeBackgroundColor( color ) {
        DrawingActions.setBackgroundColor( `${color.hex}` );
    }

    onLineWidthChange ( width ) {
        this.setState({ lineWidth : width });
        DrawingActions.setLineWidth( width );
    }

    hideLinewidthPicker(){
        this.setState({ displayLineWidthPicker : false });
    }

    hideFontSizePicker(){
        this.setState({ displayFontSizePicker : false });
    }

    onClose = () => {
        this.setState( { displayColorPicker : false, displayBackgroundColorPicker : false, displayLineWidthPicker : false } );
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

    _onMouseDown( x, y ){
        this.setState({
            x, y
        });
    }

    render() {

        const elements = [
            new NavBarElement( 'Pencil',            'brush',     () => this.setTool( Pencil ), this.isActiveTool( Pencil ) ? "active" : "" ),
            new NavBarElement( 'Line',              'line',      () => this.setTool( Line ), this.isActiveTool( Line ) ? "active" : "" ),
            new NavBarElement( 'Rectangle',         'check_box_outline_blank',     () => this.setTool( Rectangle ), this.isActiveTool( Rectangle ) ? "active" : "" ),
            new NavBarElement( 'Circle',            'radio_button_unchecked',     () => this.setTool( Circle ), this.isActiveTool( Circle ) ? "active" : "" ),
            new NavBarElement( 'Eraser',            'phonelink_erase',     () => this.setTool( Eraser ), this.isActiveTool( Eraser ) ? "active" : "" ),

            new NavBarElement( 'Line width',        'line_weight', () => this.setState( { displayLineWidthPicker : !this.state.displayLineWidthPicker } ) ),
            new NavBarElement( 'Color',             'colorize',     () => this.setState( { displayColorPicker : !this.state.displayColorPicker } ) ),

            new NavBarElement( 'Background color',  'format_color_fill',  () => this.setState( { displayBackgroundColorPicker : !this.state.displayBackgroundColorPicker } )  ),

            new NavBarElement( 'Background image',  'image',             this.updateBackgroundImage.bind( this ) ),

            new NavBarElement( 'TextTool',          'text_fields', () => this.setText(), this.isActiveTool( TextTool ) ? "active" : "" ),
        ];

        const textElements = [
            new NavBarElement( 'Font',              'text_format' /* TODO */, null , "", "bottom" ),
            new NavBarElement( 'Font size',         'format_size', () => this.setState( { displayFontSizePicker : !this.state.displayFontSizePicker } ), "", "bottom" ),
            new NavBarElement( 'Bold',              'format_bold', () => this.setBold(), this.isActiveState( 'bold' ) ? "active" : "", "bottom"),
            new NavBarElement( 'Strike through',    'format_strikethrough', () => this.setStrikeThrough(), this.isActiveState( 'strikeThrough' ) ? "active" : "", "bottom"),
            new NavBarElement( 'Underline',         'format_underlined', () => this.setUnderline(), this.isActiveState( 'underline' ) ? "active" : "", "bottom" ),
            new NavBarElement( 'Italic',            'format_italic' , () => this.setItalic(), this.isActiveState( 'italic' ) ? "active" : "", "bottom" )
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
            zIndex: 2147483647,
            width: '100px'
        };

        const FontSizePickerPosition = {
            position: 'fixed',
            top: '335px',
            left: '70px',
            zIndex: 2147483647
        };

        const TextPosition = {
            position: 'fixed',
            top: this.state.y+10 + 'px',
            left: this.state.x + 'px',
            zIndex: 2147483647
        }

        const TextElementsPosition = {
            position: 'fixed',
            top: this.state.y+50 + 'px',
            left: this.state.x + 'px',
            zIndex: 2147483647
        }

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
                 { /* color={ FIXME this.state.displayColorPicker ? DrawingActions.getColor() : DrawingActions.getBackgroundColor() } value ={this.state.lineWidth} */ }
                {this.state.displayText ? <input type='text' onKeyPress={ e => e.charCode === 13 ? this.setText() : null}value ={this.state.text}style= {TextPosition} onChange={ this.onTextChange.bind(this) } /> : null }
                {this.state.displayLineWidthPicker ?
                    <div style= {LinePickerPosition}>
                        <Rcslider min={1} max={40} defaultValue={this.state.lineWidth} onChange={ this.onLineWidthChange.bind(this) } />
                    </div>
                 : null }
                {this.state.displayFontSizePicker ? <input type='number' onKeyPress={ e => e.charCode === 13 ? this.hideFontSizePicker() : null}value ={this.state.fontSize }style= {FontSizePickerPosition} onChange={ this.onFontSizeChange.bind(this) } /> : null }
                {  this.state.displayColorPicker || this.state.displayBackgroundColorPicker ? <div style={  this.state.displayColorPicker ? colorPosition : bgColorPosition }>
                 <div style={ cover } onClick={ this.onClose }/>
                  <ChromePicker onChange={ this.state.displayColorPicker ? this.onChangeColor.bind( this ) : this.onChangeBackgroundColor.bind( this ) }/>
                </div> : null }
                 <input type="file" style={ { display : 'none' } } ref="fileUpload" onChange={ this.onUpload.bind( this ) } accept="image/*"/>
                 <NavBar elements={ elements } position={ this.props.position } horizontal={ true } />
                 {this.state.displayText ?  <NavBar elements={ textElements } position={ TextElementsPosition } horizontal={ false } /> : null}
            </div>
        );
    }
}
