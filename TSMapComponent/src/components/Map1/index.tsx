import React, { useEffect, useContext } from 'react';
import * as MapboxGl from 'mapbox-gl';
import ReactMapboxGl from 'react-mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic';
import * as MapboxDrawWaypoint from 'mapbox-gl-draw-waypoint';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import "./index.css";

import lawsonImg from './images/lawson.png';
import miniStopImg from './images/miniStop.png';
import familyMartImg from './images/familyMart.png';
import sevenElevenImg from './images/sevenEleven.png';
import lawsonStationImg from './images/Lawson-station.png';

import { MapboxConfig, LayerId, SourceId, ImageId, GlDrawColorId, GlDrawPaintPropertyId, GlDrawLayerId, GlDrawMode } from './constants';
import { mapboxReactContext } from 'components/MapboxContext';
import { layerReactContext, LayerType } from 'components/LayerContext';
import { showHideLawsonTradeAreaLayer } from 'components/LayerList/constants';
import LegendFC from 'components/Legend';
import { initialLawsonStoreFeatureProperty, LawsonStoreFeaturePropertyInfo, LawsonStoreGeojsonInfo } from './module';
import { mockCompititorFamilyMartFeatureList, mockCompititorMiniStopFeatureList, mockCompititorSevenElevenFeatureList, mockFeatureList, mockLawsonTradeAreaFeatureList } from './mock';

const Mapbox = ReactMapboxGl({
    accessToken: MapboxConfig.ACCESS_TOKEN,
});

export interface Map1Props {
    map: {
        style: string;
        center: [number, number],
        containerStyle: {
            height: string;
            width: string;
        },
        zoom: [number];
    };
}

