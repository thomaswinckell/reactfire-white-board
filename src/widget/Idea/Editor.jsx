import React                from 'react';
import classNames           from 'classnames';

import AbstractWidgetEditor from '../abstract/Editor';

import Styles from './Editor.scss';


export default class IdeaWidgetEditor extends AbstractWidgetEditor {

    static defaultProps = {
        ideaList : {
            items : []
        }
    };

    constructor( props ) {
        super( props );
        this.requestChange = this.link( 'ideaList' ).requestChange;
    }

    linkNewTodo() {
        return {
            value           : this.state.newTodo,
            requestChange   : newTodo => this.setState( { newTodo } )
        };
    }

    addItem = () => {
        const value = this.state.newTodo;
        if ( value ) {
            let { items } = this.props.ideaList;
            const index = items.push( { value } );
            items[index -1].up =0;
            items[index -1].down =0;
            this.requestChange( { items } );
            this.setState( { newTodo : '' } );
        }
    }

    removeItem( item ) {
        let { items } = this.props.ideaList;
        items.splice( items.indexOf( item ), 1 );
        this.requestChange( { items } );
    }

    renderItem = ( item, key ) => {
        return (
            <li key={ key } className={ Styles.doneTitle }>
                { item.value }
                <button className="small" type="button" onClick={ () => this.removeItem( item ) }><i className="icon icon-delete"></i></button>
            </li>
        );
    }

    renderEditor() {
        const items = this.props.ideaList.items;

        return (
            <ul className={ Styles.root }>
                { items.length ? <div className={ Styles.todoTitle }>Ideas</div> : 'No Idea ... :\'(' }
                { items.map( this.renderItem ) }

                <div className={ Styles.form }>
                    <input type="text" placeholder="What to propose..." valueLink={ this.linkNewTodo() } onKeyPress={ e => e.charCode === 13 ? this.addItem() : null }/>
                    <button className="small" type="button" onClick={ this.addItem }><i className="icon icon-add"></i></button>
                </div>

            </ul>
        );
    }
}
