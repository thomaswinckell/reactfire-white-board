import React, { PropTypes } from 'react';
import ReactDOM             from 'react-dom';

import AbstractWidgetEditor from '../abstract/Editor';

import Styles from './Editor.scss';


export default class TextWidgetEditor extends AbstractWidgetEditor {

    static propTypes = {
        value : PropTypes.string
    };

    componentDidMount() {
        if( !this.props.aggregate ){
           ReactDOM.findDOMNode( this.refs.textEditor ).focus();
        }
    }

    renderEditor() {
        return (
            <textarea ref="textEditor"
                      className={ Styles.root }
                      placeholder="Write something here..."
                      valueLink={ this.link( 'value' ) }
                      onKeyPress={ e => e.charCode === 13 ? this.props.actions.setViewMode() : null }>
            </textarea>
        );
    }
}
