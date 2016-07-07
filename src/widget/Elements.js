'use strict';

// TODO : translations


const TextWidgetDefaultProps = {
    size: {
        height: 200,
        width: 300
    },
    value : 'A simple text box'
};

const YoutubeWidgetDefaultProps = {
    size: {
        height: 300,
        width: 400
    },
    youtube: {
        id : '5HZdyUUhzXU'
    }
};

const GMapsWidgetDefaultProps = {
    size: {
        height: 300,
        width: 400
    },
    gmaps: {
        lat: 49.815273,
        lng: 6.129583000000025
    }
};

const VideoWidgetDefaultProps = {
    size: {
        height: 300,
        width: 400
    }
};

const TodoListWidgetDefaultProps = {
    size: {
        height: 300,
        width: 300
    },
    todoList : {
        items : []
    }
};

const JiraWidgetDefaultProps = {
    size: {
        height: 300,
        width: 300
    }
};

const IdeaWidgetDefaultProps = {
    size: {
        height: 500,
        width: 400
    }
}

export default [
    { text:'Text',             icon: 'textsms',             type: 'TextWidget',     defaultProps: TextWidgetDefaultProps },
    { text:'Todo List',        icon: 'list',                type: 'TodoListWidget', defaultProps: TodoListWidgetDefaultProps },
    { text: 'Youtube',         icon: 'video_collection',    type: 'YoutubeWidget',  defaultProps: YoutubeWidgetDefaultProps },
    { text: 'Google Maps',     icon: 'place',               type: 'GMapsWidget',    defaultProps: GMapsWidgetDefaultProps },
    { text: 'Video message',   icon: 'videocam',            type: 'VideoWidget',    defaultProps: VideoWidgetDefaultProps },
    //{ text: 'Jira',            icon: 'videocam',            type: 'JiraWidget',     defaultProps: JiraWidgetDefaultProps },
    { text: 'Idea',            icon: 'format_list_numbered',       type: 'IdeaWidget',     defaultProps: IdeaWidgetDefaultProps }
];


