import React, { PropTypes } from 'react';
import classNames           from 'classnames';

import AbstractWidgetEditor from 'widget/abstract/Editor';

import Styles from './Editor.scss';


export default class YoutubeWidgetEditor extends AbstractWidgetEditor {

    static propTypes = {
        value: PropTypes.string
    };

    constructor( props ) {
        super( props );
        this.requestChange = this.link( 'youtube' ).requestChange;
    }

    componentWillReceiveProps( nextProps ) {
        if ( nextProps.youtube.id !== this.props.youtube.id ) {
            this.props.actions.setViewMode();
        }
    }

    getYoutubeIdByUrl( url ) {

        var splitedUrl = url.split( 'youtube.com/embed/' );

        if ( splitedUrl.length === 2 )
            return splitedUrl[ 1 ].split( '#' )[ 0 ];

        splitedUrl = url.split( 'youtube.com/watch?v=' );

        if ( splitedUrl.length === 2 )
            return splitedUrl[ 1 ].split( '#' )[ 0 ];

        splitedUrl = url.split( 'youtu.be/' );

        if ( splitedUrl.length === 2 )
            return splitedUrl[ 1 ].split( '#' )[ 0 ];

        return null;
    }

    linkInput() {
        return {
            value         : this.props.youtube ? this.props.youtube.url : null,
            requestChange : url => {
                const id = this.getYoutubeIdByUrl( url );
                if ( id !== null ) {
                    this.requestChange( { url, id } );
                }
            }
        }
    }

    renderEditor() {
        return (
            <div className={ Styles.wrapper }>
                <textarea placeholder="Paste the URL of a youtube video"
                      valueLink={ this.linkInput() }
                      className={ classNames( { error : this.props.youtube && this.props.youtube.url && !this.props.youtube.id } ) }>
                </textarea>
            </div>
        );
    }
}
