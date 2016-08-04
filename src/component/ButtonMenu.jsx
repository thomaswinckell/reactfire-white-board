import _                                    from 'lodash';
import $                                    from 'jquery';
import React, { Component, PropTypes }      from 'react';

import { Motion, StaggeredMotion, spring }  from 'react-motion';
import range                                from 'lodash.range';

import classNames                           from 'classnames';
import ReactTooltip                         from 'react-tooltip';
import * as BoardActions                    from '../core/BoardActions';

import translations                         from '../i18n/messages/messages';

import Styles from './ButtonMenu.scss';

/* Constants */

// Diameter of the main button in pixels
const MAIN_BUTTON_DIAM  = 70;
const CHILD_BUTTON_DIAM = 48;

//should be between 0 and 0.5 (its maximum value is difference between scale in finalChildButtonStyles
// and initialChildButtonStyles
const OFFSET = 0.4;

//stiffness and damping of the open button animation
const SPRING_CONFIG = { stiffness : 400, damping : 28 };

// How far away from the main button does the child buttons go
const FLY_OUT_RADIUS   = 130,
      SEPARATION_ANGLE = 30; //degrees

// Utility functions

function toRadians( degrees ) {
    return degrees * 0.0174533;
}

export default class ButtonMenu extends Component {

    static contextTypes = {
        intl : PropTypes.object
    };

    constructor( props ) {
        super( props );
        this.state = {
            isOpen     : false,
            M_X        : 200,
            M_Y        : 19,
            BASE_ANGLE : ((180 - (this.props.elements.length - 1) * SEPARATION_ANGLE) / 2)
        };
    }

    updateDimensions = () => {
        ////TODO percentage + middle
        this.setState( { M_X : $( window ).width() / 2 } );
    }

    componentDidMount() {
        window.addEventListener( 'click', this.closeMenu );
        this.updateDimensions();
        window.addEventListener( "resize", this.updateDimensions );
    }

    componentWillUnmount() {
        window.removeEventListener( 'click', this.closeMenu, false );
        window.removeEventListener( "resize", this.updateDimensions );
    }

    mainButtonStyles() {
        return {
            top  : this.state.M_Y - MAIN_BUTTON_DIAM / 2,
            left : this.state.M_X - MAIN_BUTTON_DIAM / 2
        };
    }

    finalChildDeltaPositions( index ) {
        const angle = this.state.BASE_ANGLE + index * SEPARATION_ANGLE;
        return {
            deltaX : FLY_OUT_RADIUS * Math.cos( toRadians( angle ) ) - CHILD_BUTTON_DIAM / 2,
            deltaY : FLY_OUT_RADIUS * Math.sin( toRadians( angle ) ) + CHILD_BUTTON_DIAM / 2
        };
    }


    initialChildButtonStylesInit() {
        return {
            width  : CHILD_BUTTON_DIAM,
            height : CHILD_BUTTON_DIAM,
            top    : this.state.M_Y - CHILD_BUTTON_DIAM / 2,
            left   : this.state.M_X - CHILD_BUTTON_DIAM / 2,
            rotate : -180,
            scale  : 0.1
        };
    }

    initialChildButtonStyles() {
        return {
            width  : CHILD_BUTTON_DIAM,
            height : CHILD_BUTTON_DIAM,
            top    : spring( this.state.M_Y - CHILD_BUTTON_DIAM / 2, SPRING_CONFIG ),
            left   : spring( this.state.M_X - CHILD_BUTTON_DIAM / 2, SPRING_CONFIG ),
            rotate : spring( -180, SPRING_CONFIG ),
            scale  : spring( 0.1, SPRING_CONFIG )
        };
    }

    finalChildButtonStylesInit( childIndex ) {
        let { deltaX, deltaY } = this.finalChildDeltaPositions( childIndex );
        return {
            width  : CHILD_BUTTON_DIAM,
            height : CHILD_BUTTON_DIAM,
            top    : this.state.M_Y - deltaY,
            left   : this.state.M_X + deltaX,
            rotate : 0,
            scale  : 1
        };
    }

    finalChildButtonStyles( childIndex ) {
        let { deltaX, deltaY } = this.finalChildDeltaPositions( childIndex );
        return {
            width  : CHILD_BUTTON_DIAM,
            height : CHILD_BUTTON_DIAM,
            top    : spring( this.state.M_Y - deltaY, SPRING_CONFIG ),
            left   : spring( this.state.M_X + deltaX, SPRING_CONFIG ),
            rotate : spring( 0, SPRING_CONFIG ),
            scale  : spring( 1, SPRING_CONFIG )
        };
    }

