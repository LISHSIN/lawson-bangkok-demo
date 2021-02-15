export const MapboxConfig = {
    /* store-opening-hsin User */
    STYLE: "mapbox://styles/store-opening-hsin/ckkrswsur0j3o17uwfnxmurqu",

    SATELLITE_STYLE: "mapbox://styles/store-opening-hsin/ckkrsy84y0h3r17o5ri7bteex",

    MONOCHROME_STYLE: "mapbox://styles/hisol-lis/ckhvs3jso0ohm19nxyh83j57y",

    ACCESS_TOKEN: "pk.eyJ1Ijoic3RvcmUtb3BlbmluZy1oc2luIiwiYSI6ImNra3FqM2M0ejBmZjYyeHBmcmJhd2drdzgifQ.He2KZ2j5Rdr84gAMz22Ijg",

    CENTER: [100.52302, 13.75615] as [number, number],

    ZOOM: [12] as [number],
}

/** メインの地図で使用するレイヤーのID */
export enum LayerId {
    /* 背景地図 */

    LINE_LAYER = "lineLayer",

    BUBBLE_LAYER = "bubbleLayer",

    SYMBOL_LAYER = "symbolLayer",

    POLYGON_LAYER = "polygonLayer",

    LAWSON_STORE = "Lawson-Store",

    LAWSON_STORE_LAYER = "lawsonStoreLayer",

    LAWSON_STATION_LAYER = "lawsonStationLayer",

    LAWSON_TRADEAREA = "Lawson-TradeArea",

    LAWSON_TRADE_AREA_LAYER = "lawsonTradeAreaLayer",

    FOCUSAREA_ALABANG = "FocusArea-Alabang",

    FOCUSAREA_BGC = "FocusArea-BGC",

    FOCUSAREA_ORTIGAS = "FocusArea-Ortigas",

    FOCUSAREA_MAKATI = "FocusArea-Makati",

    SEVEN_ELEVEN_STORE = "7-eleven-store",

    SEVEN_ELEVEN_STORE_LAYER = "sevenElevenStoreLayer",

    FAMILIMART_STORE = "Familimart-Store",

    FAMILIMART_STORE_LAYER = "familymartStoreLayer",

    MINISTOP_STORE = "Ministop-store",

    MINISTOP_STORE_LAYER = "ministopStoreLayer",

    TESCO_LOTUS_EXPRESS_LAYER = "tescoLotusExpressLayer",

    POPULATION_COUNT = "Population-count",

    TOTAL_MALE_AND_FEMALE_POPULATION = "HSIN-total-population",

    TOTAL_MALE_AND_FEMALE_POPULATION_AS_POLYGON = "HSIN-total-population-as-polygon",

    TOTAL_MALE_POPULATION = "HSIN-male-total-population",

    TOTAL_MALE_POPULATION_AS_POLYGON = "HSIN-male-total-population-as-polygon",

    TOTAL_FEMALE_POPULATION = "HSIN-female-total-population",

    TOTAL_FEMALE_POPULATION_AS_POLYGON = "HSIN-female-total-population-as-polygon",

    MALE_POPULATION_FOR_AGE0 = "HSIN-male-age0",

    MALE_POPULATION_FOR_AGE1 = "HSIN-male-age1",

    MALE_POPULATION_FOR_AGE5 = "HSIN-male-age5",

    MALE_POPULATION_FOR_AGE10 = "HSIN-male-age10",

    MALE_POPULATION_FOR_AGE15 = "HSIN-male-age15",

    MALE_POPULATION_FOR_AGE20 = "HSIN-male-age20",

    MALE_POPULATION_FOR_AGE25 = "HSIN-male-age25",

    MALE_POPULATION_FOR_AGE30 = "HSIN-male-age30",

    MALE_POPULATION_FOR_AGE35 = "HSIN-male-age35",

    MALE_POPULATION_FOR_AGE40 = "HSIN-male-age40",

    MALE_POPULATION_FOR_AGE45 = "HSIN-male-age45",

    MALE_POPULATION_FOR_AGE50 = "HSIN-male-age50",

    MALE_POPULATION_FOR_AGE55 = "HSIN-male-age55",

    MALE_POPULATION_FOR_AGE60 = "HSIN-male-age60",

    MALE_POPULATION_FOR_AGE65 = "HSIN-male-age65",

    MALE_POPULATION_FOR_AGE70 = "HSIN-male-age70",

    MALE_POPULATION_FOR_AGE75 = "HSIN-male-age75",

