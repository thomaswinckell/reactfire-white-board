import React,
       { Component, PropTypes } from 'react';
import _                        from 'lodash';
import $                        from 'jquery';
import ReactDOM                 from 'react-dom';

import BoardStore               from 'core/BoardStore';
import WidgetFactory            from 'core/WidgetFactory';
import Resizer                  from 'component/Resizer';
import Blur                     from 'component/Blur';

import Styles from './WidgetContainer.scss';


export default class WidgetContainerDisplay extends Component {

    static childContextTypes = {
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

        return { widget };
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
            BoardStore.size,
            {
                top     : -this.props.position.y,
                left    : -this.props.position.x
            }
        );

        return (
            <div tabIndex="1000"
                 className={ Styles.wrapper }
                 style={ styleWidget } >

                 <Blur/>

                { this.renderWidgetView() }
            </div>
        );
    }
}
