import React, { useState } from 'react';
import "./index.css";

import { HistoryInfo } from 'components/Toolbar/module';

interface ListOfHistoricalModalProps {
    onShow: (historyId: string) => void;
    onDelete: (historyId: string) => void;
    onGenerateNewReport: (recordName: string) => void;
    historyList: HistoryInfo[];
}

export const ListOfHistoricalModalFC: React.FC<ListOfHistoricalModalProps> = (props => {
    const { historyList } = props;

    const [recordName, setRecordName] = useState<string>('');
    const [selectedHistoryId, setSelectedHistoryId] = useState<string>('');

    /**
     * This function is used to enter
     * the record name of history based on user input
     */
     function onTextInputChange(e: React.ChangeEvent) {
        let value = (e.target as HTMLInputElement).value;
        setRecordName(value);
    }

    /**
     * This function is used to set
     * the selected history value based on user input
     */
    function onInputChange(e: React.ChangeEvent) {
        let value = (e.target as HTMLInputElement).value;
        setSelectedHistoryId(value);
    }
    
    /**
     * This function is used to fetch
     * the new report from near API call
     */
    function onGenerateNewReportClick() {
        if (recordName !== '') {
            props.onGenerateNewReport(recordName);
        } else {
            alert("Please enter the record name");
        }
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
     * This function is used to render
     * one history row along with show and delete buttons
     * @param1 history object info
     * @param2 history object index
     */
    function renderHistoryComp(history: HistoryInfo, index: number) {
        const { crcef_historicalastoredataid, crcef_recordname, crcef_tradeareaid, createdon } = history;
        let id = 'history_' + crcef_historicalastoredataid;
        let historyId = crcef_historicalastoredataid;
        let historyName = crcef_recordname; //+ ' ' + createdon;
        let isHistoryChecked = (historyId === selectedHistoryId) ? true : false;

        return (
            <div className="row" key={index}>
                <div className="input-radio-container">
                    <input
                        id={id}
                        name="history"
                        type="radio"
                        value={historyId}
                        onChange={onInputChange}
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
     * all the history rows along with show and delete buttons
     */
    function renderListOfHistoricalComp() {
        return historyList.map((history, index) => {
            return renderHistoryComp(history, index);
        });
    }

    /**
     * This function is used to render
     * the message if no history data
     */
    function renderNoHistoricalComp() {
        return (
            <div className="no-history-data">No history data is available for the selected trade area.</div>
        );
    }

    return (
        <div className="list-of-historical-modal">
            <div className="list-of-historical-items">
                { historyList.length === 0 ? renderNoHistoricalComp() : renderListOfHistoricalComp() }
            </div>
            <div className="generate-new-report-container">
                <div className="row">
                    <div className="label-column">
                        <label className="control-label">Record name: </label>
                    </div>
                    <div className="input-column">
                        <input type="text" onChange={onTextInputChange}/>
                    </div>
                    <div className="button-column">
                        <button className="generate-new-report-btn" onClick={onGenerateNewReportClick}>Generete New Report</button>
                    </div>
                </div>
            </div>
            <div className="info-container">
                <span className="info-icon"><i className="fa fa-info-circle"></i></span>Please note that clicking on "Generate new report" might take up to 2 mins for the data to load.
            </div>
        </div>
    );
});

export default ListOfHistoricalModalFC;
