/*
 COPYRIGHT (C) 2019, HITACHI SOLUTIONS, LTD. ALL RIGHTS RESERVED.
 Hitachi Solutions, Ltd. Confidential
 */
import React, { useState, useEffect, useContext } from 'react';
import * as MapboxGl from 'mapbox-gl';


export interface MapboxContextProps {
}
export const MapboxContext: React.FC<MapboxContextProps> = (props) => {
    const context = useContext(mapboxReactContext);
    const Provider = mapboxReactContext.Provider;

    // State Variables
    const [map, setMap] = useState<MapboxGl.Map | undefined>(undefined);
    const [customPopup, setCustomPopup] = useState<JSX.Element | undefined>(undefined);
    const [mapStyle, setMapStyle] = useState<string>('');
    const [mapDraw, setMapDraw] = useState(undefined) as any;

    /**
     * Update the map object
     * @param Map object
     */
    function update(map: MapboxGl.Map) {
        setMap(map);
    }

    /**
     * Update the map style url
     * @param style url
     */
    function updateStyle(url: string) {
        setMapStyle(url);
    }

    /**
     * Update the map draw object
     * @param draw object
     */
    function updateDraw(draw: any) {
        setMapDraw(draw);
    }

    /**
     * Update the custom popup element
     * @param popup element
     */
    function updateCustomPopup(popup: JSX.Element | undefined) {
        setCustomPopup(popup);
    }

    return (
        <Provider value={{
            map: map,
            update: update,
            mapDraw: mapDraw,
            mapStyle: mapStyle,
            updateDraw: updateDraw,
            updateStyle: updateStyle,
            customPopup: customPopup,
            updateCustomPopup: updateCustomPopup
        }}>
            <MapboxContextInitializer>{props.children}</MapboxContextInitializer>
        </Provider>
    );
}

interface MapboxContextInitializerProps {
}
const MapboxContextInitializer: React.FC<MapboxContextInitializerProps> = (props) => {
    const context = useContext(mapboxReactContext);
    useEffect(() => {
        return () => {
        }
    }, [context]);
    return (
        <>{props.children}</>
    );
}

export interface ContextType {
    map: MapboxGl.Map | undefined;
    mapDraw: any;
    mapStyle: string;
    updateDraw: (draw: any) => void;
    updateStyle: (url: string) => void;
    update: (map: MapboxGl.Map) => void;
    customPopup: JSX.Element | undefined;
    updateCustomPopup: (popup: JSX.Element | undefined) => void;
}

/**
 * Define Initial values for mapbox context
 * @return ContextType object
 */
const initialContext = () => {
    return {
        map: undefined,
        mapDraw: undefined,
        mapStyle: '',
        update: (map: MapboxGl.Map) => {},
        customPopup: undefined,
        updateCustomPopup: (popup: JSX.Element | undefined) => {},
        updateDraw: (draw: any) => {},
        updateStyle: (url: string) => {},
    };
};


export const globalContextValue: ContextType = initialContext();
export const mapboxReactContext = React.createContext<ContextType>(globalContextValue);

export default MapboxContext;
