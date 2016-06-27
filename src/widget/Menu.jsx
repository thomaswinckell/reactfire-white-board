import React, { Component, PropTypes }  from 'react';
import classNames                       from 'classnames';
import ReactTooltip                     from 'react-tooltip';

import Guid                             from '../utils/Guid';

import Styles   from './Menu.scss';


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

    renderMenuElement( e, key ) {
        const id = Guid.generate();
        return (
            <li key={ key } className={ e.className } onClick={ e.action } data-for={ 'id' + id } data-tip>
                <i className={ classNames( 'icon', `icon-${e.icon}` ) }></i>
                <ReactTooltip id={ 'id' + id } place="top" type="light" effect="solid">
                    { e.text }
                </ReactTooltip>
            </li>
        );
    }

    render() {

        const height = 30;

        const style = {
            height          : `${height}px`,
            top             : '5px',
            whiteSpace      : 'nowrap',
            overflow        : 'hidden',
            textOverflow    : 'ellipsis',
            textAlign       : 'center',
        };

        const className = classNames( Styles.root, {
            [ Styles.hidden ] : !this.props.display
        } );

        if( this.props.lock ){
            return(
                <div className={ className } style={ style }>
                    <ul className={ Styles.listLock }>
                        <li>
                            <i className={ classNames( 'icon', `icon-lock` ) }></i>
                        </li>
                        <li> This widget is locked by { this.props.lockName }</li>
                    </ul>
                    <hr/>
                </div>
            );
        }

        return (
            <div className={ className } style={ style }>
                <ul className={ Styles.list }>
                    { this.props.menuElements.map( this.renderMenuElement.bind( this ) ) }
                </ul>
                <hr/>
            </div>
        );
    }
}
