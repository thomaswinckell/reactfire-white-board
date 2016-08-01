import React                from 'react';
import classNames           from 'classnames';

import AbstractWidgetView   from '../abstract/View';

import Styles from './View.scss';


export default class TodoListWidgetView extends AbstractWidgetView {

    static defaultProps = {
        todoList : {
            items : []
        }
    };

    constructor( props ) {
        super( props );
        this.requestChange = this.link( 'todoList' ).requestChange;
    }

    doneItem( item, undone ) {
        const { items } = this.props.todoList;
        const itemIndex = items.indexOf( item );

        if ( itemIndex > -1 ) {
            items[ itemIndex ].done = !undone;
            this.requestChange( { items } );
        }
    }

    renderItem( item, key ) {
        return (
            <li key={ key } className={ classNames( { [ Styles.done ] : item.done } ) }>
                { item.value }
                {
                    item.done ?
                    <button className="small" type="button" onClick={ () => this.doneItem( item, true ) }><i className="icon icon-clear"/></button>
                    :
                    <button  className="small" type="button" onClick={ () => this.doneItem( item ) }><i className="icon icon-check"/></button>
                }
            </li>
        );
    }

    renderView() {

        const todos = this.props.todoList.items.filter( t => !t.done );
        const dones = this.props.todoList.items.filter( t => t.done );

        return (
            <ul className={ Styles.root }>
                { todos.length ? <div className={ Styles.todoTitle }>TODO</div> : 'Nothing to do :-)' }
                { todos.length ? todos.map( this.renderItem.bind( this ) ) : null }

                { dones.length ? <div className={ Styles.doneTitle }>DONE</div> : null }
                { dones.length ? dones.map( this.renderItem.bind( this ) ) : null }
            </ul>
        );
    }
}
