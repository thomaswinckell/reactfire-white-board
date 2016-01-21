import React                from 'react';

import AbstractWidgetView   from 'core/AbstractWidgetView';


export default class UndraggableWidgetView extends AbstractWidgetView {

    constructor( props ) {
        super( props );
        this.state = { canDrag : false };
    }

    getMenuElements() {
        const additionalMenuElements = [
            {
                className   : "widget-menu-move",
                action      : () => this.setState( { canDrag : !this.state.canDrag } ),
                text        : "Move",
                icon      : "arrows"
            }
        ];
        return super.getMenuElements().concat( additionalMenuElements );
    }

    renderUndraggableView( widget ) {
        return (
            <div className="undraggable-widget">
                { widget }
                { this.state.canDrag ? <div className="undraggable-widget-layer"></div> : null }
            </div>
        );
    }
}
