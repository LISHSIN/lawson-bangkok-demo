import React from 'react';
import "./index.css";

export interface CompetitorStorePopupProps {
    property: any;
}

export const CompetitorStorePopupFC: React.FC<CompetitorStorePopupProps> = (props => {
    const { property } = props;

    return (
        <>
            <div className="store-info">
                <div><b>StoreName: </b>{property.crcef_name}</div>
                <div><b>Address: </b>{property.crcef_addrstree + property.crcef_addrcity}</div>
                <div><b>TEL: </b>{property.crcef_phone}</div>
            </div>
        </>
    );
});

export default CompetitorStorePopupFC;
