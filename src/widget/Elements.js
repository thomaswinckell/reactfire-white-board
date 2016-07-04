'use strict';

import * as BoardActions                from '../core/BoardActions';

// TODO : translations

const addTextWidget = ( event ) => {
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
};

const addYoutubeWidget = ( event ) => {
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
};

const addGMapsWidget = ( event ) => {
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
};

const addVideoWidget = ( event ) => {
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
};

const addTodoListWidget = ( event ) => {
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
};

const addJiraWidget = ( event ) => {
    BoardActions.addWidgetClone( 'JiraWidget', {
        size: {
            height: 300,
            width: 300
        },
        position : {
            x : event.pageX,
            y : event.pageY
        }
    } );
};

export const widgetsElements = [
    { text:'Text',             icon: 'textsms',             action: addTextWidget },
    { text:'Todo List',        icon: 'list',                action: addTodoListWidget },
    { text: 'Youtube',         icon: 'video_collection',    action: addYoutubeWidget },
    { text: 'Google Maps',     icon: 'place',               action: addGMapsWidget },
    { text: 'Video message',   icon: 'videocam',            action: addVideoWidget },
    { text: 'Jira',            icon: 'videocam',            action: addJiraWidget }
];
