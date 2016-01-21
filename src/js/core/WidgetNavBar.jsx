import $                                from 'jquery';
import React, { Component, PropTypes }  from 'react';

import NavBar, { NavBarElement }        from 'component/NavBar';


export default class WidgetNavBar extends Component {

    static contextTypes = {
        board   : PropTypes.object
    }

    static propTypes = {
        position    : PropTypes.object
    }

    static defaultProps = {
        position : {
            x : '1.5em',
            y : '7.5em'
        }
    }

    addTextWidget( event ) {
        this.context.board.addWidget( 'TextWidget', {
            size: {
                height: 200,
                width: 300
            },
            position : {
                x : event.pageX,
                y : event.pageY
            },
            value : 'A simple text box'
        } );
    }

    addYoutubeWidget( event ) {
        this.context.board.addWidget( 'YoutubeWidget', {
            size: {
                height: 300,
                width: 400
            },
            position : {
                x : event.pageX,
                y : event.pageY
            },
            youtube: {
                id : '5HZdyUUhzXU'
            }
        } );
    }

    addGMapsWidget( event ) {
        this.context.board.addWidget( 'GMapsWidget', {
            size: {
                height: 300,
                width: 400
            },
            position : {
                x : event.pageX,
                y : event.pageY
            },
            gmaps: {
                lat: 49.815273,
                lng: 6.129583000000025
            }
        } );
    }

    addVideoWidget( event ) {
        this.context.board.addWidget( 'VideoWidget', {
            size: {
                height: 300,
                width: 400
            },
            position : {
                x : event.pageX,
                y : event.pageY
            }
        } );
    }

    addTodoListWidget( event ) {
        this.context.board.addWidget( 'TodoListWidget', {
            size: {
                height: 300,
                width: 300
            },
            position : {
                x : event.pageX,
                y : event.pageY
            },
            todoList : {
                items : []
            }
        } );
    }

    render() {

        const elements = [
            new NavBarElement( 'Text',              'textsms',            ::this.addTextWidget ),
            new NavBarElement( 'Todo List',         'list',               ::this.addTodoListWidget ),
            new NavBarElement( 'Youtube',           'video_collection',   ::this.addYoutubeWidget ),
            new NavBarElement( 'Google Maps',       'place',              ::this.addGMapsWidget ),
            new NavBarElement( 'Video message',     'videocam',           ::this.addVideoWidget ),
        ];

        return (
            <NavBar elements={ elements } position={ this.props.position } className="horizontal" />
        );
    }
}
