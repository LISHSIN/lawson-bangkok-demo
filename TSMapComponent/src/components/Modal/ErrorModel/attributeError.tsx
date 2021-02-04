import React from 'react';
import "./index.css";

interface AttributeErrorModalProps {
    onConfirm: () => void;
}

export const AttributeErrorModalFC: React.FC<AttributeErrorModalProps> = (props => {
    /**
     * This function is used to close
     * the attribute error modal
     */
    function onConfirmClick() {
        props.onConfirm();
    }

    return (
        <div className="attribute-error-modal">
            <div className="row">
                <div className="message">Can’t get the attribute information of the specified figure.</div>
                <div className="message">If restarting the Marketing app does not help, please contact your administrator.</div>
            </div>
            <div className="buttons">
                <button className="ok" onClick={onConfirmClick}>Ok</button>
            </div>
        </div>
    );
});

export default AttributeErrorModalFC;
