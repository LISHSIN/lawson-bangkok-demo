import React from 'react';
import "./index.css";

interface SelfIntersectionErrorModalProps {
    onConfirm: () => void;
}

export const SelfIntersectionErrorModalFC: React.FC<SelfIntersectionErrorModalProps> = (props => {
    /**
     * This function is used to close
     * the self intersection error modal
     */
    function onConfirmClick() {
        props.onConfirm();
    }

    return (
        <div className="self-intersection-error-modal">
            <div className="row">
                <div className="message">The polygon contains self-intersections.</div>
                <div className="message">Specify a figure without self-intersection.</div>
            </div>
            <div className="buttons">
                <button className="ok" onClick={onConfirmClick}>Ok</button>
            </div>
        </div>
    );
});

export default SelfIntersectionErrorModalFC;
