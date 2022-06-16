import { Position } from "@turf/turf";

export interface CircleInfo {
    id: string,
    isEnable: boolean,
    center: [number, number],
    radiusInKm: number,
    storeFeatureId: string
}

export interface CompetitorAnalysisInfo {
    crcef_competitoranalysisid: string;
    crcef_tradearea: string;
    crcef_tradeareareference: string;
    crcef_demographiclinereference?: string;
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
    coordinates: Position[][],
    area: number,
    demographicLineGuid: string,
}

export interface CompetitorReportHistoryInfo{
    recordName: string,
    historicalRecordGuid: string 
}

export interface DemographicLineDetails {
    tradeAreaId: string,
    tradeAreaName: string
    lineGuid: string
}

export interface AdditionalStatisticsReportDetails {
    storeGuids : string[],
    statisticsHistoryGuid : string,
    recordName : string,
    selectedTradeAreaId : string | number
}

export interface StatisticsNearApiRequestInfo {
    nearAPIFeature : GeoJSON.Feature | undefined
    additionalReportDetails : AdditionalStatisticsReportDetails
}

export interface AdditionalCompetitorReportDetails {
    endDate: string,
    startDate: string,
    randomNumber: string,
    competitorHistoryGuid: string,
    nearApiRequestDetails: CompetitorAnalysisInfo[],
}

export interface CompetitorNearApiRequestInfo {
    nearAPIFeatureList : GeoJSON.Feature[]
    additionalReportDetails : AdditionalCompetitorReportDetails
}

export const initialStatisticsNearApiRequestInfo: StatisticsNearApiRequestInfo = {
    nearAPIFeature : undefined,
    additionalReportDetails : {
        storeGuids : [],
        statisticsHistoryGuid : '',
        recordName : '',
        selectedTradeAreaId : ''
    }
}

export const initialCompetitorNearApiRequestInfo: CompetitorNearApiRequestInfo = {
    nearAPIFeatureList : [],
    additionalReportDetails : {
        endDate: '',
        startDate: '',
        randomNumber: '',
        competitorHistoryGuid: '',
        nearApiRequestDetails: [],
    }
}
