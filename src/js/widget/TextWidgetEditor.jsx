import React                from 'react';
import ReactDOM             from 'react-dom';
import $                    from 'jquery';

import AbstractWidgetEditor from 'core/AbstractWidgetEditor';


export default class TextWidgetEditor extends AbstractWidgetEditor {

    static propTypes = {
        value: React.PropTypes.string
    };

    componentDidMount() {
        ReactDOM.findDOMNode( this.refs.textEditor ).focus();
    }

    renderEditor() {
        return (
            <textarea ref="textEditor"
                      className="text-widget-editor"
                      placeholder="Write something here..."
                      valueLink={ ::this.link( 'value' ) }
                      onKeyPress={ e => e.charCode === 13 ? this.context.widget.setViewMode() : null }>
            </textarea>
        );
    }
}
