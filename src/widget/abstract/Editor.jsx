import React, { Component, PropTypes }  from 'react';

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

                 { this.renderEditor() }
            </div>
        );
    }
}
