import React from 'react';

export interface ToolbarButtonProps {
    btnId: string;
    btnText?: string;
    tooltipName: string;
    activeBtnId: string;
    onClickHandler?: (e: React.MouseEvent, btnId: string) => void;
}

export const ToolbarButtonFC: React.FC<ToolbarButtonProps> = (props => {
    const { btnId, btnText, tooltipName, activeBtnId } = props;

    /**
     * This function is used to handle the
     * current button selection and their parent clickhandler
     */
    function onButtonClick(e: React.MouseEvent) {
        let selectedBtnId = '';
        if (btnId !== activeBtnId) {
            selectedBtnId = btnId;
        }
        props.onClickHandler && props.onClickHandler(e, selectedBtnId);
    }

    let classNames = "";
    if (btnId === activeBtnId) {
        classNames = 'toolbar-button active';
    } else {
        classNames = 'toolbar-button';
    }

    return (
        <button title={tooltipName} id={btnId} className={classNames} onClick={onButtonClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                {props.children}
            </svg><br />
            {btnText}
        </button>
    );
});


export default ToolbarButtonFC;
