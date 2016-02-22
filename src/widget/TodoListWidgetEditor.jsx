import React                from 'react';
import classNames           from 'classnames';

import AbstractWidgetEditor from 'core/AbstractWidgetEditor';

import Styles from './TodoListWidgetEditor.scss';


export default class TodoListWidgetEditor extends AbstractWidgetEditor {

    static defaultProps = {
        todoList : {
            items : []
        }
    };

    constructor( props ) {
        super( props );
        this.requestChange = this.link( 'todoList' ).requestChange;
    }

    linkNewTodo() {
        return {
            value           : this.state.newTodo,
            requestChange   : newTodo => this.setState( { newTodo } )
        };
    }

    addItem() {
        const value = this.state.newTodo;
        if ( value ) {
            let { items } = this.props.todoList;
            items.push( { value } );
            this.requestChange( { items } );
            this.setState( { newTodo : '' } );
        }
    }

    doneItem( item, undone ) {
        const { items } = this.props.todoList;
        const itemIndex = items.indexOf( item );

        if ( itemIndex > -1 ) {
            items[ itemIndex ].done = !undone;
            this.requestChange( { items } );
        }
    }

    removeItem( item ) {
        let { items } = this.props.todoList;
        items.splice( items.indexOf( item ), 1 );
        this.requestChange( { items } );
    }

    renderItem( item, key ) {
        return (
            <li key={ key } className={ classNames( { [ Styles.doneTitle ] : item.done } ) }>
                { item.value }
                { item.done ? <button className="small" type="button" onClick={ () => this.removeItem( item ) }><i className="icon icon-delete"></i></button> : null }
                {
                    item.done ?
                    <button className="small" type="button" onClick={ () => this.doneItem( item, true ) }><i className="icon icon-clear"></i></button>
                        :
                    <button className="small" type="button" onClick={ () => this.doneItem( item ) }><i className="icon icon-check"></i></button>
                }
            </li>
        );
    }

    renderEditor() {
        const items = this.props.todoList.items;
        const todos = items.filter( t => !t.done );
        const dones = items.filter( t => t.done );

        return (
            <ul className={ Styles.wrapper }>
                { todos.length ? <div className={ Styles.todoTitle }>TODO</div> : "Nothing to do :-)" }
                { todos.map( ::this.renderItem ) }

                <div className={ Styles.form }>
                    <input type="text" placeholder="What to do..." valueLink={ ::this.linkNewTodo() } onKeyPress={ e => e.charCode === 13 ? this.addItem() : null }/>
                    <button className="small" type="button" onClick={ ::this.addItem }><i className="icon icon-add"></i></button>
                </div>

                { dones.length ? <div className={ Styles.doneTitle }>DONE :</div> : null }
                { dones.map( ::this.renderItem ) }
            </ul>
        );
    }
}
