import { Position } from "@turf/turf";

export interface CircleInfo {
    id: string,
    isEnable: boolean,
    center: [number, number],
    radiusInKm: number,
    storeFeatureId: string
}

export interface ProcessedAStoreData {
    nearAPIFeature : GeoJSON.Feature | undefined
    additionalReportDetails : AdditionalReportDetails
}

export interface AdditionalReportDetails {
    storeGuids : string[],
    statisticsHistoryGuid : string,
    recordName : string,
    selectedTradeAreaId : string | number
}

export interface HistoryInfo {
    crcef_historicalastoredataid: string,
    crcef_recordname: string,
    crcef_tradeareaid: string,
    createdon: string,
}

export interface TradeAreaInfo {
    tradeAreaName: string,
    tradeAreaId: string,
    featureId: string,
    coordinates: Position[][]
}

export interface CompetitorReportHistoryInfo{
    recordName: string,
    historicalRecordGuid: string 
}
