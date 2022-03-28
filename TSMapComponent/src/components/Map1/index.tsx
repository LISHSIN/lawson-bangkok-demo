import React, { useEffect, useContext } from 'react';
import * as MapboxGl from 'mapbox-gl';
import ReactMapboxGl from 'react-mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic';
import * as MapboxDrawWaypoint from 'mapbox-gl-draw-waypoint';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import "./index.css";

import aStoreImg from './images/aStore.png';
import bStoreImg from './images/bStore.png';
import cStoreImg from './images/cStore.png';
import dStoreImg from './images/dStore.png';
import eStoreImg from './images/eStore.png';
import aStoreSelectedImg from './images/aStoreSelected.png';

import { MAPBOX_CONFIG, LayerId, SourceId, ImageId, GlDrawColorId, GlDrawPaintPropertyId, GlDrawLayerId, GlDrawMode } from './constants';
import { mapboxReactContext } from 'components/MapboxContext';
import { layerReactContext, LayerType } from 'components/LayerContext';
import { showHideTradeAreaLayer } from 'components/LayerList/constants';
import LegendFC from 'components/Legend';
import { initialAStoreFeatureProperty, AStoreFeaturePropertyInfo, AStoreGeojsonInfo } from './module';
import { mockCompititorBStoreFeatureList, mockCompititorCStoreFeatureList, mockCompititorDStoreFeatureList, mockCompititorEStoreFeatureList, mockFeatureList, mockTradeAreaFeatureList } from './mock';

