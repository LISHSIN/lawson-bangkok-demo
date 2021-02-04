import React from 'react';
import { Popup } from 'react-mapbox-gl';
import "./index.css";

import { usePopup } from './usePopup';
import LawsonStorePopupFC from './LawsonStorePopup';

export {
    usePopup,
    LawsonStorePopupFC
}

export interface CustomPopupProps {
    headerText?: string;
    coordinates: GeoJSON.Position;
    hide: (popup: JSX.Element | undefined) => void;
}

export const CustomPopupFC: React.FC<CustomPopupProps> = (props => {
    const { headerText, coordinates, hide } = props;
    return (
        <>
            <Popup coordinates={coordinates}>
                <div className="popup-header">
                    <div className="header-text">{headerText}</div>
                    <button className="mapboxgl-popup-close-button" onClick={(e) => hide(undefined)}>x</button>
                </div>
                <div className="popup-content">
                    { props.children }
                </div>
            </Popup>
        </>
    );
});

export default CustomPopupFC;
