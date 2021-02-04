import React from 'react';
import "./index.css";

interface VerticesRestrictionErrorModalProps {
    onConfirm: () => void;
}

export const VerticesRestrictionErrorModalFC: React.FC<VerticesRestrictionErrorModalProps> = (props => {
    /**
     * This function is used to close
     * the vertices restriction error modal
     */
    function onConfirmClick() {
        props.onConfirm();
    }

    return (
        <div className="attribute-error-modal">
            <div className="row">
                <div className="message">Specify the number of polygon vertices within the range of 3 to 100.</div>
            </div>
            <div className="buttons">
                <button className="ok" onClick={onConfirmClick}>Ok</button>
            </div>
        </div>
    );
});

export default VerticesRestrictionErrorModalFC;
