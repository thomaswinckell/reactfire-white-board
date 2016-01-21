import React,
       { Component, PropTypes } from 'react';
import _                        from 'lodash';
import $                        from 'jquery';
import ReactDOM                 from 'react-dom';

import WidgetFactory            from 'core/WidgetFactory';
import Resizer                  from 'component/Resizer';
import Blur                     from 'component/Blur';


export default class WidgetContainerDisplay extends Component {

    static contextTypes = {
        board   : PropTypes.object
    }

    static childContextTypes = {
        board : PropTypes.object,
        widget: PropTypes.object
    }

    constructor( props ) {
        super( props );
        this.state = {
            position    : {},
            size        : {}
        };
    }

    getChildContext() {
        const widget = {
        };

        return { widget, board : this.context.board };
    }

    renderWidgetView() {
        return WidgetFactory.createWidgetView( this.props.type, this.props );
    }

    render() {

        const styleWidget = {
            zIndex  : this.props.index + 1000,
            top     : this.props.position.y,
            left    : this.props.position.x,
            width   : this.props.size.width,
            height  : this.props.size.height
        };

        const styleBoardBackground = _.extend(
            {},
            this.context.board.size,
            {
                top     : -this.props.position.y,
                left    : -this.props.position.x
            }
        );

        return (
            <div tabIndex="1000"
                 className="widget"
                 style={ styleWidget } >

                 <Blur/>

                { this.renderWidgetView() }
            </div>
        );
    }
}
