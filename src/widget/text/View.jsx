import React                from 'react';

import AbstractWidgetView   from '../abstract/View';

import Styles from './View.scss';


export default class TextWidgetView extends AbstractWidgetView {

    renderView() {
        const { width, height } = this.props.size;
        const isImage = this.props.value.match( /^http(.*)(png|jpg|jpeg|gif)$/i );
        return (
            <div className={ Styles.root }>
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
