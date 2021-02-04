import React from 'react';
import WebApiClient from 'xrm-webapi-client';
import "./index.css";

export interface LawsonStorePopupProps {
    property: any;
    hide: (popup: JSX.Element | undefined) => void;
    attributeErrorModalToggle: () => void;
}

export const LawsonStorePopupFC: React.FC<LawsonStorePopupProps> = (props => {
    const { property, hide, attributeErrorModalToggle } = props;

    /**
     * This function is used to edit the
     * lawson store field in D365 using xrm webapi
     */
    function onEditClick() {
        let guid = property.crcef_duplicatelawsonstoredataid;
        let request = {
            entityName: "crcef_duplicatelawsonstoredata",
            entityId: guid
        };
        
        WebApiClient.Retrieve(request)
            .then((response: any) => {
                let windowOptions = {
                    openInNewWindow: true
                };
                Xrm.Utility.openEntityForm('crcef_duplicatelawsonstoredata', guid, undefined, windowOptions);
                hide(undefined); // remove popup
            })
            .catch((error: any) => {
                attributeErrorModalToggle();
                hide(undefined); // remove popup
            });
    }

    return (
        <>
            <div className="lawson-store-info">
                <div><b>StoreName: </b>{property.crcef_storename}</div>
                <div><b>Address: </b>{property.crcef_addresspluscode}</div>
                <div><b>TEL: </b>{property.crcef_tell}</div>
            </div>
            <div className="lawson-store-info-buttons">
                <button type="button" onClick={onEditClick}>Edit</button>
            </div>
        </>
    );
});

export default LawsonStorePopupFC;
