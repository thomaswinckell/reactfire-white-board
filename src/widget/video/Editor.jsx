import React                            from 'react';
import RecordRTC                        from 'recordrtc';

import { videoTime }                    from 'config/WidgetConfig';
import Webcam                           from 'component/Webcam';
import AbstractWidgetEditor             from 'widget/abstract/Editor';


export default class VideoWidgetEditor extends AbstractWidgetEditor {

    constructor( props ) {
        super( props );
        this.state = {
            isRecording : false
        };
    }

    componentWillUnmount() {
        clearTimeout( this._stopRecordingTimeout );
    }

    getMenuElements() {
        const additionalMenuElements = [ this.state.isRecording ?
            {
                className   : "widget-menu-move-stop-recording",
                action      : this.stopRecording.bind( this ),
                text        : "Stop recording",
                icon        : "stop"
            } :
            {
                className   : "widget-menu-start-recording",
                action      : this.startRecording.bind( this ),
                text        : "Start recording",
                icon        : "play_arrow"
            }
        ];
        return super.getMenuElements().concat( additionalMenuElements );
    }

    onEndRecord( dataUrl ) {
        this.link( 'video' ).requestChange( dataUrl );
        this.setState( { isRecording : false } );
    }

    startRecording() {
        if ( this.recordRTC ) {
            this.recordRTC.startRecording();
            this._stopRecordingTimeout = setTimeout( this.stopRecording.bind( this ), videoTime );
            this.setState( { isRecording : true } )
        }
    }

    stopRecording() {
        if ( this.recordRTC ) {
            this.recordRTC.stopRecording( () => this.recordRTC.getDataURL( dataUrl => this.onEndRecord( dataUrl ) ) );
        }
    }

    handleUserMedia( stream ) {
        this.recordRTC = new RecordRTC( stream, { type : 'video' } );
    }

    renderEditor() {
        return (
            <div>
                <Webcam width={ this.props.size.width - 30 }
                        height={ this.props.size.height - 65 }
                        onUserMedia={ this.handleUserMedia.bind( this ) } />
            </div>
        );
    }
}