    MALE_POPULATION_FOR_AGE80 = "HSIN-male-age80",

    FEMALE_POPULATION_FOR_AGE0 = "HSIN-female-age0",

    FEMALE_POPULATION_FOR_AGE1 = "HSIN-female-age1",

    FEMALE_POPULATION_FOR_AGE5 = "HSIN-female-age5",

    FEMALE_POPULATION_FOR_AGE10 = "HSIN-female-age10",

    FEMALE_POPULATION_FOR_AGE15 = "HSIN-female-age15",

    FEMALE_POPULATION_FOR_AGE20 = "HSIN-female-age20",

    FEMALE_POPULATION_FOR_AGE25 = "HSIN-female-age25",

    FEMALE_POPULATION_FOR_AGE30 = "HSIN-female-age30",

    FEMALE_POPULATION_FOR_AGE35 = "HSIN-female-age35",

    FEMALE_POPULATION_FOR_AGE40 = "HSIN-female-age40",

    FEMALE_POPULATION_FOR_AGE45 = "HSIN-female-age45",

    FEMALE_POPULATION_FOR_AGE50 = "HSIN-female-age50",

    FEMALE_POPULATION_FOR_AGE55 = "HSIN-female-age55",

    FEMALE_POPULATION_FOR_AGE60 = "HSIN-female-age60",

    FEMALE_POPULATION_FOR_AGE65 = "HSIN-female-age65",

    FEMALE_POPULATION_FOR_AGE70 = "HSIN-female-age70",

    FEMALE_POPULATION_FOR_AGE75 = "HSIN-female-age75",

    FEMALE_POPULATION_FOR_AGE80 = "HSIN-female-age80",
}

export enum SourceId {
    LAWSON_STORE_SOURCE = "lawsonStoreSource",

    LAWSON_TRADE_AREA_SOURCE = "lawsonTradeAreaSource",

    SEVEN_ELEVEN_STORE_SOURCE = "sevenElevenStoreSource",

    FAMILYMART_STORE_SOURCE = "familymartStoreSource",

    MINISTOP_STORE_SOURCE = "MinistopStoreSource",

    LAWSON_STATION_SOURCE = "lawsonStationSource",

    TESCO_LOTUS_EXPRESS_SOURCE = "tescoLotusExpressSource"
}

export enum ImageId {
    LAWSON_STORE_ICON = "lawsonStoreIcon",

    FAMILYMART_STORE_ICON = "familyMartStoreIcon",

    SEVENELEVEN_STORE_ICON = "sevenElevenStoreIcon",

    MINISTOP_STORE_ICON = "miniStopStoreIcon",

    LAWSON_STATION_ICON = "lawsonStationIcon",

    TESCO_LOTUS_EXPRESS_ICON = "tescoLotusExpressIcon"
}

export enum BaseMapName {
    BASIC = "Basic",

    SATELLITE = "Satellite",

    MONOCHROME = "Monochrome",
}

export enum GlDrawMode {
    DRAW_LINE_STRING = "draw_line_string",

    DRAW_POLYGON = "draw_polygon",

    DRAW_POINT = "draw_point",

    DRAW_CIRCLE = "draw_circle",

    SIMPLE_SELECT = "simple_select",

    DIRECT_SELECT = "direct_select",

    STATIC = "static",
}

export enum GlDrawLayerId {
    GL_DRAW_POLYGON_FILL_ACTIVE_HOT = "gl-draw-polygon-fill-active.hot",

    GL_DRAW_POLYGON_FILL_ACTIVE_COLD = "gl-draw-polygon-fill-active.cold",

    GL_DRAW_POLYGON_FILL_INACTIVE_COLD = "gl-draw-polygon-fill-inactive.cold",

    GL_DRAW_POLYGON_STROKE_INACTIVE_COLD = "gl-draw-polygon-stroke-inactive.cold",

    GL_DRAW_POLYGON_FILL_STATIC_COLD = "gl-draw-polygon-fill-static.cold",

    GL_DRAW_POLYGON_STROKE_STATIC_COLD = "gl-draw-polygon-stroke-static.cold",
}

export enum GlDrawPaintPropertyId {
    LINE_COLOR = "line-color",

    FILL_COLOR = "fill-color",

    FILL_OUTLINE_COLOR = "fill-outline-color",
}

export enum GlDrawColorId {
    STATIC = "#404040",

    ACTIVE = "#fbb03b",

    INACTIVE = "#3bb2d0",
}
