import React, { PropTypes } from 'react';
import ReactDOM             from 'react-dom';

import AbstractWidgetEditor from '../abstract/Editor';

import Styles from './Editor.scss';

export default class TwitterWidgetEditor extends AbstractWidgetEditor {

    static propTypes = {
        widgetId : PropTypes.string
    };

    componentDidMount() {
        if( !this.props.aggregate ){
           ReactDOM.findDOMNode( this.refs.Twitter ).focus();
        }
    }

    renderEditor() {
        return (
            <textarea ref="Twitter"
                      className={ Styles.root }
                      placeholder="Enter your twitter url to display a profile"
                      valueLink={ this.link( 'widgetId' ) }
                      onKeyPress={ e => e.charCode === 13 ?  this.props.actions.setViewMode() : null }>
            </textarea>
        );
    }
}
