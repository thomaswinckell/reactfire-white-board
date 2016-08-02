import React, { PropTypes } from 'react';

import * as Actions         from '../../core/BoardActions'

import AbstractWidgetView   from '../abstract/View';
import Resizer              from '../../component/Resizer';

import translations         from '../../i18n/messages/messages';

import AuthStore             from '../../core/AuthStore';

/**
 * Manage PanelView
 * Display a grid where you can put your widgets to store them
 * Row height is fixed define as a props
 * column number is fix the width change according to total width.
 */
export default class PanelWidgetView extends AbstractWidgetView {

    static contextTypes = {
        intl : PropTypes.object
    };

    /**
     * @type {{heightRow: number, nbCol: number}}
     */
    static defaultProps = {
        sizeCell : {
            heightRow : 80,
            widthCol : 200
        },
        offsetMenu : 40
    };

    /**
     * save starting pos
     * @param event
     */
    onDragStart( event ) {
        this.x = this.props.position.x;
        this.y = this.props.position.y;
        super.onDragStart( event );
    }

    /**
     * Moves aswell all widgets stored into the panel
     * @param event
     */
    onDrag ( event ) {
        this.previous_x = this.x;
        this.previous_y = this.y;
        super.onDrag( event );
        if( this.props.widgets && (this.previous_x !== this.x || this.previous_y !== this.y )){
            Object.keys(this.props.widgets).forEach( widget => {
                Actions.updatePosition(widget, this.previous_x - this.x, this.previous_y - this.y)
            })
        }
    }

    getMenuElements() {
        return [
            {
                action      : this.props.actions.deleteWidget,
                text        : this.context.intl.formatMessage( translations.widgetElement.Menu.Delete ),
                icon        : "delete"
            }
        ];
    }

    onResizeStart( event ) {
        event.stopPropagation();
        this.props.valueLink({'isLockedBy': AuthStore.currentUser});
    }

    onResizeEnd( event ) {
        if( !this.props.isEditingByCurrentUser ) {
            this.props.valueLink({'isLockedBy': false});
        }
    }

    renderResizer() {
        return(
            <Resizer valueLink={super.link('sizeCell')}
                     onResizeStart={this.onResizeStart.bind( this ) } onResizeEnd={this.onResizeEnd.bind( this ) }
                     index={200000}/>
        )
    }

    renderGrid = () => {

        const { width, height } = this.props.size;
        const widthCol  = this.props.sizeCell.width;
        const heightRow = this.props.sizeCell.height;

        const style = {
            height      : `${heightRow}px`,
            border      : '1px solid rgba(59,59,59,0.25)',
            position    : 'absolute',
            width       : `${widthCol}px`
        };

        const nbCol = width /widthCol | 0;
        const nbRow = ( height - this.props.offsetMenu ) / heightRow | 0;


        return _.flatten( _.range( nbCol ).map( i => _.range( nbRow ).map( j => {
            const left = `${widthCol * i}px`;
            const top = `${heightRow * j + this.props.offsetMenu || this.props.offsetMenu}px`;
            return (
                <div key={i.toString() + j.toString()} style={ { left, top, ...style }  }>
                    {this.renderResizer()}
                </div>
            );
        } ) ) );
    };

    renderView() {
        return (
            <div>
                {this.renderGrid()}
            </div>
        );
    }
}
