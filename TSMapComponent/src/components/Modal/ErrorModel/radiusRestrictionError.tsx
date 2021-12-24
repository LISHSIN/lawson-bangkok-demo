import React from 'react';
import "./index.css";

interface RadiusRestrictionErrorModalProps {
    onConfirm: () => void;
}

export const RadiusRestrictionErrorModalFC: React.FC<RadiusRestrictionErrorModalProps> = (props => {
    /**
     * This function is used to close
     * the radius restriction error modal
     */
    function onConfirmClick() {
        props.onConfirm();
    }

    return (
        <div className="radius-restriction-error-modal">
            <div className="row">
                <div className="message">The radius of the circle can be specified in the range of 10m to 10,000m.</div>
            </div>
            <div className="buttons">
                <button className="ok" onClick={onConfirmClick}>Ok</button>
            </div>
        </div>
    );
});

export default RadiusRestrictionErrorModalFC;
