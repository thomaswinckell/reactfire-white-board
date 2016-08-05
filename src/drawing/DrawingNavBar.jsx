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
import * as DrawingConfig               from '../config/DrawingConfig';

import translations                     from '../i18n/messages/messages';

import * as Styles                      from './DrawingNavBarStyle';

export default class DrawingNavBar extends Component {

    static propTypes = {
        position    : PropTypes.object
    }

    static contextTypes = {
        intl : PropTypes.object
    };

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
            lineWidth                       : DrawingConfig.DEFAULT_LINE_SIZE,
            tool                            : Pencil,
            fontSize                        : DrawingConfig.DEFAULT_FONT_SIZE,
            bold                            : false,
            italic                          : false,
            underline                       : false,
            strikeThrough                   : false,
            x                               : 580,
            y                               : 85
        };

        this.onMouseDownListener = TextToolActions.onMouseDown.listen( this._onMouseDown.bind( this ) );
    }

    componentWillUnmount() {
        this.onClose();
        this.onMouseDownListener();
    }

    setTool( tool ) {
        this.onClose();
        DrawingActions.setTool( tool );
        this.setState( { tool } );
        if( tool !== TextTool ){
            this.setState({
                displayText : false
            })
        }
    }

    setText = () => {
        this.setState({ displayText : !this.state.displayText });
        DrawingActions.endText();
        this.setTool( TextTool );
    }

    onTextChange = ( event ) => {
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

    setTextToolProp = ( prop ) => {
        this.setState( { [prop] : !this.state[prop] },
            () => DrawingActions.setTextToolProp ( prop , this.state[ prop ] )
        );
    }

    onFontSizeChange = ( size ) => {
        this.setState({ fontSize : size });
        DrawingActions.setFontSize( size );
    }

    onChangeColor( color ) {
        DrawingActions.setColor( `${color.hex}` );
    }

    onChangeBackgroundColor( color ) {
        DrawingActions.setBackgroundColor( `${color.hex}` );
    }

    onLineWidthChange = ( width ) => {
        this.setState({ lineWidth : width });
        DrawingActions.setLineWidth( width );
    }

    hideLinewidthPicker = () => {
        this.setState({ displayLineWidthPicker : false });
    }

    hideFontSizePicker = () => {
        this.setState({ displayFontSizePicker : false });
    }

    onClose = () => {
        this.setState( { displayColorPicker : false, displayBackgroundColorPicker : false, displayLineWidthPicker : false } );
    }

    updateBackgroundImage = () => {
        ReactDOM.findDOMNode( this.refs.fileUpload ).click();
    }

    onUpload =( event ) => {
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

    renderTextTool = () => {

        const textElements = [
            new NavBarElement( this.context.intl.formatMessage( translations.drawingElement.TextToolProp.FontSize ),         'format_size', () => this.setState( { displayFontSizePicker : !this.state.displayFontSizePicker } ), "", "bottom" ),
            new NavBarElement( this.context.intl.formatMessage( translations.drawingElement.TextToolProp.Bold ),              'format_bold', () => this.setTextToolProp('bold'), this.isActiveState( 'bold' ) ? "active" : "", "bottom"),
            new NavBarElement( this.context.intl.formatMessage( translations.drawingElement.TextToolProp.StrikeThrough ),    'format_strikethrough', () => this.setTextToolProp('strikeThrough'), this.isActiveState( 'strikeThrough' ) ? "active" : "", "bottom"),
            new NavBarElement( this.context.intl.formatMessage( translations.drawingElement.TextToolProp.Underline ),         'format_underlined', () => this.setTextToolProp('underline'), this.isActiveState( 'underline' ) ? "active" : "", "bottom" ),
            new NavBarElement( this.context.intl.formatMessage( translations.drawingElement.TextToolProp.Italic ),            'format_italic' , () => this.setTextToolProp('italic'), this.isActiveState( 'italic' ) ? "active" : "", "bottom" )
        ];

        const TextElementsPosition = {
            position: 'fixed',
            top: this.state.y+50 + 'px',
            left: this.state.x + 'px',
            zIndex: 2147483647
        };

        const TextPosition = {
            position: 'fixed',
            top: this.state.y+10 + 'px',
            left: this.state.x + 'px',
            zIndex: 2147483647
        };

        if(this.state.displayText){
            return  (
                <div>
                    <input type='text' onKeyPress={ e => e.charCode === 13 ? this.setText() : null} value={this.state.text} style= {TextPosition} onChange={ this.onTextChange } />
                    <NavBar elements={ textElements } position={ TextElementsPosition } horizontal={ false } />
                </div>)
        }
    }

    /**
     * Render the props we can modify of a tool
     *
     * @returns {JSX}
     */
    renderMenuPropsElements = () => {
        let propsElements = [
            new NavBarElement( this.context.intl.formatMessage( translations.drawingElement.Props.LineWidth ),        'line_weight', () => this.setState( { displayLineWidthPicker : !this.state.displayLineWidthPicker } ), this.state.displayLineWidthPicker? "active" : "", "bottom" ),
            new NavBarElement( this.context.intl.formatMessage( translations.drawingElement.Props.Color ),             'colorize',     () => this.setState( { displayColorPicker : !this.state.displayColorPicker } ), this.state.displayColorPicker? "active" : "", "bottom")
        ];

        if( this.state.tool === Circle || this.state.tool === Rectangle ){
            propsElements.push(new NavBarElement( this.context.intl.formatMessage( translations.drawingElement.Props.BackgroundColor ),  'format_color_fill',  () => this.setState( { displayBackgroundColorPicker : !this.state.displayBackgroundColorPicker } ), this.state.displayBackgroundColorPicker? "active" : "" , "bottom"))
        }

        return(
            <NavBar elements={ propsElements } position={ Styles.propsElements } horizontal={ false } />
        );
    }

    render() {

        const elements = [
            new NavBarElement( this.context.intl.formatMessage( translations.drawingElement.Pencil ),            'brush',     () => this.setTool( Pencil ), this.isActiveTool( Pencil ) ? "active" : "" ),
            new NavBarElement( this.context.intl.formatMessage( translations.drawingElement.Line ),              'line',      () => this.setTool( Line ), this.isActiveTool( Line ) ? "active" : "" ),
            new NavBarElement( this.context.intl.formatMessage( translations.drawingElement.Rectangle ),         'check_box_outline_blank',     () => this.setTool( Rectangle ), this.isActiveTool( Rectangle ) ? "active" : "" ),
            new NavBarElement( this.context.intl.formatMessage( translations.drawingElement.Circle ),            'radio_button_unchecked',     () => this.setTool( Circle ), this.isActiveTool( Circle ) ? "active" : "" ),
            new NavBarElement( this.context.intl.formatMessage( translations.drawingElement.Eraser ),            'eraser',     () => this.setTool( Eraser ), this.isActiveTool( Eraser ) ? "active" : "" ),
            new NavBarElement( this.context.intl.formatMessage( translations.drawingElement.TextTool ),          'text_fields', () => this.setText(), this.isActiveTool( TextTool ) ? "active" : "" ),
            new NavBarElement( this.context.intl.formatMessage( translations.drawingElement.BackgroundImage ),  'image',             this.updateBackgroundImage )
        ];

       return (
            <div>
                <NavBar elements={ elements } position={ Styles.DrawingTools } horizontal={ true } />

                {this.state.displayLineWidthPicker ? <div style={ Styles.LinePickerPosition }>
                    <div style={ Styles.cover } onClick={ this.hideLinewidthPicker }/>
                        <Rcslider min={DrawingConfig.MIN_LINE_SIZE} max={DrawingConfig.MAX_LINE_SIZE} defaultValue={this.state.lineWidth} onChange={ this.onLineWidthChange } />
                    </div> : null }
                {this.state.displayFontSizePicker ? <div style={ Styles.LinePickerPosition }>
                    <div style={ Styles.cover } onClick={ this.hideFontSizePicker }/>
                        <Rcslider min={DrawingConfig.MIN_FONT_SIZE} max={DrawingConfig.MAX_FONT_SIZE} defaultValue={ this.state.fontSize } onChange={ this.onFontSizeChange } />
                    </div>: null }

                {  this.state.displayColorPicker || this.state.displayBackgroundColorPicker ? <div style={ Styles.colorPosition }>
                    <div style={ Styles.cover } onClick={ this.onClose }/>
                    <ChromePicker onChange={ this.state.displayColorPicker ? this.onChangeColor : this.onChangeBackgroundColor }/>
                </div> : null }

                <input type="file" style={ { display : 'none' } } ref="fileUpload" onChange={ this.onUpload } accept="image/*"/>
                {this.renderMenuPropsElements()}
                {this.renderTextTool()}
            </div>
        );
    }
}
