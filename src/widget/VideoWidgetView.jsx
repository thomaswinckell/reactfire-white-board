import React                    from 'react';
import Webcam                   from 'component/Webcam';

import AbstractWidgetView       from 'core/AbstractWidgetView';


export default class VideoWidgetView extends AbstractWidgetView {

    renderView() {

        if ( !this.props.video ) {
            return (
                <Webcam width={ this.props.size.width - 30 }
                        height={ this.props.size.height - 65 } />
            );
        }

        return (
            <video width={ this.props.size.width - 30 } height={ this.props.size.height - 65 } controls="controls">
                    <source src={ this.props.video } type="video/mp4" />
            </video>
        );
    }
}
