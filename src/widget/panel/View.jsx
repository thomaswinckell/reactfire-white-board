import React                from 'react';

import * as Actions         from '../../core/BoardActions'

import AbstractWidgetView   from '../abstract/View';

/**
 * Manage PanelView
 * Display a grid where you can put your widgets to store them
 * Row height is fixed define as a props
 * column number is fix the width change according to total width.
 */
export default class PanelWidgetView extends AbstractWidgetView {

    /**
     * @type {{heightRow: number, nbCol: number}}
     */
    static defaultProps = {
        heightRow : 100,
        nbCol : 2,
        offsetMenu : 40
    }

    constructor( props ){
        super(props);
    }

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

    renderGrid = () => {

        const { width, height } = this.props.size;
        const { nbCol, heightRow } = this.props;

        const style = {
            height      : `${heightRow}px`,
            border      : '1px solid rgba(59,59,59,0.25)',
            position    : 'absolute',
            width       : `${width/nbCol-1}px`
        };

        var ret = [];
        const leftIncrement = width/nbCol;
        const nbRow = (height-this.props.offsetMenu)/heightRow |0;

        for(var i = 0; i<nbCol; i++){
            for(var j = 0; j<nbRow; j++){
               ret.push(<div key={i.toString() + j.toString()} style={ { left : `${leftIncrement*i}px`, top: `${heightRow*j+this.props.offsetMenu || this.props.offsetMenu}px`, ...style }  }></div>)
            }
        }
        return ret;
    };

    renderView() {
        return (
            <div>
                {this.renderGrid()}
            </div>
        );
    }
}
