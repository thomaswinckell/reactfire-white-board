import React                from 'react';
import classNames           from 'classnames';

import AbstractWidgetView   from 'core/AbstractWidgetView';


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
            <li key={ key } className={ classNames( { 'done' : item.done } ) }>
                { item.value }
                {
                    item.done ?
                    <button className="small" type="button" onClick={ () => this.doneItem( item, true ) }><i className="icon icon-clear"></i></button>
                    :
                    <button  className="small" type="button" onClick={ () => this.doneItem( item ) }><i className="icon icon-check"></i></button>
                }
            </li>
        );
    }

    renderView() {

        const todos = this.props.todoList.items.filter( t => !t.done );
        const dones = this.props.todoList.items.filter( t => t.done );

        return (
            <ul className="todolist-widget-view">
                { todos.length ? <div className="todo-title">TODO</div> : 'Nothing to do :-)' }
                { todos.length ? todos.map( ::this.renderItem ) : null }

                { dones.length ? <div className="done-title">DONE</div> : null }
                { dones.length ? dones.map( ::this.renderItem ) : null }
            </ul>
        );
    }
}
