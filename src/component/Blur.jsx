import React, { Component, PropTypes }  from 'react';
import DetectCss                        from 'detectcss';

import Styles   from './Blur.scss';


export default class Blur extends Component {

    render() {
        const hasBlur = DetectCss.feature( 'backdrop-filter' );
        const className = hasBlur ? Styles.blur : Styles.blurPolyfill;

        return (
            <div className={ className }>
                { this.props.children ? this.props.children : <div></div> }
            </div>
        );
    }
}
