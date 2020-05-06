import React, { useState } from 'react';
import { GoogleMap, Marker, withScriptjs, withGoogleMap, GoogleMapProps } from 'react-google-maps';
// import SearchBox from 'react-google-maps/lib/components/places/SearchBox';
import { IPlaceWithId, ICoordinates } from 'Interfaces/Place';
import './style';
import { usePosition } from 'use-position';

interface IProps {
    markers?: IPlaceWithId[],
    initialZoom?: number;
    initialPosition?: {
        latitude: number;
        longitude: number;
    };
    onMapClick?: (coordinates: ICoordinates) => void;
    onPlaceClick?: (place: IPlaceWithId) => void;
    isCurrentPositionHidden?: boolean
}

export default (props: IProps) => (
    <Map
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA5XArugOE_gbteyws5tHht5yGzH-TzT_M&libraries=places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div data-component="Map" />}
        mapElement={<div className="map-container" />}
        {...props}
    />
);

const Map = withScriptjs(withGoogleMap((props: GoogleMapProps & IProps) => {
    const currentLocation = usePosition(true);
    const [selectedPoint, setSelectedPoint] = useState<ICoordinates | null>(null);

    const config = {
        defaultZoom: 15
    };

    const handleMapClick = (e: any) => {
        if (props.onMapClick) {
            const coordinatesObject = {
                longitude: e.latLng.lng(),
                latitude: e.latLng.lat()
            };

            setSelectedPoint(coordinatesObject);

            props.onMapClick(coordinatesObject);
        }
    };

    const handlePlaceClick = (place: IPlaceWithId) => {
        if (props.onPlaceClick) {
            props.onPlaceClick(place);
        }
    };

    return currentLocation.latitude && currentLocation.longitude ? (
        <GoogleMap
            defaultZoom={props.initialZoom || config.defaultZoom}
            defaultCenter={{
                lat: props.initialPosition ? props.initialPosition.latitude : currentLocation.latitude,
                lng: props.initialPosition ? props.initialPosition.longitude : currentLocation.longitude
            }}
            defaultOptions={{
                fullscreenControl: false
            }}
            onClick={handleMapClick}
        >
            {!props.isCurrentPositionHidden && (
                <Marker position={{ lat: currentLocation.latitude, lng: currentLocation.longitude }} />
            )}

            {selectedPoint && (
                <Marker position={{ lat: selectedPoint.latitude, lng: selectedPoint.longitude }} />
            )}

            {props.markers && props.markers.length > 0 && props.markers.map((marker) => (
                <Marker key={marker.id} position={{ lat: marker.coordinates.latitude, lng: marker.coordinates.longitude }} onClick={() => handlePlaceClick(marker)} />
            ))}
        </GoogleMap>
    ) : null;
}));
