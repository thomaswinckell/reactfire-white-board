import React, { Component, PropTypes }  from 'react';
import DetectCss                        from 'detectcss';


export default class Blur extends Component {

    render() {
        const hasBlur = DetectCss.feature( 'backdrop-filter' );
        const className = hasBlur ? 'blur' : 'blur-polyfill';

        return (
            <div className={ className }>
                { this.props.children ? this.props.children : <div></div> }
            </div>
        );
    }
}
