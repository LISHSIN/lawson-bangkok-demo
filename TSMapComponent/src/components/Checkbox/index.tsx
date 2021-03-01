import React, { useState, useContext, useEffect } from 'react';
import * as MapboxGl from 'mapbox-gl';
import { mapboxReactContext } from 'components/MapboxContext';
import { layerReactContext, LayerType } from 'components/LayerContext';
import { LayerId } from 'components/Map1/constants';
import { showHideTradeAreaLayer } from 'components/LayerList/constants';

export interface CheckboxProps {
    checked: boolean;
    layerId: LayerType;
    layerName: string;
}

export const CheckboxFC: React.FC<CheckboxProps> = (props => {
    const context = useContext(mapboxReactContext);
    const layerContext = useContext(layerReactContext);
    const { map, mapStyle } = context;
    const { layerObj, visibleLayers, updateVisibleLayers } = layerContext;

    // Props Variables
    const { checked, layerId, layerName } = props;

    // State Variables
    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
      if (map !== undefined) {
        switch (layerId) {
          case LayerId.TRADE_AREA_LAYER:
            showHideTradeAreaLayer(map, isChecked);
            break;
          default:
            showHideLayer(map);
            break;
        }
        layerObj[layerId].isEnable = isChecked;
        addOrRemoveVisibleLayers();
      }
    }, [isChecked, map, mapStyle]);

    /**
     * Show and hide the layer based on
     * the checkbox is checked or not
     * @param Map object
     */
    function showHideLayer(map: MapboxGl.Map) {
      let mapLayer = map.getLayer(layerId);
      if (mapLayer !== undefined) {
        map.setLayoutProperty(layerId, "visibility", (isChecked ? "visible" : "none"));
      }
    }

    /**
     * Update visibleLayers array based on
     * the checkbox is checked or not
     */
    function addOrRemoveVisibleLayers() {
      if (isChecked === true) {
        visibleLayers.push(layerId);
        updateVisibleLayers(visibleLayers);
      } else {
        let index = visibleLayers.findIndex(l => l === layerId);
        if (index !== -1) {
          visibleLayers.splice(index, 1);
          updateVisibleLayers(visibleLayers);
        }
      }
    }

    /**
     * onchange event handler of
     * checkbox input
     * @param React.ChangeEvent of HTMLInputElement
     */
    function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
      setIsChecked(!isChecked);
    }

    return (
      <>
        <input
          id={layerId}
          type="checkbox"
          onChange={onChangeHandler}
          className="layerlist-checkbox"
          checked={isChecked}
        />{layerName}
      </>
    );
});


export default CheckboxFC;
