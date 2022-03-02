import React from 'react';
import "./index.css";

import { useModal } from './useModal';
import CircleModalFC from './CircleModal';
import ConfirmationModalFC from './ConfirmationModal';
import CreateTradeAreaModalFC from './TradeAreaModal';
import { ListOfHistoricalModalFC, SaveFootfallModalFC } from './HistoricalModal';
import { BrandAffinityReportModalFC } from './BrandAffinityModal';
import { CompetitorReportModalFC } from './CompetitorReportModal';
import { AttributeErrorModalFC, CrmLicenseErrorModalFC, VerticesRestrictionErrorModalFC, SelfIntersectionErrorModalFC, SelectOnStoreErrorModalFC, RadiusRestrictionErrorModalFC, UnSavedShapeErrorModalFC, StatisticsReportErrorModalFC, NearApiErrorModalFC } from './ErrorModel';

export {
    useModal,
    CircleModalFC,
    ConfirmationModalFC,
    CreateTradeAreaModalFC,
    ListOfHistoricalModalFC,
    SaveFootfallModalFC,
    CompetitorReportModalFC,
    AttributeErrorModalFC,
    CrmLicenseErrorModalFC,
    VerticesRestrictionErrorModalFC,
    SelfIntersectionErrorModalFC,
    SelectOnStoreErrorModalFC,
    RadiusRestrictionErrorModalFC,
    UnSavedShapeErrorModalFC,
    StatisticsReportErrorModalFC,
    NearApiErrorModalFC,
    BrandAffinityReportModalFC
}

export interface ModalProps {
    isShown: boolean;
    hide: () => void;
    modalId?: string;
    modalContent: JSX.Element;
    headerText: string;
}

export const ModalFC: React.FC<ModalProps> = (props => {
    const { isShown, hide, modalId, modalContent, headerText } = props;
    const modal = (
        <>
            <div className="backdrop"></div>
            <div className="modal-wrapper" data-modal-id={modalId}>
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
