import React from 'react';
import "./index.css";

import { useModal } from './useModal';
import CircleModalFC from './CircleModal';
import ConfirmationModalFC from './ConfirmationModal';
import { AttributeErrorModalFC, CrmLicenseErrorModalFC, VerticesRestrictionErrorModalFC, SelfIntersectionErrorModalFC, SelectOnStoreErrorModalFC, RadiusRestrictionErrorModalFC, UnSavedShapeErrorModalFC} from './ErrorModel';

export {
    useModal,
    CircleModalFC,
    ConfirmationModalFC,
    AttributeErrorModalFC,
    CrmLicenseErrorModalFC,
    VerticesRestrictionErrorModalFC,
    SelfIntersectionErrorModalFC,
    SelectOnStoreErrorModalFC,
    RadiusRestrictionErrorModalFC,
    UnSavedShapeErrorModalFC
}

export interface ModalProps {
    isShown: boolean;
    hide: () => void;
    modalContent: JSX.Element;
    headerText: string;
}

export const ModalFC: React.FC<ModalProps> = (props => {
    const { isShown, hide, modalContent, headerText } = props;
    const modal = (
        <>
            <div className="backdrop"></div>
            <div className="modal-wrapper">
                <div className="modal-container">
                    <div className="modal-header">
                        <div className="header-text">{headerText}</div>
                        <button className="close-button" onClick={hide}>X</button>
                    </div>
                    <div className="modal-content">{modalContent}</div>
                </div>
            </div>
        </>
    );
    return isShown ? modal : null;
});

export default ModalFC;
