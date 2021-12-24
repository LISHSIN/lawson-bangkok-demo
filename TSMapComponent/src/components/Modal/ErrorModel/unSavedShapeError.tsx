import React from 'react';
import "./index.css";

interface UnSavedShapeErrorModalProps {
    onConfirm: () => void;
}

export const UnSavedShapeErrorModalFC: React.FC<UnSavedShapeErrorModalProps> = (props => {
    /**
     * This function is used to close
     * the unsaved shape error modal
     */
    function onConfirmClick() {
        props.onConfirm();
    }

    return (
        <div className="unsaved-shape-error-modal">
            <div className="row">
                <div className="message">The edit result of the figure could not be saved.</div>
                <div className="message">If restarting the application does not help, please contact your administrator.</div>
            </div>
            <div className="buttons">
                <button className="ok" onClick={onConfirmClick}>Ok</button>
            </div>
        </div>
    );
});

export default UnSavedShapeErrorModalFC;
