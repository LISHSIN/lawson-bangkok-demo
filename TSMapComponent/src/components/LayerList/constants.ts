import * as MapboxGl from 'mapbox-gl';

/**
 * Show and Hide the trade area layer
 * which are in the mapdraw plugin
 * @param Map object
 * @param isVisible boolean value
 */
export function showHideTradeAreaLayer(map: MapboxGl.Map, isVisible: boolean) {
    let allLayers = map.getStyle().layers;
    if (allLayers !== undefined) {
        let filteredGlDrawPolygonLayers = allLayers.filter((layer) => layer.id.indexOf('gl-draw-polygon') !== -1);
        filteredGlDrawPolygonLayers.forEach(polygonLayer => {
            let polygonLayerId = polygonLayer.id;
            let mapLayer = map.getLayer(polygonLayerId);
            if (mapLayer !== undefined) {
                map.setLayoutProperty(polygonLayerId, "visibility", (isVisible ? "visible" : "none"));
            }
        });
    }
}
