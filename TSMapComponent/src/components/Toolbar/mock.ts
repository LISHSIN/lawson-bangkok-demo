import { HistoryInfo, TradeAreaInfo, CompetitorReportHistoryInfo } from "./module";

export const mockHistoryList: HistoryInfo[] = [
    {
        crcef_historicalastoredataid: '1',
        crcef_recordname: "Lawson Store A",
        crcef_tradeareaid: "trade_1",
        createdon: "27/01/2021",
    }, {
        crcef_historicalastoredataid: '2',
        crcef_recordname: "Lawson Store A",
        crcef_tradeareaid: "trade_2",
        createdon: "27/04/2021",
    }, {
        crcef_historicalastoredataid: '3',
        crcef_recordname: "Lawson Store A",
        crcef_tradeareaid: "trade_3",
        createdon: "27/07/2021",
    }, {
        crcef_historicalastoredataid: '4',
        crcef_recordname: "Lawson Store A",
        crcef_tradeareaid: "trade_4",
        createdon: "27/10/2021",
    }
];

export const mockTradeAreaList: TradeAreaInfo[] = [
    {
        tradeAreaId:"1",
        tradeAreaName: "TDP",
        featureId:"1",
        coordinates: [
          [
            [121.06334924697876, 14.60403734475385],
            [121.06448650360107, 14.604577218618584],
            [121.06386423110962, 14.604722569048002],
            [121.06334924697876, 14.60403734475385]
          ]
        ],
        area: 1000,
        demographicLineGuid: '',
    },
    {
        tradeAreaId:"2",
        tradeAreaName: "Central World",
        featureId:"2",
        coordinates: [
          [
            [
                121.05912208557129,
                14.607941018222817
            ],
            [
                121.06184720993043,
                14.608418590537632
            ],
            [
                121.06051683425905,
                14.610744145242903
            ],
            [
                121.05912208557129,
                14.607941018222817
            ]
          ]
        ],
        area: 1000,
        demographicLineGuid: '',
    },
    {
        tradeAreaId:"3",
        tradeAreaName: "Siam Paragon",
        featureId:"3",
        coordinates: [
            [
              [
                121.06173992156982,
                14.610204286522075
              ],
              [
                121.0645294189453,
                14.610266577980603
              ],
              [
                121.06373548507689,
                14.611470876042395
              ],
              [
                121.06173992156982,
                14.610204286522075
              ]
            ]
        ],
        area: 1000,
        demographicLineGuid: '',
    },
    {
        tradeAreaId:"4",
        tradeAreaName: "Mall 4",
        featureId:"4",
        coordinates: [
            [
              [
                121.05616092681883,
                14.614004033184724
              ],
              [
                121.05877876281737,
                14.614170140829637
              ],
              [
                121.05699777603148,
                14.615187547414765
              ],
              [
                121.05616092681883,
                14.614004033184724
              ]
            ]
        ],
        area: 1000,
        demographicLineGuid: '',
    },
    {
        tradeAreaId:"5",
        tradeAreaName: "Mall 5",
        featureId:"5",
        coordinates: [
            [
              [
                121.0582208633423,
                14.617429977946973
              ],
              [
                121.06197595596313,
                14.617388451663645
              ],
              [
                121.06077432632446,
                14.618592710693429
              ],
              [
                121.0582208633423,
                14.617429977946973
              ]
            ]
        ],
        area: 1000,
        demographicLineGuid: '',
    },
    {
        tradeAreaId:"6",
        tradeAreaName: "Mall 6",
        featureId:"6",
        coordinates: [
            [
              [
                121.05144023895262,
                14.607297332156985
              ],
              [
                121.05483055114745,
                14.607671085585963
              ],
              [
                121.05365037918091,
                14.609519079313035
              ],
              [
                121.05144023895262,
                14.607297332156985
              ]
            ]
        ],
        area: 1000,
        demographicLineGuid: '',
    }
];

export const mockCompetitorHistoryData: CompetitorReportHistoryInfo[] = [
    {
        recordName: "History 1",
        historicalRecordGuid: "1" 
    },
    {
        recordName: "History 2",
        historicalRecordGuid: "2" 
    },
    {
        recordName: "History 3",
        historicalRecordGuid: "3" 
    },
    {
        recordName: "History 4",
        historicalRecordGuid: "4" 
    },
    {
        recordName: "History 5",
        historicalRecordGuid: "5" 
    },
    {
        recordName: "History 6",
        historicalRecordGuid: "6" 
    }
];
