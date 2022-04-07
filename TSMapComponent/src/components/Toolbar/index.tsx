import React, { useState, useContext, useEffect, useRef } from 'react';
import WebApiClient from 'xrm-webapi-client';
import * as turf from '@turf/turf';
import * as MapboxGl from 'mapbox-gl';
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic';

import handImg from './images/hand.png';
import infoImg from './images/info.png';
import pointImg from './images/point.png';
import deleteImg from './images/delete.png';
import refreshImg from './images/refresh-icon.png';
import storeReportImg from './images/report-for-store.png';
import tradeAreaReportImg from './images/report-for-trade-area.png';
import competitorAnalysisReportImg from './images/report-for-competitor-analysis.png';

import { mapboxReactContext } from 'components/MapboxContext';
import { layerReactContext, LayerType } from 'components/LayerContext';

import SpinnerFC from 'components/Spinner';
import ToolbarButtonFC from 'components/ToolbarButton';
import CustomPopupFC, { usePopup, AStorePopupFC, CompetitorStorePopupFC } from 'components/CustomPopup';
import ModalFC, { useModal, CircleModalFC, ConfirmationModalFC, CreateTradeAreaModalFC, ListOfHistoricalModalFC, SaveFootfallModalFC, CompetitorReportModalFC, BrandAffinityReportModalFC, AttributeErrorModalFC, CrmLicenseErrorModalFC, VerticesRestrictionErrorModalFC, SelfIntersectionErrorModalFC, SelectOnStoreErrorModalFC, RadiusRestrictionErrorModalFC, UnSavedShapeErrorModalFC, StatisticsReportErrorModalFC, NearApiErrorModalFC } from 'components/Modal';

import { GlDrawLayerId, GlDrawMode, GlDrawSourceId, LayerId, SourceId } from 'components/Map1/constants';
import { CompetitorStoreInfo, initialCompetitorStoreInfo, initialAStoreGeojsonInfo, initialPopulationInfo, PopulationInfo } from 'components/Map1/module';

import { mockHistoryList, mockTradeAreaList, mockCompetitorHistoryData } from './mock';
import { CircleInfo, ProcessedAStoreData, HistoryInfo, TradeAreaInfo, CompetitorReportHistoryInfo, DemographicLineDetails, CompetitorAnalysisInfo } from './module';
import { ButtonId, TradeAreaActionId, AStoreActionId, TooltipName, PowerBIReportType, ReportTypeValue, ProcessingStatusValue } from './constants';

type TradeAreaActionType = TradeAreaActionId.CREATE | TradeAreaActionId.UPDATE | TradeAreaActionId.DELETE;
type AStoreActionType = AStoreActionId.CREATE | AStoreActionId.UPDATE | AStoreActionId.DELETE;

export interface ToolbarProps {
}

