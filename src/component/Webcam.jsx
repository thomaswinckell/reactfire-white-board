import React, { Component, PropTypes }  from 'react';
import ReactWebcam                      from 'react-webcam';


export default class Webcam extends ReactWebcam {

    handleUserMedia(error, stream) {
      if (error) {
        this.setState({
          hasUserMedia: false
        });

        return;
      }

      let src = window.URL.createObjectURL(stream);

      this.stream = stream;
      this.setState({
        hasUserMedia: true,
        src
      });

      this.props.onUserMedia( stream ); // The fix is here
    }
}
