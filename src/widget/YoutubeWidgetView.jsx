import React                    from 'react';

import AbstractWidgetView       from 'core/AbstractWidgetView';

import Styles from './YoutubeWidgetView.scss';


export default class YoutubeWidgetView extends AbstractWidgetView {

    renderView() {
        return (
            <div className={ Styles.wrapper }>
                { this.props.youtube && this.props.youtube.id ?
                    <iframe src={ `http://www.youtube.com/embed/${this.props.youtube.id}` } width={ this.props.size.width - 30 }
                            height={ this.props.size.height - 65 }></iframe>
                    :
                    <div>Please click on the edit button and enter the URL of a youtube video.</div>
                }
            </div>
        );
    }
}
