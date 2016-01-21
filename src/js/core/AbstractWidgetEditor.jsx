import React, { Component, PropTypes }  from 'react';
import ReactDOM                         from 'react-dom';

import WidgetMenu                       from 'core/WidgetMenu';


export default class AbstractWidgetEditor extends Component {

    static contextTypes = {
        board   : PropTypes.object,
        widget  : PropTypes.object
    }

    constructor( props ) {
        super( props );
        this.state = {
        };
    }

    link( prop ) {
        return {
            value           : this.props[ prop ],
            requestChange   : value => this.props.valueLink( { [prop]: value } )
        };
    }

    getMenuElements() {
        return [
            {
                className   : "widget-menu-view",
                action      : ::this.context.widget.setViewMode,
                text        : "View",
                icon        : "edit active"
            },{
                className   : "widget-menu-delete",
                action      : ::this.context.widget.deleteWidget,
                text        : "Delete",
                icon        : "delete"
            }
        ];
    }

    /**
     * @abstract
     */
    renderEditor() {
        return (
            <div></div>
        );
    }

    render() {

        const style = {
            width : this.props.size.width - 30,
            height : this.props.size.height - 65
        };

        return (
            <div tabIndex="1000"
                 style={ style }
                 className="widget-editor">

                 { <WidgetMenu menuElements={ this.getMenuElements() } position={ this.props.position } display={ true } /> }

                 { this.renderEditor() }
            </div>
        );
    }
}
