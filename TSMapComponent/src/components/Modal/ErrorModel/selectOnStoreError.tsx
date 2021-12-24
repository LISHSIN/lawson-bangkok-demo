import React from 'react';
import "./index.css";

interface SelectOnStoreErrorModalProps {
    onConfirm: () => void;
}

export const SelectOnStoreErrorModalFC: React.FC<SelectOnStoreErrorModalProps> = (props => {
    /**
     * This function is used to close
     * the select on store error modal
     */
    function onConfirmClick() {
        props.onConfirm();
    }

    return (
        <div className="select-on-store-error-modal">
            <div className="row">
                <div className="message">Select one of the store / candidate store /competing store shapes</div>
            </div>
            <div className="buttons">
                <button className="ok" onClick={onConfirmClick}>Ok</button>
            </div>
        </div>
    );
});

export default SelectOnStoreErrorModalFC;
