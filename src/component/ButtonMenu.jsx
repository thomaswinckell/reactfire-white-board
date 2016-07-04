import _                                    from 'lodash';
import $                                	from 'jquery';
import React, { Component, PropTypes }      from 'react';

import {Motion, StaggeredMotion, spring}    from 'react-motion';
import range                                from 'lodash.range';

import classNames                       	from 'classnames';
import ReactTooltip                     	from 'react-tooltip';
import * as BoardActions                    from '../core/BoardActions';

import Styles from './ButtonMenu.scss';
// Components

//Constants

// Diameter of the main button in pixels
const MAIN_BUTTON_DIAM = 90;
const CHILD_BUTTON_DIAM = 48;
// The number of child buttons that fly out from the main button
// const NUM_CHILDREN = 6;
// Hard code the position values of the mainButton
//let M_X = $(window).width() - 180;
//let M_Y = $(window).height()  - 150;

//should be between 0 and 0.5 (its maximum value is difference between scale in finalChildButtonStyles a
// nd initialChildButtonStyles)
const OFFSET = 0.4;

//Tooltip offset jsut magic numbers ....
const TOOLTIP_DATA_OFFSET = "{ 'top' : 70, 'left' : 67}";


//Version 3.1 with array
//const SPRING_CONFIG = [400, 28];
// version 4.X uses object instead
const SPRING_CONFIG = {stiffness : 400, damping : 28};

// How far away from the main button does the child buttons go
const FLY_OUT_RADIUS = 130,
	SEPARATION_ANGLE = 40; //degrees
	// FAN_ANGLE = (NUM_CHILDREN - 1) * SEPARATION_ANGLE, //degrees
	// BASE_ANGLE = ((180 - FAN_ANGLE)/2); // degrees

// Names of icons for each button retreived from fontAwesome, we'll add a little extra just in case
// the NUM_CHILDREN is changed to a bigger value
let childButtonIcons = ['pencil', 'at', 'camera', 'bell', 'comment', 'bolt', 'ban', 'code'];


// Utility functions

function toRadians(degrees) {
	return degrees * 0.0174533;
}



export default class ButtonMenu extends Component {
	constructor(props) {
		super(props);


		this.state = {
			isOpen: false,
			M_X : 200,
			M_Y : 200,
			BASE_ANGLE : ((180 - (this.props.elements.length - 1) * SEPARATION_ANGLE)/2)
		};

	}

	updateDimensions = () => {
        //this.setState({M_X: $(window).width() - 190, M_Y: $(window).height() - 150});
        ////TODO percentage + middle
        this.setState({M_X: $(window).width()/2, M_Y: $(window).height() - 120});
	}

	componentDidMount() {
		window.addEventListener('click', this.closeMenu);
		this.updateDimensions()
		 window.addEventListener("resize", this.updateDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.closeMenu, false);
        window.removeEventListener("resize", this.updateDimensions);
	}

	mainButtonStyles() {
		return {
			// width: MAIN_BUTTON_DIAM,
			// height: MAIN_BUTTON_DIAM,
			top: this.state.M_Y - (MAIN_BUTTON_DIAM/2),
			left: this.state.M_X - (MAIN_BUTTON_DIAM/2)
		};
	}

	finalChildDeltaPositions(index) {
		const angle = this.state.BASE_ANGLE + (index* SEPARATION_ANGLE);
		return {
			deltaX: FLY_OUT_RADIUS * Math.cos(toRadians(angle)) - (CHILD_BUTTON_DIAM/2),
			deltaY: FLY_OUT_RADIUS * Math.sin(toRadians(angle)) + (CHILD_BUTTON_DIAM/2)
		};
	}


	initialChildButtonStylesInit() {
		return {
			width: CHILD_BUTTON_DIAM,
			height: CHILD_BUTTON_DIAM,
			top: this.state.M_Y - (CHILD_BUTTON_DIAM/2),
			left: this.state.M_X - (CHILD_BUTTON_DIAM/2),
			rotate: -180,
			scale: 0.5
		};
	}

	initialChildButtonStyles() {
		return {
			width: CHILD_BUTTON_DIAM,
			height: CHILD_BUTTON_DIAM,
			top: spring(this.state.M_Y - (CHILD_BUTTON_DIAM/2), SPRING_CONFIG),
			left: spring(this.state.M_X - (CHILD_BUTTON_DIAM/2), SPRING_CONFIG),
			rotate: spring(-180, SPRING_CONFIG),
			scale: spring(0.5, SPRING_CONFIG)
		};
	}

	finalChildButtonStylesInit(childIndex) {
		let {deltaX, deltaY} = this.finalChildDeltaPositions(childIndex);
		return {
			width: CHILD_BUTTON_DIAM,
			height: CHILD_BUTTON_DIAM,
			top: this.state.M_Y - deltaY,
			left: this.state.M_X + deltaX,
			rotate: 0,
			scale: 1
		};
	}

	finalChildButtonStyles(childIndex) {
		let {deltaX, deltaY} = this.finalChildDeltaPositions(childIndex);
		return {
			width: CHILD_BUTTON_DIAM,
			height: CHILD_BUTTON_DIAM,
			top: spring(this.state.M_Y - deltaY, SPRING_CONFIG),
			left: spring(this.state.M_X + deltaX, SPRING_CONFIG),
			rotate: spring(0, SPRING_CONFIG),
			scale: spring(1, SPRING_CONFIG)
		};
	}

