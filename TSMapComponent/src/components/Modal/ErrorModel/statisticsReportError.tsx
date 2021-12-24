import React from 'react';
import "./index.css";

interface statisticsReportErrorModalProps {
    onConfirm: () => void;
}

export const StatisticsReportErrorModalFC: React.FC<statisticsReportErrorModalProps> = (props => {
    /**
     * This function is used to close
     * the statistics report error modal
     */
    function onConfirmClick() {
        props.onConfirm();
    }

    return (
        <div className="statistics-report-error-modal">
            <div className="row">
                <div className="message">The area of the selected region must be lesser than 50,00,000 sq. ft</div>
            </div>
            <div className="buttons">
                <button className="ok" onClick={onConfirmClick}>Ok</button>
            </div>
        </div>
    );
});

export default StatisticsReportErrorModalFC;
