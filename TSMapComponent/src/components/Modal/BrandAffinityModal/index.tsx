import React, { useState } from 'react';
import "./index.css";

interface GenerateBrandAffinityModalProps {
    onGenerateNewReport: (fromDate: Date, toDate: Date) => void;
}

export const BrandAffinityReportModalFC: React.FC<GenerateBrandAffinityModalProps> = (props => {
    //const [recordName, setRecordName] = useState<string>(props.defaultValue);
    const [fromDateString, setFromDateString] = useState<string>(constructDateString(new Date(2021, 11, 31)))//getPastDateString(10)
    const [toDateString, setToDateString] = useState<string>(constructDateString(new Date(2022, 1, 13)))//getPastDateString(7)

    function onFromDateInputChange(e: React.ChangeEvent) {
        let value = (e.target as HTMLInputElement).value;
        setFromDateString(value);
        console.log(value);
    }

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
     * This function is used to change 
     * the end date value
     */
    function onToDateInputChange(e: React.ChangeEvent) {
        let value = (e.target as HTMLInputElement).value;
        setToDateString(value);
        console.log(value);
    }

    function onGenerateNewReportClick() {
        let toDate = new Date(toDateString);
        let fromDate = new Date(fromDateString);
        props.onGenerateNewReport(fromDate, toDate);
    }

    return (
        <div className="create-brand-affinity-modal">
            <div className="date-container"> Specify the period
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
            <div className="buttons">
                <button onClick={onGenerateNewReportClick}>Generate report</button>
            </div>
        </div>
    );
});

export default BrandAffinityReportModalFC;