    toggleMenu = ( e ) => {
        e.stopPropagation();
        this.props.onClick();
        this.setState( { isOpen : !this.state.isOpen } );
    };

    closeMenu = () => this.setState( { isOpen : false } );

    addWidget = ( event, element ) => {
        const props = _.merge( {}, element.defaultProps, {
            position : {
                x : event.pageX,
                y : event.pageY
            }
        } );
        return BoardActions.addWidgetClone( element.type, props );
    };

    renderChildButtons() {
        const { isOpen } = this.state;

        const elements = this.props.elements;

        const targetButtonStylesInitObject = range( elements.length ).map( i => {
            return isOpen ? this.finalChildButtonStylesInit( i ) : this.initialChildButtonStylesInit();
        } );

        //convert object in array
        const targetButtonStylesInit = Object.keys( targetButtonStylesInitObject ).map( key => targetButtonStylesInitObject[ key ] );

        const targetButtonStyles = range( elements.length ).map( i => {
            return isOpen ? this.finalChildButtonStyles( i ) : this.initialChildButtonStyles();
        } );
        const scaleMin           = this.initialChildButtonStyles().scale.val;
        const scaleMax           = this.finalChildButtonStyles( 0 ).scale.val;

        let calculateStylesForNextFrame = prevFrameStyles => {
            prevFrameStyles = isOpen ? prevFrameStyles : prevFrameStyles;

            let nextFrameTargetStyles = prevFrameStyles.map( ( buttonStyleInPreviousFrame, i ) => {
                //animation always starts from first button
                if ( i === 0 ) {
                    return targetButtonStyles[ i ];
                }

                const prevButtonScale        = prevFrameStyles[ i - 1 ].scale;
                const shouldApplyTargetStyle = () => {
                    if ( isOpen ) {
                        return prevButtonScale >= scaleMin + OFFSET;
                    } else {
                        return prevButtonScale <= scaleMax - OFFSET;
                    }
                };

                return shouldApplyTargetStyle() ? targetButtonStyles[ i ] : buttonStyleInPreviousFrame;
            } );

            return isOpen ? nextFrameTargetStyles : nextFrameTargetStyles;
        };


        return (
            <StaggeredMotion defaultStyles={targetButtonStylesInit} styles={calculateStylesForNextFrame}>
                {interpolatedStyles =>
                    <div>
                        {interpolatedStyles.map( ( { height, left, rotate, scale, top, width }, index ) =>
                             <div key={ index }>
                                 {elements.length !== 0 ?
                                     <div className={ Styles.childButton }
                                          onClick={ ( event ) => this.addWidget( event, elements[index] ) }
                                          style={ { transform: `rotate(${rotate}deg) scale(${scale})`, width ,  left, height, top,} }
                                          data-for={ 'id' + index.toString() } data-tip>
                                         <i className={ classNames('icon' , `icon-${elements[index].icon}` ) }>
                                         </i>
                                         <ReactTooltip id={'id' + index.toString() }
                                                       place={ elements[index].tooltipPosition }
                                                       class={ Styles.tooltip }
                                                       type="light" effect="solid">
                                             { this.context.intl.formatMessage( translations.widgetElement[ elements[ index ].text ] ) }
                                         </ReactTooltip>
                                     </div> : null }
                             </div>
                        )}
                    </div>
                }
            </StaggeredMotion>
        );
    }

    render() {
        const mainButtonRotation = {
            rotate : this.state.isOpen ? spring( 120, { stiffness : 500, damping : 28 } ) : spring( 0, { stiffness : 500, damping   : 30 } )
        };
        return (
            <div>
                {this.renderChildButtons()}
                <Motion style={mainButtonRotation}>
                    {( { rotate } ) =>
                        <div>
                            <div className={ Styles.mainButton }
                                 style={ {...this.mainButtonStyles(), transform: `rotate(${rotate}deg)`} }
                                 onClick={this.toggleMenu}>
                                <i className={ classNames( 'icon', `icon-add` ) } style={ { fontSize : '50px'} }/>
                            </div>
                        </div>
                    }
                </Motion>
            </div>
        );
    }
};