export const ToolbarFC: React.FC<ToolbarProps> = (props => {
    const context = useContext(mapboxReactContext);
    const layerContext = useContext(layerReactContext);
    const { map, mapDraw } = context;
    const { layerObj, visibleLayers, updateIsRefreshAllLayers } = layerContext;

    // State Variables
    const [activeBtnId, setActiveBtnId] = useState<string>(ButtonId.HAND);
    const [isTriggerApi, setIsTriggerApi] = useState(false);
    const [filteredAStoreFeatures, setFilteredAStoreFeatures] = useState<MapboxGl.MapboxGeoJSONFeature[]>([]);
    const [aggregatedPopulationObj, setAggregatedPopulationObj] = useState<PopulationInfo>(initialPopulationInfo);
    const [aggregatedCompetitorStoreObj, setAggregatedCompetitorStoreObj] = useState<CompetitorStoreInfo>(initialCompetitorStoreInfo);
    const [isLoadingBiReport, setIsLoadingBiReport] = useState(false);
    const [nearApiErrorMessage, setNearApiErrorMessage] = useState<string | undefined>(undefined);

    const [tradeAreaApiActionType, setTradeAreaApiActionType] = useState<TradeAreaActionType | undefined>(undefined);
    const [tradeAreaFeature, setTradeAreaFeature] = useState<GeoJSON.Feature | undefined>(undefined);
    const [unSaveNewTradeAreaFeatureId, setUnSaveNewTradeAreaFeatureId] = useState<string | undefined>(undefined);
    const [unSaveModifyTradeAreaFeatureId, setUnSaveModifyTradeAreaFeatureId] = useState<string | undefined>(undefined);
    const [storeStatisticsCircleFeatureId, setStoreStatisticsCircleFeatureId] = useState<string | undefined>(undefined);
    const [selectedStatisticsFeature, setSelectedStatisticsFeature] = useState<GeoJSON.Feature | undefined>(undefined);
    const [tradeAreaStatisticsDashboardURL, setTradeAreaStatisticsDashboardURL] = useState<string>('');

    const [aStoreApiActionType, setAStoreApiActionType] = useState<AStoreActionType | undefined>(undefined);
    const [aStoreFeature, setAStoreFeature] = useState<GeoJSON.Feature | undefined>(undefined);
    const [mockAStoreFeature, setMockAStoreFeature] = useState<GeoJSON.Feature | undefined>(undefined);

    //Historical Modal
    const [historicalFootfallData, setHistoricalFootfallData] = useState<HistoryInfo[]>([]);
    const [selectedHistoricalDataGuid, setSelectedHistoricalDataGuid] = useState<string | undefined>(undefined);
    const [aStoreRecordCreationResponse, setAStoreRecordCreationResponse] = useState<any>(undefined);
    const [selectedReportType, setSelectedReportType] = useState<PowerBIReportType | undefined>(undefined);
    const [historyRecordName, setHistoryRecordName] = useState<string>('');

    const [tradeAreaRecordName, setTradeAreaRecordName] = useState<string>('');

    //Competitor Modal
    const [tradeAreaList, setTradeAreaList] = useState<TradeAreaInfo[]>([]);
    const [competitorRecordName, setCompetitorRecordName] = useState<string>('');
    const [competitorPeriodStartDate, setCompetitorPeriodStartDate] = useState<string>('');
    const [competitorPeriodEndDate, setCompetitorPeriodEndDate] = useState<string>('');
    const [competitorHistoryList, setCompetitorHistoryList] = useState<CompetitorReportHistoryInfo[]>([]);
    const [competitorMaxArea, setCompetitorMaxArea] = useState<number>(0);
    const [competitorNearApiFeatureList, setCompetitorNearApiFeatureList] = useState<GeoJSON.Feature[]>([]);
    const [competitorNearApiFeatureWithDemographicList, setCompetitorNearApiFeatureWithDemographicList] = useState<GeoJSON.Feature[]>([]);
    const [competitorSplitNearApiFeatureList, setCompetitorSplitNearApiFeatureList] = useState<GeoJSON.Feature[][]>([]);

    // Competitor analysis
    const [selectedTradeAreaList, setSelectedTradeAreaList] = useState<TradeAreaInfo[]>([]);
    const [competitorHistoryGuid, setCompetitorHistoryGuid] = useState<string | undefined>(undefined);
    const [competitorAnalysisDetailList, setCompetitorAnalysisDetailList] = useState<CompetitorAnalysisInfo[]>([]);
    const [competitorAnalysisDashboardURL, setCompetitorAnalysisDashboardURL] = useState<string>('');
    const [deleteStatisticsHistoryRecordGuid, setDeleteStatisticsHistoryRecordGuid] = useState<string>('');
    const [deleteCompetitorAnalysisHistoryHeaderGuid, setDeleteCompetitorAnalysisHistoryHeaderGuid] = useState<string>('');
    const [errorTradeAreaName, setErrorTradeAreaName] = useState<string>('');

    // Selected Trade Area List for Competitor Analysis - Near Api
    const [initialCompetitorSelectedTradeAreaGuids, setInitialCompetitorSelectedTradeAreaGuids] = useState<any[]>([]);
    const [completedCompetitorSelectedTradeAreaGuid, setCompletedCompetitorSelectedTradeAreaGuid] = useState<string>('');

    // Ref Variables
    let { current: pluginStartTimeRef } = useRef({
        statistics: undefined as Date | undefined,
        competitorAnalysis: undefined as Date | undefined,
        completedCompetitorSelectedTradeAreaGuidList: [] as string[],
    });
    const navigationRef = useRef<HTMLDivElement>(null);
    const { current: toggleBtnRef } = useRef({
        el: null as HTMLAnchorElement | null,
        /**
         * Add toggleButton anchor element
         * using callback method
         * @param HTMLAnchorElement | null
         */
        cb(el: HTMLAnchorElement | null): void {
            if (el !== null) {
                toggleBtnRef.el = el;
            } else {
                toggleBtnRef.el = null;
            }
        },
        /**
         * Add and Remove active class for
         * toolbar and navigation container
         * @param React.MouseEvent
         */
        onClick(e: React.MouseEvent): void {
            e.preventDefault();
            let el = toggleBtnRef.el;
            let navEl = navigationRef.current;
            let parentEl = e.currentTarget.closest(".toolbar-container");

            if ((el !== null) && (navEl !== null)) {
                let hasActive = el.classList.contains('active') ? true : false;
                if (hasActive) {
                    el.classList.remove('active');
                    navEl.classList.remove('active');
                    parentEl?.classList.remove('active');
                } else {
                    el.classList.add('active');
                    navEl.classList.add('active');
                    parentEl?.classList.add('active');
                }
            }
        }
    });
    const { current: btnObjRef } = useRef({
        mapOperation: {
            hand: {
                isEnable: false
            },
            zoomIn: {
                isEnable: false
            },
            zoomOut: {
                isEnable: false
            },
            info: {
                isEnable: false
            }
        },
        createTradeArea: {
            featureId: '',
            point: {
                isEnable: false
            },
            polygon: {
                isEnable: false
            },
            circle: {
                id: '',
                isEnable: false,
                center: [0, 0],
                radiusInKm: 0,
                storeFeatureId: ''
            } as CircleInfo,
        },
        modifyPolygonArea: {
            featureId: '',
            recordName: '',
            point: {
                isEnable: false,
                latitude: 0,
                longitude: 0
            },
            polygon: {
                isEnable: false
            },
            circle: {
                isEnable: false
            },
            delete: {
                isEnable: false,
            },
        },
        createStatistics: {
            arrow: {
                isEnable: false
            },
            report: {
                isEnable: false
            },
            storeReport: {
                isEnable: false,
                center: [0, 0],
                storeFeatureId: ''
            },
        }
    });
    const { current: mapEventRef } = useRef({
        canvas: undefined as HTMLElement | undefined,
        mapObj: undefined as MapboxGl.Map | undefined,
        unSaveAStoreFeatureId: undefined as string | undefined,
        /**
         * This function triggered on dragging
         * of "A" store icon
         * @param event
         */
        onMapMouseMove: (e: any) => {
            let { mapObj: map, canvas } = mapEventRef;
            if ((map === undefined) || (canvas === undefined)) {
                return;
            }

            // Set a UI indicator for dragging.
            canvas.style.cursor = "grabbing";

            let coords = e.lngLat;
            let newCoords = {
                latitude: coords["lat"],
                longitude: coords["lng"],
            };
            let { longitude, latitude } = newCoords;
            let { modifyPolygonArea } = btnObjRef;
            let { point: modifyPoint } = modifyPolygonArea;

            let unSaveFeatureId = modifyPolygonArea.featureId;
            modifyPoint.latitude = latitude;
            modifyPoint.longitude = longitude;

            mapEventRef.unSaveAStoreFeatureId = unSaveFeatureId;
            showUnSaveAStoreFeatureOnMap(map, unSaveFeatureId, latitude, longitude);
        },
        /**
         * This function triggered on dropping
         * of "A" store icon
         * @param event
         */
        onMapMouseUp: (e: any) => {
            let { mapObj: map, canvas } = mapEventRef;
            if ((map === undefined) || (canvas === undefined)) {
                return;
            }

            // Set a UI indicator for dragging.
            canvas.style.cursor = "";

            map.off('mousemove', mapEventRef.onMapMouseMove);
            // map.off('touchmove', mapEventRef.onMapMouseMove);

            let { modifyPolygonArea } = btnObjRef;

            if ((modifyPolygonArea.point.isEnable === true) && (mapEventRef.unSaveAStoreFeatureId !== undefined)) {
                storeModifyModalToggle();
            }
        },
    })

    // Create, Modify and Delete Modal
    const { isShown: isStoreModifyModalShown, toggle: storeModifyModalToggle } = useModal();
    const { isShown: isStoreDeleteModalShown, toggle: storeDeleteModalToggle } = useModal();
    const { isShown: isTradeAreaCreateModalShown, toggle: tradeAreaCreateModalToggle } = useModal();
    const { isShown: isTradeAreaModifyModalShown, toggle: tradeAreaModifyModalToggle } = useModal();
    const { isShown: isTradeAreaDeleteModalShown, toggle: tradeAreaDeleteModalToggle } = useModal();
    // Statistics Modal
    const { isShown: isStoreStatisticsModalShown, toggle: storeStatisticsModalToggle } = useModal();
    const { isShown: isTradeAreaStatisticsModalShown, toggle: tradeAreaStatisticsModalToggle } = useModal();
    // Circle Modal
    const { isShown: isCircleModalShown, toggle: circleModalToggle } = useModal();
    // Historical Modal
    const { isShown: isListOfHistoricalModalShown, toggle: listOfHistoricalModalToggle } = useModal();
    //const { isShown: isSaveFootfallDataModalShown, toggle: saveFootfallDataModalToggle } = useModal();
    const {isShown: isDeleteCompetitorModalShown, toggle: deleteCompetitorModalToggle} = useModal();
    const {isShown: isDeleteStatisticsModalShown, toggle: deleteStatisticsModalToggle} = useModal();
    //Competitor Report Modal
    const { isShown: isCompetitorReportModalShown, toggle: competitorReportModalToggle } = useModal();
    // Brand Affinity Report Modal
    const { isShown: isBrandAffinityReportModalShown, toggle: brandAffinityReportModalToggle } = useModal();
    // Error Modal
    const { isShown: isAttributeErrorModalShown, toggle: attributeErrorModalToggle } = useModal();
    const { isShown: isCrmLicenseErrorModalShown, toggle: crmLicenseErrorModalToggle } = useModal();
    const { isShown: isVerticesRestrictionErrorModalShown, toggle: verticesRestrictionErrorModalToggle } = useModal();
    const { isShown: isSelfIntersectionErrorModalShown, toggle: selfIntersectionErrorModalToggle } = useModal();
    const { isShown: isSelectOnStoreErrorModalShown, toggle: selectOnStoreErrorModalToggle } = useModal();
    const { isShown: isRadiusRestrictionErrorModalShown, toggle: radiusRestrictionErrorModalToggle } = useModal();
    const { isShown: isUnSavedShapeErrorModalShown, toggle: unSavedShapeErrorModalToggle } = useModal();
    const { isShown: isStatisticsReportErrorModalShown, toggle: statisticsReportErrorModalToggle } = useModal();
    const { isShown: isNearApiErrorModalShown, toggle: nearApiErrorModalToggle} = useModal();

    // Store Info Popup
    const { toggle: togglePopup } = usePopup();

    useEffect(() => {
        if (map !== undefined) {
            mapEventRef.mapObj = map;
            mapEventRef.canvas = map.getCanvasContainer();

            // add draw event handler
            map.on('draw.create', onDrawCreate);
            map.on('draw.delete', onDrawDelete);
            map.on('draw.update', onDrawUpdate);
            map.on('draw.selectionchange', onDrawSelectionChange);

            // Remove the existing click event
            map.off('click', LayerId.A_STORE_LAYER, onAStoreClick);
            map.off('click', LayerId.C_STORE_LAYER, onCStoreClick);
            map.off('click', LayerId.D_STORE_LAYER, onDStoreClick);
            map.off('click', LayerId.B_STORE_LAYER, onBStoreClick);
            map.off('click', LayerId.E_STORE_LAYER, onEStoreClick);
            map.off('click', GlDrawLayerId.GL_DRAW_POLYGON_FILL_INACTIVE_COLD, onGlDrawPolygonFillInActiveColdClick);
            map.off('click', GlDrawLayerId.GL_DRAW_POLYGON_STROKE_INACTIVE_COLD, onGlDrawPolygonStrokeInActiveColdClick);
            map.off('click', onMapClick);

            // add new click event
            map.on('click', LayerId.A_STORE_LAYER, onAStoreClick);
            map.on('click', LayerId.C_STORE_LAYER, onCStoreClick);
            map.on('click', LayerId.D_STORE_LAYER, onDStoreClick);
            map.on('click', LayerId.B_STORE_LAYER, onBStoreClick);
            map.on('click', LayerId.E_STORE_LAYER, onEStoreClick);
            map.on('click', GlDrawLayerId.GL_DRAW_POLYGON_FILL_INACTIVE_COLD, onGlDrawPolygonFillInActiveColdClick);
            map.on('click', GlDrawLayerId.GL_DRAW_POLYGON_STROKE_INACTIVE_COLD, onGlDrawPolygonStrokeInActiveColdClick);
            map.on('click', onMapClick);

            // Remove the existing double click event
            map.off('dblclick', GlDrawLayerId.GL_DRAW_POLYGON_FILL_ACTIVE_COLD, onGlDrawPolygonFillActiveColdDoubleClick);

            // add new double click event
            map.on('dblclick', GlDrawLayerId.GL_DRAW_POLYGON_FILL_ACTIVE_COLD, onGlDrawPolygonFillActiveColdDoubleClick);

            // Remove the existing right click event
            map.off('contextmenu', onMapRightClick);
            map.off('contextmenu', GlDrawLayerId.GL_DRAW_POLYGON_FILL_ACTIVE_HOT, onGlDrawPolygonFillActiveHotRightClick);
            map.off('contextmenu', GlDrawLayerId.GL_DRAW_POLYGON_FILL_ACTIVE_COLD, onGlDrawPolygonFillActiveColdRightClick);
            map.off('contextmenu', GlDrawLayerId.GL_DRAW_POLYGON_FILL_INACTIVE_COLD, onGlDrawPolygonFillInActiveColdRightClick);

            // add new right click event
            map.on('contextmenu', onMapRightClick);
            map.on('contextmenu', GlDrawLayerId.GL_DRAW_POLYGON_FILL_ACTIVE_HOT, onGlDrawPolygonFillActiveHotRightClick);
            map.on('contextmenu', GlDrawLayerId.GL_DRAW_POLYGON_FILL_ACTIVE_COLD, onGlDrawPolygonFillActiveColdRightClick);
            map.on('contextmenu', GlDrawLayerId.GL_DRAW_POLYGON_FILL_INACTIVE_COLD, onGlDrawPolygonFillInActiveColdRightClick);

            // Remove the existing mouse down event
            map.off('mousedown', LayerId.A_STORE_LAYER, onAStoreMouseDown);

            // add new mouse down event
            map.on('mousedown', LayerId.A_STORE_LAYER, onAStoreMouseDown);

            map.on('mousedown', function () {
                let { mapOperation } = btnObjRef;
                let { hand } = mapOperation;
                if (hand.isEnable === true) {
                    map.dragPan.enable();
                } else {
                    map.dragPan.disable();
                }
            });

            map.on('touchstart', function () {
                let { mapOperation } = btnObjRef;
                let { hand } = mapOperation;
                if (hand.isEnable === true) {
                    map.dragPan.enable();
                } else {
                    map.dragPan.disable();
                }
            });
            
            document.addEventListener("keydown", function(e: any) {
                let { createTradeArea } = btnObjRef;
                if (e.key === "Escape") {
                    if ((createTradeArea.polygon.isEnable === true) && (createTradeArea.featureId === '')) {
                        setTimeout(function(e: any){
                            setActiveBtnId('');
                        }, 500)
                    }
                }
            })
        }
    }, [mapDraw]);

    useEffect(() => {
        if (map === undefined) {
            return;
        }
        deselectAllToolbarButtons(map);
        let { mapOperation, createTradeArea, modifyPolygonArea, createStatistics } = btnObjRef;
        let { hand, zoomIn, zoomOut, info } = mapOperation;
        let { point: createPoint, polygon: createPolygon, circle: createCircle } = createTradeArea;
        let { point: modifyPoint, polygon: modifyPolygon, circle: modifyCircle, delete: drawDelete } = modifyPolygonArea;
        let { arrow, report, storeReport } = createStatistics;

        switch (activeBtnId) {
            case ButtonId.HAND:
                hand.isEnable = true;
                break;
            case ButtonId.ZOOM_IN:
                zoomIn.isEnable = true;
                break;
            case ButtonId.ZOOM_OUT:
                zoomOut.isEnable = true;
                break;
            case ButtonId.INFO:
                info.isEnable = true;
                map.getCanvas().style.cursor = "pointer";
                break;
            case ButtonId.CREATE_POINT:
                createPoint.isEnable = true;
                map.getCanvas().style.cursor = "pointer";
                break;
            case ButtonId.CREATE_POLYGON:
                createPolygon.isEnable = true;
                mapDraw?.changeMode(GlDrawMode.DRAW_POLYGON);
                break;
            case ButtonId.CREATE_CIRCLE:
                createCircle.isEnable = true;
                map.getCanvas().style.cursor = "pointer";
                break;
            case ButtonId.MODIFY_POINT:
                modifyPoint.isEnable = true;
                map.getCanvas().style.cursor = "pointer";
                break;
            case ButtonId.MODIFY_POLYGON:
                modifyPolygon.isEnable = true;
                map.getCanvas().style.cursor = "pointer";
                mapDraw?.changeMode(GlDrawMode.SIMPLE_SELECT);
                break;
            case ButtonId.MODIFY_CIRCLE:
                modifyCircle.isEnable = true;
                map.getCanvas().style.cursor = "pointer";
                mapDraw?.changeMode(GlDrawMode.SIMPLE_SELECT);
                break;
            case ButtonId.DRAW_DELETE:
                drawDelete.isEnable = true;
                map.getCanvas().style.cursor = "pointer";
                mapDraw?.changeMode(GlDrawMode.SIMPLE_SELECT);
                break;
            case ButtonId.SELECT:
                arrow.isEnable = true;
                break;
            case ButtonId.TRADE_AREA_CHART:
                report.isEnable = true;
                map.getCanvas().style.cursor = "pointer";
                mapDraw?.changeMode(GlDrawMode.SIMPLE_SELECT);
                break;
            case ButtonId.A_STORE_CHART:
                storeReport.isEnable = true;
                map.getCanvas().style.cursor = "pointer";
                break;
        }
    }, [map, activeBtnId]);

    useEffect(() => {
        if (activeBtnId !== ButtonId.HAND) {
            setActiveBtnId('');
        }
    }, [visibleLayers]);

    useEffect(() => {
        if (storeStatisticsCircleFeatureId !== undefined) {
            onStoreStatisticsFeatureApiCall();
        }
    }, [storeStatisticsCircleFeatureId]);

    useEffect(() => {
        if (isTriggerApi === true) {
            deleteAndCreateApiCall();
        }
    }, [filteredAStoreFeatures]);

    useEffect(() => {
        switch (tradeAreaApiActionType) {
            case TradeAreaActionId.CREATE:
                createTradeAreaApiCall(tradeAreaFeature);
                break;
            case TradeAreaActionId.UPDATE:
                updateTradeAreaApiCall(tradeAreaFeature);
                break;
            case TradeAreaActionId.DELETE:
                deleteTradeAreaApiCall(tradeAreaFeature);
                break;
        }
    }, [tradeAreaFeature]);

    useEffect(() => {
        switch (aStoreApiActionType) {
            case AStoreActionId.CREATE:
                createAStoreApiCall(aStoreFeature);
                break;
            case AStoreActionId.UPDATE:
                updateAStoreApiCall(aStoreFeature);
                break;
            case AStoreActionId.DELETE:
                deleteAStoreApiCall(aStoreFeature);
                break;
        }
    }, [aStoreFeature]);

    useEffect(() => {
        if (competitorNearApiFeatureList.length > 0) {
            updateDemographicLineToCompetitorSelectedTradeAreaFeatureList();
        }
    }, [competitorNearApiFeatureList]);

    useEffect(() => {
        if (competitorNearApiFeatureWithDemographicList.length > 0) {
            updateComptitorSplitSelectedTradeAreaFeatureList()
        }
    }, [competitorNearApiFeatureWithDemographicList]);

    useEffect(() => {
        if (competitorSplitNearApiFeatureList.length > 0) {
            deleteAndCreateCompetitorAnalysisApiCall();
        }
    }, [competitorSplitNearApiFeatureList]);

    useEffect(() => {
        if (competitorAnalysisDetailList.length > 0) {
            deleteAndCreateSelectedTradeAreaForCompetitorAnalysisApiCall();
        }
    }, [competitorAnalysisDetailList]);

    useEffect(() => {
        if (initialCompetitorSelectedTradeAreaGuids.length > 0) {
            for (let i = 0; i < initialCompetitorSelectedTradeAreaGuids.length; i++) {
                let guid = initialCompetitorSelectedTradeAreaGuids[i]
                checkCurrentSelectedTradeAreaPluginStatusById(guid);
            }
        }
    }, [initialCompetitorSelectedTradeAreaGuids]);

    useEffect(() => {
        let completedList = pluginStartTimeRef.completedCompetitorSelectedTradeAreaGuidList;
        if (completedCompetitorSelectedTradeAreaGuid !== '') {
            completedList.push(completedCompetitorSelectedTradeAreaGuid);
        }
        if (initialCompetitorSelectedTradeAreaGuids.length > 0 && completedList.length === initialCompetitorSelectedTradeAreaGuids.length) {
            createCompetitorAnalysisHistoryHeaderApiCall();
        }
    }, [completedCompetitorSelectedTradeAreaGuid]);

    useEffect(() => {
        if (competitorHistoryGuid !== undefined) {
            deleteAndCreateSelectedTradeAreaForCompetitorAnalysisApiCall();
        }
    }, [competitorHistoryGuid]);

    useEffect(() => {
        if ((selectedStatisticsFeature !== undefined) && (selectedHistoricalDataGuid !== undefined)) {
            let processedStoreDetails: ProcessedAStoreData = processFilteredAStores();
            deleteAndCreateSelectedTradeAreaForStatisticsApiCall(JSON.stringify(processedStoreDetails.nearAPIFeature)
                                    , JSON.stringify(processedStoreDetails.additionalReportDetails));
            setSelectedHistoricalDataGuid(undefined);
        }
    }, [selectedHistoricalDataGuid]);

    useEffect(() => {
        getTradeAreaStatisticsDashboardURL();
        getCompetitorAnalysisDashboardURL();
    }, []);

    useEffect(() => {
        if (errorTradeAreaName !== "") {
            alert("Please unselect " + errorTradeAreaName + " as the trade area is larger in size for the selected time period.");
            setErrorTradeAreaName("");
        }
    }, [errorTradeAreaName]);

    /**
     * This function is used to compare
     * two coordinates
     * @param Position
     * @param Position
     * @return Boolean value
     */
    function isSameCoordinates(a: GeoJSON.Position, b: GeoJSON.Position) {
        return Array.isArray(a) &&
          Array.isArray(b) &&
          a.length === b.length &&
          a.every((val, index) => val === b[index]);
    }

    /**
     * This function is used to find the
     * trade area layer is checked or not
     * @return Boolean value
     */
    function isVisibleTradeAreaLayer() {
        return layerObj[LayerId.TRADE_AREA_LAYER].isEnable ? true : false;
    }

    /**
     * This function is used to validate
     * the polygon trade area
     * @return Boolean value
     */
    function isValidPolygon(e: any) {
        let featureList = e.features;
        //checking whether polygon or circle
        if (featureList !== undefined) {
            let feature = featureList[0];
            let featureId = feature.id;
            if (feature.geometry.coordinates[0].length > 101) {
                verticesRestrictionErrorModalToggle()
                mapDraw.delete(featureId);
                return false;
            }

            let kinks = turf.kinks(feature);
            if (kinks.features.length !== 0) {
                selfIntersectionErrorModalToggle();
                mapDraw.delete(featureId);

                let feature = getTradeAreaFeatureById(featureId);
                if (feature !== undefined) {
                    mapDraw.add(feature);
                } else {
                    console.error('isValidPolygon - existing feature add error');
                }
                return false;
            }
        }
        return true;
    }

    /**
     * This function is used to find any
     * unsave circle is exist or not
     * @return Boolean value
     */
    function isUnSaveCircleExist() {
        let { createTradeArea } = btnObjRef;
        let { circle: createCircle } = createTradeArea;
        return createCircle.id !== '' ? true : false;
    }

    /**
     * This function is used to find any
     * unsave store, circle and polygon is exist or not
     * @return Boolean value
     */
    function isUnSaveFeatureExist() {
        let unSaveCircleExist = isUnSaveCircleExist();
        if ((unSaveNewTradeAreaFeatureId !== undefined) || (unSaveCircleExist === true)) {
            alert('You can save created trade area by right clicking the trade area');
            return true;
        }
        if (unSaveModifyTradeAreaFeatureId !== undefined) {
            alert('You can save modified polygon by right clicking the polygon');
            return true;
        }
        if (mapEventRef.unSaveAStoreFeatureId !== undefined) {
            alert('Please save the edited store A');
            return true;
        }
        return false;
    }

    /**
     * This function is used to find any
     * vertex changes (add/delete) is exist or not
     * @return Boolean value
     */
    function isAddOrDeleteVertexExist(id: string) {
        let existingFeature = getTradeAreaFeatureById(id);
        let updatedFeature = mapDraw.get(id);

        if ((existingFeature !== undefined) && (updatedFeature !== undefined)) {
            let existingGeometry: GeoJSON.Polygon = existingFeature.geometry as GeoJSON.Polygon;
            let existingCoordinates: GeoJSON.Position[] = existingGeometry.coordinates[0];

            let updatedGeometry: GeoJSON.Polygon = updatedFeature.geometry as GeoJSON.Polygon;
            let updatedCoordinates: GeoJSON.Position[] = updatedGeometry.coordinates[0];

            let addVertexList = filterAddedVertexList(existingCoordinates, updatedCoordinates);
            if (addVertexList.length > 0) {
                let sameCoordsOnBoth = findSameCoordsOnBoth(existingCoordinates, updatedCoordinates);
                let isDragged = sameCoordsOnBoth === undefined ? true : false;

                if (isDragged === true) {
                    return false;
                }
                return true;
            }
            
            let deleteVertexList = filterDeletedVertexList(existingCoordinates, updatedCoordinates);
            if (deleteVertexList.length > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * This function is used to find a new generated report
     * input parameters are valid or not
     * @param recordName string
     * @param fromDate date object
     * @param toDate date object
     * @return Boolean value
     */
    function isValidCompetitorReport(recordName: string, fromDate: Date, toDate: Date) {
        if (selectedTradeAreaList.length < 2) {
            alert("Please select minimum 2 trade areas");
            return false;
        }

        let today = new Date();
        validateReportDates(fromDate, toDate, today);

        // let diffTime = toDate.getTime() - fromDate.getTime();
        // let diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
        // if (diffDays > 13) {
        //     alert("Date interval is greater than 14 days");
        //     return false;
        // }

        let diffTimeToday = today.getTime() - toDate.getTime();
        let diffDaysToday = Math.floor(diffTimeToday / (1000 * 3600 * 24));
        if (diffDaysToday < 5) {
            alert("To date should be 5 days before today");
            return false;
        }

        if (recordName === '') {
            alert("Please enter the record name");
            return false;
        }
        return true;
    }

    function validateReportDates(fromDate: Date, toDate: Date, today: Date) {
        if (toDate > today) {
            alert("To date cannot be future date");
            return false;
        }

        if (fromDate > toDate) {
            alert("From date is greater than to date");
            return false;
        }

        return true;
    }

    /**
     * This function is used to get
     * the current login user id
     * @return user id
     */
    function getUserIdValue() {
        return Xrm.Page.context.getUserId().replace("{", "").replace("}", "");
    }

    /**
     * This function is used to get
     * the guid from response data
     * @param res web api response
     * @return guid
     */
    function getGUIDFromResponse(res: any) {
        return res.headers._headers.Location.slice(-37, -1);
    }

    /**
     * This function is used to get the "A"
     * store featureList from layer object
     * @return feature list of "A" store
     */
    function getAStoreFeatureList() {
        return layerObj[LayerId.A_STORE_LAYER].featureList;
    }

    /**
     * This function is used to set the new "A"
     * store featureList into layer object
     * @param feature list of "A" store
     */
    function setAStoreFeatureList(featureList: GeoJSON.Feature[]) {
        layerObj[LayerId.A_STORE_LAYER].featureList = featureList;
    }

    /**
     * This function is used to get the specified
     * "A" store feature from featureList
     * @param feature id
     * @return feature of "A" store
     */
    function getAStoreFeatureById(id: string) {
        return getAStoreFeatureList().find(f => f.id === id);
    }

    /**
     * This function is used to add the new
     * "A" store feature into featureList
     * @param geojson
     */
    function addAStoreFeatureList(geojson: any) {
        layerObj[LayerId.A_STORE_LAYER].featureList.push(geojson as any);
        showAStoreFeatureOnMap();
    }

    /**
     * This function is used to delete the specified
     * "A" store feature from featureList
     * @param geojson
     */
    function deleteAStoreFeatureList(geojson: any) {
        let featureList = getAStoreFeatureList();
        let deletedFeatureIndex = featureList.findIndex(f => f.id === geojson.id);
        layerObj[LayerId.A_STORE_LAYER].featureList.splice(deletedFeatureIndex, 1);
        showAStoreFeatureOnMap();
    }

    /**
     * This function is used to update the specified
     * "A" store feature in featureList
     * @param geojson
     */
    function updateAStoreFeatureList(geojson: any) {
        let featureList = getAStoreFeatureList();
        let updatedFeatureList = featureList.map(f => {
            if (f.id === geojson.id) {
                f = geojson;
            }
            return f;
        });
        setAStoreFeatureList(updatedFeatureList);
        showAStoreFeatureOnMap();
    }

    /**
     * This function is used to get the
     * trade area featureList from layer object
     * @return feature list of trade area
     */
    function getTradeAreaFeatureList() {
        return layerObj[LayerId.TRADE_AREA_LAYER].featureList;
    }

    /**
     * This function is used to get the specified
     * trade area feature from featureList
     * @param feature id
     * @return feature of trade area
     */
    function getTradeAreaFeatureById(id: string) {
        let featureList = getTradeAreaFeatureList();
        return featureList.find(f => f.id === id);
    }
    
    /**
     * This function is used to set the new
     * trade area featureList into layer object
     * @param feature list of trade area
     */
    function setTradeAreaFeatureList(list: GeoJSON.Feature[]) {
        layerObj[LayerId.TRADE_AREA_LAYER].featureList = list;
    }
    
    /**
     * This function is used to add the new
     * trade area feature into featureList
     * @param feature
     */
    function addTradeAreaFeatureList(feature: GeoJSON.Feature) {
        layerObj[LayerId.TRADE_AREA_LAYER].featureList.push(feature);
    }
    
    /**
     * This function is used to delete the specified
     * trade area feature from featureList
     * @param feature id
     */
    function deleteTradeAreaFeatureList(featureId: string) {
        let featureList = getTradeAreaFeatureList();
        let deletedFeatureIndex = featureList.findIndex(f => f.id === featureId);
        layerObj[LayerId.TRADE_AREA_LAYER].featureList.splice(deletedFeatureIndex, 1);
    }
    
    /**
     * This function is used to update the specified
     * trade area feature in featureList
     * @param feature
     */
    function updateTradeAreaFeatureList(feature: GeoJSON.Feature) {
        let featureList = getTradeAreaFeatureList();
        featureList = featureList.map((f) => {
            if (f.id === feature.id) {
                f = feature;
            }
            return f;
        });
        setTradeAreaFeatureList(featureList);
    }

    /**
     * This function is used to get the Near Api Request
     * Details along with Guid information like TradeArea,
     * Demographic, Competitor Analysis entity...
     * @param splitNearApiFeatureList List Near Api Features per request
     * @return CompetitorAnalysisInfo - competitor analysis information details
     */
    function getCompetitorAnalysisNearApiRequestDetailList(splitNearApiFeatureList: GeoJSON.Feature[]): CompetitorAnalysisInfo[] {
        let nearApiRequestDetails: CompetitorAnalysisInfo[] = [];
        for (let i = 0; i < splitNearApiFeatureList.length; i++) {
            let nearApiFeature = splitNearApiFeatureList[i];
            let competitorAnalysisObj = competitorAnalysisDetailList.find(ca => ca.crcef_tradeareareference === nearApiFeature.id) as CompetitorAnalysisInfo;
            nearApiRequestDetails.push(competitorAnalysisObj);
        }
        return nearApiRequestDetails;
    }

    /**
     * This function is used to get
     * Competitor Analysis Dashboard URL
     */
    function getCompetitorAnalysisDashboardURL() {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_configuration","?$filter=crcef_entityschemaname eq 'Store Locator Configuration'")
            .then(function (response) {
                // Process response
                let url = response.entities[0].crcef_competitortradeareacoverageappid;
                setCompetitorAnalysisDashboardURL(url);
            })
            .catch(function (error) {
                // Handle error
                console.log(error)
            });
    }

    /**
     * This function is used to get
     * Trade Area Statistics Dashboard URL
     */
    function getTradeAreaStatisticsDashboardURL() {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_configuration","?$filter=crcef_entityschemaname eq 'Store Locator Configuration'")
            .then(function (response) {
                // Process response
                let url = response.entities[0].crcef_tradeareastatisticsappurl;
                setTradeAreaStatisticsDashboardURL(url);
            })
            .catch(function (error) {
                // Handle error
                console.log(error)
            });
    }

    /**
     * This function is used to fit the specified
     * trade area feature on Mapbox view
     */
    function setMapFitBoundsOnStatistics(options?: MapboxGl.FitBoundsOptions) {
        if (map === undefined) {
            return;
        }

        let selectedFeatureId = mapDraw.getSelectedIds()[0];
        if (selectedFeatureId !== undefined) {
            let bbox: any;
            let selectedFeature = mapDraw.get(selectedFeatureId);
            selectedFeature = JSON.parse(JSON.stringify(selectedFeature));

            let isCicle = MapboxDrawGeodesic.isCircle(selectedFeature);
            if (isCicle === true) {
                let circleProp = selectedFeature.properties;
                let circleGeom = selectedFeature.geometry as GeoJSON.Polygon;

                let circleCoordinates = circleGeom.coordinates[0];
                let circleCenterPoint = circleCoordinates[0];
                let circleRadiusInKm = circleProp === null ? 0 : circleProp.circleRadius;

                let turfPoint = turf.point(circleCenterPoint);
                let turfBuffered = turf.buffer(turfPoint, circleRadiusInKm, {units:'kilometers'});

                bbox = turf.bbox(turfBuffered);
            } else {
                bbox = turf.bbox(selectedFeature);
            }
            
            let defaultOptions = {
                padding: {top: 15, bottom: 80, left: 15, right: 5}
            };
            let fitBoundOptions = (options !== undefined) ? options: defaultOptions;
            map?.fitBounds(bbox, fitBoundOptions);
        }
    }

    /**
     * This function is used to reset all the
     * values buttons and button refs object
     * @param Map object
     */
    function deselectAllToolbarButtons(map: MapboxGl.Map) {
        let { mapOperation, createTradeArea, modifyPolygonArea, createStatistics } = btnObjRef;
        let { hand, zoomIn, zoomOut, info } = mapOperation;
        hand.isEnable = false;
        zoomIn.isEnable = false;
        zoomOut.isEnable = false;
        info.isEnable = false;

        let { point: createPoint, polygon: createPolygon, circle: createCircle } = createTradeArea;
        createPoint.isEnable = false;
        createPolygon.isEnable = false;
        createCircle.isEnable = false;

        let { point: modifyPoint, polygon: modifyPolygon, circle: modifyCircle, delete: drawDelete } = modifyPolygonArea;
        modifyPoint.isEnable = false;
        modifyPolygon.isEnable = false;
        modifyCircle.isEnable = false;
        drawDelete.isEnable = false;

        let { arrow, report, storeReport } = createStatistics;
        arrow.isEnable = false;
        report.isEnable = false;
        storeReport.isEnable = false;

        map.getCanvas().style.cursor = "";
        mapDraw?.changeMode(GlDrawMode.STATIC);
        modifyPolygonArea.featureId = "";
        togglePopup(undefined);
    }

    /**
     * This function is used to reset the
     * create circle reference object values
     */
    function resetCreateCircleRefValue() {
        let { createTradeArea } = btnObjRef;
        let { circle: createCircle } = createTradeArea;
        createCircle.id = "";
        createCircle.center = [0, 0];
        createCircle.radiusInKm = 0;
        createCircle.storeFeatureId = "";
    }

    /**
     * This function is used to reset the
     * modify point reference object values
     */
    function resetModifyPointRefValue() {
        let { modifyPolygonArea } = btnObjRef;
        let { point: modifyPoint } = modifyPolygonArea;
        modifyPoint.latitude = 0;
        modifyPoint.longitude = 0;
        modifyPolygonArea.featureId = "";
        mapEventRef.unSaveAStoreFeatureId = undefined;
    }

    /**
     * This function is used to reset the
     * store statistics reference object values
     */
    function resetStoreStatesticsRefValue() {
        let { modifyPolygonArea, createStatistics } = btnObjRef;
        let { storeReport } = createStatistics;
        storeReport.center = [0, 0];
        modifyPolygonArea.featureId = "";
    }

    /**
     * This function is used to reset the
     * Competetior Selected TradeArea Guid List values
     */
    function resetCompletedCompetetiorSelectedTradeAreaGuidRefValue() {
        pluginStartTimeRef.completedCompetitorSelectedTradeAreaGuidList = [];
    }

    /**
     * This function is used to reset the
     * "A" store selected layer data
     */
    function removeAStoreSelectedIcon() {
        if (map === undefined) {
            return;
        }

        let aStoreSelectedGeojson = {
            'type': 'FeatureCollection',
            'features': [],
        } as any;

        let source = map.getSource(SourceId.A_STORE_SELECTION_SOURCE) as any;
        source.setData(aStoreSelectedGeojson);
    }

    /**
     * This function is used to get the
     * selected drawn circle features from
     * either Trade Area Layer/Source
     * @param Map object
     */
    function getSelectedDrawnCircleFeatures(map: MapboxGl.Map) {
        let selectedDrawnFeatures = map.queryRenderedFeatures(undefined, { layers: [GlDrawLayerId.GL_DRAW_POLYGON_FILL_ACTIVE_COLD]});

        if (selectedDrawnFeatures.length === 0 && btnObjRef.createStatistics.storeReport.isEnable === true) {
            selectedDrawnFeatures = map.querySourceFeatures(GlDrawSourceId.MAPBOX_GL_DRAW_COLD);
        }
        return selectedDrawnFeatures;
    }

    /**
     * This function is used to construct the
     * circle geometry coordinates
     * @param Map object
     * @param Geojson feature
     * @return Geojson feature
     */
    function constructCircleCoordinates(map: MapboxGl.Map, feature: GeoJSON.Feature) {
        let circleFeature = undefined;
        let selectedDrawnFeatures = getSelectedDrawnCircleFeatures(map);
        let filteredSelectedDrawnFeatures = selectedDrawnFeatures.filter((f: MapboxGl.MapboxGeoJSONFeature) => (f.properties as any).id === feature.id);

        if (filteredSelectedDrawnFeatures.length > 0) {
            circleFeature = filteredSelectedDrawnFeatures.reduce((prev, current) => {
                let prevGeomCoordsLength = (prev.geometry as GeoJSON.Polygon).coordinates[0].length;
                let currentGeomCoordsLength = (current.geometry as GeoJSON.Polygon).coordinates[0].length;
                return (prevGeomCoordsLength > currentGeomCoordsLength) ? prev : current;
            });
        }
        if (circleFeature !== undefined) {
            let circleGeometry: GeoJSON.Polygon = circleFeature.geometry as GeoJSON.Polygon;
            let circleCoordinates: GeoJSON.Position[][] = circleGeometry.coordinates.slice();

            (feature.geometry as GeoJSON.Polygon).coordinates = JSON.parse(JSON.stringify(circleCoordinates));
        }
        return feature;
    }

    /**
     * This function is used to construct the
     * feature list along with circle geometry coordinates
     * @param Map object
     * @param selected trade area feature list
     * @return selected trade area feature list
     */
    function constructPolygonFeatureList(map: MapboxGl.Map, selectedTradeAreaFeatures: any) {
        let featureList = selectedTradeAreaFeatures.filter((f: GeoJSON.Feature) => f.geometry.type.toLowerCase() === 'polygon' || f.geometry.type.toLowerCase() === 'circle');

        let newFeatureList = featureList.map((f: GeoJSON.Feature) => {
            let isCicle = MapboxDrawGeodesic.isCircle(f);
            if (isCicle === true) {
                f = constructCircleCoordinates(map, f);
            }
            return f;
        });
        return newFeatureList;
    }

    /**
     * This function is used to construct the
     * population object
     * @param Map object
     * @param polygon feature list
     * @return population info object
     */
    function constructPopulationObj(map: MapboxGl.Map, polygonFeatureList: GeoJSON.Feature[]): PopulationInfo {
        let getTotalCountByLayerIds = (layers: LayerType[], propName: string) => {
            let filterdPopulationFeatureList = filterPopulationDataWithInPolygonByLayerIds(layers, map, polygonFeatureList);

            let totalCount = 0;
            filterdPopulationFeatureList.forEach((f) => {
                if (f.properties !== null) {
                    let count = f.properties[propName];
                    if (count >= 0) {
                        totalCount += count;
                    }
                }
            });
            return totalCount;
        };
        let getTotalAge0ByLayers = (layers: LayerType[]) => {
            return Math.ceil(
                getTotalCountByLayerIds(layers, 'age0')
            );
        };
        let getTotalAge1_10ByLayers = (layers: LayerType[]) => {
            return Math.ceil(
                getTotalCountByLayerIds(layers, 'age1')
                + getTotalCountByLayerIds(layers, 'age10')
            );
        };
        let getTotalAge10_20ByLayers = (layers: LayerType[]) => {
            return Math.ceil(
                getTotalCountByLayerIds(layers, 'age15')
                + getTotalCountByLayerIds(layers, 'age20')
            );
        };
        let getTotalAge20_30ByLayers = (layers: LayerType[]) => {
            return Math.ceil(
                getTotalCountByLayerIds(layers, 'age25')
                + getTotalCountByLayerIds(layers, 'age30')
            );
        };
        let getTotalAge30_40ByLayers = (layers: LayerType[]) => {
            return Math.ceil(
                getTotalCountByLayerIds(layers, 'age35')
                + getTotalCountByLayerIds(layers, 'age40')
            );
        };
        let getTotalAge40_50ByLayers = (layers: LayerType[]) => {
            return Math.ceil(
                getTotalCountByLayerIds(layers, 'age45')
                + getTotalCountByLayerIds(layers, 'age50')
            );
        };
        let getTotalAge50_60ByLayers = (layers: LayerType[]) => {
            return Math.ceil(
                getTotalCountByLayerIds(layers, 'age55')
                + getTotalCountByLayerIds(layers, 'age60')
            );
        };
        let getTotalAge60_70ByLayers = (layers: LayerType[]) => {
            return Math.ceil(
                getTotalCountByLayerIds(layers, 'age65')
                + getTotalCountByLayerIds(layers, 'age70')
            );
        };
        let getTotalAge70_80ByLayers = (layers: LayerType[]) => {
            return Math.ceil(
                getTotalCountByLayerIds(layers, 'age75')
                + getTotalCountByLayerIds(layers, 'age80')
            );
        };
        let getTotalManZero = () => {
            let layers: LayerType[] = [LayerId.TOTAL_MALE_POPULATION];
            return getTotalAge0ByLayers(layers);
        };
        let getTotalManTen = () => {
            let layers: LayerType[] = [LayerId.TOTAL_MALE_POPULATION];
            return getTotalAge1_10ByLayers(layers);
        };
        let getTotalManTwenty = () => {
            let layers: LayerType[] = [LayerId.TOTAL_MALE_POPULATION];
            return getTotalAge10_20ByLayers(layers);
        };
        let getTotalManThirty = () => {
            let layers: LayerType[] = [LayerId.TOTAL_MALE_POPULATION];
            return getTotalAge20_30ByLayers(layers);
        };
        let getTotalManFourty = () => {
            let layers: LayerType[] = [LayerId.TOTAL_MALE_POPULATION];
            return getTotalAge30_40ByLayers(layers);
        };
        let getTotalManFifty = () => {
            let layers: LayerType[] = [LayerId.TOTAL_MALE_POPULATION];
            return getTotalAge40_50ByLayers(layers);
        };
        let getTotalManSixty = () => {
            let layers: LayerType[] = [LayerId.TOTAL_MALE_POPULATION];
            return getTotalAge50_60ByLayers(layers);
        };
        let getTotalManSeventy = () => {
            let layers: LayerType[] = [LayerId.TOTAL_MALE_POPULATION];
            return getTotalAge60_70ByLayers(layers);
        };
        let getTotalManEighty = () => {
            let layers: LayerType[] = [LayerId.TOTAL_MALE_POPULATION];
            return getTotalAge70_80ByLayers(layers);
        };
        let getTotalWomanZero = () => {
            let layers: LayerType[] = [LayerId.TOTAL_FEMALE_POPULATION];
            return getTotalAge0ByLayers(layers);
        };
        let getTotalWomanTen = () => {
            let layers: LayerType[] = [LayerId.TOTAL_FEMALE_POPULATION];
            return getTotalAge1_10ByLayers(layers);
        };
        let getTotalWomanTwenty = () => {
            let layers: LayerType[] = [LayerId.TOTAL_FEMALE_POPULATION];
            return getTotalAge10_20ByLayers(layers);
        };
        let getTotalWomanThirty = () => {
            let layers: LayerType[] = [LayerId.TOTAL_FEMALE_POPULATION];
            return getTotalAge20_30ByLayers(layers);
        };
        let getTotalWomanFourty = () => {
            let layers: LayerType[] = [LayerId.TOTAL_FEMALE_POPULATION];
            return getTotalAge30_40ByLayers(layers);
        };
        let getTotalWomanFifty = () => {
            let layers: LayerType[] = [LayerId.TOTAL_FEMALE_POPULATION];
            return getTotalAge40_50ByLayers(layers);
        };
        let getTotalWomanSixty = () => {
            let layers: LayerType[] = [LayerId.TOTAL_FEMALE_POPULATION];
            return getTotalAge50_60ByLayers(layers);
        };
        let getTotalWomanSeventy = () => {
            let layers: LayerType[] = [LayerId.TOTAL_FEMALE_POPULATION];
            return getTotalAge60_70ByLayers(layers);
        };
        let getTotalWomanEighty = () => {
            let layers: LayerType[] = [LayerId.TOTAL_FEMALE_POPULATION];
            return getTotalAge70_80ByLayers(layers);
        };
        let getTotalMalePopulation = () => {
            return totalMan0 + totalMan10 + totalMan20 + totalMan30 + totalMan40 + totalMan50 + totalMan60 + totalMan70 + totalMan80;
        };
        let getTotalFemalePopulation = () => {
            return totalWoman0 + totalWoman10 + totalWoman20 + totalWoman30 + totalWoman40 + totalWoman50 + totalWoman60 + totalWoman70 + totalWoman80;
        };

        let totalMan0 = getTotalManZero();
        let totalMan10 = getTotalManTen();
        let totalMan20 = getTotalManTwenty();
        let totalMan30 = getTotalManThirty();
        let totalMan40 = getTotalManFourty();
        let totalMan50 = getTotalManFifty();
        let totalMan60 = getTotalManSixty();
        let totalMan70 = getTotalManSeventy();
        let totalMan80 = getTotalManEighty();
        let totalWoman0 = getTotalWomanZero();
        let totalWoman10 = getTotalWomanTen();
        let totalWoman20 = getTotalWomanTwenty();
        let totalWoman30 = getTotalWomanThirty();
        let totalWoman40 = getTotalWomanFourty();
        let totalWoman50 = getTotalWomanFifty();
        let totalWoman60 = getTotalWomanSixty();
        let totalWoman70 = getTotalWomanSeventy();
        let totalWoman80 = getTotalWomanEighty();
        let totalMalePopulation = getTotalMalePopulation();
        let totalFemalePopulation = getTotalFemalePopulation();
        let totalPopulation = totalMalePopulation + totalFemalePopulation;

        return {
            man0: totalMan0,
            man10: totalMan10,
            man20: totalMan20,
            man30: totalMan30,
            man40: totalMan40,
            man50: totalMan50,
            man60: totalMan60,
            man70: totalMan70,
            man80: totalMan80,
            woman0: totalWoman0,
            woman10: totalWoman10,
            woman20: totalWoman20,
            woman30: totalWoman30,
            woman40: totalWoman40,
            woman50: totalWoman50,
            woman60: totalWoman60,
            woman70: totalWoman70,
            woman80: totalWoman80,
            total: totalPopulation,
            males: totalMalePopulation,
            females: totalFemalePopulation,
        };
    }

    /**
     * This function is used to construct the
     * competitor store object
     * @param Map object
     * @param polygon feature list
     * @return competitor store info object
     */
    function constructCompetitorStoreObj(map: MapboxGl.Map, polygonFeatureList: GeoJSON.Feature[]): CompetitorStoreInfo {
        let getTotalStoreByLayerIds = (layers: LayerType[]) => {
            let filterdCompetitorStoreFeatureList = filterCompetitorStoreDataWithInPolygonByLayerIds(layers, map, polygonFeatureList);
            return filterdCompetitorStoreFeatureList.length;
        };
        let getTotalDStore = () => {
            let layers: LayerType[] = [LayerId.D_STORE_LAYER];
            return getTotalStoreByLayerIds(layers);
        };
        let getTotalCStore = () => {
            let layers: LayerType[] = [LayerId.C_STORE_LAYER];
            return getTotalStoreByLayerIds(layers);
        };
        let getTotalBStore = () => {
            let layers: LayerType[] = [LayerId.B_STORE_LAYER];
            return getTotalStoreByLayerIds(layers);
        };
        let getTotalEStore = () => {
            let layers: LayerType[] = [LayerId.E_STORE_LAYER];
            return getTotalStoreByLayerIds(layers);
        };
        let totalBStore = getTotalBStore();
        let totalCStore = getTotalCStore();
        let totalDStore = getTotalDStore();
        let totalEStore = getTotalEStore();
        let totalCompetitiores = totalBStore + totalCStore + totalDStore + totalEStore;
        return {
            bStore: totalBStore,
            cStore: totalCStore,
            dStore: totalDStore,
            eStore: totalEStore,
            tatal: totalCompetitiores,
        };
    }

    function constructCompetitorAnalysisObj(guid: string, nearApiFeature: GeoJSON.Feature): CompetitorAnalysisInfo {
        let tradeAreaGuid = nearApiFeature.id as string;
        let property: any = nearApiFeature.properties;
        // let demographicLineGuid = (property.demographicLineGuid === undefined) ? '' : property.demographicLineGuid;

        return {
            crcef_competitoranalysisid: guid,
            crcef_tradearea: property.name,
            crcef_tradeareareference: tradeAreaGuid,
            // crcef_demographiclinereference: demographicLineGuid,
        };
    }

    /**
     * This function is used to find the
     * equal coords between existing and updated one
     * @param existing coords (Position array)
     * @param updated coords (Position array)
     * @return equal coord (Position) | undefined
     */
    function findSameCoordsOnBoth(existingCoords: GeoJSON.Position[], updatedCoords: GeoJSON.Position[]) {
        let sameCoordsOnBoth = updatedCoords.find(function (updatedCoord) {
            let isCoordExist = existingCoords.some(function (existCoord) {
                return isSameCoordinates(updatedCoord, existCoord);
            });
            return isCoordExist === true;
        });
        return sameCoordsOnBoth;
    }

    /**
     * This function is used to filter the
     * list of new vertexes
     * @param existing coords (Position array)
     * @param updated coords (Position array)
     * @return list of new vertexes
     */
    function filterAddedVertexList(existingCoords: GeoJSON.Position[], updatedCoords: GeoJSON.Position[]) {
        let addedVertexes = updatedCoords.filter(function (updatedCoord) {
            let isCoordExist = existingCoords.some(function (existCoord) {
                return isSameCoordinates(updatedCoord, existCoord);
            });
            return isCoordExist === false;
        });
        return addedVertexes;
    }

    /**
     * This function is used to filter the
     * list of deleted vertexes
     * @param existing coords (Position array)
     * @param updated coords (Position array)
     * @return list of deleted vertexes
     */
    function filterDeletedVertexList(existingCoords: GeoJSON.Position[], updatedCoords: GeoJSON.Position[]) {
        let deletedVertexes =  existingCoords.filter(function (existCoord) {
            let isCoordExist = updatedCoords.some(function (updatedCoord) {
                return isSameCoordinates(existCoord, updatedCoord);
            });
            return isCoordExist === false;
        });
        return deletedVertexes;
    }

    /**
     * This function is used to filter the
     * competitor store inside trade area (circle or polygon)
     * @param list of competitor layers
     * @param Map object
     * @param lost of polygon features
     * @return list of competitor store features
     */
    function filterCompetitorStoreDataWithInPolygonByLayerIds(competitorLayerList: LayerType[], map: MapboxGl.Map, polygonFeatureList: GeoJSON.Feature[]) {
        let filteredCompetitorStoreFeatureList: MapboxGl.MapboxGeoJSONFeature[] = [];
        if (polygonFeatureList.length > 0) {
            let competitorStoreFeatureList = map.queryRenderedFeatures(undefined, { layers: competitorLayerList });
            let competitorStoreFeatureListCollection = {
                "type": "FeatureCollection",
                "features": competitorStoreFeatureList
            } as any;
            let drawnFeatureListCollection = {
                "type": "FeatureCollection",
                "features": polygonFeatureList
            } as any;

            let filteredCompetitorStoreFeatureCollection = turf.pointsWithinPolygon(competitorStoreFeatureListCollection, drawnFeatureListCollection);
            filteredCompetitorStoreFeatureList = filteredCompetitorStoreFeatureCollection.features as MapboxGl.MapboxGeoJSONFeature[];
        }
        return filteredCompetitorStoreFeatureList;
    }

    /**
     * This function is used to filter the
     * population data inside trade area (circle or polygon)
     * @param list of population layers
     * @param Map object
     * @param lost of polygon features
     * @return list of population features
     */
    function filterPopulationDataWithInPolygonByLayerIds(populationLayerList: LayerType[], map: MapboxGl.Map, polygonFeatureList: GeoJSON.Feature[]) {
        let filteredPopulationFeatureList: MapboxGl.MapboxGeoJSONFeature[] = [];
        if (polygonFeatureList.length > 0) {
            let populationFeatureList = map.queryRenderedFeatures(undefined, { layers: populationLayerList });
            let populationFeatureListCollection = {
                "type": "FeatureCollection",
                "features": populationFeatureList
            } as any;
            let drawnFeatureListCollection = {
                "type": "FeatureCollection",
                "features": polygonFeatureList
            } as any;

            let filteredPopulationFeatureCollection = turf.pointsWithinPolygon(populationFeatureListCollection, drawnFeatureListCollection);
            filteredPopulationFeatureList = filteredPopulationFeatureCollection.features as MapboxGl.MapboxGeoJSONFeature[];
        }
        return filteredPopulationFeatureList;
    }

    /**
     * This function is used to filter the
     * "A" store inside trade area (circle or polygon)
     * @param Map object
     * @param lost of polygon features
     * @return list of "A" store features
     */
    function filterStoreDataWithInPolygon(map: MapboxGl.Map, polygonFeatureList: GeoJSON.Feature[]) {
        let filteredStoreFeatureList: MapboxGl.MapboxGeoJSONFeature[] = [];
        if (polygonFeatureList.length > 0) {
            // get all the features on the map
            let storeFeatureList = map.queryRenderedFeatures(undefined, { layers: [LayerId.A_STORE_LAYER] });
            let storeFeatureListCollection = {
                "type": "FeatureCollection",
                "features": storeFeatureList
            } as any;
            // all the features drawn on the map except point
            let drawnFeatureListCollection = {
                "type": "FeatureCollection",
                "features": polygonFeatureList
            } as any;

            let filteredStoreFeatureCollection = turf.pointsWithinPolygon(storeFeatureListCollection, drawnFeatureListCollection);
            filteredStoreFeatureList = filteredStoreFeatureCollection.features as MapboxGl.MapboxGeoJSONFeature[];
        }
        return filteredStoreFeatureList;
    }

    /**
     * This function is used to set the state value of
     * trade area api action name and feature
     * @param action name
     * @param geojson feature
     */
    function triggerTradeAreaApiActions(actionName: TradeAreaActionType, feature: GeoJSON.Feature) {
        setTradeAreaApiActionType(actionName);
        setTradeAreaFeature(JSON.parse(JSON.stringify(feature)));
    }

    /**
     * This function is used to set the state value of
     * "A" store api action name and feature
     * @param action name
     * @param geojson feature
     */
    function triggerAStoreApiActions(actionName: AStoreActionType, feature: GeoJSON.Feature) {
        setAStoreApiActionType(actionName);
        setAStoreFeature(JSON.parse(JSON.stringify(feature)));
    }

    /**
     * This function is used to set the state value of
     * aggregated population and competitor store object and
     * filtered "A" store feature list
     * @param filtered "A" store feature list
     * @param aggregated population object
     * @param aggregated competitor store object
     */
    function triggerTradeAreaStatisticsApiAction(featureList: MapboxGl.MapboxGeoJSONFeature[], populationObj: PopulationInfo, competitorObj: CompetitorStoreInfo) {
        setIsTriggerApi(true);
        setAggregatedPopulationObj(populationObj);
        setAggregatedCompetitorStoreObj(competitorObj);
        setFilteredAStoreFeatures(featureList);
    }

    /**
     * This function is used to show all the
     * "A" store feature on mapbox view
     */
    function showAStoreFeatureOnMap() {
        if (map == undefined) {
            return;
        }
        let aStoreFeatureList = getAStoreFeatureList();
        let aStoreGeojson = {
            'type': 'FeatureCollection',
            'features': aStoreFeatureList,
        } as any;
        
        let source = map.getSource(SourceId.A_STORE_SOURCE) as any;
        source.setData(aStoreGeojson);
    }

    /**
     * This function is used to show unsave
     * "A" store feature on mapbox view
     * @param Map object
     * @param unsave feature id
     * @param latitude
     * @param longitude
     */
    function showUnSaveAStoreFeatureOnMap(map: MapboxGl.Map, unSaveFeatureId: string, latitude: number, longitude: number) {
        let aStoreFeatureList = getAStoreFeatureList().slice();
        let unSaveAStoreFeatureList = aStoreFeatureList.map(feature => {
            let f = JSON.parse(JSON.stringify(feature));
            if (f.id === unSaveFeatureId) {
                (f.geometry as GeoJSON.Point).coordinates = [longitude, latitude];

                let featureProp = f.properties;
                if (featureProp !== null) {
                    let prop = Object.assign(featureProp, {
                        crcef_lat: latitude,
                        crcef_lon: longitude,
                    });
                    f.properties = Object.assign({}, prop);
                }
            }
            return f;
        });
        let unSaveAStoreGeojson = {
            'type': 'FeatureCollection',
            'features': unSaveAStoreFeatureList,
        } as any;
        
        let source = map.getSource(SourceId.A_STORE_SOURCE) as any;
        source.setData(unSaveAStoreGeojson);
    }

    /**
     * This function is used to handle after the
     * trade area will be deleted
     * @param event
     */
    function onDrawDelete(e: any) {
        if (map === undefined) {
            return;
        }

        let data = mapDraw.getAll();
        let drawnFeatureList = data.features;

        if (drawnFeatureList.length === 0) {
            setIsTriggerApi(false);
            return;
        }

        // Deselect logic
        btnObjRef.modifyPolygonArea.featureId = "";
    }

    /**
     * This function is used to handle after the
     * trade area will be updated
     * @param event
     */
    function onDrawUpdate(e: any) {
        if (map === undefined) {
            return;
        }

        let data = mapDraw.getAll();
        let drawnFeatureList = data.features;

        let { modifyPolygonArea } = btnObjRef;

        let updatedFeature = drawnFeatureList.find((f: GeoJSON.Feature) => f.id === modifyPolygonArea.featureId);
        if ((updatedFeature === undefined) || (updatedFeature.properties.risk === true) || (!isValidPolygon(e))) {
            return;
        }

        setUnSaveModifyTradeAreaFeatureId(updatedFeature.id);

        // Deselect logic
        mapDraw.setFeatureProperty(updatedFeature.id, 'risk', true);

        // popup
        let { circle: modifyCircle, polygon: modifyPolygon } = modifyPolygonArea;
        if (modifyCircle.isEnable === true) {
            tradeAreaModifyModalToggle();
        }
        if (modifyPolygon.isEnable === true) {
            let addOrDeleteVertexExist = isAddOrDeleteVertexExist(updatedFeature.id);
            if (addOrDeleteVertexExist === false) {
                tradeAreaModifyModalToggle();
            }
        }
    }

    /**
     * This function is used to handle after the
     * trade area will be created
     * @param event
     */
    function onDrawCreate(e: any) {
        if ((map === undefined) || (!isValidPolygon(e))) {
            return;
        }

        let data = mapDraw.getAll();
        let drawnFeatureList = data.features;

        if (drawnFeatureList.length === 0) {
            setIsTriggerApi(false);
            return;
        }

        let { createTradeArea } = btnObjRef;

        let drawnFeature = drawnFeatureList.slice(-1)[0];
        setUnSaveNewTradeAreaFeatureId(drawnFeature.id);
        
        createTradeArea.featureId = drawnFeature.id;

        // Deselect logic
        mapDraw.setFeatureProperty(drawnFeature.id, 'risk', true);
    }

    /**
     * This function is used to handle after the
     * trade area drawing mode will be changed
     * @param event
     */
    function onDrawSelectionChange(e: any) {
        let currentDrawMode = mapDraw.getMode();
        if ((map === undefined) || (currentDrawMode !== GlDrawMode.DIRECT_SELECT)) {
            return;
        }

        let feature = e.features[0];
        if (feature !== undefined) {
            let featureId = feature.id;
            let { modifyPolygonArea } = btnObjRef;
            let { polygon: modifyPolygon, circle: modifyCircle } = modifyPolygonArea;
            let isCicle = MapboxDrawGeodesic.isCircle(feature);

            modifyPolygonArea.featureId = featureId;
            modifyPolygonArea.recordName = feature.properties.name;

            if (modifyPolygon.isEnable === true) {
                let pointsCount = e.points.length
                if (pointsCount === 1) {
                    let vertexNumber = feature.geometry.coordinates[0].length;
                    if (vertexNumber === 4) {
                        verticesRestrictionErrorModalToggle();
                    }
                    if (vertexNumber > 4) {
                        let onDeleteVertex = function (e: any) {
                            if (e.key === "Delete") {
                                mapDraw.trash();
                            }
                        };
                        document.removeEventListener("keydown", onDeleteVertex);
                        document.addEventListener("keydown", onDeleteVertex);
                    }
                }
            }

            if ((isCicle === false) && (modifyPolygon.isEnable === true)) {
                mapDraw.setFeatureProperty(featureId, 'risk', false);
            }
            if ((isCicle === true) && (modifyCircle.isEnable === true)) {
                mapDraw.setFeatureProperty(featureId, 'risk', false);
            }
        }
    }

    /**
     * This function is used to handle the below action
     * based on the toolbar button selected
     * 1. show "A" store info popup
     * 2. show circle modal
     * 3. delete the "A" store
     * 4. store report generation
     * @param event
     */
    function onAStoreClick(e: any) {
        e.preventDefault();
        let isExist = isUnSaveFeatureExist();
        if ((map === undefined) || (isExist === true)) {
            mapDraw?.changeMode(GlDrawMode.SIMPLE_SELECT);
            return;
        }

        let { mapOperation, createTradeArea, modifyPolygonArea, createStatistics } = btnObjRef;
        if (mapOperation.info.isEnable === true) {
            showAStoreInfoPopup(map, e);
        }
        if (createTradeArea.circle.isEnable === true) {
            showCircleModal(map, e);
        }
        if (modifyPolygonArea.delete.isEnable === true) {
            modifyPolygonArea.featureId = e.features[0].properties.crcef_duplicatelawsonstoredataid;
            storeDeleteModalToggle();
            mapDraw?.changeMode(GlDrawMode.STATIC);
        }
        if (createStatistics.storeReport.isEnable === true) {
            let selectedStoreDetails = getAStoreFeatureById(e.features[0].properties.crcef_duplicatelawsonstoredataid);

            let aStoreSelectedGeojson = {
                'type': 'FeatureCollection',
                'features': [selectedStoreDetails],
            } as any;

            let source = map.getSource(SourceId.A_STORE_SELECTION_SOURCE) as any;
            source.setData(aStoreSelectedGeojson);

            showStoreStatisticsModel(map, e);
        }
    }

    /**
     * This function is used to handle the below action
     * based on the toolbar button selected
     * 1. show "C" store info popup
     * @param event
     */
    function onCStoreClick(e: any) {
        e.preventDefault();
        let isExist = isUnSaveFeatureExist();
        if ((map === undefined) || (isExist === true)) {
            mapDraw?.changeMode(GlDrawMode.SIMPLE_SELECT);
            return;
        }

        let { mapOperation} = btnObjRef;
        if (mapOperation.info.isEnable === true) {
            showCompetitorStoreInfoPopup(map, e);
        }
    }

    /**
     * This function is used to handle the below action
     * based on the toolbar button selected
     * 1. show "D" store info popup
     * @param event
     */
    function onDStoreClick(e: any) {
        e.preventDefault();
        let isExist = isUnSaveFeatureExist();
        if ((map === undefined) || (isExist === true)) {
            mapDraw?.changeMode(GlDrawMode.SIMPLE_SELECT);
            return;
        }

        let { mapOperation} = btnObjRef;
        if (mapOperation.info.isEnable === true) {
            showCompetitorStoreInfoPopup(map, e);
        }
    }

    /**
     * This function is used to handle the below action
     * based on the toolbar button selected
     * 1. show "B" store info popup
     * @param event
     */
    function onBStoreClick(e: any) {
        e.preventDefault();
        let isExist = isUnSaveFeatureExist();
        if ((map === undefined) || (isExist === true)) {
            mapDraw?.changeMode(GlDrawMode.SIMPLE_SELECT);
            return;
        }

        let { mapOperation} = btnObjRef;
        if (mapOperation.info.isEnable === true) {
            showCompetitorStoreInfoPopup(map, e);
        }
    }

    /**
     * This function is used to handle the below action
     * based on the toolbar button selected
     * 1. show "E" store info popup
     * @param event
     */
    function onEStoreClick(e: any) {
        e.preventDefault();
        let isExist = isUnSaveFeatureExist();
        if ((map === undefined) || (isExist === true)) {
            mapDraw?.changeMode(GlDrawMode.SIMPLE_SELECT);
            return;
        }

        let { mapOperation} = btnObjRef;
        if (mapOperation.info.isEnable === true) {
            showCompetitorStoreInfoPopup(map, e);
        }
    }

    /**
     * This function is used to handle the click of
     * gl draw polygon stroke inactive cold layer
     * @param event
     */
    function onGlDrawPolygonStrokeInActiveColdClick(e: any) {
        onGlDrawPolygonFillInActiveColdClick(e);
    }

    /**
     * This function is used to handle the click of
     * gl draw polygon fill inactive cold layer
     * @param event
     */
    function onGlDrawPolygonFillInActiveColdClick(e: any) {
        if (e.defaultPrevented === true) {
            return;
        }
        let isChangeModePrevent = true;
        let featureList = e.features;

        if ((featureList !== undefined) && (featureList.length > 0)) {
            let selectedInactiveFeature = featureList[0];
            if (selectedInactiveFeature !== undefined) {
                let feature = mapDraw.get(selectedInactiveFeature.properties.id);
                if (feature !== undefined) {
                    let { modifyPolygonArea } = btnObjRef;
                    let { circle: modifyCircle, polygon: modifyPolygon, delete: modifyDelete } = modifyPolygonArea;
                    let isCicle = MapboxDrawGeodesic.isCircle(feature);

                    if ((isCicle === false) && (modifyPolygon.isEnable === true)) {
                        isChangeModePrevent = false;
                    }
                    if ((isCicle === true) && (modifyCircle.isEnable === true)) {
                        isChangeModePrevent = false;
                    }
                    if (modifyDelete.isEnable === true) {
                        isChangeModePrevent = false;
                        tradeAreaDeleteModalToggle();
                    }
                }
            }
        }

        if (isChangeModePrevent === true) {
            mapDraw?.changeMode(GlDrawMode.SIMPLE_SELECT);
        }
    }

    /**
     * This function is used to handle the right click of
     * gl draw polygon fill active hot layer
     * @param event
     */
    function onGlDrawPolygonFillActiveHotRightClick(e: any) {
        onGlDrawPolygonFillInActiveColdRightClick(e);
    }

    /**
     * This function is used to handle the right click of
     * gl draw polygon fill active cold layer
     * @param event
     */
    function onGlDrawPolygonFillActiveColdRightClick(e: any) {
        onGlDrawPolygonFillInActiveColdRightClick(e);
    }

    /**
     * This function is used to handle the right click of
     * gl draw polygon fill inactive cold layer, if any below actions
     * 1. Trade area report generation open
     * 2. Trade area create modal open
     * 3. Trade area modify modal open
     * @param event
     */
    function onGlDrawPolygonFillInActiveColdRightClick(e: any) {
        if (map === undefined) {
            return;
        }

        let { createTradeArea, modifyPolygonArea, createStatistics } = btnObjRef;
        let { circle: createCircle, polygon: createPolygon } = createTradeArea;
        let { polygon: modifyPolygon } = modifyPolygonArea;
        let { report: createReport } = createStatistics;

        if (createReport.isEnable === true) {
            setTimeout(function () {
                setMapFitBoundsOnStatistics();
                tradeAreaStatisticsModalToggle();
            }, 100);
        }
        if ((createPolygon.isEnable === true) || (createCircle.isEnable === true)) {
            tradeAreaCreateModalToggle();
        }

        let addOrDeleteVertexExist = isAddOrDeleteVertexExist(modifyPolygonArea.featureId);
        if ((modifyPolygon.isEnable === true) && (addOrDeleteVertexExist === true)) {
            tradeAreaModifyModalToggle();
        }
    }

    /**
     * This function is used to handle the double click of
     * gl draw polygon fill active cold layer, if below action
     * 1. circle modal open if modify enable
     * @param event
     */
    function onGlDrawPolygonFillActiveColdDoubleClick(e: any) {
        if (map === undefined) {
            return;
        }

        let { modifyPolygonArea } = btnObjRef;
        let { circle: modifyCircle } = modifyPolygonArea;

        if (modifyCircle.isEnable === true) {
            circleModalToggle();
        }
    }

    /**
     * This function is used to handle the below action
     * if modify point is enable
     * 1. dragging "A" store icon
     * @param event
     */
    function onAStoreMouseDown(e: any) {
        e.preventDefault();
        if (map === undefined) {
            return;
        }

        let { canvas } = mapEventRef;
        if (canvas !== undefined) {
            canvas.style.cursor = "grab";
        }

        let features = e.features;
        if ((features !== undefined) && (features.length > 0) && (e.originalEvent.button == 0)) { // mouse left click
            let { modifyPolygonArea } = btnObjRef;
            let { point: modifyPoint } = modifyPolygonArea;

            if (modifyPoint.isEnable == true) {
                let feature = features[0];

                modifyPolygonArea.featureId = feature.properties.crcef_duplicatelawsonstoredataid;

                map.on('mousemove', mapEventRef.onMapMouseMove);
                map.once('mouseup', mapEventRef.onMapMouseUp);
            }
        }
    }

    /**
     * This function is used to handle the below action
     * on click of map
     * 1. create "A" store feature
     * 2. open "A" store error modal if store feature id is not there
     * @param event
     */
    function onMapClick(e: any) {
        if (e.defaultPrevented === false) {
            togglePopup(undefined);
        }
        if (map === undefined) {
            return;
        }

        let createTradeArea = btnObjRef.createTradeArea;
        if (createTradeArea.point.isEnable === true) {
            createAStorePoint(e);
        }
        if (createTradeArea.circle.isEnable === true) {
            if ((createTradeArea.circle.storeFeatureId == '') || (createTradeArea.circle.storeFeatureId == undefined) || (createTradeArea.circle.storeFeatureId == null)) {
                selectOnStoreErrorModalToggle();
            }
        }
    }

    /**
     * This function is used to show the information
     * of competitor store
     * @param Map object
     * @param MapLayerMouseEvent
     */
    function showCompetitorStoreInfoPopup(map: MapboxGl.Map, e: MapboxGl.MapLayerMouseEvent) {
        let event: MapboxGl.MapLayerMouseEvent = (e as any);
        if ((map === undefined) || (event.features === undefined)) {
            return;
        }

        let feature = event.features[0];
        let properties = feature.properties;

        if (properties !== null) {
            let p = properties;
            let geometry: GeoJSON.Point = feature.geometry as GeoJSON.Point;
            let coordinates: GeoJSON.Position = geometry.coordinates.slice();

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            let val = (
                <CustomPopupFC coordinates={coordinates} hide={togglePopup}>
                    <CompetitorStorePopupFC property={p}></CompetitorStorePopupFC>
                </CustomPopupFC>
            );
            togglePopup(val);
        }
    }

    /**
     * This function is used to handle the below action
     * on right click of map
     * 1. trade area create modal open if condition is true
     * 2. trade area modify modal open if condition is true
     * @param event
     */
    function onMapRightClick(e:any) {
        e.preventDefault();
        if (map === undefined) {
            return;
        }
        let modifyTradeArea = btnObjRef.modifyPolygonArea;
        let createTradeArea = btnObjRef.createTradeArea;

        if ((createTradeArea.polygon.isEnable === true) || (createTradeArea.circle.isEnable == true)) {
            if (createTradeArea.featureId != '') {
                tradeAreaCreateModalToggle();
            }
        }

        if (modifyTradeArea.polygon.isEnable === true) {
            if ((modifyTradeArea.featureId != undefined) && (modifyTradeArea.featureId != '') && (modifyTradeArea.featureId != null)) {
                tradeAreaModifyModalToggle();
            }
        }
    }

    /**
     * This function is used to show the information
     * of "A" store
     * @param Map object
     * @param MapLayerMouseEvent
     */
    function showAStoreInfoPopup(map: MapboxGl.Map, e: MapboxGl.MapLayerMouseEvent) {
        let event: MapboxGl.MapLayerMouseEvent = (e as any);
        if ((map === undefined) || (event.features === undefined)) {
            return;
        }

        let feature = event.features[0];
        let properties = feature.properties;

        if (properties !== null) {
            let p = properties;
            let geometry: GeoJSON.Point = feature.geometry as GeoJSON.Point;
            let coordinates: GeoJSON.Position = geometry.coordinates.slice();

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            let val = (
                <CustomPopupFC coordinates={coordinates} hide={togglePopup}>
                    <AStorePopupFC
                        property={p}
                        hide={togglePopup}
                        attributeErrorModalToggle={attributeErrorModalToggle}
                    ></AStorePopupFC>
                </CustomPopupFC>
            );
            togglePopup(val);
        }
    }

    /**
     * This function is used to
     * open the circle modal
     * @param Map object
     * @param MapLayerMouseEvent
     */
    function showCircleModal(map: MapboxGl.Map, e: MapboxGl.MapLayerMouseEvent) {
        let event: MapboxGl.MapLayerMouseEvent = (e as any);
        if ((map === undefined) || (event.features === undefined)) {
            return;
        }

        let feature = event.features[0];
        let geometry: GeoJSON.Point = feature.geometry as GeoJSON.Point;
        let coordinates: GeoJSON.Position = geometry.coordinates.slice();

        let featureId = feature.id;
        if (featureId === undefined) {
            let properties = feature.properties;
            if (properties !== null) {
                featureId = properties.crcef_duplicatelawsonstoredataid;
            }
        }

        let { createTradeArea } = btnObjRef;
        createTradeArea.circle.center = coordinates as [number, number];
        createTradeArea.circle.storeFeatureId = featureId as string;

        circleModalToggle();
    }

    /**
     * This function is used to
     * open the store statistics modal
     * @param Map object
     * @param MapLayerMouseEvent
     */
    function showStoreStatisticsModel(map: MapboxGl.Map, e: MapboxGl.MapLayerMouseEvent){
        let event: MapboxGl.MapLayerMouseEvent = (e as any);
        if ((map === undefined) || (event.features === undefined)) {
            return;
        }

        let feature = event.features[0];
        let geometry: GeoJSON.Point = feature.geometry as GeoJSON.Point;
        let coordinates: GeoJSON.Position = geometry.coordinates.slice();

        let featureId = feature.id;
        if (featureId === undefined) {
            let properties = feature.properties;
            if (properties !== null) {
                featureId = properties.crcef_duplicatelawsonstoredataid;
            }
        }

        let { createStatistics } = btnObjRef;
        createStatistics.storeReport.center = coordinates as [number, number];
        createStatistics.storeReport.storeFeatureId = featureId as string;

        storeStatisticsModalToggle();
    }

    /**
     * This function is used to get
     * the total man and woman population
     * @param prop object
     */
    function getTotalPopulation(prop: any) {
        let totalMan = prop["crcef_man0"] + prop["crcef_man10"] + prop["crcef_man20"] + prop["crcef_man30"] + prop["crcef_man40"] + prop["crcef_man50"] + prop["crcef_man60"] + prop["crcef_man70"] + prop["crcef_man80"] + prop["crcef_man90"] + prop["crcef_man100"];
        let totalWoman = prop["crcef_woman0"] + prop["crcef_woman10"] + prop["crcef_woman20"] + prop["crcef_woman30"] + prop["crcef_woman40"] + prop["crcef_woman50"] + prop["crcef_woman60"] + prop["crcef_woman70"] + prop["crcef_woman80"] + prop["crcef_woman90"] + prop["crcef_woman100"];

        return totalMan + totalWoman;
    }

    /**
     * This function is used to get
     * the total footfall
     * @param prop object
     */
    function getTotalFootFall(prop: any) {
        let totalff = prop.crcef_0oclock + prop.crcef_1oclock + prop.crcef_2oclock + prop.crcef_3oclock + prop.crcef_4oclock + prop.crcef_5oclock + prop.crcef_6oclock + prop.crcef_7oclock + prop.crcef_8oclock + prop.crcef_9oclock + prop.crcef_10oclock + prop.crcef_11oclock + prop.crcef_12oclock + prop.crcef_13oclock + prop.crcef_14oclock + prop.crcef_15oclock + prop.crcef_16oclock + prop.crcef_17oclock + prop.crcef_18oclock + prop.crcef_19oclock + prop.crcef_20oclock + prop.crcef_21oclock + prop.crcef_22oclock + prop.crcef_23oclock;

        return totalff;
    }

    /**
     * This function is used to create
     * new "A" store feature
     * @param event
     */
    function createAStorePoint(e: any) {
        if (e.features === undefined) {
            let lngLat = e.lngLat;
            let crcef_lat: string = lngLat.lat.toString();
            let crcef_lon: string = lngLat.lng.toString();
            let geojson = {
                'type': 'Feature',
                'geometry': {
                    coordinates: [crcef_lon, crcef_lat],
                    type: "Point"
                },
                'properties': {
                    crcef_lat: crcef_lat,
                    crcef_lon: crcef_lon,
                    crcef_storename: "Store_" + Math.floor(Math.random() * 1000).toString(),
                }
            };

            triggerAStoreApiActions(AStoreActionId.CREATE, geojson as any);
        }
    }

    /**
     * This function is used to create
     * trade area into D635
     * @param drawnFeature
     */
    function createTradeAreaApiCall(drawnFeature: any) {
        let drawnFeatureId = drawnFeature.id;
        let drawnFeatureProp = Object.assign(drawnFeature.properties, { "id": drawnFeatureId, "risk": true, "name": tradeAreaRecordName });
        let geojson = {
            'type': 'Feature',
            'id': drawnFeatureId,
            'geometry': drawnFeature.geometry,
            'properties': drawnFeatureProp
        };
        let request = {
            entityName: "crcef_lawsontradearea",
            entity: {
                crcef_id: "TradeArea_" + drawnFeatureId,
                crcef_tradeareajson: JSON.stringify(geojson),
                crcef_recordname: tradeAreaRecordName
            }
        };

        WebApiClient.Create(request)
            .then(function (response: any) {
                // Process response
                addTradeAreaFeatureList(geojson as any);
                updateIsRefreshAllLayers(true);
            })
            .catch(function (error: any) {
                // Handle error
                unSavedShapeErrorModalToggle();
                mapDraw.delete(drawnFeatureId);
            });
        setTradeAreaRecordName('');
    }

    /**
     * This function is used to update the
     * existing trade area into D635
     * @param drawnFeature
     */
    function updateTradeAreaApiCall(drawnFeature: any) {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_lawsontradearea").then((result) => {
                let updatedFeatureId = drawnFeature.id;
                let entityList = result.entities;

                for (let i = 0; i < entityList.length; i++) {
                    let entity = entityList[i];
                    let individualResults = JSON.parse(entity.crcef_tradeareajson);
                    let featureID = individualResults.id;

                    if (featureID === updatedFeatureId) {
                        let d365RecordID = entity.crcef_lawsontradeareaid;

                        let drawnFeatureId = drawnFeature.id;
                        let drawnFeatureProp = Object.assign(drawnFeature.properties, { "id": drawnFeatureId, "risk": true, "name": tradeAreaRecordName });
                        let geojson = {
                            'type': 'Feature',
                            'id': drawnFeatureId,
                            'geometry': drawnFeature.geometry,
                            'properties': drawnFeatureProp
                        };
                        let request = {
                            entityName: "crcef_lawsontradearea",
                            entityId: d365RecordID,
                            entity: {
                                crcef_tradeareajson: JSON.stringify(geojson),
                                crcef_recordname: tradeAreaRecordName
                            }
                        };

                        WebApiClient.Update(request)
                            .then(function (response: any) {
                                // Process response
                                updateTradeAreaFeatureList(geojson as any);
                                updateIsRefreshAllLayers(true);
                            })
                            .catch(function (error: any) {
                                // Handle error
                                unSavedShapeErrorModalToggle();
                                mapDraw.delete(drawnFeatureId);
                            });
                    }
                }
            });

        setTradeAreaRecordName('');
    }

    /**
     * This function is used to delete the
     * existing trade area from D635
     * @param drawnFeature
     */
    function deleteTradeAreaApiCall(drawnFeature: any) {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_lawsontradearea").then((result) => {
                let deletableDrawnFeatureId = drawnFeature.id;
                let entityList = result.entities;

                for (let i = 0; i < entityList.length; i++) {
                    let entity = entityList[i];
                    let individualResults = JSON.parse(entity.crcef_tradeareajson);
                    let featureID = individualResults.id;

                    if (featureID === deletableDrawnFeatureId) {
                        let d365RecordID = entity.crcef_lawsontradeareaid;
                        Xrm.WebApi.deleteRecord("crcef_lawsontradearea", d365RecordID)
                            .then(function (response: any) {
                                // Process response
                                deleteTradeAreaFeatureList(deletableDrawnFeatureId);
                            })
                            .catch(function (error: any) {
                                // Handle error
                            });
                    }
                }
            });
    }

    /**
     * This function is used to create
     * "A" store into D635
     * @param storeFeature
     */
    function createAStoreApiCall(storeFeature: any) {
        let prop = storeFeature.properties;
        let request = {
            entityName: "crcef_duplicatelawsonstoredata",
            entity: {
                crcef_lat: prop.crcef_lat,
                crcef_lon: prop.crcef_lon,
                crcef_storename: prop.crcef_storename,
            }
        };
        WebApiClient.Create(request)
            .then(function (response: any) {
                // Process response
                let geojson = storeFeature;
                if (geojson !== undefined) {
                    if (geojson.properties !== null) {
                        let createdguid: string = response.slice(-37, -1);
                        geojson.id = createdguid;
                        geojson.properties.crcef_duplicatelawsonstoredataid = createdguid;

                        addAStoreFeatureList(geojson as any);
                    }
                }
            })
            .catch(function (error: any) {
                // Handle error
            });
    }

    /**
     * This function is used to update the
     * existing "A" store into D635
     * @param storeFeature
     */
    function updateAStoreApiCall(storeFeature: any) {
        let prop = storeFeature.properties;
        let request = {
            entityName: "crcef_duplicatelawsonstoredata",
            entityId: prop.crcef_duplicatelawsonstoredataid,
            entity: {
                crcef_lat: prop.crcef_lat,
                crcef_lon: prop.crcef_lon,
            }
        };

        WebApiClient.Update(request)
            .then(function(response : any) {
                // Process response
                updateAStoreFeatureList(storeFeature);
            })
            .catch(function(error : any) {
                // Handle error
            });
    }

    /**
     * This function is used to delete the
     * existing "A" store from D635
     * @param storeFeature
     */
    function deleteAStoreApiCall(storeFeature: any) {
        let prop = storeFeature.properties;
        let request = {
            entityName: "crcef_duplicatelawsonstoredata",
            entityId: prop.crcef_duplicatelawsonstoredataid
        };

        let deletePromise = WebApiClient.Delete(request) as any;
        deletePromise
            .then(function(response: any){
                deleteAStoreFeatureList(storeFeature);
            })
            .catch(function(error: any) {
            });
    }

    /**
     * This function is used to fetch
     * the demographic details for the report.
     */
    function fetchTradeAreaDemographics() {
        let startDate0hr = "2022-01-10";
        //let startDate23hr = "2022-01-10T23:59:59";

        let endDate0hr = "2022-01-23";
        //let endDate23hr = "2022-01-23T23:59:59";

        let fetchDemographicsHeaderPromise = new Promise<void>((resolve, reject) => {
            Xrm.WebApi
                .retrieveMultipleRecords("crcef_demographicdataheader", "?$select=crcef_name,crcef_startdate,crcef_enddate,crcef_demographicdataheaderid&$filter=crcef_startdate eq "+ startDate0hr + " and crcef_enddate eq " + endDate0hr)
                /*.retrieveMultipleRecords("crcef_demographicdataheader", "?$select=crcef_name,crcef_startdate,crcef_enddate,crcef_demographicdataheaderid&$filter=crcef_startdate ge '"+ startDate0hr + "'" + " and crcef_startdate le '" + startDate23hr + "'" + " and crcef_enddate ge '" + endDate0hr + "'" + " and crcef_enddate le '" + endDate23hr + "'")*/
                .then(function (response: any) {
                    // Process response
                    resolve(response);
                })
                .catch(function (error: any) {
                    // Handle error
                    reject();
                });
        });
        fetchDemographicsHeaderPromise.then(function (result: any) {
            let entities = result.entities;
            let demographicHeaderId = entities[0].crcef_demographicdataheaderid

            //demo line
            let demographicLinePromise = new Promise<void>((resolve, reject) => {
                Xrm.WebApi
                    .retrieveMultipleRecords("crcef_demographicdata","?$filter=_crcef_headerid_value eq '"+ demographicHeaderId + "'")
                    .then((lineResponse: any) => {
                        resolve(lineResponse);
                    });
            });

            demographicLinePromise.then(function (result: any) {
                let lineEntities = result.entities;
                let tradeAreaDemographicLine;
                for (let line = 0; line < lineEntities.length; line++)
                {
                    if (lineEntities[line]._crcef_tradearea_value === selectedStatisticsFeature?.properties?.tradeAreaGuid)
                    {
                        tradeAreaDemographicLine = lineEntities[line];
                        break;
                    }
                }
                createFilteredAStoreFeaturesApiCall(tradeAreaDemographicLine);
            });
        });
    }

    /**
     * This function is used to create
     * duplicate "A" store into D635
     */
    function createFilteredAStoreFeaturesApiCall(tradeAreaDemographics : any) {
        const { man0: totalMan0, man10: totalMan10, man20: totalMan20, man30: totalMan30, man40: totalMan40, man50: totalMan50, man60: totalMan60, man70: totalMan70, man80: totalMan80, woman0: totalWoman0, woman10: totalWoman10, woman20: totalWoman20, woman30: totalWoman30, woman40: totalWoman40, woman50: totalWoman50, woman60: totalWoman60, woman70: totalWoman70, woman80: totalWoman80, males: totalMales, females: totalFemales, total: totalPopulation } = aggregatedPopulationObj;
        const { bStore: totalBStore, cStore: totalCStore, dStore: totalDStore, eStore: totalEStore, tatal: totalTatal } = aggregatedCompetitorStoreObj;

        let promisesArray = [];
        let randomNumber = Math.floor(Math.random() * 100) + 1;

        for (let i = 0; i < filteredAStoreFeatures.length; i++) {
            let feature = filteredAStoreFeatures[i];
            if (feature !== null) {
                let property: any = feature.properties;
                let totalff = getTotalFootFall(property);
                let request: any = {
                    entityName: "crcef_lawsonstore",
                    entity: {
                        crcef_randomnumber: randomNumber,
                        crcef_id: property.crcef_id,
                        crcef_storename: property.crcef_storename,
                        crcef_addresspluscode: property.crcef_addresspluscode,
                        crcef_lat: property.crcef_lat,
                        crcef_lon: property.crcef_lon,
                        crcef_tell: property.crcef_tell,
                        crcef_lastmonthssales: property.crcef_lastmonthssales,
                        crcef_thismonthssales: property.crcef_thismonthssales,
                        crcef_transactioncount: property.crcef_transactioncount,
                        crcef_custmeravg: property.crcef_custmeravg,
                        crcef_abca: property.crcef_abca,
                        crcef_abcb: property.crcef_abcb,
                        crcef_abcc: property.crcef_abcc,
                        crcef_lankingtop1: property.crcef_lankingtop1,
                        crcef_lankingtop2: property.crcef_lankingtop2,
                        crcef_lankingtop3: property.crcef_lankingtop3,
                        crcef_0oclock: property.crcef_0oclock,
                        crcef_1oclock: property.crcef_1oclock,
                        crcef_2oclock: property.crcef_2oclock,
                        crcef_3oclock: property.crcef_3oclock,
                        crcef_4oclock: property.crcef_4oclock,
                        crcef_5oclock: property.crcef_5oclock,
                        crcef_6oclock: property.crcef_6oclock,
                        crcef_7oclock: property.crcef_7oclock,
                        crcef_8oclock: property.crcef_8oclock,
                        crcef_9oclock: property.crcef_9oclock,
                        crcef_10oclock: property.crcef_10oclock,
                        crcef_11oclock: property.crcef_11oclock,
                        crcef_12oclock: property.crcef_12oclock,
                        crcef_13oclock: property.crcef_13oclock,
                        crcef_14oclock: property.crcef_14oclock,
                        crcef_15oclock: property.crcef_15oclock,
                        crcef_16oclock: property.crcef_16oclock,
                        crcef_17oclock: property.crcef_17oclock,
                        crcef_18oclock: property.crcef_18oclock,
                        crcef_19oclock: property.crcef_19oclock,
                        crcef_20oclock: property.crcef_20oclock,
                        crcef_21oclock: property.crcef_21oclock,
                        crcef_22oclock: property.crcef_22oclock,
                        crcef_23oclock: property.crcef_23oclock,
                        crcef_totalff: totalff,
                        crcef_home1lat: property.crcef_home1lat,
                        crcef_home1lon: property.crcef_home1lon,
                        crcef_home1ratio: property.crcef_home1ratio,
                        crcef_home2lat: property.crcef_home2lat,
                        crcef_home2lon: property.crcef_home2lon,
                        crcef_home2ratio: property.crcef_home2ratio,
                        crcef_home3lat: property.crcef_home3lat,
                        crcef_home3lon: property.crcef_home3lon,
                        crcef_home3ratio: property.crcef_home3ratio,
                        crcef_work1lat: property.crcef_work1lat,
                        crcef_work1lon: property.crcef_work1lon,
                        crcef_work1ratio: property.crcef_work1ratio,
                        crcef_work2lat: property.crcef_work2lat,
                        crcef_work2lon: property.crcef_work2lon,
                        crcef_work2ratio: property.crcef_work2ratio,
                        crcef_work3lat: property.crcef_work3lat,
                        crcef_work3lon: property.crcef_work3lon,
                        crcef_work3ratio: property.crcef_work3ratio,
                        crcef_man0: totalMan0,
                        crcef_man10: totalMan10,
                        crcef_man20: totalMan20,
                        crcef_man30: totalMan30,
                        crcef_man40: totalMan40,
                        crcef_man50: totalMan50,
                        crcef_man60: totalMan60,
                        crcef_man70: totalMan70,
                        crcef_man80: totalMan80,
                        crcef_man90: property.crcef_man90,
                        crcef_man100: property.crcef_man100,
                        crcef_woman0: totalWoman0,
                        crcef_woman10: totalWoman10,
                        crcef_woman20: totalWoman20,
                        crcef_woman30: totalWoman30,
                        crcef_woman40: totalWoman40,
                        crcef_woman50: totalWoman50,
                        crcef_woman60: totalWoman60,
                        crcef_woman70: totalWoman70,
                        crcef_woman80: totalWoman80,
                        crcef_woman90: property.crcef_woman90,
                        crcef_woman100: property.crcef_woman100,
                        crcef_total: totalPopulation,
                        crcef_7eleven: totalBStore,
                        crcef_familymart: totalCStore,
                        crcef_ministop: totalDStore,
                        crcef_tescolotusexpress: totalEStore,
                        crcef_tatal: totalTatal,
                        crcef_0oclockweekend: property.crcef_0oclockweekend,
                        crcef_1oclockweekend: property.crcef_1oclockweekend,
                        crcef_2oclockweekend: property.crcef_2oclockweekend,
                        crcef_3oclockweekend: property.crcef_3oclockweekend,
                        crcef_4oclockweekend: property.crcef_4oclockweekend,
                        crcef_5oclockweekend: property.crcef_5oclockweekend,
                        crcef_6oclockweekend: property.crcef_6oclockweekend,
                        crcef_7oclockweekend: property.crcef_7oclockweekend,
                        crcef_8oclockweekend: property.crcef_8oclockweekend,
                        crcef_9oclockweekend: property.crcef_9oclockweekend,
                        crcef_10oclockweekend: property.crcef_10oclockweekend,
                        crcef_11oclockweekend: property.crcef_11oclockweekend,
                        crcef_12oclockweekend: property.crcef_12oclockweekend,
                        crcef_13oclockweekend: property.crcef_13oclockweekend,
                        crcef_14oclockweekend: property.crcef_14oclockweekend,
                        crcef_15oclockweekend: property.crcef_15oclockweekend,
                        crcef_16oclockweekend: property.crcef_16oclockweekend,
                        crcef_17oclockweekend: property.crcef_17oclockweekend,
                        crcef_18oclockweekend: property.crcef_18oclockweekend,
                        crcef_19oclockweekend: property.crcef_19oclockweekend,
                        crcef_20oclockweekend: property.crcef_20oclockweekend,
                        crcef_21oclockweekend: property.crcef_21oclockweekend,
                        crcef_22oclockweekend: property.crcef_22oclockweekend,
                        crcef_23oclockweekend: property.crcef_23oclockweekend,
                        crcef_02kmhomelocation: property.crcef_02kmhomelocation,
                        crcef_24kmhomelocation: property.crcef_24kmhomelocation,
                        crcef_46kmhomelocation: property.crcef_46kmhomelocation,
                        crcef_68kmhomelocation: property.crcef_68kmhomelocation,
                        crcef_810kmhomelocation: property.crcef_810kmhomelocation,
                        crcef_10kmhomelocation: property.crcef_10kmhomelocation,
                        crcef_02kmworklocation: property.crcef_02kmworklocation,
                        crcef_24kmworklocation: property.crcef_24kmworklocation,
                        crcef_46kmworklocation: property.crcef_46kmworklocation,
                        crcef_68kmworklocation: property.crcef_68kmworklocation,
                        crcef_810kmworklocation: property.crcef_810kmworklocation,
                        crcef_10kmworklocation: property.crcef_10kmworklocation,
                        crcef_mon: property.crcef_mon,
                        crcef_tue: property.crcef_tue,
                        crcef_wed: property.crcef_wed,
                        crcef_thu: property.crcef_thu,
                        crcef_fri: property.crcef_fri,
                        crcef_sat: property.crcef_sat,
                        crcef_sun: property.crcef_sun,
                    }
                };

                if (tradeAreaDemographics !== undefined) {
                    // demographic fields are add
                    request.entity = Object.assign({}, request.entity, {
                        crcef_males: tradeAreaDemographics.crcef_male, //totalMales,
                        crcef_females: tradeAreaDemographics.crcef_female, //totalFemales
                        crcef_1825: tradeAreaDemographics.crcef_age1824,
                        crcef_2635: tradeAreaDemographics.crcef_age2534,
                        crcef_3645: tradeAreaDemographics.crcef_age3544,
                        crcef_over45: tradeAreaDemographics.crcef_age4554,
                        crcef_over55: tradeAreaDemographics.crcef_ageover55,
                        crcef_professionals: tradeAreaDemographics.crcef_professionals,
                        crcef_students: tradeAreaDemographics.crcef_students,
                        crcef_families: tradeAreaDemographics.crcef_parents,
                        crcef_travelers: tradeAreaDemographics.crcef_travellers,
                        crcef_shoppers: tradeAreaDemographics.crcef_shoppers,
                        crcef_affluents: tradeAreaDemographics.crcef_affluents,
                    });
                }

                let promise = new Promise<void>((resolve, reject) => {
                    WebApiClient.Create(request)
                        .then(function (response: any) {
                            // Process response
                            resolve(response);
                        })
                        .catch(function (error: any) {
                            // Handle error
                            reject();
                        });
                });
                promisesArray.push(promise);
            }
        }
        Promise.all(promisesArray).then((responses: any) => {
            setAStoreRecordCreationResponse(responses);
            fetchHistoricalFootfallData();
        });
    }

    /**
     * This function is used to the new selected trade area
     * record and then show the power bi report
     */
    function createSelectedTradeAreaApiCallForStatistics(polygonFeatureCoordinates: any, storeId: any) {
        let data = {
            crcef_storeid : storeId,
            crcef_tradeareajson: polygonFeatureCoordinates,
            crcef_reporttype: ReportTypeValue.STATISTICS,
            crcef_processingstatus: ProcessingStatusValue.NEW
        };
        pluginStartTimeRef.statistics = new Date();

        Xrm.WebApi
            .createRecord("crcef_selectedtradearea", data)
            .then(function (result: any) {
                // perform operations on record creation
                if (selectedHistoricalDataGuid === undefined || selectedHistoricalDataGuid === '') {
                    checkCurrentSelectedTradeAreaPluginStatusById(result.id);
                } else {
                    updateSelectedTradeAreaToCompletedForStatistics(result.id);
                }
            })
            .catch(function (error: any) {
                // handle error conditions
                let errorMessage: string = error.message;
                let errorContent = errorMessage.split(": ");
                setNearApiErrorMessage("Near API has return the following error" + errorMessage.toUpperCase());
                nearApiErrorModalToggle();
                setIsLoadingBiReport(false);
                console.log(error);
            });
    }

    function updateSelectedTradeAreaProcessingStatusToReprocessing(recordId: string) {
        var data = {
            crcef_processingstatus: ProcessingStatusValue.REPROCESS
        };
        Xrm.WebApi
            .updateRecord("crcef_selectedtradearea", recordId, data)
            .then(function success(result) {
                checkCurrentSelectedTradeAreaPluginStatusById(recordId);
            })
            .catch(function (error) {
                console.log("unable to update record", error.message);
            });
    }

    function updateSelectedTradeAreaToCompletedForStatistics(recordId: string) {
        var data = {
            crcef_processingstatus: ProcessingStatusValue.COMPLETED,
            crcef_pushdatatoazure: true
        };
        Xrm.WebApi
            .updateRecord("crcef_selectedtradearea", recordId, data)
            .then(function success(result) {
                showPowerBiStatisticsReport();
                setSelectedReportType(undefined);
            })
            .catch(function (error) {
                console.log("unable to update record", error.message);
            });
    }

    function updateSelectedTradeAreaToCompletedForCompetitor(recordId: string) {
        var data = {
            crcef_processingstatus: ProcessingStatusValue.COMPLETED,
        };
        Xrm.WebApi
            .updateRecord("crcef_selectedtradearea", recordId, data)
            .then(function success(result) {
                setCompletedCompetitorSelectedTradeAreaGuid(recordId);
            })
            .catch(function (error) {
                console.log("unable to update record", error.message);
            });
    }

    function checkNearApiPluginStatus(recordId: string, zeropointReportStatus: boolean, celcdlReportStatus: boolean, reportType: any) {
        if (zeropointReportStatus === true && celcdlReportStatus === true) {
            if (reportType === ReportTypeValue.STATISTICS) {
                updateSelectedTradeAreaToCompletedForStatistics(recordId);
            } else if (reportType === ReportTypeValue.COMPETITOR) {
                updateSelectedTradeAreaToCompletedForCompetitor(recordId);
            }
        } else {
            updateSelectedTradeAreaProcessingStatusToReprocessing(recordId);
        }
    }

    /**
     * This function is used to fetch the selected trade area record
     * @param recordId unique id of crcef_selectedtradearea entity record
     */
    function checkCurrentSelectedTradeAreaPluginStatusById(recordId: string) {
        Xrm.WebApi
            .retrieveRecord("crcef_selectedtradearea", recordId)
            .then(function success(result) {
                let pluginStartTime: any = undefined;
                let reportType = result.crcef_reporttype;

                if (reportType === ReportTypeValue.STATISTICS) {
                    pluginStartTime = pluginStartTimeRef.statistics;
                } else if (reportType === ReportTypeValue.COMPETITOR) {
                    pluginStartTime = pluginStartTimeRef.competitorAnalysis;
                }
                console.log("pluginStartTime >>>> ", pluginStartTime);

                let currentTime: any = new Date();
                let timeDifference = Math.abs(currentTime - pluginStartTime);
                let executionTimeInMinutes = Math.floor((timeDifference/1000)/60);

                if (executionTimeInMinutes >= 10) {
                    setNearApiErrorMessage("Near API is currently down please try later.");
                    nearApiErrorModalToggle();
                    setIsLoadingBiReport(false);
                } else {
                    let zeropointReportStatus = result.crcef_zeropointreport;
                    let celcdlReportStatus = result.crcef_celcdlreport;

                    checkNearApiPluginStatus(recordId, zeropointReportStatus, celcdlReportStatus, reportType);
                }
            })
            .catch(function (error) {
                console.log("unable to retrieve record", error.message);
            });
    }

    /**
     * This function is used to create
     * competitor analysis into D635
     */
    function createCompetitorAnalysisApiCall() {
        let promisesArray = [];
        let nearApiFeatureList = competitorNearApiFeatureWithDemographicList;

        for (let i = 0; i < nearApiFeatureList.length; i++) {
            let nearApiFeature = nearApiFeatureList[i];
            let tradeAreaGuid = nearApiFeature.id as string;
            let property: any = nearApiFeature.properties;
            let demographicLineGuid = (property.demographicLineGuid === undefined) ? '' : property.demographicLineGuid;

            let data = {
                crcef_tradearea: property.name,
                crcef_tradeareareference: tradeAreaGuid,
                // crcef_demographic_line_guid: demographicLineGuid,
            }

            let promise = new Promise<CompetitorAnalysisInfo>((resolve, reject) => {
                Xrm.WebApi
                    .createRecord("crcef_competitoranalysis", data)
                    .then(function (result: any) {
                        let guid = result.id;
                        let competitorAnalysisObj: CompetitorAnalysisInfo = constructCompetitorAnalysisObj(guid, nearApiFeature);
                        resolve(competitorAnalysisObj);
                    })
                    .catch(function (error: any) {
                        // Handle error
                        reject();
                    });
            });
            promisesArray.push(promise);
        }

        Promise.all(promisesArray).then((responses: CompetitorAnalysisInfo[]) => {
            setCompetitorAnalysisDetailList(responses);
        });
    }

    /**
     * This function is used to create Competitor history header record
     * records for crcef_competitoranalysishistoryheader entity in D365
     */
    function createCompetitorAnalysisHistoryHeaderApiCall() {
        Xrm.WebApi
            .createRecord("crcef_competitoranalysishistoryheader", { "crcef_recordname": competitorRecordName })
            .then((result) => {
                let guid = result.id;
                createCompetitorAnalysisHistoryLineApiCall(guid);
            });
    }

    /**
     * This function is used to create Competitor history line records
     * records for crcef_competitoranalysishistoryline entity in D365
     * @param guid crcef_competitoranalysishistoryheader unique id
     */
    function createCompetitorAnalysisHistoryLineApiCall(guid: any) {
        let ownerIdValue = getUserIdValue();
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_competitoranalysis", "?$filter=_ownerid_value eq " + ownerIdValue + "")
            .then((result) => {
                let entities = result.entities;
                let createPromisesArray = [];

                for (var i = 0; i < entities.length; i++) {
                    let entity = entities[i];
                    let data = {
                        "crcef_headerrecordid@odata.bind" : `/crcef_competitoranalysishistoryheaders(${guid})`,
                        crcef_tradeareaname : entity.crcef_tradearea,
                        crcef_tradeareareference : entity.crcef_tradeareareference,
                        crcef_visitorlocations1 : entity.crcef_visitorlocations1,
                        crcef_visitorlocations2 : entity.crcef_visitorlocations2,
                        crcef_visitorlocations3 : entity.crcef_visitorlocations3,
                        crcef_visitorcdllocations1 : entity.crcef_visitorcdllocations1,
                        crcef_visitorcdllocations2 : entity.crcef_visitorcdllocations2,
                        crcef_visitorcdllocations3 : entity.crcef_visitorcdllocations3,
                        crcef_0oclock : entity.crcef_0oclock,
                        crcef_1oclock : entity.crcef_1oclock,
                        crcef_2oclock : entity.crcef_2oclock,
                        crcef_3oclock : entity.crcef_3oclock,
                        crcef_4oclock : entity.crcef_4oclock,
                        crcef_5oclock : entity.crcef_5oclock,
                        crcef_6oclock : entity.crcef_6oclock,
                        crcef_7oclock : entity.crcef_7oclock,
                        crcef_8oclock : entity.crcef_8oclock,
                        crcef_9oclock : entity.crcef_9oclock,
                        crcef_10oclock : entity.crcef_10oclock,
                        crcef_11oclock : entity.crcef_11oclock,
                        crcef_12oclock : entity.crcef_12oclock,
                        crcef_13oclock : entity.crcef_13oclock,
                        crcef_14oclock : entity.crcef_14oclock,
                        crcef_15oclock : entity.crcef_15oclock,
                        crcef_16oclock : entity.crcef_16oclock,
                        crcef_17oclock : entity.crcef_17oclock,
                        crcef_18oclock : entity.crcef_18oclock,
                        crcef_19oclock : entity.crcef_19oclock,
                        crcef_20oclock : entity.crcef_20oclock,
                        crcef_21oclock : entity.crcef_21oclock,
                        crcef_22oclock : entity.crcef_22oclock,
                        crcef_23oclock : entity.crcef_23oclock,
                        crcef_totalfootfall : entity.crcef_totalfootfall,
                        crcef_monday : entity.crcef_monday,
                        crcef_tuesday : entity.crcef_tuesday,
                        crcef_wednesday : entity.crcef_wednesday,
                        crcef_thursday : entity.crcef_thursday,
                        crcef_friday : entity.crcef_friday,
                        crcef_saturday : entity.crcef_saturday,
                        crcef_sunday : entity.crcef_sunday,
                        crcef_male : entity.crcef_male,
                        crcef_female : entity.crcef_female,
                        crcef_age18to25 : entity.crcef_age18to25,
                        crcef_age26to35 : entity.crcef_age26to35,
                        crcef_age36to45 : entity.crcef_age36to45,
                        crcef_ageover45 : entity.crcef_ageover45,
                        crcef_ageover55 : entity.crcef_ageover55,
                        crcef_families : entity.crcef_families,
                        crcef_professionals : entity.crcef_professionals,
                        crcef_students : entity.crcef_students,
                        crcef_travelers : entity.crcef_travelers,
                        crcef_shoppers : entity.crcef_shoppers,
                        crcef_affluents : entity.crcef_affluents,
                    }

                    let promise = new Promise<void>((resolve, reject) => {
                        Xrm.WebApi
                            .createRecord("crcef_competitoranalysishistoryline", data)
                            .then((res) => {
                                resolve();
                            });
                    });
                    createPromisesArray.push(promise);
                }

                Promise.all(createPromisesArray).then(() => {
                    showCompetitorAnalysisPowerBiReport(completedCompetitorSelectedTradeAreaGuid);
                });
            });
    }

    /**
     * This function is used to open Competitor Power Bi report
     */
    function showCompetitorAnalysisPowerBiReport(recordId: any) {
        if (recordId !== undefined) {
            Xrm.WebApi
                .updateRecord("crcef_selectedtradearea", recordId, {"crcef_pushdatatoazure": true})
                .then(function (response: any) {
                    showPowerBiCompetitorReport();
                    setActiveBtnId('');
                    setCompetitorHistoryGuid(undefined);
                    resetCompletedCompetetiorSelectedTradeAreaGuidRefValue();
                    //setSelectedReportType(undefined);
                })    
                .catch(function (error: any) {
                    // Handle error
                    setIsLoadingBiReport(false);
                    setActiveBtnId('');
                    setCompetitorHistoryGuid(undefined);
                    resetCompletedCompetetiorSelectedTradeAreaGuidRefValue();
                    //setSelectedReportType(undefined);

                    let errorMessage: string = error.message;
                    let errorContent = errorMessage.split(": ");
                    setNearApiErrorMessage("Azure Plugin has return the following error" + errorMessage.toUpperCase());
                    nearApiErrorModalToggle();
                    console.log(error);
                });
        }
    }

    /**
     * This function is used to create selected trade area
     * Api Call for competitor analysis into D635
     */
    function createSelectedTradeAreaApiCallForCompetitorAnalysis() {
        if (competitorHistoryGuid !== undefined) {
            let fetchHistoryDetails = {
                competitorHistoryGuid : competitorHistoryGuid,
            };
            createSelectedTradeAreaApiRequestForCompetitorAnalysis(fetchHistoryDetails, true);
        } else {
            let randomNumber = Math.round(Math.random() * 1000000000).toString();
            let additionalCompetitorAnalysisDetails = {
                nearApiRequestDetails: [],
                startDate: competitorPeriodStartDate,
                endDate: competitorPeriodEndDate,
                randomNumber: randomNumber
            };

            createSelectedTradeAreaApiRequestForCompetitorAnalysis(additionalCompetitorAnalysisDetails, false);
        }
    }

    /**
     * This function is used to create selected trade area
     * Api Request for competitor analysis into D635
     * @param additionalCompetitorAnalysisDetails additional competitor report details with near request info
     * @param isFetchFromHistory boolean
     */
    function createSelectedTradeAreaApiRequestForCompetitorAnalysis(additionalCompetitorAnalysisDetails: any, isFetchFromHistory: boolean) {
        let requests: any[] = [];
        let pendingRequests : any[] = [];

        var Sdk = (window as any).Sdk || {};

        Sdk.CreateRequest = function(entityName: string, payload: object) {
            this.etn = entityName;
            this.payload = payload;
        };

        Sdk.CreateRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {},
                operationType: 2, // This is a CRUD operation. Use '0' for actions and '1' for functions
                operationName: "Create",
            };
        };

        if (isFetchFromHistory === false) {
            for (let i = 0; i < competitorSplitNearApiFeatureList.length; i++) {
                let splitNearApiFeatureList = competitorSplitNearApiFeatureList[i];
                let nearApiRequestDetails = getCompetitorAnalysisNearApiRequestDetailList(splitNearApiFeatureList);

                additionalCompetitorAnalysisDetails.nearApiRequestDetails = nearApiRequestDetails;

                let payload = {
                    crcef_storeid : JSON.stringify(additionalCompetitorAnalysisDetails),
                    crcef_tradeareajson: JSON.stringify(splitNearApiFeatureList),
                    crcef_reporttype: ReportTypeValue.COMPETITOR,
                    crcef_processingstatus: ProcessingStatusValue.NEW,
                };
                let createRequest = new Sdk.CreateRequest("crcef_selectedtradearea", payload);
                requests.push(createRequest);
            }
        } else {
            let payload = {
                crcef_storeid : JSON.stringify(additionalCompetitorAnalysisDetails),
                crcef_tradeareajson: '',
                crcef_reporttype: ReportTypeValue.COMPETITOR,
                crcef_processingstatus: ProcessingStatusValue.NEW,
            };
            let createRequest = new Sdk.CreateRequest("crcef_selectedtradearea", payload);
            requests.push(createRequest);
        }

        pendingRequests = requests.slice();

        // track the date and time for very first near api plugin hit
        pluginStartTimeRef.competitorAnalysis = new Date();

        let currentRequest = pendingRequests.splice(0, 2);
        executeCompetitorAnalysisNearApiRequest(currentRequest, pendingRequests);
    }

    /**
     * This function is used to execute Near Api Request
     *  for competitor analysis into D635
     * @param currentRequest collection of current Near Api request
     * @param pendingRequests collection of pending Near Api request
     */
    function executeCompetitorAnalysisNearApiRequest(currentRequest: any, pendingRequests: any) {
        Xrm.WebApi.online
            .executeMultiple(currentRequest)
            .then(function (response: any) {
                if (pendingRequests.length === 0) {
                    if (competitorHistoryGuid === undefined) {
                        let ownerIdValue = getUserIdValue();
                        Xrm.WebApi
                            .retrieveMultipleRecords("crcef_selectedtradearea", "?$select=crcef_selectedtradeareaid,_ownerid_value&$filter=_ownerid_value eq " + ownerIdValue + "").then((result) => {
                                let entities = result.entities;
                                let selectedTradeAreaguids = [];

                                for (let i = 0; i < entities.length; i++) {
                                    let recordId = entities[i].crcef_selectedtradeareaid;
                                    selectedTradeAreaguids.push(recordId);
                                }
                                setInitialCompetitorSelectedTradeAreaGuids(selectedTradeAreaguids);
                            })
                            .catch(function (error: any) {
                                console.log(error);
                            });
                    } else {
                        let selectedTradeAreaGuid = getGUIDFromResponse(response[0]);
                        showCompetitorAnalysisPowerBiReport(selectedTradeAreaGuid);
                    }
                } else {
                    let currentRequest = pendingRequests.splice(0, 2);
                    executeCompetitorAnalysisNearApiRequest(currentRequest, pendingRequests);
                }
            })
            .catch(function (error: any) {
                // Handle error
                console.log(">>>Near api method - catch")
                setIsLoadingBiReport(false);
                setActiveBtnId('');
                //setSelectedReportType(undefined);

                let errorMessage: string = error.message;
                let errorContent = errorMessage.split(": ");
                setNearApiErrorMessage("Near API has return the following error" + errorMessage.toUpperCase());
                nearApiErrorModalToggle();
                console.log(error);
            });
        setSelectedTradeAreaList([]);
    }

    /**
     * This function is used to fetch store statistics history
     * records from crcef_historicallawsondata entity
     */
    function fetchHistoricalFootfallData() {
        let fetchHistoricalDataPromise = new Promise<void>((resolve, reject) => {
            Xrm.WebApi
                .retrieveMultipleRecords("crcef_historicallawsondata","?$filter=crcef_tradeareaid eq '" +  selectedStatisticsFeature?.id + "'")
                .then(function (response: any) {
                    // Process response
                    resolve(response);
                })
                .catch(function (error: any) {
                    // Handle error
                    reject();
                });
        });
        fetchHistoricalDataPromise.then(function (result: any) { 
            let entities = result.entities;
            let historicalInfo : HistoryInfo;
            let historicalInfoList : HistoryInfo[] = [];
            
            if (entities.length > 0) {
                for (let i = 0; i < entities.length; i++) {
                    historicalInfo = {
                        crcef_historicalastoredataid: entities[i].crcef_historicallawsondataid,
                        crcef_recordname: entities[i].crcef_recordname,
                        crcef_tradeareaid: entities[i].crcef_tradeareaid,
                        createdon: entities[i].createdon
                    }
                    historicalInfoList.push(historicalInfo);
                }
            }
            setHistoricalFootfallData(historicalInfoList);

            if (activeBtnId === ButtonId.TRADE_AREA_CHART) {
                setIsLoadingBiReport(false);
                listOfHistoricalModalToggle();
            } else {
                setSelectedHistoricalDataGuid('');
            }
        });
    }

    /**
     * This function is used to create store features and "A" store entity
     * records GUID list required for creating selected trade area entity
     * details.
     */
    //NEAR API - get data for multiple stores in trade area
    function processFilteredAStores() {
        let processedAStore: ProcessedAStoreData;
        let nearAPIFeature: GeoJSON.Feature | undefined;
        let aStoreGuid: string;
        let aStoreGuidList: string[] = [];

        processedAStore = {
            nearAPIFeature: undefined,
            additionalReportDetails: {
                storeGuids: [],
                statisticsHistoryGuid: "",
                recordName: "",
                selectedTradeAreaId: ""
            }
        }
        
        if (selectedHistoricalDataGuid === '') {
            if (selectedStatisticsFeature) {
                if (selectedStatisticsFeature.geometry.type == 'Polygon') {
                    nearAPIFeature = {
                        type: "Feature",
                        id: "Statistics report area",
                        geometry: {
                            type: "Polygon",
                            coordinates: selectedStatisticsFeature.geometry.coordinates
                        },
                        properties: {
                            name: "Statistics report area"
                        }
                    }
                }
            }
        }
        
        for (var i = 0; i < aStoreRecordCreationResponse.length; i++) {
            aStoreGuid = aStoreRecordCreationResponse[i].slice(-37, -1);
            aStoreGuidList.push(aStoreGuid);
        }

        processedAStore = {
            nearAPIFeature: nearAPIFeature,
            additionalReportDetails: {
                storeGuids: aStoreGuidList,
                statisticsHistoryGuid: (selectedHistoricalDataGuid === undefined) ? '' : selectedHistoricalDataGuid,
                recordName: historyRecordName,
                selectedTradeAreaId: (selectedStatisticsFeature?.id === undefined || selectedReportType === PowerBIReportType.STORE) ? '' : selectedStatisticsFeature?.id
            }
        }
        return processedAStore;
    }

    /**
     * This function is used to delete existing
     * duplicate "A" store and create new into D365
     */
    function deleteAndCreateApiCall() {
        let ownerIdValue = getUserIdValue();
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_lawsonstore", "?$select=crcef_lawsonstoreid,_ownerid_value&$filter=_ownerid_value eq " + ownerIdValue + "").then((result) => {
                let entities = result.entities;
                let promisesArray = [];

                for (let i = 0; i < entities.length; i++) {
                    let storeId = entities[i].crcef_lawsonstoreid;
                    let promise = new Promise<void>((resolve, reject) => {
                        Xrm.WebApi
                            .deleteRecord("crcef_lawsonstore", storeId).then((res) => {
                                resolve();
                            });
                    });
                    promisesArray.push(promise);
                }
                Promise.all(promisesArray).then(() => {
                    fetchTradeAreaDemographics();
                    // createFilteredAStoreFeaturesApiCall();
                });
            });
    }

    /**
     * This function is used to delete the existing trade area record and 
     * create the new selected trade area record
     */
    function deleteAndCreateSelectedTradeAreaForStatisticsApiCall(polygonFeatureCoordinates: any, storeId: any) {
        let ownerIdValue = getUserIdValue();
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_selectedtradearea", "?$select=crcef_selectedtradeareaid,_ownerid_value&$filter=_ownerid_value eq " + ownerIdValue + "").then((result) => {
                let entities = result.entities;
                let promisesArray = [];

                for (var i = 0; i < entities.length; i++) {
                    let entity = entities[i];
                    let tradeareaId = entity.crcef_selectedtradeareaid;
                    let promise = new Promise<void>((resolve, reject) => {
                        Xrm.WebApi
                            .deleteRecord("crcef_selectedtradearea", tradeareaId).then((res) => {
                                resolve();
                            });
                    });
                    promisesArray.push(promise);
                }

                Promise.all(promisesArray).then(() => {
                    createSelectedTradeAreaApiCallForStatistics(polygonFeatureCoordinates, storeId);
                });
            });
    }

    /**
     * This function is used to delete existing
     * competitor analysis and create new into D365
     */
    function deleteAndCreateCompetitorAnalysisApiCall() {
        let ownerIdValue = getUserIdValue();
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_competitoranalysis", "?$select=crcef_competitoranalysisid,_ownerid_value&$filter=_ownerid_value eq " + ownerIdValue + "").then((result) => {
                let entities = result.entities;
                let deletePromisesArray = [];

                for (var i = 0; i < entities.length; i++) {
                    let entity = entities[i];
                    let competitorAnalysisId = entity.crcef_competitoranalysisid;
                    let promise = new Promise<void>((resolve, reject) => {
                        Xrm.WebApi
                            .deleteRecord("crcef_competitoranalysis", competitorAnalysisId).then((res) => {
                                resolve();
                            });
                    });
                    deletePromisesArray.push(promise);
                }

                Promise.all(deletePromisesArray).then(() => {
                    createCompetitorAnalysisApiCall();
                });
            });
    }

    /**
     * This function is used to delete existing selected trade area
     * and create new for competitor analysis into D365
     */
    function deleteAndCreateSelectedTradeAreaForCompetitorAnalysisApiCall() {
        let ownerIdValue = getUserIdValue();
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_selectedtradearea", "?$select=crcef_selectedtradeareaid,_ownerid_value&$filter=_ownerid_value eq " + ownerIdValue + "").then((result) => {
                let entities = result.entities;
                let deletePromisesArray = [];

                for (let i = 0; i < entities.length; i++) {
                    let tradeareaId = entities[i].crcef_selectedtradeareaid;
                    let promise = new Promise<void>((resolve, reject) => {
                        Xrm.WebApi
                            .deleteRecord("crcef_selectedtradearea", tradeareaId).then((res) => {
                                resolve();
                            });
                    });
                    deletePromisesArray.push(promise);
                }

                Promise.all(deletePromisesArray).then(() => {
                    createSelectedTradeAreaApiCallForCompetitorAnalysis();

                    // close the competitor report modal
                    competitorReportModalToggle();
                });
            })
            .catch(function (error: any) {
                console.log(error);
            });
    }

    /**
     * This function is used to validate the
     * trade area is checked or not in layerlist
     * @param selected button id
     */
    function handleTradeAreaLayerValidation(btnId: string) {
        if (isVisibleTradeAreaLayer() === true) {
            setActiveBtnId(btnId);
        } else {
            alert("Please select the trade area layer");
        }
    }

    /**
     * This function is used to handle the
     * click of hand toolbar button
     * @param React.MouseEvent
     * @param selected button id
     */
    function onHandClick(e: React.MouseEvent, btnId: string) {
        if (map === undefined) {
            return;
        }
        setActiveBtnId(btnId);
    }

    /**
     * This function is used to handle the
     * zoom in on map view
     * @param React.MouseEvent
     * @param selected button id
     */
    function onZoomInClick(e: React.MouseEvent, btnId: string) {
        if (map === undefined) {
            return;
        }
        map.zoomIn();
    }

    /**
     * This function is used to handle the
     * zoom out on map view
     * @param React.MouseEvent
     * @param selected button id
     */
    function onZoomOutClick(e: React.MouseEvent, btnId: string) {
        if (map === undefined) {
            return;
        }
        map.zoomOut();
    }

    /**
     * This function is used to set the
     * state value of info button id
     * @param React.MouseEvent
     * @param selected button id
     */
    function onInfoClick(e: React.MouseEvent, btnId: string) {
        setActiveBtnId(btnId);
    }

    /**
     * This function is used to create the
     * new polygon trade area
     * @param React.MouseEvent
     * @param selected button id
     */
    function onCreatePolygonClick(e: React.MouseEvent, btnId: string) {
        handleTradeAreaLayerValidation(btnId);
    }

    /**
     * This function is used to create the
     * new circle trade area
     * @param React.MouseEvent
     * @param selected button id
     */
    function onCreateCircleClick(e: React.MouseEvent, btnId: string) {
        handleTradeAreaLayerValidation(btnId);
    }

    /**
     * This function is used to create the
     * new "A" store
     * @param React.MouseEvent
     * @param selected button id
     */
    function onCreatePointClick(e: React.MouseEvent, btnId: string) {
        setActiveBtnId(btnId);
    }

    /**
     * This function is used to modify the
     * the existing "A" store
     * @param React.MouseEvent
     * @param selected button id
     */
    function onModifyPointClick(e: React.MouseEvent, btnId: string) {
        setActiveBtnId(btnId);
    }

    /**
     * This function is used to modify the
     * the existing polygon trade area
     * @param React.MouseEvent
     * @param selected button id
     */
    function onModifyPolygonClick(e: React.MouseEvent, btnId: string) {
        handleTradeAreaLayerValidation(btnId);
    }

    /**
     * This function is used to modify the
     * the existing circle trade area
     * @param React.MouseEvent
     * @param selected button id
     */
    function onModifyCircleClick(e: React.MouseEvent, btnId: string) {
        handleTradeAreaLayerValidation(btnId);
    }

    /**
     * This function is used to delete the
     * the existing "A" store, circle and polygon trade area
     * @param React.MouseEvent
     * @param selected button id
     */
    function onDeleteClick(e: React.MouseEvent, btnId: string) {
        setActiveBtnId(btnId);
    }

    /**
     * This function is used to select the
     * the "A" store, circle and polygon trade area
     * @param React.MouseEvent
     * @param selected button id
     */
    function onArrowClick(e: React.MouseEvent, btnId: string) {
        setActiveBtnId(btnId);
    }

    /**
     * This function is used to generate the
     * the report for circle and polygon trade area
     * @param React.MouseEvent
     * @param selected button id
     */
    function onTradeAreaChartClick(e: React.MouseEvent, btnId: string) {
        setActiveBtnId(btnId);
    }

    /**
     * This function is used to generate the
     * the report for "A" store
     * @param React.MouseEvent
     * @param selected button id
     */
    function onAStoreChartClick(e: React.MouseEvent, btnId: string) {
        setActiveBtnId(btnId);
    }

    /**
     * This function is used to generate the
     * the report for competitor statistics
     * @param React.MouseEvent
     * @param selected button id
     */
    function onCompetitorChartClick(e: React.MouseEvent, btnId: string) {
        setActiveBtnId(btnId);
        
        let fetchTradeAreaListPromise = new Promise<void>((resolve, reject) => {
            Xrm.WebApi
                .retrieveMultipleRecords("crcef_lawsontradearea")
                .then(function (response: any) {
                    // Process response
                    resolve(response);
                })
                .catch(function (error: any) {
                    // Handle error
                    reject();
                });
        });
        fetchTradeAreaListPromise.then(function (result: any) {
            let entities = result.entities;
            let tradeAreaInfo : TradeAreaInfo;
            let tradeAreaInfoList : TradeAreaInfo[] = [];
            
            if (entities.length > 0) {
                for (let i = 0; i < entities.length; i++) {
                    let currentFeature = JSON.parse(entities[i].crcef_tradeareajson);
                    tradeAreaInfo = {
                        tradeAreaId: entities[i].crcef_lawsontradeareaid,
                        tradeAreaName: entities[i].crcef_recordname,
                        featureId: currentFeature.id,
                        coordinates: currentFeature.geometry.coordinates
                    }
                    tradeAreaInfoList.push(tradeAreaInfo);
                }
            }
            setTradeAreaList(tradeAreaInfoList);//mockTradeAreaList
        })

        let fetchCompetitorHistoryList = new Promise<void>((resolve, reject) => {
            Xrm.WebApi
                .retrieveMultipleRecords("crcef_competitoranalysishistoryheader")
                .then(function (response: any) {
                    // Process response
                    resolve(response);
                })
                .catch(function (error: any) {
                    // Handle error
                    reject();
                });
        });
        fetchCompetitorHistoryList.then(function (result: any) {
            let entities = result.entities;
            let competitorHistoryInfo : CompetitorReportHistoryInfo;
            let competitorHistoryList : CompetitorReportHistoryInfo[] = [];
            
            if (entities.length > 0) {
                for (var i = 0; i < entities.length; i++) {
                    competitorHistoryInfo = {
                        recordName: entities[i].crcef_recordname,
                        historicalRecordGuid: entities[i].crcef_competitoranalysishistoryheaderid
                    }
                    competitorHistoryList.push(competitorHistoryInfo);
                }
            }
            setCompetitorHistoryList(competitorHistoryList);
        })
        competitorReportModalToggle();
    }

    /**
     * This function is used to refresh
     * all custom layers
     * @param React.MouseEvent
     * @param selected button id
     */
    function onRefreshClick(e: React.MouseEvent, btnId: string) {
        updateIsRefreshAllLayers(true);
    }

    function onBrandAffinityReportClick(e: React.MouseEvent, btnId: string) {
        setActiveBtnId(btnId);
        brandAffinityReportModalToggle();
    }

    /**
     * This function is used to handle
     * button click event for commonly
     * @param React.MouseEvent
     * @param selected button id
     */
    function onToolbarBtnClick(e: React.MouseEvent, btnId: string) {
        let isExist = isUnSaveFeatureExist();
        if (isExist === true) {
            return;
        }
        if (storeStatisticsCircleFeatureId !== undefined) {
            mapDraw.delete(storeStatisticsCircleFeatureId);
            removeAStoreSelectedIcon();
            setStoreStatisticsCircleFeatureId(undefined);
        }

        switch (btnId) {
            case ButtonId.HAND:
                onHandClick(e, btnId);
                break;
            case ButtonId.ZOOM_IN:
                onZoomInClick(e, btnId);
                break;
            case ButtonId.ZOOM_OUT:
                onZoomOutClick(e, btnId);
                break;
            case ButtonId.INFO:
                onInfoClick(e, btnId);
                break;
            case ButtonId.CREATE_POINT:
                onCreatePointClick(e, btnId);
                break;
            case ButtonId.CREATE_POLYGON:
                onCreatePolygonClick(e, btnId);
                break;
            case ButtonId.CREATE_CIRCLE:
                onCreateCircleClick(e, btnId);
                break;
            case ButtonId.MODIFY_POINT:
                onModifyPointClick(e, btnId);
                break;
            case ButtonId.MODIFY_POLYGON:
                onModifyPolygonClick(e, btnId);
                break;
            case ButtonId.MODIFY_CIRCLE:
                onModifyCircleClick(e, btnId);
                break;
            case ButtonId.DRAW_DELETE:
                onDeleteClick(e, btnId);
                break;
            case ButtonId.SELECT:
                onArrowClick(e, btnId);
                break;
            case ButtonId.TRADE_AREA_CHART:
                onTradeAreaChartClick(e, btnId);
                break;
            case ButtonId.A_STORE_CHART:
                onAStoreChartClick(e, btnId);
                break;
            case ButtonId.COMPETITOR_CHART:
                onCompetitorChartClick(e, btnId);
                break;
            case ButtonId.BRAND_AFFINITY:
                onBrandAffinityReportClick(e, btnId);
                break;
            case ButtonId.REFRESH:
                onRefreshClick(e,btnId);
                break;
            default:
                setActiveBtnId(btnId);
                break;
        }
    }

    /**
     * This function is used to validate
     * the circle radius range between 10 to 10000 meter
     * @param radiusInMeter
     * @return boolean value
     */
    function isCircleRadiusValid(radiusInMeter : number){
        if ((radiusInMeter < 10) || (radiusInMeter > 10000)) {
            radiusRestrictionErrorModalToggle();
            return false;
        }
        return true;
    }

    /**
     * This function is used to create or modify
     * the circle and close the modal
     * @param radiusInMeter
     */
    function onCircleConfirm(radiusInMeter: number) {
        if ((map === undefined) || (isCircleRadiusValid(radiusInMeter) === false)) {
            return;
        }

        let radiusInKm = radiusInMeter / 1000;
        let { createTradeArea, modifyPolygonArea } = btnObjRef;
        let { circle: createCircle } = createTradeArea;
        let { circle: modifyCircle } = modifyPolygonArea;

        if (createCircle.isEnable === true) {
            // create new circle
            let newCircle = MapboxDrawGeodesic.createCircle(createCircle.center, radiusInKm);

            newCircle.properties.risk = true;
            mapDraw.add(newCircle);

            createCircle.id = newCircle.id;

            map.fire('draw.create');
            mapDraw.changeMode(GlDrawMode.SIMPLE_SELECT);
        }
        if (modifyCircle.isEnable === true) {
            let drawnCircleId = modifyPolygonArea.featureId;
            if (drawnCircleId !== '') {
                let drawnCircle = mapDraw?.get(drawnCircleId);
                if (drawnCircle !== undefined) {
                    drawnCircle.properties.risk = false;
                    mapDraw.setFeatureProperty(drawnCircleId, 'risk', false);
                    mapDraw.setFeatureProperty(drawnCircleId, 'circleRadius', radiusInKm);
                }
            }

            map.fire('draw.update');
        }
        circleModalToggle();
    }

    /**
     * This function is used to reset the
     * circle refs value and close the modal
     */
    function onCircleCancel() {
        circleModalToggle();

        // Deselect logic
        resetCreateCircleRefValue();
    }

    /**
     * This function is used to trigger the
     * store statistics api call
     */
    function onStoreStatisticsFeatureApiCall() {
        setSelectedReportType(PowerBIReportType.STORE);

        if (map === undefined) {
            return;
        }

        // Waiting time for enable the spinner and new circle is drawing by mapDraw.add method
        setTimeout(() => {
            let selectedTradeAreaFeatures = [mapDraw.get(storeStatisticsCircleFeatureId)];
            let polygonFeatureList = constructPolygonFeatureList(map, selectedTradeAreaFeatures);

            let isPolygonAreaAcceptable = validatePolygonArea(polygonFeatureList);
            if (isPolygonAreaAcceptable === true) {
                let filteredStoreFeatureList: MapboxGl.MapboxGeoJSONFeature[] = [];
                let selectedStoreFeature = getAStoreFeatureById(btnObjRef.createStatistics.storeReport.storeFeatureId);
                if (selectedStoreFeature !== undefined) {
                    filteredStoreFeatureList.push(selectedStoreFeature as MapboxGl.MapboxGeoJSONFeature);
                }
    
                let populationObj = constructPopulationObj(map, polygonFeatureList);
                let competitorObj = constructCompetitorStoreObj(map, polygonFeatureList);

                setSelectedStatisticsFeature(polygonFeatureList[0]);

                triggerTradeAreaStatisticsApiAction(filteredStoreFeatureList, populationObj, competitorObj);

                // Deselect logic
                setActiveBtnId('');
                resetStoreStatesticsRefValue();
            } else {
                setActiveBtnId('');
                setIsLoadingBiReport(false);
                statisticsReportErrorModalToggle();
            }
        }, 1000);
    }

    /**
     * This function is used to validate the
     * first polygon is valid or not
     * @param polygon feature list
     */
    function validatePolygonArea(polygonFeatureList : any){
        let sqMtArea = turf.area(polygonFeatureList[0]);
        let sqFtArea = sqMtArea * 10.76391042;
        
        if (sqFtArea < 5000000) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * This function is used to generate the
     * "A" store statistics report
     * @param radiusInMeter
     */
    function onStoreStatisticsConfirm(radiusInMeter : number){
        if ((map === undefined) || (isCircleRadiusValid(radiusInMeter) === false)) {
            return;
        }

        setIsLoadingBiReport(true);

        let radiusInKm = radiusInMeter / 1000;
        let { createStatistics } = btnObjRef;
        let { storeReport: storeStatistics } = createStatistics;

        if (storeStatistics.isEnable === true) {
            let newCircle = MapboxDrawGeodesic.createCircle(storeStatistics.center, radiusInKm);
            let circleFeaureId = newCircle.id;

            newCircle.properties.risk = true;
            mapDraw.add(newCircle);
            mapDraw.changeMode(GlDrawMode.DIRECT_SELECT, {featureId: circleFeaureId});
            setMapFitBoundsOnStatistics();

            setStoreStatisticsCircleFeatureId(circleFeaureId);
        }
        storeStatisticsModalToggle();
    }

    /**
     * This function is used to cancel the
     * "A" store statistics report and reset the values
     */
    function onStoreStatisticsCancel(){
        if (map === undefined) {
            return;
        }
        storeStatisticsModalToggle();

        // Deselect logic
        setActiveBtnId('');
        resetStoreStatesticsRefValue();
        removeAStoreSelectedIcon();
        setStoreStatisticsCircleFeatureId(undefined);
    }

    /**
     * This function is used to modify the
     * existing "A" store feature
     */
    function onStoreModifyConfirm() {
        let { modifyPolygonArea } = btnObjRef;
        let { featureId: modifyFeatureId } = modifyPolygonArea;

        let storeFeature = getAStoreFeatureById(modifyFeatureId);
        if (storeFeature !== undefined) {
            let updateAStoreFeature = JSON.parse(JSON.stringify(storeFeature));
            let { point: modifyPoint } = modifyPolygonArea;
            let { latitude, longitude } = modifyPoint;

            // Construct feature properties
            if (updateAStoreFeature.properties === null) {
                updateAStoreFeature.properties = {};
                updateAStoreFeature.properties.crcef_duplicatelawsonstoredataid = modifyFeatureId;
            }
            let updatedFeatureProp = Object.assign({}, updateAStoreFeature.properties, {
                "crcef_lat": latitude,
                "crcef_lon": longitude
            });
            updateAStoreFeature.properties = updatedFeatureProp;

            // set geometry coords
            (updateAStoreFeature.geometry as GeoJSON.Point).coordinates = [longitude, latitude];
            // trigger update api
            triggerAStoreApiActions(AStoreActionId.UPDATE, updateAStoreFeature);
        } else {
            console.error('onStoreModifyConfirm error');
        }

        storeModifyModalToggle();

        // Deselect logic
        resetModifyPointRefValue();
        setActiveBtnId('');
    }

    /**
     * This function is used to cancel the
     * existing "A" store feature modification
     */
    function onStoreModifyCancel() {
        storeModifyModalToggle();

        // Deselect logic
        showAStoreFeatureOnMap();
        resetModifyPointRefValue();
        setActiveBtnId('');
    }

    /**
     * This function is used to delete the
     * existing "A" store feature
     */
    function onStoreDeleteConfirm() {
        let { modifyPolygonArea } = btnObjRef;
        let { featureId: deleteFeatureId } = modifyPolygonArea;

        let storeFeature = getAStoreFeatureById(deleteFeatureId);
        if (storeFeature != undefined) {
            triggerAStoreApiActions(AStoreActionId.DELETE, storeFeature);
        } else {
            console.error('onStoreDeleteConfirm error');
        }

        storeDeleteModalToggle();

        // Deselect logic
        resetModifyPointRefValue();
        setActiveBtnId('');
    }

    /**
     * This function is used to cancel the
     * existing "A" store feature deletion
     */
    function onStoreDeleteCancel() {
        storeDeleteModalToggle();

        // Deselect logic
        resetModifyPointRefValue();
        setActiveBtnId('');
    }

    /**
     * This function is used to create the
     * new trade area feature
     */
    function onTradeAreaCreateConfirm(recordName: string) {
        setTradeAreaRecordName(recordName);

        let tradeAreaFeatureList = layerObj.tradeAreaLayer.featureList; 
        let existingFeature = tradeAreaFeatureList.find(tradeArea => (tradeArea.properties!.name).toUpperCase() === recordName.toUpperCase());

        if (existingFeature !== undefined) {
            alert("Trade area with the same name exists");
        } else {
            if (unSaveNewTradeAreaFeatureId !== undefined) {
                let drawnFeature = mapDraw.get(unSaveNewTradeAreaFeatureId);
                triggerTradeAreaApiActions(TradeAreaActionId.CREATE, drawnFeature);
            } else {
                console.error("onTradeAreaCreateConfirm error");
            }

            tradeAreaCreateModalToggle();

            let { createTradeArea } = btnObjRef;

            // Deselect logic
            createTradeArea.featureId = "";
            resetCreateCircleRefValue();
            setUnSaveNewTradeAreaFeatureId(undefined);
            setActiveBtnId('');
        }
    }
    
    /**
     * This function is used to cancel the
     * new trade area feature creation
     */
    function onTradeAreaCreateCancel() {
        if (unSaveNewTradeAreaFeatureId !== undefined) {
            mapDraw?.delete(unSaveNewTradeAreaFeatureId);
        } else {
            console.error("onTradeAreaCreateCancel error");
        }

        tradeAreaCreateModalToggle();

        let { createTradeArea } = btnObjRef;

        // Deselect logic
        createTradeArea.featureId = "";
        resetCreateCircleRefValue();
        setUnSaveNewTradeAreaFeatureId(undefined);
        setActiveBtnId('');
    }

    /**
     * This function is used to modify the
     * existing trade area feature
     */
    function onTradeAreaModifyConfirm(recordName: string) {
        let tradeAreaFeatureList = layerObj.tradeAreaLayer.featureList; 
        let existingFeature = tradeAreaFeatureList.find(tradeArea => tradeArea.id !== btnObjRef.modifyPolygonArea.featureId && (tradeArea.properties!.name).toUpperCase() === recordName.toUpperCase());

        if (existingFeature !== undefined) {
            alert("Trade area with the same name exists");
        } else {
            if ((unSaveModifyTradeAreaFeatureId !== undefined) || (btnObjRef.modifyPolygonArea.recordName !== recordName)) {
                setTradeAreaRecordName(recordName);
                let updateDrawnFeature = mapDraw.get(btnObjRef.modifyPolygonArea.featureId);
                triggerTradeAreaApiActions(TradeAreaActionId.UPDATE, updateDrawnFeature);
            } else {
                console.error("onTradeAreaModifyConfirm error");
            }

            tradeAreaModifyModalToggle();

            // Deselect logic
            setUnSaveModifyTradeAreaFeatureId(undefined);
            setActiveBtnId('');
            btnObjRef.modifyPolygonArea.featureId = "";
        }
    }

    /**
     * This function is used to cancel the
     * existing trade area feature modification
     */
    function onTradeAreaModifyCancel() {
        if (unSaveModifyTradeAreaFeatureId !== undefined) {
            mapDraw?.delete(unSaveModifyTradeAreaFeatureId);

            let unSaveTradeAreaFeature = getTradeAreaFeatureById(unSaveModifyTradeAreaFeatureId);
            if (unSaveTradeAreaFeature !== undefined) {
                mapDraw?.add(unSaveTradeAreaFeature);
            } else {
                console.error("onTradeAreaModifyCancel - existing feature add error");
            }
        } else {
            console.error("onTradeAreaModifyCancel error");
        }

        tradeAreaModifyModalToggle();

        // Deselect logic
        setUnSaveModifyTradeAreaFeatureId(undefined);
        setActiveBtnId('');
        btnObjRef.modifyPolygonArea.featureId = "";
    }

    /**
     * This function is used to delete the
     * existing trade area feature
     */
    function onTradeAreaDeleteConfirm() {
        let id = btnObjRef.modifyPolygonArea.featureId;
        let deletableDrawnFeature = mapDraw.get(id);

        if (deletableDrawnFeature !== undefined) {
            triggerTradeAreaApiActions(TradeAreaActionId.DELETE, deletableDrawnFeature);
            mapDraw?.delete(deletableDrawnFeature.id);
            map?.fire('draw.delete');
        } else {
            console.error("onTradeAreaDeleteConfirm error");
        }

        tradeAreaDeleteModalToggle();

        // Deselect logic
        btnObjRef.modifyPolygonArea.featureId = "";
        setActiveBtnId('');
    }

    /**
     * This function is used to cancel the
     * existing trade area feature deletion
     */
    function onTradeAreaDeleteCancel() {
        tradeAreaDeleteModalToggle();

        // Deselect logic
        btnObjRef.modifyPolygonArea.featureId = "";
        setActiveBtnId('');
    }

    /**
     * This function is used to generate the
     * trade area statistics report
     */
    function onTradeAreaStatisticsConfirm() {
        setSelectedReportType(PowerBIReportType.TRADE_AREA);

        if (map === undefined) {
            return;
        }

        setIsLoadingBiReport(true);
        // Waiting time for enable the spinner
        setTimeout(() => {
            let selectedTradeAreaFeatures = mapDraw.getSelected().features;
            let polygonFeatureList = constructPolygonFeatureList(map, selectedTradeAreaFeatures);
            let isPolygonAreaAcceptable = validatePolygonArea(polygonFeatureList);

            if (isPolygonAreaAcceptable === true) {
                let filteredStoreFeatureList = filterStoreDataWithInPolygon(map, polygonFeatureList);
                if (filteredStoreFeatureList.length === 0) {
                    let initialAStoreFeature = JSON.parse(JSON.stringify(initialAStoreGeojsonInfo));
                    initialAStoreFeature.properties = Object.assign(initialAStoreFeature.properties, {
                        crcef_storename: 'Trade Area Without Store A',
                        crcef_duplicatelawsonstoredataid: initialAStoreFeature.id
                    });

                    setMockAStoreFeature(initialAStoreFeature);
                    filteredStoreFeatureList = [initialAStoreFeature];
                }

                let populationObj = constructPopulationObj(map, polygonFeatureList);
                let competitorObj = constructCompetitorStoreObj(map, polygonFeatureList);

                setSelectedStatisticsFeature(polygonFeatureList[0]);
                triggerTradeAreaStatisticsApiAction(filteredStoreFeatureList, populationObj, competitorObj);
                setActiveBtnId('');
            } else {
                setActiveBtnId('');
                statisticsReportErrorModalToggle();
                setIsLoadingBiReport(false);
            }
        }, 1000);

        tradeAreaStatisticsModalToggle();
    }

    /**
     * This function is used to cancel the
     * trade area statistics report generation
     */
    function onTradeAreaStatisticsCancel() {
        tradeAreaStatisticsModalToggle();
        setActiveBtnId('');
    }

    /**
     * This function is used to fetch
     * the historical data from D365 history entity
     * @param historyId
     */
    function onListOfHistoricalShow(historyId: string) {
        if (map === undefined) {
            return;
        }
        setSelectedHistoricalDataGuid(historyId);
        setIsLoadingBiReport(true);
        listOfHistoricalModalToggle();
    }
    
    /**
     * This function is used to delete
     * the historical data from D365 history entity
     * @param historyId
     */
    function onListOfHistoricalDelete(historyId: string) {
        setDeleteStatisticsHistoryRecordGuid(historyId);
        listOfHistoricalModalToggle();

        deleteStatisticsModalToggle();
    }

    /**
     * This function is used to generate new
     * footfall and location data from Near Api Call
     * @param recordName
     */
    function onListOfHistoricalGenerateNewReport(recordName: string) {
        if (map === undefined) {
            return;
        }
        setHistoryRecordName(recordName);
        setSelectedHistoricalDataGuid('');
        setIsLoadingBiReport(true);
        listOfHistoricalModalToggle();
    }

    /**
     * This function is used to reset the
     * circle refs value and close the modal
     */
    function onListOfHistoricalCancel() {
        setActiveBtnId('');
        listOfHistoricalModalToggle();
    }

    function onCompetitorHistoryShow(historyId: string) {
        if (map === undefined) {
            return;
        }
        
        setIsLoadingBiReport(true);
        setCompetitorHistoryGuid(historyId);

        // close the competitor report modal
        competitorReportModalToggle();
    }

    function onDeleteStatisticsDataConfirm() {
        if (map === undefined) {
            return;
        }
        Xrm.WebApi
            .deleteRecord("crcef_historicallawsondata", deleteStatisticsHistoryRecordGuid).then(function (response: any) {
                // Process response
                console.log("deleted successfully")
            })
            .catch(function (error: any) {
                // Handle error
            });
        
        deleteStatisticsModalToggle();
        setSelectedReportType(undefined);
        setDeleteStatisticsHistoryRecordGuid('');
    }

    function onDeleteStatisticsDataCancel() {
        setDeleteStatisticsHistoryRecordGuid('');
        deleteStatisticsModalToggle();
        listOfHistoricalModalToggle();
    }

    function onCompetitorHistoryDelete(historyId: string) {
        setDeleteCompetitorAnalysisHistoryHeaderGuid(historyId);
        competitorReportModalToggle();

        deleteCompetitorModalToggle();
    }

    function onGenerateNewCompetitorReport(recordName: string, fromDate: Date, toDate: Date) {
        if (map === undefined) {
            return;
        }
        if (!isValidCompetitorReport(recordName, fromDate, toDate)) {
            return;
        }

        setIsLoadingBiReport(true);

        // Competitor Period start and end date
        let ISOStartDate = fromDate.toISOString();
        let ISOEndDate = toDate.toISOString();
        let periodStartDate = ISOStartDate.substring(0, ISOStartDate.length-5).replace('T' , " ")
        let periodEndDate = ISOEndDate.substring(0, ISOEndDate.length-5).replace('T00:00:00' , " 23:59:59");

        // Prepare competitor feature list for selected mall
        let competitorFeaturesList = selectedTradeAreaList.map(tradeArea => {
            let competitorFeature: GeoJSON.Feature;
            competitorFeature = {
                type: "Feature",
                id: tradeArea.tradeAreaId,
                properties: {
                    name: tradeArea.tradeAreaName
                },
                geometry: {
                    type: "Polygon",
                    coordinates: tradeArea.coordinates
                }
            }
            return competitorFeature;
        });

        // add area to competitor feature list
        competitorFeaturesList.forEach((feature : any) => {
            let polygonArea = turf.area(feature.geometry);
            feature.properties.area = polygonArea;
        });

        // sorting of competitor feature list
        competitorFeaturesList.sort(function(a: any, b: any) { return b.properties.area - a.properties.area; });

        setCompetitorRecordName(recordName);
        setCompetitorPeriodEndDate(periodEndDate);
        setCompetitorPeriodStartDate(periodStartDate);
        setCompetitorNearApiFeatureList(competitorFeaturesList);
    }

    /**
     * This function is used to update the
     * demographic line information into existing
     * competitor selected trade area feature list
     */
    function updateDemographicLineToCompetitorSelectedTradeAreaFeatureList() {
        //let startDate0hr = competitorPeriodStartDate.replace(' ', 'T');//2022-01-18T00:00:00
        //let startDate23hr = startDate0hr.replace('00:00:00', '23:59:59');//2022-01-18T23:59:59

        //let endDate23hr = competitorPeriodEndDate.replace(' ', 'T');//2022-01-19T23:59:59
        //let endDate0hr = endDate23hr.replace('23:59:59', '00:00:00');//2022-01-19T00:00:00

        let fetchDemographicsHeaderPromise = new Promise<void>((resolve, reject) => {
            let startDate = competitorPeriodStartDate.substring(0, 10);
            let endDate = competitorPeriodEndDate.substring(0, 10);

            Xrm.WebApi
                .retrieveMultipleRecords("crcef_demographicdataheader", "?$select=crcef_name,crcef_startdate,crcef_enddate,crcef_demographicdataheaderid&$filter=crcef_startdate eq "+ startDate + " and crcef_enddate eq " + endDate)
                /*.retrieveMultipleRecords("crcef_demographicdataheader", "?$select=crcef_name,crcef_startdate,crcef_enddate,crcef_demographicdataheaderid&$filter=crcef_startdate ge '"+ startDate0hr + "'" + " and crcef_startdate le '" + startDate23hr + "'" + " and crcef_enddate ge '" + endDate0hr + "'" + " and crcef_enddate le '" + endDate23hr + "'")*/
                .then(function (response: any) {
                    // Process response
                    resolve(response);
                })
                .catch(function (error: any) {
                    // Handle error
                    reject();
                });
        });

        fetchDemographicsHeaderPromise.then(function (result: any) {
            let headerEntities = result.entities;

            // demo line
            let demographicLinePromise = new Promise<void>((resolve, reject) => {
                let headerEntity = headerEntities[0];
                let demographicHeaderId = headerEntity.crcef_demographicdataheaderid;

                console.log("Header ID >>>>>>>", demographicHeaderId);
                Xrm.WebApi
                    .retrieveMultipleRecords("crcef_demographicdata","?$select=_crcef_headerid_value,_crcef_tradearea_value,crcef_demographicdataid,crcef_tradeareasname&$filter=_crcef_headerid_value eq '"+ demographicHeaderId + "'")
                    .then((lineResponse: any) => {
                        resolve(lineResponse);
                    });
            });

            demographicLinePromise.then(function (result: any) {
                let lineEntities = result.entities;
                let lineDetailsList: DemographicLineDetails[] = [];

                for (let i = 0; i < lineEntities.length; i++) {
                    let lineEntity = lineEntities[i];
                    let lineDetails: DemographicLineDetails = {
                        tradeAreaId: lineEntity._crcef_tradearea_value,
                        tradeAreaName: lineEntity.crcef_tradeareasname,
                        lineGuid: lineEntity.crcef_demographicdataid
                    }
                    lineDetailsList.push(lineDetails);
                }

                let competitorFeatureWithDemographicList = competitorNearApiFeatureList.slice();
                competitorFeatureWithDemographicList.forEach((feature: GeoJSON.Feature) => {
                    let properties = feature.properties;
                    let currentLineDetails = lineDetailsList.find(line => line.tradeAreaId === feature.id);

                    if (properties !== null) {
                        properties.demographicLineGuid = currentLineDetails?.lineGuid;
                    }
                });

                let weekdifference = Math.ceil((new Date(competitorPeriodEndDate).getTime() - new Date(competitorPeriodStartDate).getTime()) / (7 * 24 * 60 * 60 * 1000));

                let maxArea = 0;
                switch (weekdifference) {
                    case 1:
                        maxArea = 450000; 
                        break;
                    case 2:
                        maxArea = 350000;
                        break;
                    case 3:
                        maxArea = 180000;
                        break;
                    case 4:
                        maxArea = 125000;
                        break;
                    case 5:
                        maxArea = 75000;
                        break;
                    case 6:
                        maxArea = 50000;
                        break;
                }

                setCompetitorMaxArea(maxArea);
                setCompetitorNearApiFeatureWithDemographicList(competitorFeatureWithDemographicList);
            })
            .catch(function(result) {
                // loader is hide if demographic line promise throws error.
                setIsLoadingBiReport(false);
            })
        })
        .catch(function (error: any) {
            // loader is hide if demographic header promise throws error.
            setIsLoadingBiReport(false);
        });
    }

    /**
     * This function is used to update the
     * competitor split selected trade area feature list
     */
    function updateComptitorSplitSelectedTradeAreaFeatureList() {
        let competitorSplitFeaturesList: GeoJSON.Feature[][] = [];
        let competitorFeatureWithDemographicLineList = competitorNearApiFeatureWithDemographicList.slice();

        while (competitorFeatureWithDemographicLineList.length !== 0) {
            let maxAreaLimit = competitorMaxArea;
            let splittedarray: GeoJSON.Feature[] = [];

            for (let i = 0; i < competitorFeatureWithDemographicLineList.length; i++) {
                let competitorFeature = competitorFeatureWithDemographicLineList[i];
                let competitorFeatureProp = competitorFeature.properties;

                if (competitorFeatureProp !== null) {
                    let competitorFeatureArea = competitorFeatureProp.area
                    if (competitorFeatureArea > competitorMaxArea) {
                        setErrorTradeAreaName(competitorFeatureProp.name);
                        return [];
                    }

                    let conditionValue = maxAreaLimit - competitorFeatureArea;
                    if (conditionValue === 0) {
                        splittedarray.push(competitorFeature);
                        break;
                    } else if (conditionValue > 0) {
                        splittedarray.push(competitorFeature);
                        maxAreaLimit = maxAreaLimit - competitorFeatureArea;
                    }
                }
            }

            competitorSplitFeaturesList.push(splittedarray);
            competitorFeatureWithDemographicLineList = competitorFeatureWithDemographicLineList.filter((item:any) => !splittedarray.includes(item))
        }

        setCompetitorSplitNearApiFeatureList(competitorSplitFeaturesList);
    }

    function onCompetitorReportCancel() {
        competitorReportModalToggle();
        setActiveBtnId('');
        setSelectedTradeAreaList([]);
    }

    function onTradeAreaCheckboxChanged(tradeAreaId: string) {
        let selectedTradeAreaIndex = selectedTradeAreaList.findIndex(tradeArea => tradeArea.tradeAreaId === tradeAreaId);

        if (selectedTradeAreaIndex >= 0) {
            let refSelectedTradeAreaList = selectedTradeAreaList;
            refSelectedTradeAreaList.splice(selectedTradeAreaIndex, 1);
            setSelectedTradeAreaList(refSelectedTradeAreaList);

            mapDraw.changeMode(GlDrawMode.SIMPLE_SELECT);
        } else {
            let selectedTradeArea = tradeAreaList.find(tradeArea => tradeArea.tradeAreaId === tradeAreaId);
            if (selectedTradeArea !== undefined) {
                selectedTradeAreaList.push(selectedTradeArea);
                setSelectedTradeAreaList(selectedTradeAreaList);

                mapDraw.changeMode(GlDrawMode.DIRECT_SELECT, {featureId: selectedTradeArea.featureId});

                let fitBoundOptions = {
                    padding: {top: 15, bottom: 80, left: 15, right: 500}
                };
                setMapFitBoundsOnStatistics(fitBoundOptions);
            }
        }
    }

    function onDeleteCompetitorDataConfirm() {
        if (map === undefined) {
            return;
        }
        //Check if cascading delete happens in line records
        Xrm.WebApi
            .deleteRecord("crcef_competitoranalysishistoryheader", deleteCompetitorAnalysisHistoryHeaderGuid).then(function (response: any) {
                    // Process response
                    console.log("deleted successfully")
                })
                .catch(function (error: any) {
                    // Handle error
                });

        deleteCompetitorModalToggle();
        setActiveBtnId('');
        setDeleteCompetitorAnalysisHistoryHeaderGuid('');
    }

    function onDeleteCompetitorDataCancel() {
        setDeleteCompetitorAnalysisHistoryHeaderGuid('');
        deleteCompetitorModalToggle();
        competitorReportModalToggle();
    }

    function onGenerateBrandAffinityData(fromDate: Date, toDate: Date) {
        let today = new Date();
        validateReportDates(fromDate, toDate, today);
        setIsLoadingBiReport(true);

        let ISOStartDate = fromDate.toISOString();//2022-01-18T00:00:00.000Z
        let ISOEndDate = toDate.toISOString();//
        let periodStartDate = ISOStartDate.substring(0, ISOStartDate.length-5).replace('T' , " ")//2022-01-16 00:00:00
        let periodEndDate = ISOEndDate.substring(0, ISOEndDate.length-5).replace('T00:00:00' , " 23:59:59");//2022-01-16 23:59:59

        let startDate = periodStartDate.substring(0, 10);
        let endDate = periodEndDate.substring(0, 10);
        //let startDate0hr = periodStartDate.replace(' ', 'T');//2022-01-18T00:00:00
        //let startDate23hr = startDate0hr.replace('00:00:00', '23:59:59');//2022-01-18T23:59:59

        //let endDate23hr = periodEndDate.replace(' ', 'T');//2022-01-19T23:59:59
        //let endDate0hr = endDate23hr.replace('23:59:59', '00:00:00');//2022-01-19T00:00:00

        let fetchDemographicsHeaderPromise = new Promise<void>((resolve, reject) => {
            Xrm.WebApi
                .retrieveMultipleRecords("crcef_brandaffinityheader", "?$select=crcef_brandaffinityheaderid,crcef_fromdate,crcef_todate&$filter=crcef_fromdate eq "+ startDate + " and crcef_todate eq " + endDate)
                // .retrieveMultipleRecords("crcef_brandaffinityheader", "?$select=crcef_brandaffinityheaderid,crcef_fromdate,crcef_todate&$filter=crcef_fromdate ge '"+ startDate0hr + "'" + " and crcef_fromdate le '" + startDate23hr + "'" + " and crcef_todate ge '" + endDate0hr + "'" + " and crcef_todate le '" + endDate23hr + "'")
                .then(function (response: any) {
                    // Process response
                    resolve(response);
                })
                .catch(function (error: any) {
                    // Handle error
                    reject();
                });
        });
        fetchDemographicsHeaderPromise.then(function (result: any) {
            let entities = result.entities;

            if (entities.length === 0) {
                setIsLoadingBiReport(false);
                alert("Please select a valid date range for which brand affinity details is available");
            }
            else {
                let brandAffinityHeaderId = entities[0].crcef_brandaffinityheaderid;

                let additionalDetails = {
                    startDate: periodStartDate,
                    endDate: periodEndDate,
                    brandAffinityHeaderGuid: brandAffinityHeaderId
                };

                createBrandAffinitySelectedTradeArea(JSON.stringify(additionalDetails));
            }
        });

        setActiveBtnId('');
        brandAffinityReportModalToggle()
    }

    function onBrandAffinityReportCancel() {
        brandAffinityReportModalToggle();
        setActiveBtnId('');
    }

    function createBrandAffinitySelectedTradeArea(additionalDetails: any) {
        let ownerIdValue = getUserIdValue();
        let request = {
            entityName: "crcef_selectedtradearea",
            entity: {
                crcef_storeid : additionalDetails,
                crcef_reporttype: ReportTypeValue.BRAND_AFFINITY
            }
        };

        Xrm.WebApi
            .retrieveMultipleRecords("crcef_selectedtradearea", "?$select=crcef_selectedtradeareaid,_ownerid_value&$filter=_ownerid_value eq " + ownerIdValue + "").then((result) => {
                let entities = result.entities;
                let promisesArray = [];

                for (var i = 0; i < entities.length; i++) {
                    let tradeareaId = entities[i].crcef_selectedtradeareaid;
                    let promise = new Promise<void>((resolve, reject) => {
                        Xrm.WebApi
                            .deleteRecord("crcef_selectedtradearea", tradeareaId).then((res) => {
                                resolve();
                            });
                    });
                    promisesArray.push(promise);
                }

                Promise.all(promisesArray).then(() => {
                    WebApiClient.Create(request)
                        .then(function (response: any) {
                            // Process response
                            showPowerBiBrandAffinityReport();
                        })
                        .catch(function (error: any) {
                            // Handle error
                            let errorMessage: string = error.message;
                            let errorContent = errorMessage.split(": ");
                            setNearApiErrorMessage("Near API has return the following error" + errorMessage.toUpperCase());
                            nearApiErrorModalToggle();
                            setIsLoadingBiReport(false);
                            console.log(error);
                        });
                });
            });
    }

    /**
     * This function is used to reset the
     * button and modify feature id
     */
    function onSelfIntersectionErrorModalClose() {
        setActiveBtnId('');
        setUnSaveModifyTradeAreaFeatureId(undefined);
        selfIntersectionErrorModalToggle();
    }

    /**
     * This function is used to create the
     * dashboard url to generate the power bi report
     */
    function showPowerBiStatisticsReport() {
        let globalContext = Xrm.Utility.getGlobalContext();
        let orgurl = globalContext.getClientUrl();

        let dashboardUrl = "";
        if (mockAStoreFeature !== undefined) {
            setMockAStoreFeature(undefined);
            dashboardUrl = `${orgurl}/dashboards/dashboard.aspx?dashboardId=b1262a4d-7743-eb11-a813-000d3a1a2401&dashboardType=1030&pagemode=iframe`;
        } else {
            //dashboardUrl = `${orgurl}/dashboards/dashboard.aspx?dashboardId=9DD79E5B-07F8-EA11-A815-000D3A8FAAA7&dashboardType=1030&pagemode=iframe`;
            dashboardUrl = tradeAreaStatisticsDashboardURL;
        }

        setTimeout(() => {
            setIsLoadingBiReport(false);
            window.open(dashboardUrl);
        }, 6000);
    }

    function showPowerBiCompetitorReport() {
        setTimeout(() => {
            setIsLoadingBiReport(false);
            window.open(competitorAnalysisDashboardURL);
        }, 6000);
    }

    function showPowerBiBrandAffinityReport() {
        let globalContext = Xrm.Utility.getGlobalContext();
        let orgurl = globalContext.getClientUrl();

        let dashboardUrl = `${orgurl}/dashboards/dashboard.aspx?dashboardId=235078f9-198f-ec11-b400-000d3a36e92f&dashboardType=1030&pagemode=iframe`;
        //let dashboardUrl = `${orgurl}/dashboards/dashboard.aspx?dashboardId=b1262a4d-7743-eb11-a813-000d3a1a2401&dashboardType=1030&pagemode=iframe`;

        setTimeout(() => {
            setIsLoadingBiReport(false);
            window.open(dashboardUrl);
        }, 6000);
    }

    return (
        <>
            { isLoadingBiReport && <SpinnerFC></SpinnerFC>}
            <div className="toolbar-container">
                <a ref={toggleBtnRef.cb} href="#" className="toolbar-toggle-btn" onClick={(e: React.MouseEvent) => toggleBtnRef.onClick(e)}>
                    <i className="fa fa-angle-up"></i>
                    <i className="fa fa-angle-down"></i>
                </a>
                <div ref={navigationRef} className="toolbar-navigation toolbar">
                    <div className="button-group-grid">
                        <div className="button-group-header">Map Operation</div>
                        <div className="button-group-header">Create Store/Trade Area</div>
                        <div className="button-group-header">Modify Store/Trade Area</div>
                        <div className="button-group-header">Statistics</div>
                        <div className="button-group-header">Refresh</div>

                        <div className="button-group-content">
                            <ToolbarButtonFC tooltipName={TooltipName.HAND} btnId={ButtonId.HAND} activeBtnId={activeBtnId} onClickHandler={onToolbarBtnClick}>
                                <image href={handImg} />
                            </ToolbarButtonFC>
                            <ToolbarButtonFC tooltipName={TooltipName.ZOOM_IN} btnId={ButtonId.ZOOM_IN} activeBtnId={activeBtnId} onClickHandler={onToolbarBtnClick}>
                                <path
                                    d="M13 10h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2zm8.172 14l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z" />
                            </ToolbarButtonFC>
                            <ToolbarButtonFC tooltipName={TooltipName.ZOOM_OUT} btnId={ButtonId.ZOOM_OUT} activeBtnId={activeBtnId} onClickHandler={onToolbarBtnClick}>
                                <path
                                    d="M13 10h-8v-2h8v2zm8.172 14l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z" />
                            </ToolbarButtonFC>
                            <ToolbarButtonFC tooltipName={TooltipName.INFO} btnId={ButtonId.INFO} activeBtnId={activeBtnId} onClickHandler={onToolbarBtnClick}>
                                <image href={infoImg} />
                            </ToolbarButtonFC>
                        </div>
                        <div className="button-group-content">
                            <ToolbarButtonFC tooltipName={TooltipName.CREATE_POINT} btnId={ButtonId.CREATE_POINT} activeBtnId={activeBtnId} onClickHandler={onToolbarBtnClick}>
                                <image href={pointImg} />
                            </ToolbarButtonFC>
                            <ToolbarButtonFC tooltipName={TooltipName.CREATE_POLYGON} btnId={ButtonId.CREATE_POLYGON} activeBtnId={activeBtnId} onClickHandler={onToolbarBtnClick}>
                                <path
                                    d="M16 0v2h-8v-2h8zm0 24v-2h-8v2h8zm2-22h4v4h2v-6h-6v2zm-18 14h2v-8h-2v8zm2-10v-4h4v-2h-6v6h2zm22 2h-2v8h2v-8zm-2 10v4h-4v2h6v-6h-2zm-16 4h-4v-4h-2v6h6v-2z" />
                            </ToolbarButtonFC>
                            <ToolbarButtonFC tooltipName={TooltipName.CREATE_CIRCLE} btnId={ButtonId.CREATE_CIRCLE} activeBtnId={activeBtnId} onClickHandler={onToolbarBtnClick}>
                                <path
                                    d="M1.341 6.502c1.11-2.157 2.877-3.984 5.162-5.16l.766 1.848c-1.779.954-3.169 2.393-4.074 4.081l-1.854-.769zm5.93 14.302c-1.688-.904-3.126-2.294-4.08-4.074l-1.848.765c1.175 2.286 3.002 4.054 5.16 5.165l.768-1.856zm-4.845-5.921c-.584-1.932-.549-3.932.005-5.765l-1.856-.768c-.739 2.311-.782 4.852.003 7.299l1.848-.766zm5.925-14.306l.766 1.848c1.932-.583 3.933-.549 5.765.005l.77-1.855c-2.313-.74-4.853-.782-7.301.002zm8.378 2.619c1.688.905 3.126 2.294 4.079 4.073l1.848-.766c-1.176-2.285-3.002-4.052-5.159-5.163l-.768 1.856zm4.845 5.919c.584 1.933.549 3.933-.005 5.766l1.855.769c.74-2.311.782-4.853-.003-7.301l-1.847.766zm-.77 7.614c-.904 1.688-2.294 3.126-4.072 4.08l.766 1.848c2.285-1.176 4.052-3.003 5.162-5.16l-1.856-.768zm-5.92 4.845c-1.933.584-3.933.549-5.766-.005l-.77 1.856c2.312.739 4.853.782 7.301-.002l-.765-1.849z" />
                            </ToolbarButtonFC>
                        </div>
                        <div className="button-group-content">
                            <ToolbarButtonFC tooltipName={TooltipName.MODIFY_POINT} btnId={ButtonId.MODIFY_POINT} activeBtnId={activeBtnId} onClickHandler={onToolbarBtnClick}>
                                <image href={pointImg} />
                            </ToolbarButtonFC>
                            <ToolbarButtonFC tooltipName={TooltipName.MODIFY_POLYGON} btnId={ButtonId.MODIFY_POLYGON} activeBtnId={activeBtnId} onClickHandler={onToolbarBtnClick}>
                                <path
                                    d="M16 0v2h-8v-2h8zm0 24v-2h-8v2h8zm2-22h4v4h2v-6h-6v2zm-18 14h2v-8h-2v8zm2-10v-4h4v-2h-6v6h2zm22 2h-2v8h2v-8zm-2 10v4h-4v2h6v-6h-2zm-16 4h-4v-4h-2v6h6v-2z" />
                            </ToolbarButtonFC>
                            <ToolbarButtonFC tooltipName={TooltipName.MODIFY_CIRCLE} btnId={ButtonId.MODIFY_CIRCLE} activeBtnId={activeBtnId} onClickHandler={onToolbarBtnClick}>
                                <path
                                    d="M1.341 6.502c1.11-2.157 2.877-3.984 5.162-5.16l.766 1.848c-1.779.954-3.169 2.393-4.074 4.081l-1.854-.769zm5.93 14.302c-1.688-.904-3.126-2.294-4.08-4.074l-1.848.765c1.175 2.286 3.002 4.054 5.16 5.165l.768-1.856zm-4.845-5.921c-.584-1.932-.549-3.932.005-5.765l-1.856-.768c-.739 2.311-.782 4.852.003 7.299l1.848-.766zm5.925-14.306l.766 1.848c1.932-.583 3.933-.549 5.765.005l.77-1.855c-2.313-.74-4.853-.782-7.301.002zm8.378 2.619c1.688.905 3.126 2.294 4.079 4.073l1.848-.766c-1.176-2.285-3.002-4.052-5.159-5.163l-.768 1.856zm4.845 5.919c.584 1.933.549 3.933-.005 5.766l1.855.769c.74-2.311.782-4.853-.003-7.301l-1.847.766zm-.77 7.614c-.904 1.688-2.294 3.126-4.072 4.08l.766 1.848c2.285-1.176 4.052-3.003 5.162-5.16l-1.856-.768zm-5.92 4.845c-1.933.584-3.933.549-5.766-.005l-.77 1.856c2.312.739 4.853.782 7.301-.002l-.765-1.849z" />
                            </ToolbarButtonFC>
                            <ToolbarButtonFC tooltipName={TooltipName.DRAW_DELETE} btnId={ButtonId.DRAW_DELETE} activeBtnId={activeBtnId} onClickHandler={onToolbarBtnClick}>
                                <image href={deleteImg} />
                            </ToolbarButtonFC>
                        </div>
                        <div className="button-group-content">
                            <ToolbarButtonFC tooltipName={TooltipName.TRADE_AREA_CHART} btnId={ButtonId.TRADE_AREA_CHART} activeBtnId={activeBtnId} onClickHandler={onToolbarBtnClick}>
                                <image href={tradeAreaReportImg} />
                            </ToolbarButtonFC>
                            <ToolbarButtonFC tooltipName={TooltipName.COMPETITOR_CHART} btnId={ButtonId.COMPETITOR_CHART} activeBtnId={activeBtnId} onClickHandler={onToolbarBtnClick}>
                                <image href={competitorAnalysisReportImg} />
                            </ToolbarButtonFC>
                            <ToolbarButtonFC tooltipName={TooltipName.BRAND_AFFINITY} btnId={ButtonId.BRAND_AFFINITY} activeBtnId={activeBtnId} onClickHandler={onToolbarBtnClick}>
                                <image href={storeReportImg} />
                            </ToolbarButtonFC>
                        </div>
                        <div className="button-group-content">
                            <ToolbarButtonFC tooltipName={TooltipName.REFRESH} btnId={ButtonId.REFRESH} activeBtnId={activeBtnId} onClickHandler={onToolbarBtnClick}>
                                <image href={refreshImg} />
                            </ToolbarButtonFC>
                        </div>
                    </div>
                </div>
            </div>
            <React.Fragment>
                <ModalFC isShown={isStoreModifyModalShown} hide={onStoreModifyCancel} headerText={''} modalContent={
                    <ConfirmationModalFC
                        onConfirm={onStoreModifyConfirm}
                        onCancel={onStoreModifyCancel}
                        message="save the edited result?"
                    />
                } />
                <ModalFC isShown={isStoreDeleteModalShown} hide={storeDeleteModalToggle} headerText={'Confirmation'} modalContent={
                    <ConfirmationModalFC
                        onConfirm={onStoreDeleteConfirm}
                        onCancel={onStoreDeleteCancel}
                        message="Are you sure you want to delete selected store?"
                    />
                } />
                <ModalFC isShown={isTradeAreaCreateModalShown} hide={onTradeAreaCreateCancel} headerText={''} modalContent={
                    <CreateTradeAreaModalFC
                        onConfirm={onTradeAreaCreateConfirm}
                        onCancel={onTradeAreaCreateCancel}
                        defaultValue=""
                    />
                } />
                <ModalFC isShown={isTradeAreaModifyModalShown} hide={onTradeAreaModifyCancel} headerText={''} modalContent={
                    <CreateTradeAreaModalFC
                        onConfirm={onTradeAreaModifyConfirm}
                        onCancel={onTradeAreaModifyCancel}
                        defaultValue={btnObjRef.modifyPolygonArea.recordName}
                    />
                } />
                <ModalFC isShown={isTradeAreaDeleteModalShown} hide={onTradeAreaDeleteCancel} headerText={'Confirmation'} modalContent={
                    <ConfirmationModalFC
                        onConfirm={onTradeAreaDeleteConfirm}
                        onCancel={onTradeAreaDeleteCancel}
                        message="Are you sure you want to delete selected feature?"
                    />
                } />
                <ModalFC isShown={isTradeAreaStatisticsModalShown} hide={onTradeAreaStatisticsCancel} headerText={'Confirmation'} modalContent={
                    <ConfirmationModalFC
                        onConfirm={onTradeAreaStatisticsConfirm}
                        onCancel={onTradeAreaStatisticsCancel}
                        message="Create statistics?"
                    />
                } />
                <ModalFC isShown={isCircleModalShown} hide={onCircleCancel} headerText={'Circle Modal'} modalContent={
                    <CircleModalFC
                        onConfirm={onCircleConfirm}
                        onCancel={onCircleCancel}
                        message="Are you sure you want to delete element?"
                    />
                } />
                <ModalFC isShown={isStoreStatisticsModalShown} hide={onStoreStatisticsCancel} headerText={''} modalContent={
                    <CircleModalFC
                        onConfirm={onStoreStatisticsConfirm}
                        onCancel={onStoreStatisticsCancel}
                        message= ""
                    />
                } />
                <ModalFC isShown={isAttributeErrorModalShown} hide={attributeErrorModalToggle} headerText={'Error'} modalContent={
                    <AttributeErrorModalFC
                        onConfirm={attributeErrorModalToggle}
                    />
                } />
                <ModalFC isShown={isCrmLicenseErrorModalShown} hide={crmLicenseErrorModalToggle} headerText={'Error'} modalContent={
                    <CrmLicenseErrorModalFC
                        onConfirm={crmLicenseErrorModalToggle}
                    />
                } />
                <ModalFC isShown={isVerticesRestrictionErrorModalShown} hide={verticesRestrictionErrorModalToggle} headerText={'Error'} modalContent={
                    <VerticesRestrictionErrorModalFC
                        onConfirm={verticesRestrictionErrorModalToggle}
                    />
                } />
                <ModalFC isShown={isSelfIntersectionErrorModalShown} hide={onSelfIntersectionErrorModalClose} headerText={'Error'} modalContent={
                    <SelfIntersectionErrorModalFC
                        onConfirm={onSelfIntersectionErrorModalClose}
                    />
                } />
                <ModalFC isShown={isSelectOnStoreErrorModalShown} hide={selectOnStoreErrorModalToggle} headerText={'Error'} modalContent={
                    <SelectOnStoreErrorModalFC
                        onConfirm={selectOnStoreErrorModalToggle}
                    />
                } />
                <ModalFC isShown={isRadiusRestrictionErrorModalShown} hide={radiusRestrictionErrorModalToggle} headerText={'Error'} modalContent={
                    <RadiusRestrictionErrorModalFC
                        onConfirm={radiusRestrictionErrorModalToggle}
                    />
                } />
                <ModalFC isShown={isUnSavedShapeErrorModalShown} hide={unSavedShapeErrorModalToggle} headerText={'Error'} modalContent={
                    <UnSavedShapeErrorModalFC
                        onConfirm={unSavedShapeErrorModalToggle}
                    />
                } />
                <ModalFC isShown={isStatisticsReportErrorModalShown} hide={statisticsReportErrorModalToggle} headerText={'Error'} modalContent={
                    <StatisticsReportErrorModalFC
                        onConfirm={statisticsReportErrorModalToggle}
                    />
                } />
                <ModalFC isShown={isNearApiErrorModalShown} hide={nearApiErrorModalToggle} headerText={'Error'} modalContent={
                    <NearApiErrorModalFC
                        onConfirm={nearApiErrorModalToggle}
                        message={nearApiErrorMessage}
                    />
                } />
                <ModalFC isShown={isListOfHistoricalModalShown} hide={onListOfHistoricalCancel} headerText={'Historical Modal'} modalContent={
                    <ListOfHistoricalModalFC
                        onShow={onListOfHistoricalShow}
                        onDelete={onListOfHistoricalDelete}
                        onGenerateNewReport={onListOfHistoricalGenerateNewReport}
                        historyList={historicalFootfallData}
                    />
                } />
                <ModalFC isShown={isDeleteStatisticsModalShown} hide={onDeleteStatisticsDataCancel} headerText={'Confirmation'} modalContent={
                    <ConfirmationModalFC
                        onConfirm={onDeleteStatisticsDataConfirm}
                        onCancel={onDeleteStatisticsDataCancel}
                        message="Do you want to delete the selected data?"
                    />
                } />
                <ModalFC isShown={isCompetitorReportModalShown} hide={onCompetitorReportCancel} headerText={'Competitor Reports'} modalId="competitorReport" modalContent={
                    <CompetitorReportModalFC
                        tradeAreaList={tradeAreaList}
                        historyList = {competitorHistoryList}
                        onShow={onCompetitorHistoryShow}
                        onDelete={onCompetitorHistoryDelete}
                        onGenerateNewReport={onGenerateNewCompetitorReport}
                        onCheckboxChanged={onTradeAreaCheckboxChanged}
                    />
                } />
                <ModalFC isShown={isDeleteCompetitorModalShown} hide={onDeleteCompetitorDataCancel} headerText={'Confirmation'} modalContent={
                    <ConfirmationModalFC
                        onConfirm={onDeleteCompetitorDataConfirm}
                        onCancel={onDeleteCompetitorDataCancel}
                        message="Do you want to delete the selected data?"
                    />
                } />
                <ModalFC isShown={isBrandAffinityReportModalShown} hide={onBrandAffinityReportCancel} headerText={'Brand affinity report'} modalContent={
                    <BrandAffinityReportModalFC
                        onGenerateNewReport={onGenerateBrandAffinityData}
                    />
                } />
            </React.Fragment>
        </>
    );
});

export default ToolbarFC;
