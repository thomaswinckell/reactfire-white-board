import React, { Component, PropTypes }  from 'react';
import ReactDOM                         from 'react-dom';

import Menu                             from '../Menu';

import translations                     from '../../i18n/messages/messages';

import * as Styles from './Editor.scss';


export default class AbstractWidgetEditor extends Component {

    static contextTypes = {
        intl : PropTypes.object
    };

    constructor( props ) {
        super( props );
        this.state = {};
    }

    componentDidMount() {
        if( this.props.aggregate ){
            ReactDOM.findDOMNode( this.refs.aggEditor ).focus();
        }
    }


    link( prop ) {
        return {
            value           : this.props[ prop ],
            requestChange   : value => this.props.valueLink( { [ prop ] : value } )
        };
    }

    getMenuElements() {
        return [ {
            action      : this.props.actions.setViewMode,
            text        : this.context.intl.formatMessage( translations.widgetElement.Menu.View ),
            icon        : `edit ${Styles.iconActive}`
        }, {
            action      : this.props.actions.deleteWidget,
            text        : this.context.intl.formatMessage( translations.widgetElement.Menu.Delete ),
            icon        : 'delete'
        } ];
    }

    /**
     * @abstract
     */
    renderEditor() {
        throw `The component ${this.constructor.name} should implement the method renderEditor !`;
    }

    renderAggregate() {
        return (
            <textarea ref="aggEditor"
                  className={ Styles.aggregate }
                  placeholder="Write title here..."
                  valueLink={ this.link( 'title' ) }
                  onKeyPress={ e => e.charCode === 13 ? this.props.actions.setViewMode() : null }>
            </textarea>
        )
    }

    render() {

        const style = {
            width : this.props.size.width - 30, // FIXME
            height : this.props.size.height - 65 // FIXME
        };

        return (
            <div tabIndex="1000"
                 style={ style }
                 className={ Styles.root }>

                 { <Menu menuElements={ this.getMenuElements() } position={ this.props.position } display={ true } /> }

                 { this.props.aggregate? this.renderAggregate() : this.renderEditor() }
            </div>
        );
    }
}
