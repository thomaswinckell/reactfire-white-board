import React, { PropTypes }     from 'react';
import ReactDOM                 from 'react-dom';
import GMapsApi                 from 'google-maps-api';

import AuthStore                from '../../core/AuthStore';
import AbstractWidgetEditor     from '../abstract/Editor';

import Styles from './Editor.scss';


export default class GMapsWidgetEditor extends AbstractWidgetEditor {

    constructor( props ) {
        super( props );
        this.requestChange = this.link( 'gmaps' ).requestChange;
    }

    componentDidMount() {
        const { gmapsApiKey } = AuthStore.appConfig;
        GMapsApi( gmapsApiKey, ['places'] )().then( maps => {
            this.initMap( maps, this.props.gmaps || {lat: -33.8688, lng: 151.2195} );
        }, err => console.error( err )  )
    }

    initMap( maps, location ) {

        var map = new maps.Map( ReactDOM.findDOMNode( this.refs.map ), {
            center: location,
            zoom: this.props.gmaps.zoom,
            mapTypeId : this.props.gmaps.mapTypeId
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

        //Update the current zoom when plus or minus button are pressed
        map.addListener('zoom_changed', () => {
            this.requestChange( { zoom : map.getZoom() } );
        });

        //update the typeMap
        map.addListener('maptypeid_changed', () => {
            this.requestChange( { mapTypeId : map.getMapTypeId() } );
        })

        //update the position when dragging the position in edit mode
        map.addListener('dragend', () => {
            this.requestChange( { lat : map.getCenter().lat(), lng : map.getCenter().lng() , zoom : map.getZoom() } )
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

            this.requestChange( { lat : place.geometry.location.lat(), lng : place.geometry.location.lng() , zoom : map.getZoom() } );
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
