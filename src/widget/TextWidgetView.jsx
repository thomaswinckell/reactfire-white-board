import React                from 'react';

import AbstractWidgetView   from 'core/AbstractWidgetView';

import Styles from './TextWidgetView.scss';


export default class TextWidgetView extends AbstractWidgetView {

    renderView() {
        const { width, height } = this.props.size;
        const isImage = this.props.value.match( /^http(.*)(png|jpg|jpeg|gif)$/i );
        return (
            <div className={ Styles.wrapper }>
                {
                    isImage ?
                    <img width={ width } height={ height } src={this.props.value} />
                    :
                    <label style={ { width } }>{this.props.value}</label>
                }
            </div>
        );
    }
}
