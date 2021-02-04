import React from 'react';
import "./index.css";

interface CrmLicenseErrorModalProps {
    onConfirm: () => void;
}

export const CrmLicenseErrorModalFC: React.FC<CrmLicenseErrorModalProps> = (props => {
    /**
     * This function is used to close
     * the crm license error modal
     */
    function onConfirmClick() {
        props.onConfirm();
    }

    return (
        <div className="crm-license-error-modal">
            <div className="row">
                <div className="message">Can’t open the attribute edit screen.</div>
                <div className="message">If restarting the Marketing app does not help, please contact your administrator.</div>
            </div>
            <div className="buttons">
                <button className="ok" onClick={onConfirmClick}>Ok</button>
            </div>
        </div>
    );
});

export default CrmLicenseErrorModalFC;