const Mapbox = ReactMapboxGl({
    accessToken: MAPBOX_CONFIG.ACCESS_TOKEN,
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

    const aStoreGeojson = {
        'type': 'FeatureCollection',
        'features': [],
        // 'features': mockFeatureList,
    } as any;

    const aStoreSelectedGeojson = {
        'type': 'FeatureCollection',
        'features': [],
    } as any;

    const bStoreGeojson = {
        'type': 'FeatureCollection',
        'features': [],
        // 'features': mockCompititorBStoreFeatureList,
    } as any;

    const cStoreGeojson = {
        'type': 'FeatureCollection',
        'features': [],
        // 'features': mockCompititorCStoreFeatureList,
    } as any;

    const dStoreGeojson = {
        'type': 'FeatureCollection',
        'features': [],
        // 'features': mockCompititorDStoreFeatureList,
    } as any;

    const eStoreGeojson = {
        'type': 'FeatureCollection',
        'features': [],
        // 'features': mockCompititorEStoreFeatureList,
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
        if ((mapContext !== undefined) && (isRefreshAllLayers === true)) {
            retriveAStoreDataFromD365(mapContext);
            retriveTradeAreaDataFromD365(mapContext);
            retriveBStoreDataFromD365(mapContext);
            retriveCStoreDataFromD365(mapContext);
            retriveDStoreDataFromD365(mapContext);
            retriveEStoreDataFromD365(mapContext);
            updateIsRefreshAllLayers(false);
        }
    }, [isRefreshAllLayers]);

    /**
     * This function is used to retrive the "crcef_ministop" (D Store) Entity values
     * to populate over the compititor Area on Map view.
     * @param map 
     */
    function retriveDStoreDataFromD365(map: MapboxGl.Map) {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_ministop").then((result) => {
                dStoreGeojson.features = [];
                for (let i = 0; i < result.entities.length; i++) {
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
                    dStoreGeojson.features.push(geojson);
                }
                let source = map.getSource(SourceId.D_STORE_SOURCE) as any;
                source.setData(dStoreGeojson);
            });
    }

    /**
     * This function is used to retrive the "crcef_familymart" (C Store) Entity values
     * to populate over the compititor Area on Map view.
     * @param map 
     */
    function retriveCStoreDataFromD365(map: MapboxGl.Map) {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_familymart").then((result) => {
                cStoreGeojson.features = [];
                for (let i = 0; i < result.entities.length; i++) {
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
                    cStoreGeojson.features.push(geojson);
                }
                let source = map.getSource(SourceId.C_STORE_SOURCE) as any;
                source.setData(cStoreGeojson);
            });
    }

    /**
     * This function is used to retrive the "crcef_seveneleven" (B Store) Entity values
     * to populate over the compititor Area on Map view.
     * @param map 
     */
    function retriveBStoreDataFromD365(map: MapboxGl.Map) {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_seveneleven").then((result) => {
                bStoreGeojson.features = [];
                for (let i = 0; i < result.entities.length; i++) {
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
                    bStoreGeojson.features.push(geojson);
                }
                let source = map.getSource(SourceId.B_STORE_SOURCE) as any;
                source.setData(bStoreGeojson);
            });
    }

    /**
     * This function is used to retrive the "crcef_tescolotusexpress" (E Store) Entity values
     * to populate over the compititor Area on Map view.
     * @param map 
     */
    function retriveEStoreDataFromD365(map: MapboxGl.Map) {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_tescolotusexpress").then((result) => {
                eStoreGeojson.features = [];
                for (let i = 0; i < result.entities.length; i++) {
                    let entity = result.entities[i];
                    let geojson = {
                        'type': 'Feature',
                        'geometry': {
                            coordinates: [entity.crcef_ceox, entity.crcef_ux],
                            type: "Point"
                        },
                        'id': entity.crcef_tescolotusexpressid,
                        'properties': {
                            crcef_tescolotusexpressid: entity.crcef_tescolotusexpressid,
                            crcef_id: entity.crcef_id,
                            crcef_name: entity.crcef_name,
                            crcef_addrcity: entity.crcef_addrcity,
                            crcef_addrstree: entity.crcef_addrstree,
                            crcef_phone: entity.crcef_phone,
                            crcef_ceox: entity.crcef_ceox,
                            crcef_ux: entity.crcef_ux
                        }
                    }
                    eStoreGeojson.features.push(geojson);
                }
                let source = map.getSource(SourceId.E_STORE_SOURCE) as any;
                source.setData(eStoreGeojson);
            });
    }

    /**
     * This function is used to retrive the "crcef_duplicatelawsonstoredata" (A Store) Entity values
     * to populate over the store Area on Map view.
     * @param map 
     */
    function retriveAStoreDataFromD365(map: MapboxGl.Map) {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_duplicatelawsonstoredata").then((result) => {
                let aStoreFeatureList = layerObj[LayerId.A_STORE_LAYER].featureList;
                aStoreFeatureList.length = 0;
                aStoreGeojson.features = [];

                for (let i = 0; i < result.entities.length; i++) {
                    let entity = result.entities[i];
                    for (let key of Object.keys(entity)) {
                        let entityVal = entity[key];
                        if (entityVal === null) {
                            let initialPropVal = initialAStoreFeatureProperty[key as keyof AStoreFeaturePropertyInfo];
                            if (initialPropVal !== undefined) {
                                entity[key] = initialPropVal; // Set Initial Value
                            }
                        }
                    }

                    let geojson: AStoreGeojsonInfo = {
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
                            crcef_tescoLotusExpress: entity.crcef_tescolotusexpress,
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

                    aStoreGeojson.features.push(geojson);
                }
                let source = map.getSource(SourceId.A_STORE_SOURCE) as any;
                source.setData(aStoreGeojson);

                layerObj[LayerId.A_STORE_LAYER].featureList = aStoreGeojson.features.slice();
            });
    }

    /**
     * This function is used to retrive the "crcef_lawsontradearea" (TradeArea) Entity values
     * to populate over the circle and polygon on Map view.
     * @param map 
     */
    function retriveTradeAreaDataFromD365(map: MapboxGl.Map) {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_lawsontradearea").then((result) => {
                let tradeAreaFeatureList = layerObj[LayerId.TRADE_AREA_LAYER].featureList;
                tradeAreaFeatureList.length = 0;
                mapDraw?.deleteAll();

                for (let i = 0; i < result.entities.length; i++) {
                    let individualResults = JSON.parse(result.entities[i].crcef_tradeareajson);
                    let feature = individualResults;
                    feature.properties.risk = true;
                    feature.properties.tradeAreaGuid = result.entities[i].crcef_lawsontradeareaid;

                    mapDraw?.add(feature);
                    tradeAreaFeatureList.push(feature);
                }
            });
    }

    /**
     * This function is used to retrive the "mock trade area" (TradeArea) Entity values
     * to populate over the circle and polygon on Map view.
     * @param map 
     */
    function retriveTradeAreaDataFromMockList(map: MapboxGl.Map) {
        let tradeAreaFeatureList = layerObj[LayerId.TRADE_AREA_LAYER].featureList;
        tradeAreaFeatureList.length = 0;
        mapDraw?.deleteAll();

        mockTradeAreaFeatureList.forEach((feature) => {
            mapDraw?.add(feature);
            tradeAreaFeatureList.push(feature);
        });
    }

    /**
     * This function is used to add custom layer
     * to populate over the "A store" icon on Map view.
     * @param map 
     */
    function addAStoreLayer(map: MapboxGl.Map) {
        let aStoreIconId = ImageId.A_STORE_ICON;
        let aStoreLayerId = LayerId.A_STORE_LAYER as LayerType;
        let aStoreSourceId = SourceId.A_STORE_SOURCE;

        map.loadImage(aStoreImg, (error: any, image: any) => {
            if (error) {
                return;
            }

            let hasStoreImage = map.hasImage(aStoreIconId);
            if (hasStoreImage === false) {
                map.addImage(aStoreIconId, image);
            }
        });

        let aStoreSource = map.getSource(aStoreSourceId);
        if (aStoreSource === undefined) {
            map.addSource(aStoreSourceId, {
                'type': 'geojson',
                'data': aStoreGeojson
            });
        }

        let aStoreLayer = map.getLayer(aStoreLayerId);
        if (aStoreLayer === undefined) {
            map.addLayer({
                'id': aStoreLayerId,
                'source': aStoreSourceId,
                'type': 'symbol',
                'minzoom': 13,
                'layout': {
                    'icon-image': aStoreIconId,
                    'icon-size': 0.5,
                    'icon-allow-overlap': true
                },
            });
        }

        map.setLayoutProperty(aStoreLayerId, "visibility", (layerObj[aStoreLayerId].isEnable === true ? 'visible' : 'none'));
        retriveAStoreDataFromD365(map);
    }

    /**
     * This function is used to add custom layer
     * to populate over the selected "A store" icon on Map view.
     * @param map 
     */
    function addAStoreSelectionLayer(map: MapboxGl.Map) {
        let aStoreSelectedIconId = ImageId.A_STORE_SELECTION_ICON;
        let aStoreSelectedLayerId = LayerId.A_STORE_SELECTION_LAYER as LayerType;
        let aStoreSelectedSourceId = SourceId.A_STORE_SELECTION_SOURCE;

        map.loadImage(aStoreSelectedImg, (error: any, image: any) => {
            if (error) {
                return;
            }

            let hasStoreImage = map.hasImage(aStoreSelectedIconId);
            if (hasStoreImage === false) {
                map.addImage(aStoreSelectedIconId, image);
            }
        });

        let aStoreSelectedSource = map.getSource(aStoreSelectedSourceId);
        if (aStoreSelectedSource === undefined) {
            map.addSource(aStoreSelectedSourceId, {
                'type': 'geojson',
                'data': aStoreSelectedGeojson
            });
        }

        let aStoreSelectedLayer = map.getLayer(aStoreSelectedLayerId);
        if (aStoreSelectedLayer === undefined) {
            map.addLayer({
                'id': aStoreSelectedLayerId,
                'source': aStoreSelectedSourceId,
                'type': 'symbol',
                'minzoom': 13,
                'layout': {
                    'icon-image': aStoreSelectedIconId,
                    'icon-size': 0.5,
                    'icon-allow-overlap': true
                },
            });
        }

        map.setLayoutProperty(aStoreSelectedLayerId, "visibility", (layerObj[aStoreSelectedLayerId].isEnable === true ? 'visible' : 'none'));
    }

    /**
     * This function is used to add custom layer
     * to populate over the "C" store icon on Map view.
     * @param map 
     */
    function addCStoreLayer(map: MapboxGl.Map) {
        let cStoreIconId = ImageId.C_STORE_ICON;
        let cStoreLayerId = LayerId.C_STORE_LAYER as LayerType;
        let cStoreSourceId = SourceId.C_STORE_SOURCE;

        map.loadImage(cStoreImg, (error: any, image: any) => {
            if (error) {
                return;
            }

            let hasStoreImage = map.hasImage(cStoreIconId);
            if (hasStoreImage === false) {
                map.addImage(cStoreIconId, image);
            }
        });

        let cStoreSource = map.getSource(cStoreSourceId);
        if (cStoreSource === undefined) {
            map.addSource(cStoreSourceId, {
                'type': 'geojson',
                'data': cStoreGeojson
            });
        }

        let cStoreLayer = map.getLayer(cStoreLayerId);
        if (cStoreLayer === undefined) {
            map.addLayer({
                'id': cStoreLayerId,
                'source': cStoreSourceId,
                'type': 'symbol',
                'minzoom': 13,
                'layout': {
                    'icon-image': cStoreIconId,
                    'icon-size': 0.5,
                    'icon-allow-overlap': true
                },
            });
        }

        map.setLayoutProperty(cStoreLayerId, "visibility", (layerObj[cStoreLayerId].isEnable === true ? 'visible' : 'none'));
        retriveCStoreDataFromD365(map);
    }

    /**
     * This function is used to add custom layer
     * to populate over the "B" store icon on Map view.
     * @param map 
     */
    function addBStoreLayer(map: MapboxGl.Map) {
        let bStoreIconId = ImageId.B_STORE_ICON;
        let bStoreLayerId = LayerId.B_STORE_LAYER as LayerType;
        let bStoreSourceId = SourceId.B_STORE_SOURCE;

        map.loadImage(bStoreImg, (error: any, image: any) => {
            if (error) {
                return;
            }

            let hasStoreImage = map.hasImage(bStoreIconId);
            if (hasStoreImage === false) {
                map.addImage(bStoreIconId, image);
            }
        });

        let bStoreSource = map.getSource(bStoreSourceId);
        if (bStoreSource === undefined) {
            map.addSource(bStoreSourceId, {
                'type': 'geojson',
                'data': bStoreGeojson
            });
        }

        let bStoreLayer = map.getLayer(bStoreLayerId);
        if (bStoreLayer === undefined) {
            map.addLayer({
                'id': bStoreLayerId,
                'source': bStoreSourceId,
                'type': 'symbol',
                'minzoom': 13,
                'layout': {
                    'icon-image': bStoreIconId,
                    'icon-size': 0.5,
                    'icon-allow-overlap': true
                },
            });
        }

        map.setLayoutProperty(bStoreLayerId, "visibility", (layerObj[bStoreLayerId].isEnable === true ? 'visible' : 'none'));
        retriveBStoreDataFromD365(map);
    }

    /**
     * This function is used to add custom layer
     * to populate over the "D" store icon on Map view.
     * @param map 
     */
    function addDStoreLayer(map: MapboxGl.Map) {
        let dStoreIconId = ImageId.D_STORE_ICON;
        let dStoreLayerId = LayerId.D_STORE_LAYER as LayerType;
        let dStoreSourceId = SourceId.D_STORE_SOURCE;

        map.loadImage(dStoreImg, (error: any, image: any) => {
            if (error) {
                return;
            }

            let hasStoreImage = map.hasImage(dStoreIconId);
            if (hasStoreImage === false) {
                map.addImage(dStoreIconId, image);
            }
        });

        let dStoreSource = map.getSource(dStoreSourceId);
        if (dStoreSource === undefined) {
            map.addSource(dStoreSourceId, {
                'type': 'geojson',
                'data': dStoreGeojson
            });
        }

        let dStoreLayer = map.getLayer(dStoreLayerId);
        if (dStoreLayer === undefined) {
            map.addLayer({
                'id': dStoreLayerId,
                'source': dStoreSourceId,
                'type': 'symbol',
                'minzoom': 13,
                'layout': {
                    'icon-image': dStoreIconId,
                    'icon-size': 0.5,
                    'icon-allow-overlap': true
                },
            });
        }

        map.setLayoutProperty(dStoreLayerId, "visibility", (layerObj[dStoreLayerId].isEnable === true ? 'visible' : 'none'));
        retriveDStoreDataFromD365(map);
    }

    /**
     * This function is used to add custom layer
     * to populate over the "E" store icon on Map view.
     * @param map 
     */
    function addEStoreLayer(map: MapboxGl.Map) {
        let eStoreIconId = ImageId.E_STORE_ICON;
        let eStoreLayerId = LayerId.E_STORE_LAYER as LayerType;
        let eStoreSourceId = SourceId.E_STORE_SOURCE;

        map.loadImage(eStoreImg, (error: any, image: any) => {
            if (error) {
                return;
            }

            let hasStoreImage = map.hasImage(eStoreIconId);
            if (hasStoreImage === false) {
                map.addImage(eStoreIconId, image);
            }
        });

        let eStoreSource = map.getSource(eStoreSourceId);
        if (eStoreSource === undefined) {
            map.addSource(eStoreSourceId, {
                'type': 'geojson',
                'data': eStoreGeojson
            });
        }

        let eStoreLayer = map.getLayer(eStoreLayerId);
        if (eStoreLayer === undefined) {
            map.addLayer({
                'id': eStoreLayerId,
                'source': eStoreSourceId,
                'type': 'symbol',
                'minzoom': 13,
                'layout': {
                    'icon-image': eStoreIconId,
                    'icon-size': 0.5,
                    'icon-allow-overlap': true
                },
            });
        }

        map.setLayoutProperty(eStoreLayerId, "visibility", (layerObj[eStoreLayerId].isEnable === true ? 'visible' : 'none'));
        retriveEStoreDataFromD365(map);
    }

    /**
     * This function is used to add trade area
     * to populate over the circle and polygon on Map view.
     * @param map 
     */
    function addTradeAreaLayer(map: MapboxGl.Map) {
        retriveTradeAreaDataFromD365(map);
        // retriveTradeAreaDataFromMockList(map);
    }

    /**
     * This function is used to add control
     * to show the search box on Map view.
     * @param map 
     */
    function addGeoCoder(map: MapboxGl.Map) {
        const geocoder = new MapboxGeocoder({
            accessToken: MAPBOX_CONFIG.ACCESS_TOKEN,
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
        addAStoreLayer(map);
        addAStoreSelectionLayer(map);
        addTradeAreaLayer(map);
        addBStoreLayer(map);
        addCStoreLayer(map);
        addDStoreLayer(map);
        addEStoreLayer(map);

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

            if (layerId === LayerId.TRADE_AREA_LAYER) {
                showHideTradeAreaLayer(map, isVisible);
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
