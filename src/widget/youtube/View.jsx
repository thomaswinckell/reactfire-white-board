import React                    from 'react';

import AbstractWidgetView       from '../abstract/View';

import Styles from './View.scss';


export default class YoutubeWidgetView extends AbstractWidgetView {

    renderView() {
        return (
            <div className={ Styles.root }>
                { this.props.youtube && this.props.youtube.id ?
                    <iframe src={ `https://www.youtube.com/embed/${this.props.youtube.id}` } width={ this.props.size.width - 30 }
                            height={ this.props.size.height - 65 }></iframe>
                    :
                    <div>Please click on the edit button and enter the URL of a youtube video.</div>
                }
            </div>
        );
    }
}
