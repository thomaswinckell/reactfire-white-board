import React                from 'react';
import { Timeline } from 'react-twitter-widgets'
import AbstractWidgetView   from '../abstract/View';

import Styles from './View.scss';


//desabled type checker cause we send an object and not a String
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
        this.state.data = {
            sourceType : "url",
            url : this.props.widgetId.trim()
        };
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
