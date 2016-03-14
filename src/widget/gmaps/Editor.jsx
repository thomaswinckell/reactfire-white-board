import React, { PropTypes }     from 'react';
import ReactDOM                 from 'react-dom';
import GMapsApi                 from 'google-maps-api';

import { gmapsApiKey }          from 'config/AppConfig';
import AbstractWidgetEditor     from 'widget/abstract/Editor';

import Styles from './Editor.scss';


export default class GMapsWidgetEditor extends AbstractWidgetEditor {

    constructor( props ) {
        super( props );
        this.requestChange = this.link( 'gmaps' ).requestChange;
    }

    componentDidMount() {
        GMapsApi( gmapsApiKey, ['places'] )().then( maps => {
            this.initMap( maps, this.props.gmaps || {lat: -33.8688, lng: 151.2195} );
        }, err => console.error( err )  )
    }

    initMap( maps, location ) {

        var map = new maps.Map( ReactDOM.findDOMNode( this.refs.map ), {
            center: location,
            zoom: 13
        } );

        var input = ReactDOM.findDOMNode( this.refs.pacInput );
        map.controls[maps.ControlPosition.TOP_LEFT].push(input);

        var autocomplete = new maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new maps.InfoWindow();
        var marker = new maps.Marker({
            map: map,
            anchorPoint: new maps.Point(0, -29)
        });

        autocomplete.addListener('place_changed', () => {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);  // Why 17? Because it looks good.
            }
            marker.setIcon(/** @type {maps.Icon} */({
                url: place.icon,
                size: new maps.Size(71, 71),
                origin: new maps.Point(0, 0),
                anchor: new maps.Point(17, 34),
                scaledSize: new maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);

            this.requestChange( { lat : place.geometry.location.G, lng : place.geometry.location.K } );
        } );
    }

    renderEditor() {
        return (
            <div className={ Styles.root }>
                <input ref="pacInput" className={ Styles.input } type="text" placeholder="Enter a location" />
                <div ref="map" className={ Styles.map } style={ { height : this.props.size.height - 65 } }></div>
            </div>
        );
    }
}
