import React                from 'react';
import classNames           from 'classnames';

import AbstractWidgetView   from '../abstract/View';
import AuthStore            from '../../core/AuthStore'


import Styles from './View.scss';


export default class IdeaWidgetView extends AbstractWidgetView {

    static defaultProps = {
        ideaList : {
            items : []
        }
    };

    constructor( props ) {
        super( props );
        this.requestChange = this.link( 'ideaList' ).requestChange;
    }

    /**
     * Put a vote into an element
     * @param item - the current item where the vote goes
     * @param vote - String either 'up' or 'down'
     */
    vote( item, vote ) {

        const currentUser = AuthStore.currentUser;

        const { items } = this.props.ideaList;
        const itemIndex = items.indexOf( item );

        if ( itemIndex > -1 ) {

            //create uid on the idea in case the user never voted on this idea
            if( !items[ itemIndex ][currentUser.uid] ){
                items[ itemIndex ][currentUser.uid] = {'up' : false , 'down' : false}
            }

            items[ itemIndex ][ currentUser.uid ][ vote ] = items[ itemIndex ][ currentUser.uid  ][ vote ]? false : true;
            items[ itemIndex ][ currentUser.uid ][ vote ] ? items[ itemIndex ][ vote ]++ : items[ itemIndex ][ vote ]--;

            //switch the vote
            if ( vote === 'up' && items[ itemIndex ][ currentUser.uid ].down ){
                items[ itemIndex ][ currentUser.uid ].down = false;
                items[ itemIndex ].down--;
            } else if ( vote === 'down' && items[ itemIndex ][ currentUser.uid ].up ){
                items[ itemIndex ][ currentUser.uid ].up = false;
                items[ itemIndex ].up--;
            }

            this.requestChange( { items } );
        }
    }

    renderItem = ( item, key ) => {
        const uid = AuthStore.currentUser.uid;
        return (
            <li key={ key }>
                { item.value }
                <button className="small" type="button" onClick={ () => this.vote( item, 'up'  ) }><i className={ classNames("icon","icon-thumb_up", { [Styles.up] : item[uid] && item[uid].up } ) }> {item.up} </i></button>
                <button className="small" type="button" onClick={ () => this.vote( item, 'down') }><i className={ classNames("icon","icon-thumb_down", { [Styles.down] : item[uid]  && item[uid].down } ) }> {item.down} </i></button>
            </li>
        );
    }

    renderView() {

        const ideas = this.props.ideaList.items;

        return (
            <ul className={ Styles.root }>
                { ideas.length ? <div className={ Styles.todoTitle }>Ideas</div> : 'No Idea ... :\'(' }
                { ideas.length ? ideas.map( this.renderItem ) : null }
            </ul>
        );
    }
}
