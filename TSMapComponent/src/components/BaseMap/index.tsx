import React, { useState, useContext, useEffect, useRef } from 'react';
import * as MapboxGl from 'mapbox-gl';
import { mapboxReactContext } from 'components/MapboxContext';
import { MAPBOX_CONFIG, BaseMapName } from 'components/Map1/constants';

export interface BaseMapProps {
}

export const BaseMapFC: React.FC<BaseMapProps> = (props => {
    const context = useContext(mapboxReactContext);
    const { map, mapStyle, updateStyle } = context;

    // State Variables
    const [styleUrl, setStyleUrl] = useState<string>(mapStyle);
    const [selectedMapName, setSelectedMapName] = useState<string>(BaseMapName.BASIC);

    // Ref Variables
    const { current: onStyleRef } = useRef({
        currentUrl: '',
        /**
         * Map style load event handler
         */
        load: (e: MapboxGl.MapMouseEvent) => {
            updateStyle(onStyleRef.currentUrl);
        },
    });

    useEffect(() => {
        if (map !== undefined) {
            let url = MAPBOX_CONFIG.STYLE;
            switch (selectedMapName) {
                case BaseMapName.BASIC:
                    url = MAPBOX_CONFIG.STYLE;
                    break;
                case BaseMapName.SATELLITE:
                    url = MAPBOX_CONFIG.SATELLITE_STYLE;
                    break;
                case BaseMapName.MONOCHROME:
                    url = MAPBOX_CONFIG.MONOCHROME_STYLE;
                    break;
            }
            setStyleUrl(url);
            map.setStyle(url);
        }
    }, [selectedMapName]);

    useEffect(() => {
        if (map !== undefined) {
            onStyleRef.currentUrl = styleUrl;
            map.off('style.load', onStyleRef.load);
            map.on('style.load', onStyleRef.load);
        }
    }, [styleUrl]);

    /**
     * onchange event handler of
     * radio input
     * @param name of selected map
     */
    function onChangeHandler(mapName: string) {
        setSelectedMapName(mapName);
    }

    // const BaseMapList = [BaseMapName.BASIC, BaseMapName.SATELLITE, BaseMapName.MONOCHROME];
    const BaseMapList = [BaseMapName.BASIC, BaseMapName.SATELLITE];

    return (
      <>
        {
            BaseMapList.map((mapName: string, index: number) => {
                return (
                    <li key={index}>
                        <input
                            type="radio"
                            id={mapName}
                            name={mapName}
                            className="layerlist-radio"
                            checked={mapName === selectedMapName}
                            onChange={(e) => onChangeHandler(mapName)}
                            />{mapName}
                    </li>
                );
            })
        }
      </>
    );
});


export default BaseMapFC;
