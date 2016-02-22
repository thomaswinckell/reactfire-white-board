import $                                from 'jquery';
import React, { Component, PropTypes }  from 'react';
import ReactDOM                         from 'react-dom';
import ColorPicker                      from 'react-color';

import BackgroundDrawingStore           from 'core/BackgroundDrawingStore';
import NavBar, { NavBarElement }        from 'component/NavBar';
import Pencil                           from 'drawer/Pencil';
import Rectangle                        from 'drawer/Rectangle';
import Line                             from 'drawer/Line';
import Circle                           from 'drawer/Circle';


export default class DrawerNavBar extends Component {

    static contextTypes = {
        drawing : PropTypes.object
    }

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
            tool                            : Pencil
        };
    }

    componentWillUnmount() {
        this.onClose();
    }

    setTool( tool ) {
        this.context.drawing.setTool( tool );
        this.setState( { tool } );
    }

    isActiveTool( tool ) {
        return tool === this.state.tool;
    }

    onChangeColor( color ) {
        this.context.drawing.setColor( `#${color.hex}` );
    }

    onChangeBackgroundColor( color ) {
        this.context.drawing.setBackgroundColor( `#${color.hex}` );
    }

    onClose() {
        this.setState( { displayColorPicker : false, displayBackgroundColorPicker : false } );
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
            reader.onload = e => BackgroundDrawingStore.setBackgroundImage( e.target.result );
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

            new NavBarElement( 'Line width',        'line_weight' /* TODO */ ),
            new NavBarElement( 'Color',             'colorize',     () => this.setState( { displayColorPicker : !this.state.displayColorPicker } ) ),

            new NavBarElement( 'Background color',  'format_color_fill', ::this.toggleBackgroundColor ),

            new NavBarElement( 'Background image',  'image',             ::this.updateBackgroundImage ),

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

        return (
            <div>
                <ColorPicker type="chrome"
                             color={ this.state.displayColorPicker ? this.context.drawing.getColor() : this.context.drawing.getBackgroundColor() }
                             display={ this.state.displayColorPicker || this.state.displayBackgroundColorPicker }
                             positionCSS={ this.state.displayColorPicker ? colorPosition : bgColorPosition }
                             onClose={ ::this.onClose }
                             onChange={ this.state.displayColorPicker ? ::this.onChangeColor : ::this.onChangeBackgroundColor }/>
                 <input type="file" style={ { display : 'none' } } ref="fileUpload" onChange={ ::this.onUpload } accept="image/*"/>
                 <NavBar elements={ elements } position={ this.props.position } horizontal={ true } />
            </div>
        );
    }
}
