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
        lng: 6.129583000000025,
        zoom : 13,
        mapTypeId : 'roadmap'
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
        height: 300,
        width: 400
    }
}
const PanelWidgetDefaultProps = {
    size: {
        height: 280,
        width: 400
    },
    sizeCell : {
        width : 200,
        height : 80,
    },
    offsetMenu : 40
}

const TwitterWidgetDefaultProps = {
    size: {
        height: 280,
        width: 400
    },
    widgetId : 'https://twitter.com/ThombsonCrema'
}

export default [
    { text:'Text',             icon: 'textsms',             type: 'TextWidget',     defaultProps: TextWidgetDefaultProps, tooltipPosition : 'right' },
    { text:'TodoList',         icon: 'list',                type: 'TodoListWidget', defaultProps: TodoListWidgetDefaultProps, tooltipPosition : 'right' },
    { text: 'Youtube',         icon: 'video_collection',    type: 'YoutubeWidget',  defaultProps: YoutubeWidgetDefaultProps },
    { text: 'GoogleMaps',      icon: 'place',               type: 'GMapsWidget',    defaultProps: GMapsWidgetDefaultProps },
    { text: 'Videomessage',    icon: 'videocam',            type: 'VideoWidget',    defaultProps: VideoWidgetDefaultProps },
    // { text: 'Jira',            icon: 'videocam',            type: 'JiraWidget',     defaultProps: JiraWidgetDefaultProps },
    { text: 'Idea',            icon: 'format_list_numbered',       type: 'IdeaWidget',     defaultProps: IdeaWidgetDefaultProps },
    { text: 'Panel',           icon: 'book',       type: 'PanelWidget',     defaultProps: PanelWidgetDefaultProps, tooltipPosition : 'left' },
    { text: 'Twitter',         icon: 'social-twitter',       type: 'TwitterWidget',     defaultProps: TwitterWidgetDefaultProps, tooltipPosition : 'left' }
];


