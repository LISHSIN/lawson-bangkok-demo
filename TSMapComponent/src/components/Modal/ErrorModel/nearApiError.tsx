import React from 'react';
import "./index.css";

interface nearApiErrorModalProps {
    onConfirm: () => void;
    message: string | undefined;
}

export const NearApiErrorModalFC: React.FC<nearApiErrorModalProps> = (props => {
    /**
     * This function is used to close
     * the near api error modal
     */
    function onConfirmClick() {
        props.onConfirm();
    }

    return (
        <div className="near-api-error-modal">
            <div className="row">
                <div className="message">{props.message}</div>
            </div>
            <div className="buttons">
                <button className="ok" onClick={onConfirmClick}>Ok</button>
            </div>
        </div>
    );
});

export default NearApiErrorModalFC;
