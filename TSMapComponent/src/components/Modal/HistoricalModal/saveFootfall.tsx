import React, { useState } from 'react';
import "./index.css";

interface SaveFootfallModalProps {
    onConfirm: (recordName: string) => void;
    onCancel: () => void;
    message: string;
}

export const SaveFootfallModalFC: React.FC<SaveFootfallModalProps> = (props => {
    const [recordName, setRecordName] = useState<string>('');

    /**
     * This function is used to set
     * the record name based on user input
     */
    function onInputChange(e: React.ChangeEvent) {
        let value = (e.target as HTMLInputElement).value;
        setRecordName(value);
    }

    /**
     * This function is used to save
     * the history data along with the record name
     */
    function onConfirmClick() {
        props.onConfirm(recordName);
    }

    return (
        <div className="saveFootfall-modal">
            <div className="row">
                <div className="col-35">
                    <label className="control-label">Record name: </label>
                </div>
                <div className="col-65">
                    <input type="text" onChange={onInputChange}/>
                </div>
            </div>
            <div className="buttons">
                <button className="ok" onClick={onConfirmClick}>Save</button>
                <button className="cancel" onClick={props.onCancel}>Cancel</button>
            </div>
        </div>
    );
});

export default SaveFootfallModalFC;
