import React, { PropTypes } from 'react';
import classNames           from 'classnames';

import AbstractWidgetEditor from '../abstract/Editor';

import Styles from './Editor.scss';


export default class JiraWidgetEditor extends AbstractWidgetEditor {

    static propTypes = {
        value: PropTypes.string
    };

    constructor( props ) {
        super( props );
        this.requestChange = this.link( 'adresse' ).requestChange;
    }

    componentWillReceiveProps( nextProps ) {
        if ( nextProps.adresse !== this.props.adresse ) {
            this.props.actions.setViewMode();
        }
    }

    linkInput() {
        return {
            value         : this.props.adresse ? this.props.adresse : null,
            requestChange : url => {
                let serv = url.split( 'https://' )[ 1 ];
                this.requestChange( { serv } );
            }
        }
    }


    renderEditor() {
        return (
            <div className={ Styles.root }>
                <textarea placeholder="Paste the URL of your jira dashboard"
                      valueLink={ this.linkInput() }
                      className={ classNames( { error : this.props.adresse } ) }>
                </textarea>
            </div>
        );
    }
}
