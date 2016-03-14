import $                                from 'jquery';
import _                                from 'lodash';
import React, { Component, PropTypes }  from 'react';
import WidgetWrapperDisplay             from './WrapperDisplay';


export default class WidgetClone extends Component {

    static propTypes = {
        widgetType  : PropTypes.string,
        widgetProps : PropTypes.object
    };

    constructor( props ) {
        super( props );
        this.state = {
            position : {
                x : props.widgetProps.position ? props.widgetProps.position.x : 0,
                y : props.widgetProps.position ? props.widgetProps.position.y : 0
            }
        };
    }

    componentWillMount() {
        document.addEventListener( 'mousemove', this.onMove );
    }

    componentWillUnmount() {
        document.removeEventListener( 'mousemove', this.onMove );
    }

    onMove = ( event ) => {
        this.setState( { position : { x : event.pageX, y : event.pageY } } )
    };

    render() {
        const index = 2147483645;
        const props = _.merge( {}, this.props.widgetProps, { index, position : this.state.position, type : this.props.widgetType, displayOnly : true } );
        return (
            <WidgetWrapperDisplay { ...props } />
        );
    }
}
