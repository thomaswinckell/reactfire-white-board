import React,
       { Component, PropTypes } from 'react';
import _                        from 'lodash';

import BoardStore               from '../core/BoardStore';
import WidgetFactory            from './Factory';
import Blur                     from '../component/Blur';

import Styles from './Wrapper.scss';


export default class WidgetWrapperDisplay extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            position    : {},
            size        : {}
        };
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
                 className={ Styles.root }
                 style={ styleWidget } >

                 <Blur/>

                { this.renderWidgetView() }
            </div>
        );
    }
}