	toggleMenuDrawing(e) {
		e.stopPropagation();
		let{isOpen} = this.state;
		this.setState({
			isOpen: !isOpen,
			type : 'drawing'
		});
	}

	toggleMenuWidget(e){
		e.stopPropagation();
		let{isOpen} = this.state;
		this.setState({
			isOpen: !isOpen,
			type : 'widget'
		});
	}

	closeMenu = () => {
		this.setState({ isOpen: false});
	};

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
		const {isOpen} = this.state;
		const targetButtonStylesInitObject = range(this.props.elements.length).map(i => {
			return isOpen ? this.finalChildButtonStylesInit(i) : this.initialChildButtonStylesInit();
		});

		const targetButtonStylesInit = Object.keys(targetButtonStylesInitObject).map(key => targetButtonStylesInitObject[key]);

		const targetButtonStyles = range(this.props.elements.length).map(i => {
			return isOpen ? this.finalChildButtonStyles(i) : this.initialChildButtonStyles();
		});
		const scaleMin = this.initialChildButtonStyles().scale.val;
		const scaleMax = this.finalChildButtonStyles(0).scale.val;
		//console.log('scaleMin', scaleMin, 'scaleMax', scaleMax);

		let calculateStylesForNextFrame = prevFrameStyles => {
			// prevFrameStyles = isOpen ? prevFrameStyles : prevFrameStyles.reverse();
			prevFrameStyles = isOpen ? prevFrameStyles : prevFrameStyles;

			let nextFrameTargetStyles =  prevFrameStyles.map((buttonStyleInPreviousFrame, i) => {
				//animation always starts from first button
				if (i === 0) {
					return targetButtonStyles[i];
				}

				const prevButtonScale = prevFrameStyles[i - 1].scale;
				// console.log('prevButtonScale',prevButtonScale);
				const shouldApplyTargetStyle = () => {
					if (isOpen) {
						return prevButtonScale >= scaleMin + OFFSET;
					} else {
						return prevButtonScale <= scaleMax - OFFSET;
					}
				};

				return shouldApplyTargetStyle() ? targetButtonStyles[i] : buttonStyleInPreviousFrame;
			});

			// return isOpen ? nextFrameTargetStyles : nextFrameTargetStyles.reverse();
			return isOpen ? nextFrameTargetStyles : nextFrameTargetStyles;
		};



		return (
			<StaggeredMotion defaultStyles={targetButtonStylesInit} styles={calculateStylesForNextFrame}>
				{interpolatedStyles =>
					<div>
						{interpolatedStyles.map(({height, left, rotate, scale, top, width}, index) =>
							<div data-for={ 'id' + index.toString() } data-tip data-offset={ TOOLTIP_DATA_OFFSET } key={ index }>
								{this.props.elements.length !== 0  ?
								<div className= { Styles.childButton } key={index} onClick={ ( event ) => this.addWidget( event, this.props.elements[index] ) }
									 style={ { left, height, top, transform: `rotate(${rotate}deg) scale(${scale})`, width } }>
									<i className={ classNames('icon' , `icon-${this.props.elements[index].icon}` ) } >
										<ReactTooltip id={'id' + index.toString() } place={ this.props.elements[index].tooltipPosition } type="light" effect="solid" >
											{ this.props.elements[index].text }
										</ReactTooltip>
									</i>
								</div> : null }
							</div>
						)}
					</div>
				}
			</StaggeredMotion>
		);
	}

	renderWidgetHalf(){
		return(
			<div className={ Styles.widgetHalf }
				data-for='widget' data-tip
				onClick={this.toggleMenuWidget.bind(this)}>
				<i className={ classNames( 'icon', 'icon-dashboard',`${Styles.iconButton}` ) }></i>
				<ReactTooltip id='widget' place={'top'} type="light" effect="solid">
					{'Widgets'}
				</ReactTooltip>
			</div>
		)
	}

	renderDrawingHalf(){
		return(
			<div className={ Styles.drawingHalf }
				 data-for='paint' data-tip data-multiline={false}
				 onClick={this.toggleMenuDrawing.bind(this)}>
				 <i className={ classNames( 'icon', 'icon-format_paint',`${Styles.iconButton}` ) }></i>
			   <ReactTooltip id={'paint'} place={'top'} type="light" effect="solid">
				   {'Paint'}
			   </ReactTooltip>
			</div>
		)
	}


	// <i className={ classNames( 'icon', `icon-add` ) }/>
	render() {
		const {isOpen} = this.state;
		const mainButtonRotation = isOpen ? {rotate: spring(0, {stiffness : 500, damping : 30})} : {rotate: spring(120, {stiffness : 500, damping : 28})};
		return (
			<div>
				{this.renderChildButtons()}
				<Motion style={mainButtonRotation}>
					{({rotate}) =>
					<div>
						<div className= { Styles.mainButton } style={ {...this.mainButtonStyles(), transform: `rotate(${rotate}deg)`} }>
							{this.renderDrawingHalf()}
							{this.renderWidgetHalf()}
						</div>
					</div>
					}
				</Motion>
			</div>
		);
	}
};
