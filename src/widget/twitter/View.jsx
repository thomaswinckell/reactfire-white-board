import React                from 'react';
import { Timeline } from 'react-twitter-widgets'
import AbstractWidgetView   from '../abstract/View';

import Styles from './View.scss';


//disabled type checker cause we send an object and not a String
Timeline.propTypes = null;

export default class TwitterWidgetView extends AbstractWidgetView {

    static defaultProps = {
        widgetId : {
            sourceType: "url",
            url: 'https://twitter.com/ThombsonCrema'
        }
    }

    constructor( props ){
        super( props );
        this.checkForIdInit( this.props.widgetId )
    }

    checkForIdInit( widgetId ){
        if( widgetId.includes('http') ){
            this.state.data = {
                sourceType : "url",
                url : widgetId.trim()
            }
        } else {
            this.state.data = widgetId.trim();
        }
    }

    checkForId( widgetId ){
        if( widgetId.includes('http') ){
            this.setState({data : {
                sourceType : "url",
                url : widgetId.trim()
            }});
        } else {
            this.setState({data : widgetId.trim() })
        }
    }

    componentWillReceiveProps( nextProps ){
        if( this.props.widgetId !== nextProps.widgetId ){
            this.checkForId( nextProps.widgetId )
        }
    }

    //we put a fix height to have a scroll into the widget.
    renderView() {
        return (
            <div className={ Styles.root }>
                <Timeline
                    widgetId={ this.state.data }
                    options={ { height : this.props.size.height - 35} }
                    onLoad={() => console.log('Timeline is loaded!')}
                />
            </div>
        );
    }
}
