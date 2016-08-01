import React, { Component, PropTypes }  from 'react';
import classNames                       from 'classnames';
import ReactTooltip                     from 'react-tooltip';

import Guid                             from '../utils/Guid';

import Styles from './NavBar.scss';

export class NavBarElement {
    className   : string;
    action      : func;
    icon        : string;
    text        : string;

    constructor( text, icon, action = () => true, className = "", tooltipPosition = "right" ) {
        this.icon = icon;
        this.text = text;
        this.action = action;
        this.className = classNames( Styles[className] );
        this.tooltipPosition = tooltipPosition;
    }

    render( key ) {
        const id = Guid.generate();
        return (
            <li key={ key } className={ this.className } onClick={ this.action } data-for={ 'id' + id } data-tip>
                <i className={ classNames( 'icon', `icon-${this.icon}` ) }/>
                <ReactTooltip id={ 'id' + id } place={this.tooltipPosition} type="light" effect="solid">
                    { this.text }
                </ReactTooltip>
            </li>
        );
    }
}


export default class NavBar extends Component {

    static propTypes = {
        elements    : PropTypes.array.isRequired,
        position    : PropTypes.object
    };

    static defaultProps = {
        horizontal : false,
        position : {
            x : '1.5em',
            y : '1.5em'
        }
    };

    renderNavBarElement = ( element : NavBarElement, key : string ) => {
        return element.render( key );
    };

    render() {
        const className = classNames( Styles.root, this.props.className, {
            [ Styles.horizontal ] : this.props.horizontal,
            [ Styles.vertical ]   : !this.props.horizontal
        } );
        return (
            <div className={ className } style = {this.props.position}>
                <ul>
                    { this.props.elements.map( this.renderNavBarElement ) }
                </ul>
            </div>
        );
    }
}
