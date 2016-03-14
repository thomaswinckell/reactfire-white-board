import React                from 'react';

import AbstractWidgetView   from 'widget/abstract/View';

import Styles from './View.scss';


export default class UndraggableWidgetView extends AbstractWidgetView {

    constructor( props ) {
        super( props );
        this.state = { canDrag : false };
    }

    getMenuElements() {
        const additionalMenuElements = [
            {
                action      : () => this.setState( { canDrag : !this.state.canDrag } ),
                text        : 'Move',
                icon        : 'arrows'
            }
        ];
        return super.getMenuElements().concat( additionalMenuElements );
    }

    renderUndraggableView( widget ) {
        return (
            <div className={ Styles.root }>
                { widget }
                { this.state.canDrag ? <div className={ Styles.layer }></div> : null }
            </div>
        );
    }
}
