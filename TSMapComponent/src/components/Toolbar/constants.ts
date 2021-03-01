import * as MapboxGl from 'mapbox-gl';

export const showMockData: boolean = true;

const featureProperties = {
    "#": 1,
    "Store Name": "Store A",
    "Address(Plus Code)": "H259+4X マカティ フィリピン Metro Manila",
    "Lat": 14.557813,
    "Lon": 121.019938,
    "Tell": "+63 2 8802 2862",
    "Last month's sales": 264,
    "This month's sales": 277,
    "Transaction Count": 4014,
    "Custmer AVG": 69,
    "ABC-A": "Lunch Box w",
    "ABC-B": "Desserts",
    "ABC-C": "Pasta",
    "Lanking-top1": "Fried Foods - Hotdog",
    "Lanking-top2": "Cold Beverages - Matcha Latte",
    "Lanking-top3": "Ice Cream - Green Tea",
    "0-oclock": 10,
    "1-oclock": 3,
    "2-oclock": 2,
    "3-oclock": 4,
    "4-oclock": 10,
    "5-oclock": 68,
    "6-oclock": 168,
    "7-oclock": 730,
    "8-oclock": 855,
    "9-oclock": 1366,
    "10-oclock": 757,
    "11-oclock": 781,
    "12-oclock": 1398,
    "13-oclock": 1698,
    "14-oclock": 711,
    "15-oclock": 560,
    "16-oclock": 698,
    "17-oclock": 1039,
    "18-oclock": 1340,
    "19-oclock": 1833,
    "20-oclock": 1129,
    "21-oclock": 811,
    "22-oclock": 400,
    "23-oclock": 143,
    "totalFF": 16514,
    "Males": 47,
    "Females": 53,
    "18-25": 34,
    "26-35": 20,
    "36-45": 7,
    "over45": 39,
    "Professionals": 18,
    "Students": 43,
    "Families": 0,
    "Travelers": 39,
    "Home1 lat": 14.557813,
    "Home1 lon": 121.019938,
    "Home1 ratio": 46,
    "Home2 lat": 14.557813,
    "Home2 lon": 121.019938,
    "Home2 ratio": 30,
    "Home3 lat": 14.557813,
    "Home3 lon": 121.019938,
    "Home3 ratio": 12,
    "work1 lat": 14.557813,
    "work1 lon": 121.019938,
    "work1 ratio": 32,
    "work2 lat": 14.557813,
    "Work2 lon": 121.019938,
    "Work2 ratio": 18,
    "Work3 lat": 14.557813,
    "Work3 lon": 121.019938,
    "Work3 ratio": 10,
    "Income High": 50,
    "Income Mid": 24,
    "Income row": 26,
    "man-0": 3,
    "man-10": 82,
    "man-20": 533,
    "man-30": 1065,
    "man-40": 755,
    "man-50": 113,
    "man-60": 448,
    "man-70": 50,
    "man-80": 3,
    "man-90": 1,
    "man-100": 0,
    "Woman-0": 5,
    "Woman-10": 82,
    "Woman-20": 486,
    "Woman-30": 545,
    "Woman-40": 214,
    "Woman-50": 240,
    "Woman-60": 689,
    "Woman-70": 67,
    "Woman-80": 3,
    "Woman-90": 4,
    "Woman-100": 1,
    "total": 5389,
    "B-Store": 10,
    "C-Store": 3,
    "D-Store": 1,
    "Tatal": 14
}

export const mockFeatureData: MapboxGl.MapboxGeoJSONFeature = {
    "geometry": {
        "type": "Point",
        "coordinates": [121.04659080505371, 14.557665544950098]
    },
    "type": "Feature",
    "properties": featureProperties,
    "id": 1,
    "layer": {
        "id": "Store",
        "type": "symbol",
        "source": "composite",
        "source-layer": "store-84rvui",
        "minzoom": 13,
        "layout": {
            "text-field": {},
            "icon-image": {},
            "text-justify": "left",
            "text-anchor": "bottom",
            "icon-size": 0.5,
            "text-offset": [0, -1]
        },
        "paint": {
            "text-halo-width": 2,
            "text-halo-blur": 2,
            "text-color": {},
            "text-halo-color": {}
        }
    },
    "source": "composite",
    "sourceLayer": "store-84rvui",
    "state": {}
}

/** メインの地図で使用するレイヤーのID */
export enum ButtonId {
    /* 背景地図 */

    HAND = "hand",

    ZOOM_IN = "zoomIn",

    ZOOM_OUT = "zoomOut",

    INFO = "info",

    CREATE_POINT = "createPoint",

    CREATE_POLYGON = "createPolygon",

    CREATE_CIRCLE = "createCircle",

    MODIFY_POINT = "modifyPoint",

    MODIFY_POLYGON = "modifyPolygon",

    MODIFY_CIRCLE = "modifyCircle",

    DRAW_DELETE = "drawDelete",

    SELECT = "select",

    TRADE_AREA_CHART = "tradeAreaStatistics",

    A_STORE_CHART = "StoreStatistics",

    REFRESH = "refresh",
}

export enum TooltipName {
    /* 背景地図 */

    HAND = "Hand",

    ZOOM_IN = "Zoom In",

    ZOOM_OUT = "Zoom Out",

    INFO = "Store Info",

    CREATE_POINT = "Create Candidate Store",

    CREATE_POLYGON = "Create Polygon",

    CREATE_CIRCLE = "Create Circle",

    MODIFY_POINT = "Modify Candidate Store",

    MODIFY_POLYGON = "Modify Polygon",

    MODIFY_CIRCLE = "Modify Circle",

    DRAW_DELETE = "Delete",

    SELECT = "Select",

    TRADE_AREA_CHART = "Trade Area Statistics",

    A_STORE_CHART = "Store Statistics",

    REFRESH = "Refresh",
}

export enum TradeAreaActionId {
    CREATE = "create",

    UPDATE = "update",

    DELETE = "delete",
}

export enum StoreActionId {
    CREATE = "create",

    UPDATE = "update",

    DELETE = "delete",
}