export const Map1FC: React.FC<Map1Props> = (props => {
    const context = useContext(mapboxReactContext);
    const layerContext = useContext(layerReactContext);
    const { map: mapContext, mapStyle, mapDraw } = context;
    const { layerObj, isRefreshAllLayers, updateIsRefreshAllLayers } = layerContext;

    const { style, center, containerStyle, zoom } = props.map;

    const lawsonStoreGeojson = {
        'type': 'FeatureCollection',
        'features': [],
        // 'features': mockFeatureList,
    } as any;

    const lawsonStationGeojson = {
        'type': 'FeatureCollection',
        'features': [],
    } as any;

    const familyMartGeojson = {
        'type': 'FeatureCollection',
        'features': [],
        // 'features': mockCompititorFamilyMartFeatureList,
    } as any;

    const sevenElevenGeojson = {
        'type': 'FeatureCollection',
        'features': [],
        // 'features': mockCompititorSevenElevenFeatureList,
    } as any;

    const miniStopGeojson = {
        'type': 'FeatureCollection',
        'features': [],
        // 'features': mockCompititorMiniStopFeatureList,
    } as any;

    useEffect(() => {
        if (mapContext !== undefined) {
            onInitMapDraw(mapContext);
        }
    }, [mapContext]);

    useEffect(() => {
        if (mapContext !== undefined) {
            addCustomLayers(mapContext);
            onChangeMapDrawStaticColor(mapContext);
        }
    }, [mapStyle, mapDraw]);

    useEffect(() => {
        if (mapContext !== undefined && isRefreshAllLayers === true) {
            retriveLawsonStoreDataFromD365(mapContext);
            retriveLawsonTradeAreaDataFromD365(mapContext);
            retriveMiniStopDataFromD365(mapContext);
            retriveFamilyMartDataFromD365(mapContext);
            retriveSevenElevenDataFromD365(mapContext);
            updateIsRefreshAllLayers(false);
        }
    }, [isRefreshAllLayers]);

    /**
     * This function is used to retrive the "crcef_ministop" (Ministop) Entity values
     * to populate over the compititor Area on Map view.
     * @param map 
     */
    function retriveMiniStopDataFromD365(map: MapboxGl.Map) {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_ministop").then((result) => {
                miniStopGeojson.features = [];
                for (var i = 0; i < result.entities.length; i++) {
                    let entity = result.entities[i];
                    let geojson = {
                        'type': 'Feature',
                        'geometry': {
                            coordinates: [entity.crcef_ceox, entity.crcef_ux],
                            type: "Point"
                        },
                        'id': entity.crcef_ministopid,
                        'properties': {
                            crcef_ministopid: entity.crcef_ministopid,
                            crcef_id: entity.crcef_id,
                            crcef_name: entity.crcef_name,
                            crcef_addrcity: entity.crcef_addrcity,
                            crcef_addrstree: entity.crcef_addrstree,
                            crcef_phone: entity.crcef_phone,
                            crcef_ceox: entity.crcef_ceox,
                            crcef_ux: entity.crcef_ux
                        }
                    }
                    miniStopGeojson.features.push(geojson);
                }
                let source = map.getSource(SourceId.MINISTOP_STORE_SOURCE) as any;
                source.setData(miniStopGeojson);
            });
    }

    /**
     * This function is used to retrive the "crcef_familymart" (FamilyMart) Entity values
     * to populate over the compititor Area on Map view.
     * @param map 
     */
    function retriveFamilyMartDataFromD365(map: MapboxGl.Map) {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_familymart").then((result) => {
                familyMartGeojson.features = [];
                for (var i = 0; i < result.entities.length; i++) {
                    let entity = result.entities[i];
                    let geojson = {
                        'type': 'Feature',
                        'geometry': {
                            coordinates: [entity.crcef_ceox, entity.crcef_ux],
                            type: "Point"
                        },
                        'id': entity.crcef_familymartid,
                        'properties': {
                            crcef_familymartid: entity.crcef_familymartid,
                            crcef_id: entity.crcef_id,
                            crcef_name: entity.crcef_name,
                            crcef_addrcity: entity.crcef_addrcity,
                            crcef_addrstree: entity.crcef_addrstree,
                            crcef_phone: entity.crcef_phone,
                            crcef_ceox: entity.crcef_ceox,
                            crcef_ux: entity.crcef_ux
                        }
                    }
                    familyMartGeojson.features.push(geojson);
                }
                let source = map.getSource(SourceId.FAMILYMART_STORE_SOURCE) as any;
                source.setData(familyMartGeojson);
            });
    }

    /**
     * This function is used to retrive the "crcef_seveneleven" (SevenEleven) Entity values
     * to populate over the compititor Area on Map view.
     * @param map 
     */
    function retriveSevenElevenDataFromD365(map: MapboxGl.Map) {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_seveneleven").then((result) => {
                sevenElevenGeojson.features = [];
                for (var i = 0; i < result.entities.length; i++) {
                    let entity = result.entities[i];
                    let geojson = {
                        'type': 'Feature',
                        'geometry': {
                            coordinates: [entity.crcef_ceox, entity.crcef_ux],
                            type: "Point"
                        },
                        'id': entity.crcef_sevenelevenid,
                        'properties': {
                            crcef_sevenelevenid: entity.crcef_sevenelevenid,
                            crcef_id: entity.crcef_id,
                            crcef_name: entity.crcef_name,
                            crcef_addrcity: entity.crcef_addrcity,
                            crcef_addrstree: entity.crcef_addrstree,
                            crcef_phone: entity.crcef_phone,
                            crcef_ceox: entity.crcef_ceox,
                            crcef_ux: entity.crcef_ux
                        }
                    }
                    sevenElevenGeojson.features.push(geojson);
                }
                let source = map.getSource(SourceId.SEVEN_ELEVEN_STORE_SOURCE) as any;
                source.setData(sevenElevenGeojson);
            });
    }

    /**
     * This function is used to retrive the "crcef_duplicatelawsonstoredata" (LawsonStore) Entity values
     * to populate over the store Area on Map view.
     * @param map 
     */
    function retriveLawsonStoreDataFromD365(map: MapboxGl.Map) {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_duplicatelawsonstoredata").then((result) => {
                let lawsonStoreFeatureList = layerObj[LayerId.LAWSON_STORE_LAYER].featureList;
                lawsonStoreFeatureList.length = 0;
                lawsonStoreGeojson.features = [];

                for (var i = 0; i < result.entities.length; i++) {
                    let entity = result.entities[i];
                    for (let key of Object.keys(entity)) {
                        let entityVal = entity[key];
                        if (entityVal === null) {
                            let initialPropVal = initialLawsonStoreFeatureProperty[key as keyof LawsonStoreFeaturePropertyInfo];
                            if (initialPropVal !== undefined) {
                                entity[key] = initialPropVal; // Set Initial Value
                            }
                        }
                    }

                    let geojson: LawsonStoreGeojsonInfo = {
                        'type': 'Feature',
                        'geometry': {
                            coordinates: [entity.crcef_lon, entity.crcef_lat],
                            type: "Point"
                        },
                        //'id': entity.crcef_id,
                        'id': entity.crcef_duplicatelawsonstoredataid,
                        'properties': {
                            crcef_randomnumber: entity.crcef_randomnumber,
                            crcef_duplicatelawsonstoredataid: entity.crcef_duplicatelawsonstoredataid,
                            crcef_id: entity.crcef_id,
                            crcef_storename: entity.crcef_storename,
                            crcef_addresspluscode: entity.crcef_addresspluscode,
                            crcef_lat: entity.crcef_lat,
                            crcef_lon: entity.crcef_lon,
                            crcef_tell: entity.crcef_tell,
                            crcef_lastmonthssales: entity.crcef_lastmonthssales,
                            crcef_thismonthssales: entity.crcef_thismonthssales,
                            crcef_transactioncount: entity.crcef_transactioncount,
                            crcef_custmeravg: entity.crcef_custmeravg,
                            crcef_abca: entity.crcef_abca,
                            crcef_abcb: entity.crcef_abcb,
                            crcef_abcc: entity.crcef_abcc,
                            crcef_lankingtop1: entity.crcef_lankingtop1,
                            crcef_lankingtop2: entity.crcef_lankingtop2,
                            crcef_lankingtop3: entity.crcef_lankingtop3,
                            crcef_0oclock: entity.crcef_0oclock,
                            crcef_1oclock: entity.crcef_1oclock,
                            crcef_2oclock: entity.crcef_2oclock,
                            crcef_3oclock: entity.crcef_3oclock,
                            crcef_4oclock: entity.crcef_4oclock,
                            crcef_5oclock: entity.crcef_5oclock,
                            crcef_6oclock: entity.crcef_6oclock,
                            crcef_7oclock: entity.crcef_7oclock,
                            crcef_8oclock: entity.crcef_8oclock,
                            crcef_9oclock: entity.crcef_9oclock,
                            crcef_10oclock: entity.crcef_10oclock,
                            crcef_11oclock: entity.crcef_11oclock,
                            crcef_12oclock: entity.crcef_12oclock,
                            crcef_13oclock: entity.crcef_13oclock,
                            crcef_14oclock: entity.crcef_14oclock,
                            crcef_15oclock: entity.crcef_15oclock,
                            crcef_16oclock: entity.crcef_16oclock,
                            crcef_17oclock: entity.crcef_17oclock,
                            crcef_18oclock: entity.crcef_18oclock,
                            crcef_19oclock: entity.crcef_19oclock,
                            crcef_20oclock: entity.crcef_20oclock,
                            crcef_21oclock: entity.crcef_21oclock,
                            crcef_22oclock: entity.crcef_22oclock,
                            crcef_23oclock: entity.crcef_23oclock,
                            crcef_totalff: entity.crcef_totalff,
                            crcef_males: entity.crcef_males,
                            crcef_females: entity.crcef_females,
                            crcef_1825: entity.crcef_1825,
                            crcef_2635: entity.crcef_2635,
                            crcef_3645: entity.crcef_3645,
                            crcef_over45: entity.crcef_over45,
                            crcef_professionals: entity.crcef_professionals,
                            crcef_students: entity.crcef_students,
                            crcef_families: entity.crcef_families,
                            crcef_travelers: entity.crcef_travelers,
                            crcef_home1lat: entity.crcef_home1lat,
                            crcef_home1lon: entity.crcef_home1lon,
                            crcef_home1ratio: entity.crcef_home1ratio,
                            crcef_home2lat: entity.crcef_home2lat,
                            crcef_home2lon: entity.crcef_home2lon,
                            crcef_home2ratio: entity.crcef_home2ratio,
                            crcef_home3lat: entity.crcef_home3lat,
                            crcef_home3lon: entity.crcef_home3lon,
                            crcef_home3ratio: entity.crcef_home3ratio,
                            crcef_work1lat: entity.crcef_work1lat,
                            crcef_work1lon: entity.crcef_work1lon,
                            crcef_work1ratio: entity.crcef_work1ratio,
                            crcef_work2lat: entity.crcef_work2lat,
                            crcef_work2lon: entity.crcef_work2lon,
                            crcef_work2ratio: entity.crcef_work2ratio,
                            crcef_work3lat: entity.crcef_work3lat,
                            crcef_work3lon: entity.crcef_work3lon,
                            crcef_work3ratio: entity.crcef_work3ratio,
                            crcef_incomehigh: entity.crcef_incomehigh,
                            crcef_incomemid: entity.crcef_incomemid,
                            crcef_incomerow: entity.crcef_incomerow,
                            crcef_man0: entity.crcef_man0,
                            crcef_man10: entity.crcef_man10,
                            crcef_man20: entity.crcef_man20,
                            crcef_man30: entity.crcef_man30,
                            crcef_man40: entity.crcef_man40,
                            crcef_man50: entity.crcef_man50,
                            crcef_man60: entity.crcef_man60,
                            crcef_man70: entity.crcef_man70,
                            crcef_man80: entity.crcef_man80,
                            crcef_man90: entity.crcef_man90,
                            crcef_man100: entity.crcef_man100,
                            crcef_woman0: entity.crcef_woman0,
                            crcef_woman10: entity.crcef_woman10,
                            crcef_woman20: entity.crcef_woman20,
                            crcef_woman30: entity.crcef_woman30,
                            crcef_woman40: entity.crcef_woman40,
                            crcef_woman50: entity.crcef_woman50,
                            crcef_woman60: entity.crcef_woman60,
                            crcef_woman70: entity.crcef_woman70,
                            crcef_woman80: entity.crcef_woman80,
                            crcef_woman90: entity.crcef_woman90,
                            crcef_woman100: entity.crcef_woman100,
                            crcef_total: entity.crcef_total,
                            crcef_7eleven: entity.crcef_7eleven,
                            crcef_familymart: entity.crcef_familymart,
                            crcef_ministop: entity.crcef_ministop,
                            crcef_tatal: entity.crcef_tatal,
                            crcef_0oclockweekend: entity.crcef_0oclockweekend,
                            crcef_1oclockweekend: entity.crcef_1oclockweekend,
                            crcef_2oclockweekend: entity.crcef_2oclockweekend,
                            crcef_3oclockweekend: entity.crcef_3oclockweekend,
                            crcef_4oclockweekend: entity.crcef_4oclockweekend,
                            crcef_5oclockweekend: entity.crcef_5oclockweekend,
                            crcef_6oclockweekend: entity.crcef_6oclockweekend,
                            crcef_7oclockweekend: entity.crcef_7oclockweekend,
                            crcef_8oclockweekend: entity.crcef_8oclockweekend,
                            crcef_9oclockweekend: entity.crcef_9oclockweekend,
                            crcef_10oclockweekend: entity.crcef_10oclockweekend,
                            crcef_11oclockweekend: entity.crcef_11oclockweekend,
                            crcef_12oclockweekend: entity.crcef_12oclockweekend,
                            crcef_13oclockweekend: entity.crcef_13oclockweekend,
                            crcef_14oclockweekend: entity.crcef_14oclockweekend,
                            crcef_15oclockweekend: entity.crcef_15oclockweekend,
                            crcef_16oclockweekend: entity.crcef_16oclockweekend,
                            crcef_17oclockweekend: entity.crcef_17oclockweekend,
                            crcef_18oclockweekend: entity.crcef_18oclockweekend,
                            crcef_19oclockweekend: entity.crcef_19oclockweekend,
                            crcef_20oclockweekend: entity.crcef_20oclockweekend,
                            crcef_21oclockweekend: entity.crcef_21oclockweekend,
                            crcef_22oclockweekend: entity.crcef_22oclockweekend,
                            crcef_23oclockweekend: entity.crcef_23oclockweekend,
                            crcef_02kmhomelocation: entity.crcef_02kmhomelocation,
                            crcef_24kmhomelocation: entity.crcef_24kmhomelocation,
                            crcef_46kmhomelocation: entity.crcef_46kmhomelocation,
                            crcef_68kmhomelocation: entity.crcef_68kmhomelocation,
                            crcef_810kmhomelocation: entity.crcef_810kmhomelocation,
                            crcef_10kmhomelocation: entity.crcef_10kmhomelocation,
                            crcef_02kmworklocation: entity.crcef_02kmworklocation,
                            crcef_24kmworklocation: entity.crcef_24kmworklocation,
                            crcef_46kmworklocation: entity.crcef_46kmworklocation,
                            crcef_68kmworklocation: entity.crcef_68kmworklocation,
                            crcef_810kmworklocation: entity.crcef_810kmworklocation,
                            crcef_10kmworklocation: entity.crcef_10kmworklocation,
                            crcef_mon: entity.crcef_mon,
                            crcef_tue: entity.crcef_tue,
                            crcef_wed: entity.crcef_wed,
                            crcef_thu: entity.crcef_thu,
                            crcef_fri: entity.crcef_fri,
                            crcef_sat: entity.crcef_sat,
                            crcef_sun: entity.crcef_sun,
                        }
                    }

                    lawsonStoreGeojson.features.push(geojson);
                }
                let source = map.getSource(SourceId.LAWSON_STORE_SOURCE) as any;
                source.setData(lawsonStoreGeojson);

                layerObj[LayerId.LAWSON_STORE_LAYER].featureList = lawsonStoreGeojson.features.slice();
            });
    }

    /**
     * This function is used to retrive the "crcef_lawsontradearea" (LawsonTradeArea) Entity values
     * to populate over the circle and polygon on Map view.
     * @param map 
     */
    function retriveLawsonTradeAreaDataFromD365(map: MapboxGl.Map) {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_lawsontradearea").then((result) => {
                let tradeAreaFeatureList = layerObj[LayerId.LAWSON_TRADE_AREA_LAYER].featureList;
                tradeAreaFeatureList.length = 0;
                mapDraw?.deleteAll();

                for (var i = 0; i < result.entities.length; i++) {
                    let individualResults = JSON.parse(result.entities[i].crcef_tradeareajson);
                    let feature = individualResults;
                    feature.properties.risk = true;

                    mapDraw?.add(feature);
                    tradeAreaFeatureList.push(feature);
                }
            });
    }

    /**
     * This function is used to retrive the "mock trade area" (LawsonTradeArea) Entity values
     * to populate over the circle and polygon on Map view.
     * @param map 
     */
    function retriveLawsonTradeAreaDataFromMockList(map: MapboxGl.Map) {
        let tradeAreaFeatureList = layerObj[LayerId.LAWSON_TRADE_AREA_LAYER].featureList;
        tradeAreaFeatureList.length = 0;
        mapDraw?.deleteAll();

        mockLawsonTradeAreaFeatureList.forEach((feature) => {
            mapDraw?.add(feature);
            tradeAreaFeatureList.push(feature);
        });
    }

    /**
     * This function is used to add custom layer
     * to populate over the lawson store icon on Map view.
     * @param map 
     */
    function addLawsonStoreLayer(map: MapboxGl.Map) {
        let lawsonIconId = ImageId.LAWSON_STORE_ICON;
        let lawsonLayerId = LayerId.LAWSON_STORE_LAYER as LayerType;
        let lawsonSourceId = SourceId.LAWSON_STORE_SOURCE;

        map.loadImage(lawsonImg, (error: any, image: any) => {
            if (error) return;

            let hasStoreImage = map.hasImage(lawsonIconId);
            if (hasStoreImage === false) {
                map.addImage(lawsonIconId, image);
            }
        });

        let lawsonSource = map.getSource(lawsonSourceId);
        if (lawsonSource === undefined) {
            map.addSource(lawsonSourceId, {
                'type': 'geojson',
                'data': lawsonStoreGeojson
            });
        }

        let lawsonLayer = map.getLayer(lawsonLayerId);
        if (lawsonLayer === undefined) {
            map.addLayer({
                'id': lawsonLayerId,
                'source': lawsonSourceId,
                'type': 'symbol',
                'minzoom': 13,
                'layout': {
                    'icon-image': lawsonIconId,
                    'icon-size': 0.5,
                    'icon-allow-overlap': true
                },
            });
        }

        map.setLayoutProperty(lawsonLayerId, "visibility", (layerObj[lawsonLayerId].isEnable === true ? 'visible' : 'none'));
        retriveLawsonStoreDataFromD365(map);
    }

    /**
     * This function is used to add custom layer
     * to populate over the lawson selected store icon on Map view.
     * @param map 
     */
    function addLawsonStationLayer(map: MapboxGl.Map) {
        let lawsonStationIconId = ImageId.LAWSON_STATION_ICON;
        let lawsonStationLayerId = LayerId.LAWSON_STATION_LAYER as LayerType;
        let lawsonStationSourceId = SourceId.LAWSON_STATION_SOURCE;

        map.loadImage(lawsonStationImg, (error: any, image: any) => {
            if (error) return;

            let hasStoreImage = map.hasImage(lawsonStationIconId);
            if (hasStoreImage === false) {
                map.addImage(lawsonStationIconId, image);
            }
        });

        let lawsonSource = map.getSource(lawsonStationSourceId);
        if (lawsonSource === undefined) {
            map.addSource(lawsonStationSourceId, {
                'type': 'geojson',
                'data': lawsonStationGeojson
            });
        }

        let lawsonLayer = map.getLayer(lawsonStationLayerId);
        if (lawsonLayer === undefined) {
            map.addLayer({
                'id': lawsonStationLayerId,
                'source': lawsonStationSourceId,
                'type': 'symbol',
                'minzoom': 13,
                'layout': {
                    'icon-image': lawsonStationIconId,
                    'icon-size': 0.5,
                    'icon-allow-overlap': true
                },
            });
        }

        map.setLayoutProperty(lawsonStationLayerId, "visibility", (layerObj[lawsonStationLayerId].isEnable === true ? 'visible' : 'none'));
    }

    /**
     * This function is used to add custom layer
     * to populate over the family mart icon on Map view.
     * @param map 
     */
    function addFamilyMartLayer(map: MapboxGl.Map) {
        let familyMartIconId = ImageId.FAMILYMART_STORE_ICON;
        let familyMartLayerId = LayerId.FAMILIMART_STORE_LAYER as LayerType;
        let familyMartSourceId = SourceId.FAMILYMART_STORE_SOURCE;

        map.loadImage(familyMartImg, (error: any, image: any) => {
            if (error) return;

            let hasStoreImage = map.hasImage(familyMartIconId);
            if (hasStoreImage === false) {
                map.addImage(familyMartIconId, image);
            }
        });

        let fmlyMartSource = map.getSource(familyMartSourceId);
        if (fmlyMartSource === undefined) {
            map.addSource(familyMartSourceId, {
                'type': 'geojson',
                'data': familyMartGeojson
            });
        }

        let fmlyMartLayer = map.getLayer(familyMartLayerId);
        if (fmlyMartLayer === undefined) {
            map.addLayer({
                'id': familyMartLayerId,
                'source': familyMartSourceId,
                'type': 'symbol',
                'minzoom': 13,
                'layout': {
                    'icon-image': familyMartIconId,
                    'icon-size': 0.5,
                    'icon-allow-overlap': true
                },
            });
        }

        map.setLayoutProperty(familyMartLayerId, "visibility", (layerObj[familyMartLayerId].isEnable === true ? 'visible' : 'none'));
        retriveFamilyMartDataFromD365(map);
    }

    /**
     * This function is used to add custom layer
     * to populate over the seven eleven icon on Map view.
     * @param map 
     */
    function addSevenElevenStoreLayer(map: MapboxGl.Map) {
        let sevenElevenIconId = ImageId.SEVENELEVEN_STORE_ICON;
        let sevenElevenLayerId = LayerId.SEVEN_ELEVEN_STORE_LAYER as LayerType;
        let sevenElevenSourceId = SourceId.SEVEN_ELEVEN_STORE_SOURCE;

        map.loadImage(sevenElevenImg, (error: any, image: any) => {
            if (error) return;

            let hasStoreImage = map.hasImage(sevenElevenIconId);
            if (hasStoreImage === false) {
                map.addImage(sevenElevenIconId, image);
            }
        });

        let sevenElevenSource = map.getSource(sevenElevenSourceId);
        if (sevenElevenSource === undefined) {
            map.addSource(sevenElevenSourceId, {
                'type': 'geojson',
                'data': sevenElevenGeojson
            });
        }

        let sevenelevenLayer = map.getLayer(sevenElevenLayerId);
        if (sevenelevenLayer === undefined) {
            map.addLayer({
                'id': sevenElevenLayerId,
                'source': sevenElevenSourceId,
                'type': 'symbol',
                'minzoom': 13,
                'layout': {
                    'icon-image': sevenElevenIconId,
                    'icon-size': 0.5,
                    'icon-allow-overlap': true
                },
            });
        }

        map.setLayoutProperty(sevenElevenLayerId, "visibility", (layerObj[sevenElevenLayerId].isEnable === true ? 'visible' : 'none'));
        retriveSevenElevenDataFromD365(map);
    }

    /**
     * This function is used to add custom layer
     * to populate over the ministop icon on Map view.
     * @param map 
     */
    function addMiniStopStoreLayer(map: MapboxGl.Map) {
        let miniStopIconId = ImageId.MINISTOP_STORE_ICON;
        let miniStopLayerId = LayerId.MINISTOP_STORE_LAYER as LayerType;
        let miniStopSourceId = SourceId.MINISTOP_STORE_SOURCE;

        map.loadImage(miniStopImg, (error: any, image: any) => {
            if (error) return;

            let hasStoreImage = map.hasImage(miniStopIconId);
            if (hasStoreImage === false) {
                map.addImage(miniStopIconId, image);
            }
        });

        let miniStopSource = map.getSource(miniStopSourceId);
        if (miniStopSource === undefined) {
            map.addSource(miniStopSourceId, {
                'type': 'geojson',
                'data': miniStopGeojson
            });
        }

        let miniStopLayer = map.getLayer(miniStopLayerId);
        if (miniStopLayer === undefined) {
            map.addLayer({
                'id': miniStopLayerId,
                'source': miniStopSourceId,
                'type': 'symbol',
                'minzoom': 13,
                'layout': {
                    'icon-image': miniStopIconId,
                    'icon-size': 0.5,
                    'icon-allow-overlap': true
                },
            });
        }

        map.setLayoutProperty(miniStopLayerId, "visibility", (layerObj[miniStopLayerId].isEnable === true ? 'visible' : 'none'));
        retriveMiniStopDataFromD365(map);
    }

    /**
     * This function is used to add trade area
     * to populate over the circle and polygon on Map view.
     * @param map 
     */
    function addLawsonTradeAreaLayer(map: MapboxGl.Map) {
        retriveLawsonTradeAreaDataFromD365(map);
        // retriveLawsonTradeAreaDataFromMockList(map);
    }

    /**
     * This function is used to add control
     * to show the search box on Map view.
     * @param map 
     */
    function addGeoCoder(map: MapboxGl.Map) {
        const geocoder = new MapboxGeocoder({
            accessToken: MapboxConfig.ACCESS_TOKEN,
            mapboxgl: MapboxGl
        });
        geocoder.on('result', function (event: any) {
            map.flyTo({ center: event.result.center, zoom: map.getZoom() });
        });

        map.addControl(geocoder, "top-left");
    }

    /**
     * This function is used to add all the custom layers
     * and to show and hide control on Map view.
     * @param map 
     */
    function addCustomLayers(map: MapboxGl.Map) {
        addLawsonStoreLayer(map);
        addLawsonStationLayer(map);
        addLawsonTradeAreaLayer(map);
        addFamilyMartLayer(map);
        addSevenElevenStoreLayer(map);
        addMiniStopStoreLayer(map);

        showHideAllLayers(map);
    }

    /**
     * This function is used to control show and hide
     * all the layers on Map view.
     * @param map 
     */
    function showHideAllLayers(map: MapboxGl.Map) {
        for (const id of Object.keys(layerObj)) {
            let layerId = id as LayerType;
            let isVisible = layerObj[layerId].isEnable;

            if (layerId === LayerId.LAWSON_TRADE_AREA_LAYER) {
                showHideLawsonTradeAreaLayer(map, isVisible);
            } else {
                let mapLayer = map.getLayer(layerId);
                if (mapLayer !== undefined) {
                    map.setLayoutProperty(layerId, "visibility", (isVisible === true ? 'visible' : 'none'));
                }
            }
        }
    }

    /**
     * This function is used to change the color
     * of Mapdraw static layer.
     * @param map 
     */
    function onChangeMapDrawStaticColor(map: MapboxGl.Map) {
        let inActiveColor = GlDrawColorId.INACTIVE;
        let promise1 = new Promise<void>((resolve) => {
            let fillStaticFn = () => {
                let fillStaticLayer = GlDrawLayerId.GL_DRAW_POLYGON_FILL_STATIC_COLD;
                let mapLayer = map.getLayer(fillStaticLayer);
                if (mapLayer !== undefined) {
                    map.setPaintProperty(fillStaticLayer, GlDrawPaintPropertyId.FILL_COLOR, inActiveColor);
                    map.setPaintProperty(fillStaticLayer, GlDrawPaintPropertyId.FILL_OUTLINE_COLOR, inActiveColor);
                    resolve();
                } else {
                    setTimeout(fillStaticFn, 1000);
                }
            };
            fillStaticFn();
        });
        let promise2 = new Promise<void>((resolve) => {
            let strokeStaticFn = () => {
                let strokeStaticLayer = GlDrawLayerId.GL_DRAW_POLYGON_STROKE_STATIC_COLD;
                let mapLayer = map.getLayer(strokeStaticLayer);
                if (mapLayer !== undefined) {
                    map.setPaintProperty(strokeStaticLayer, GlDrawPaintPropertyId.LINE_COLOR, inActiveColor);
                    resolve();
                } else {
                    setTimeout(strokeStaticFn, 1000);
                }
            };
            strokeStaticFn();
        });

        Promise.all([promise1, promise2]).then(() => {
            mapDraw?.changeMode(GlDrawMode.STATIC);
        });
    }

    /**
     * Initialization of map draw functionality.
     * @param map 
     */
    function onInitMapDraw(map: MapboxGl.Map) {
        let modes = MapboxDraw.modes;
        modes = MapboxDrawGeodesic.enable(modes);
        modes = MapboxDrawWaypoint.enable(modes, (f: GeoJSON.Feature) => f && f.properties && f.properties.risk === true);

        let draw = new MapboxDraw({
            defaultMode: GlDrawMode.SIMPLE_SELECT,
            userProperties: true,
            displayControlsDefault: false,
            modes
        });

        map.addControl(draw, "top-right");
        context.updateDraw(draw);
    }

    /**
     * Initialization of map load functionality.
     * @param map 
     */
    function onMapLoad(map: MapboxGl.Map | undefined) {
        if (map !== undefined) {
            let scaleControl = new MapboxGl.ScaleControl();
            map.addControl(scaleControl, 'bottom-left');
            map.dragPan.disable();
            map.doubleClickZoom.disable();

            addGeoCoder(map);
            addCustomLayers(map);

            context.update(map);
        }
    }

    return (
        <>
            <Mapbox style={style} containerStyle={containerStyle} zoom={zoom} center={center} onStyleLoad={onMapLoad}>
                <LegendFC></LegendFC>
                {context.customPopup}
            </Mapbox>
        </>
    );
});

export default Map1FC;
