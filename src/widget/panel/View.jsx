import React                from 'react';

import AbstractWidgetView   from '../abstract/View';

import Styles from './View.scss';


export default class PanelWidgetView extends AbstractWidgetView {

    renderView() {
        const { width, height } = this.props.size;
        return (
            <div className={ Styles.root }>
                <label style={ { width } }>{this.props.value}</label>
            </div>
        );
    }
}
