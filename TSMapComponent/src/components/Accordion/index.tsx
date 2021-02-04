import React, { useState } from 'react';
import './index.css';

export interface AccordionProps {
    shown: boolean;
    headingTxt: string;
}

export const AccordionFC: React.FC<AccordionProps> = (props => {
    const { shown, headingTxt } = props;
    const [isShown, setIsShown] = useState(shown);

    /**
     * onclick event handler of
     * accordion icon and set whether
     * the accordion content show or hide
     */
    function onIconClick(e: React.MouseEvent) {
      setIsShown(!isShown);
    }

    let accordionClass = '';
    if (isShown === true) {
        accordionClass = 'accordion show';
    } else {
        accordionClass = 'accordion';
    }

    return (
      <div className={accordionClass}>
        <div className="accordion-header">
            <b>{ headingTxt } <span className="icon" onClick={onIconClick}></span></b>
        </div>
        <div className="accordion-content">
            { props.children }
        </div>
      </div>
    );
});

export default AccordionFC;
