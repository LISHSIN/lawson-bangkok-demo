import React, { useState } from 'react';
import "./index.css";

import { CompetitorReportHistoryInfo, TradeAreaInfo } from 'components/Toolbar/module';

const END_REPORT_DATE_OFFSET = 5; // get the actual NEAR data 5 days before from the current date
const START_REPORT_DATE_OFFSET = END_REPORT_DATE_OFFSET + 13; // user should show the 14 days time interval period by default

interface CompetitorReportModalProps {
    onShow: (historyId: string) => void;
    onDelete: (historyId: string) => void;
    onGenerateNewReport: (recordName: string, fromDate: Date, toDate: Date) => void;
    onCheckboxChanged: (tradeAreaGuid: string) => void;
    historyList: CompetitorReportHistoryInfo[];
    tradeAreaList: TradeAreaInfo[];
}

export const CompetitorReportModalFC: React.FC<CompetitorReportModalProps> = (props => {
    const { historyList, tradeAreaList } = props;

    const [recordName, setRecordName] = useState<string>('');
    const [selectedHistoryId, setSelectedHistoryId] = useState<string>('');
    const [fromDateString, setFromDateString] = useState<string>(getPastDateString(START_REPORT_DATE_OFFSET));
    const [toDateString, setToDateString] = useState<string>(getPastDateString(END_REPORT_DATE_OFFSET));

    /**
     * This function is used to get
     * the past date string value
     * @param1 dateOffset subtract day value
     */
    function getPastDateString(dateOffset: number) {
        var today = new Date();
        var pastDate = new Date(today);
        pastDate.setDate(pastDate.getDate() - dateOffset);
        return constructDateString(pastDate);
    }

    /**
     * This function is used to construt
     * the date string format eg. 'YYYY-MM-DD'
     * @param1 date object
     */
    function constructDateString(date: Date) {
        let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        return `${year}-${month}-${day}`;
    }

    /**
     * This function is used to enter
     * the record name of history based on user input
     */
    function onTextInputChange(e: React.ChangeEvent) {
        let value = (e.target as HTMLInputElement).value;
        setRecordName(value);
    }

    /**
     * This function is used to change 
     * the start date value
     */
    function onFromDateInputChange(e: React.ChangeEvent) {
        let value = (e.target as HTMLInputElement).value;
        setFromDateString(value);
        console.log(value);
    }

    /**
     * This function is used to change 
     * the end date value
     */
    function onToDateInputChange(e: React.ChangeEvent) {
        let value = (e.target as HTMLInputElement).value;
        setToDateString(value);
        console.log(value);
    }

    /**
     * This function is used to set
     * the selected history value based on user input
     */
    function onHistoryInputChange(e: React.ChangeEvent) {
        let value = (e.target as HTMLInputElement).value;
        setSelectedHistoryId(value);
    }
    
    /**
     * This function is used to fetch
     * the new report from near API call
     */
    function onGenerateNewReportClick() {
        let toDate = new Date(toDateString);
        let fromDate = new Date(fromDateString);
        props.onGenerateNewReport(recordName, fromDate, toDate);
    }
    
    /**
     * This function is used to get
     * the footfall and location data from History entity
     * based on the selected history value and close the modal
     */
    function onShowClick() {
        console.log('selectedHistoryId >>> ', selectedHistoryId);
        props.onShow(selectedHistoryId);
    }
    
    /**
     * This function is used to delete
     * the footfall and location data from History entity
     * based on the selected history value and close the modal
     */
    function onDeleteClick() {
        props.onDelete(selectedHistoryId);
    }

    /**
     * This function is used to select 
     * the record from history list
     */
    function onCheckboxChange(e: React.ChangeEvent) {
        let value = (e.target as HTMLInputElement).value;
        props.onCheckboxChanged(value);
    }

    /**
     * This function is used to render
     * one history row along with show and delete buttons
     * @param1 history object info
     * @param2 history object index
     */
    function renderHistoryComp(history: CompetitorReportHistoryInfo, index: number) {
        const { recordName, historicalRecordGuid} = history;
        let id = 'history_' + historicalRecordGuid;
        let historyId = historicalRecordGuid;
        let historyName = recordName //+ ' ' + createdon;
        let isHistoryChecked = (historyId === selectedHistoryId) ? true : false;

        return (
            <div className="row" key={index}>
                <div className="input-radio-container">
                    <input
                        id={id}
                        name="history"
                        type="radio"
                        value={historyId}
                        onChange={onHistoryInputChange}
                        checked={isHistoryChecked === true}
                    />
                    <label htmlFor={id} className="ellipsis" title={historyName}>{historyName}</label>
                </div>
                <div className="show-delete-btn-container">
                    <button className="show" onClick={onShowClick} disabled={isHistoryChecked === false}>Show</button>
                    <button className="delete" onClick={onDeleteClick} disabled={isHistoryChecked === false}>Delete</button>
                </div>
            </div>
        );
    }

    /**
     * This function is used to render
     * all the trade area list
     * @param1 tradeArea object info
     * @param2 tradeArea object index
     */
    function renderTradeAreaComp(tradeArea: TradeAreaInfo, index: number) {
        const { tradeAreaName, tradeAreaId } = tradeArea;
        return (
            <div className= "row" key={index}>
                <div className="input-checkbox-container">
                    <input
                        id={tradeAreaId}
                        name="tradearea"
                        type="checkbox"
                        value={tradeAreaId}
                        onChange={onCheckboxChange}
                    />
                    <label htmlFor={tradeAreaId} className="ellipsis" title={tradeAreaName}>{tradeAreaName}</label>
                </div>
            </div>
        );
    }
    
    /**
     * This function is used to render
     * all the history rows along with show and delete buttons
     */
    function renderListItemsComp(list:any[], functionName: (listItem : any, index: number)=> void ) {
        return list.map((listItem, index) => {
            return functionName(listItem, index);
        });
    }

    /**
     * This function is used to render
     * the message if no history data
     */
    function renderNoDataComp(listType: string) {
        return (
            <div className="no-data">No {listType} is available for competitor report</div>
        );
    }

    return (
        <div className="competitor-report-modal">
            <div className="list-of-history-data-container">Historical Reports:
                <div className="list-of-historical-items">
                    { historyList.length === 0 ? renderNoDataComp("history data") : renderListItemsComp(historyList, renderHistoryComp) }
                </div>
            </div>
            <div className="new-report-container">New Report:
                <div className="list-of-trade-area-container">1. Select Trade Area
                    <div className="list-of-trade-area-items">
                        { tradeAreaList.length === 0 ? renderNoDataComp("Trade area") : renderListItemsComp(tradeAreaList, renderTradeAreaComp)}
                    </div>
                </div>
                <div className="date-container">2. Specify the period
                    <div className="date-row">
                        <div className="start-date">
                            <input 
                                type="date"
                                value={fromDateString}
                                onChange={onFromDateInputChange}
                            />
                        </div>
                        <div>to</div>
                        <div className="end-date">
                            <input 
                                type="date"
                                value={toDateString}
                                onChange={onToDateInputChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="generate-new-report-container">
                    <div className="label-column">
                        <label className="control-label">3. Enter record name </label>
                    </div>
                    <div className="row">
                        
                        <div className="input-column">
                            <input type="text" onChange={onTextInputChange}/>
                        </div>
                        <div className="button-column">
                            <button className="generate-new-report-btn" onClick={onGenerateNewReportClick}>Generete New Report</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});// disabled

export default CompetitorReportModalFC;
