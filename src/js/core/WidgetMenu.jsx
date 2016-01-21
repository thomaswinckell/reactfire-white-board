import React, { Component, PropTypes }  from 'react';
import classNames                       from 'classnames';
import ReactTooltip                     from 'react-tooltip';

import Guid                             from 'utils/Guid';


export default class WidgetMenu extends Component {

    static propTypes = {
        menuElements  : PropTypes.array.isRequired,
        position      : PropTypes.object.isRequired,
        display       : PropTypes.bool.isRequired
    };

    static defaultProps = {
        menuElements    : [],
        position        : {}
    };

    constructor( props ) {
        super( props );
        this.state = {
            isMouseOver : false
        };
    }

    componentWillUnmount() {
        clearTimeout( this.mouseOutTimeout );
    }

    link( prop ) {
        return {
            value           : this.props[ prop ],
            requestChange   : value => this.props.valueLink( { [ prop ]: value } )
        };
    }

    render() {

        const height = 30;

        function renderMenuElement( e, key ) {
            const id = Guid.generate();
            return (
                <li key={ key } className={ e.className } onClick={ e.action } data-for={id} data-tip>
                    <i className={ classNames( 'icon', `icon-${e.icon}` ) }></i>
                    <ReactTooltip id={id} place="top" type="light" effect="solid">
                        { e.text }
                    </ReactTooltip>
                </li>
            );
        }

        const style = {
            height  : `${height}px`,
            top     : '5px'
        };

        return (
            <div className={ classNames( 'widget-menu', { active : this.props.display } ) } style={ style }>
                <ul className="widget-menu-list">
                    { this.props.menuElements.map( renderMenuElement ) }
                </ul>
                <hr/>
            </div>
        );
    }
}
