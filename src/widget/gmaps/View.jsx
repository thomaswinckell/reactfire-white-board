import React, { PropTypes }     from 'react';
import ReactDOM                 from 'react-dom';
import GMapsApi                 from 'google-maps-api';

import AuthStore                from '../../core/AuthStore';
import AbstractWidgetView       from '../abstract/View';

import Styles from './View.scss';


export default class GMapsWidgetView extends AbstractWidgetView {

    componentDidMount() {
        if ( this.props.gmaps ) {
            const { gmapsApiKey } = AuthStore.appConfig;
            GMapsApi( gmapsApiKey, ['places'] )().then( maps => {
                this.initMap( maps, this.props.gmaps );
            }, err => console.error( err )  );
        }
    }

    componentWillReceiveProps() {
        if ( this.props.gmaps ) {
            const { gmapsApiKey } = AuthStore.appConfig;
            GMapsApi( gmapsApiKey, ['places'] )().then( maps => {
                this.initMap( maps, this.props.gmaps );
            }, err => console.error( err )  );
        }
    }

    initMap( maps, location ) {
        var map = new maps.Map( ReactDOM.findDOMNode( this.refs.map ), {
            center: location,
            zoom: 13
        } );
    }

    renderView() {

        if ( !this.props.gmaps ) {
            return (
                <div>Please click on Edit</div>
            );
        }

        return (
            <div className={ Styles.root }>
                <div ref="map" className={ Styles.map } style={ { height : this.props.size.height - 65 } }></div>
            </div>
        );
    }
}
