import $                                	from 'jquery';
import React, { Component, PropTypes }      from 'react';

import {Motion, StaggeredMotion, spring}    from 'react-motion';
import range                                from 'lodash.range';

import classNames                       	from 'classnames';
import ReactTooltip                     	from 'react-tooltip';
import Guid                             	from '../utils/Guid';

import Styles from './ButtonMenu.scss';
// Components

//Constants

// Diameter of the main button in pixels
const MAIN_BUTTON_DIAM = 90;
const CHILD_BUTTON_DIAM = 48;
// The number of child buttons that fly out from the main button
const NUM_CHILDREN = 6;
// Hard code the position values of the mainButton
//let M_X = $(window).width() - 180;
//let M_Y = $(window).height()  - 150;

//should be between 0 and 0.5 (its maximum value is difference between scale in finalChildButtonStyles a
// nd initialChildButtonStyles)
const OFFSET = 0.4;

const SPRING_CONFIG = [400, 28];

// How far away from the main button does the child buttons go
const FLY_OUT_RADIUS = 130,
	SEPARATION_ANGLE = 40, //degrees
	FAN_ANGLE = (NUM_CHILDREN - 1) * SEPARATION_ANGLE, //degrees
	BASE_ANGLE = ((180 - FAN_ANGLE)/2); // degrees

// Names of icons for each button retreived from fontAwesome, we'll add a little extra just in case
// the NUM_CHILDREN is changed to a bigger value
let childButtonIcons = ['pencil', 'at', 'camera', 'bell', 'comment', 'bolt', 'ban', 'code'];


// Utility functions

function toRadians(degrees) {
	return degrees * 0.0174533;
}

function finalChildDeltaPositions(index) {
	let angle = BASE_ANGLE + (index* SEPARATION_ANGLE);
	return {
		deltaX: FLY_OUT_RADIUS * Math.cos(toRadians(angle)) - (CHILD_BUTTON_DIAM/2),
		deltaY: FLY_OUT_RADIUS * Math.sin(toRadians(angle)) + (CHILD_BUTTON_DIAM/2)
	};
}


export default class ButtonMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
			childButtons: [],
			M_X : 200,
			M_Y : 200
		};
		//M_X = this.props.position.x;
		//M_Y = this.props.position.y;
		// Bind this to the functions
		//this.toggleMenu = this.toggleMenu.bind(this);
		//this.closeMenu = this.closeMenu.bind(this);

	}

	updateDimensions() {
        //this.setState({M_X: $(window).width() - 190, M_Y: $(window).height() - 150});
        this.setState({M_X: $(window).width() - 290, M_Y: $(window).height() - 150});
	}

	componentDidMount() {
		window.addEventListener('click', this.closeMenu.bind(this));
		let childButtons = [];
		//this.setState({childButtons: childButtons.slice(0)});
		this.setState({childButtons: this.props.elements});
		this.updateDimensions()
		 window.addEventListener("resize", this.updateDimensions.bind(this));
	}

	mainButtonStyles() {
		return {
			width: MAIN_BUTTON_DIAM,
			height: MAIN_BUTTON_DIAM,
			top: this.state.M_Y - (MAIN_BUTTON_DIAM/2),
			left: this.state.M_X - (MAIN_BUTTON_DIAM/2)
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

	finalChildButtonStyles(childIndex) {
		let {deltaX, deltaY} = finalChildDeltaPositions(childIndex);
		return {
			width: CHILD_BUTTON_DIAM,
			height: CHILD_BUTTON_DIAM,
			top: spring(this.state.M_Y - deltaY, SPRING_CONFIG),
			left: spring(this.state.M_X + deltaX, SPRING_CONFIG),
			rotate: spring(0, SPRING_CONFIG),
			scale: spring(1, SPRING_CONFIG)
		};
	}

	toggleMenu(e) {
		e.stopPropagation();
		let{isOpen} = this.state;
		this.setState({
			isOpen: !isOpen
		});
	}

	closeMenu() {
		this.setState({ isOpen: false});
	}

	renderChildButtons() {
		const {isOpen} = this.state;

		const targetButtonStyles = range(NUM_CHILDREN).map(i => {
			return isOpen ? this.finalChildButtonStyles(i) : this.initialChildButtonStyles();
		});

		const scaleMin = this.initialChildButtonStyles().scale.val;
		const scaleMax = this.finalChildButtonStyles(0).scale.val;

		let calculateStylesForNextFrame = prevFrameStyles => {
			prevFrameStyles = isOpen ? prevFrameStyles : prevFrameStyles.reverse();

			let nextFrameTargetStyles =  prevFrameStyles.map((buttonStyleInPreviousFrame, i) => {
				//animation always starts from first button
				if (i === 0) {
					return targetButtonStyles[i];
				}

				const prevButtonScale = prevFrameStyles[i - 1].scale;
				const shouldApplyTargetStyle = () => {
					if (isOpen) {
						return prevButtonScale >= scaleMin + OFFSET;
					} else {
						return prevButtonScale <= scaleMax - OFFSET;
					}
				};

				return shouldApplyTargetStyle() ? targetButtonStyles[i] : buttonStyleInPreviousFrame;
			});

			return isOpen ? nextFrameTargetStyles : nextFrameTargetStyles.reverse();
		};

		return (
			<StaggeredMotion
				defaultStyles={targetButtonStyles}
				styles={calculateStylesForNextFrame}>
				{interpolatedStyles =>
					<div>
						{interpolatedStyles.map(({height, left, rotate, scale, top, width}, index) =>
							<div data-for={index.toString()} data-tip data-offset= "{ 'top' : 60, 'left' : 130}" key={index}>
								{this.state.childButtons.length !== 0  ?
								<div className= { Styles.childButton }
									 key={index}
									 onClick={ this.state.childButtons[index].action }
									 style={{
										left,
										height,
										top,
										transform: `rotate(${rotate}deg) scale(${scale})`,
										width
									}}>
									<i className={ classNames('icon' , `icon-${this.state.childButtons[index].icon}` ) } >
										<ReactTooltip id={index.toString()} place={this.state.childButtons[index].tooltipPosition} type="light" effect="solid" >
											{ this.state.childButtons[index].text }
										</ReactTooltip>
									</i>
								</div>
								: null }
							</div>
						)}
					</div>
				}
			</StaggeredMotion>
		);
	}

	render() {
		let {isOpen} = this.state;
		let mainButtonRotation = isOpen ? {rotate: spring(0, [500, 30])} : {rotate: spring(-135, [500, 30])};
		return (
			<div>
				{this.renderChildButtons()}
				<Motion style={mainButtonRotation}>
					{({rotate}) =>
						<div
							className= { Styles.mainButton }
							style={{...this.mainButtonStyles(), transform: `rotate(${rotate}deg)`}}
							onClick={this.toggleMenu.bind(this)}>
							<i className={ classNames( 'icon', `icon-add` ) }/>
						</div>
					}
				</Motion>
			</div>
		);
	}
};
