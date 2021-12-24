import React, { useState } from 'react';
import "./index.css";

interface CreateTradeAreaModalProps {
    onConfirm: (recordName: string) => void;
    onCancel: () => void;
    defaultValue: string;
}

export const CreateTradeAreaModalFC: React.FC<CreateTradeAreaModalProps> = (props => {
    const [recordName, setRecordName] = useState<string>(props.defaultValue);

    /**
     * This function is used to set
     * the trade area name value based on user input
     */
    function onInputChange(e: React.ChangeEvent) {
        let value = (e.target as HTMLInputElement).value;
        setRecordName(value);
    }

    /**
     * This function is used to create/modify
     * the trade area name based on the input value and close the modal
     */
    function onConfirmClick() {
        props.onConfirm(recordName);
    }

    return (
        <div className="create-trade-area-modal">
            <div className="row">
                <div className="col-35">
                    <label className="control-label">Record name: </label>
                </div>
                <div className="col-65">
                    <input className="" id="recordname"type="Text" value={recordName} onChange={onInputChange}/>
                </div>
            </div>
            <div className="buttons">
                <button className="ok" onClick={onConfirmClick}>Ok</button>
                <button className="cancel" onClick={props.onCancel}>Cancel</button>
            </div>
        </div>
    );
});

export default CreateTradeAreaModalFC;
