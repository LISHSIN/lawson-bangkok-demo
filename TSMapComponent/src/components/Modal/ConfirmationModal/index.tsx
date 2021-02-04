import React, {  } from 'react';
import "./index.css";

interface ConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    message: string;
}

export const ConfirmationModalFC: React.FC<ConfirmationModalProps> = (props => {
    return (
        <>
            <div className="message">{props.message}</div>
            <div className="confirmation-buttons">
                <button className="yes" onClick={props.onConfirm}>OK</button>
                <button className="no" onClick={props.onCancel}>Cancel</button>
            </div>
        </>
    );
});

export default ConfirmationModalFC;
