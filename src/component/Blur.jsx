import React, { Component, PropTypes }  from 'react';
import DetectCss                        from 'detectcss';

import Styles   from './Blur.scss';


export default class Blur extends Component {

    getBlur(){
        const hasBlur   = DetectCss.feature( 'backdrop-filter' );

        if ( this.props.isLockedByAnotherUser ) {
            return hasBlur ? Styles.blurLock : Styles.blurPolyfillLock;
        } else {
            return hasBlur ? Styles.blur : Styles.blurPolyfill;
        }
    }

    render() {
        const className = this.getBlur();

        return (
            <div className={ className }>
                { this.props.children ? this.props.children : <div></div> }
            </div>
        );
    }
}
