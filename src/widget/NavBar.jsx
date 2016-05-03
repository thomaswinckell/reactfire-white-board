import $                                from 'jquery';
import React, { Component, PropTypes }  from 'react';

import NavBar, { NavBarElement }        from '../component/NavBar';

import * as BoardActions                from '../core/BoardActions';


export default class WidgetNavBar extends Component {

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
        BoardActions.addWidgetClone( 'TextWidget', {
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
        BoardActions.addWidgetClone( 'YoutubeWidget', {
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
        BoardActions.addWidgetClone( 'GMapsWidget', {
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
        BoardActions.addWidgetClone( 'VideoWidget', {
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
        BoardActions.addWidgetClone( 'TodoListWidget', {
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

    addJiraWidget( event ){
        BoardActions.addWidgetClone( 'JiraWidget', {
            size: {
                height: 300,
                width: 300
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

    render() {

        const elements = [
            new NavBarElement( 'Text',              'textsms',            this.addTextWidget.bind( this ) ),
            new NavBarElement( 'Todo List',         'list',               this.addTodoListWidget.bind( this ) ),
            new NavBarElement( 'Youtube',           'video_collection',   this.addYoutubeWidget.bind( this ) ),
            new NavBarElement( 'Google Maps',       'place',              this.addGMapsWidget.bind( this ) ),
            new NavBarElement( 'Video message',     'videocam',           this.addVideoWidget.bind( this ) ),
            new NavBarElement( 'Jira',              'videocam',           this.addJiraWidget.bind( this ) ),
        ];

        return (
            <NavBar elements={ elements } position={ this.props.position } horizontal={ true } />
        );
    }
}
