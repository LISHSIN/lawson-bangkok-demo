import React, { useState } from 'react';
import "./index.css";

interface CircleModalProps {
    onConfirm: (radiusInKm: number) => void;
    onCancel: () => void;
    message: string;
}

export const CircleModalFC: React.FC<CircleModalProps> = (props => {
    const [radiusInMeter, setRadiusInMeter] = useState<number>(0);

    /**
     * This function is used to set
     * the radius value based on user input
     */
    function onInputChange(e: React.ChangeEvent) {
        let value = (e.target as HTMLInputElement).value;
        setRadiusInMeter(Number(value));
    }

    /**
     * This function is used to create/modify
     * the circle based on the radius value and close the modal
     */
    function onConfirmClick() {
        props.onConfirm(radiusInMeter);
    }

    return (
        <div className="circle-modal">
            <div className="row">
                <div className="col-35">
                    <label className="control-label">Enter radius (m)</label>
                </div>
                <div className="col-65">
                    <input className="" id="radius" type="number" onChange={onInputChange}/>
                </div>
            </div>
            <div className="buttons">
                <button className="ok" onClick={onConfirmClick}>Ok</button>
                <button className="cancel" onClick={props.onCancel}>Cancel</button>
            </div>
        </div>
    );
});

export default CircleModalFC;
