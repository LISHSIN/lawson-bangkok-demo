import React, { useContext, useRef } from 'react';

import { mapboxReactContext } from 'components/MapboxContext';
import { layerReactContext } from 'components/LayerContext';
import CheckboxFC from 'components/Checkbox';
import { LayerId } from 'components/Map1/constants';
import BaseMapFC from 'components/BaseMap';
import AccordionFC from 'components/Accordion';

export interface LayerListProps {
}

export const LayerListFC: React.FC<LayerListProps> = (props => {
    const context = useContext(mapboxReactContext);
    const layerContext = useContext(layerReactContext);
    const { map } = context;
    const { layerObj } = layerContext;

    // Ref Variables
    const navigationRef = useRef<HTMLDivElement>(null);
    const { current: toggleBtnRef } = useRef({
        el: null as HTMLAnchorElement | null,
        /**
         * Add toggleButton anchor element
         * using callback method
         * @param HTMLAnchorElement | null
         */
        cb(el: HTMLAnchorElement | null): void {
            if (el !== null) {
                toggleBtnRef.el = el;
            } else {
                toggleBtnRef.el = null;
            }
        },
        /**
         * Add and Remove active class for
         * layerlist and navigation container
         * @param React.MouseEvent
         */
        onClick(e: React.MouseEvent): void {
            e.preventDefault();
            let el = toggleBtnRef.el;
            let navEl = navigationRef.current;
            let parentEl = e.currentTarget.closest(".layerlist-container");

            if (el !== null && navEl !== null) {
                let hasActive = el.classList.contains('active') ? true : false;
                if (hasActive) {
                    el.classList.remove('active');
                    navEl.classList.remove('active');
                    parentEl?.classList.remove('active');
                } else {
                    el.classList.add('active');
                    navEl.classList.add('active');
                    parentEl?.classList.add('active');
                }
            }
            if (map !== undefined) {
                map.resize();
            }
        }
    });

    return (
        <div className="layerlist-container">
            <a ref={toggleBtnRef.cb} href="#" id="toggleButton" onClick={(e: React.MouseEvent) => toggleBtnRef.onClick(e)}>
                <i className="fa fa-angle-left"></i>
                <i className="fa fa-angle-right"></i>
            </a>
            <div ref={navigationRef} className="navigation layerlist">
                <ul>
                    <li>
                        <b>Store Location</b>
                        <ul>
                            <li>
                                <CheckboxFC
                                    checked={layerObj[LayerId.LAWSON_STORE_LAYER].isEnable}
                                    layerId={LayerId.LAWSON_STORE_LAYER}
                                    layerName="Lawson Store"
                                ></CheckboxFC>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <b>Trade Area</b>
                        <ul>
                            <li>
                                <CheckboxFC
                                    checked={layerObj[LayerId.LAWSON_TRADE_AREA_LAYER].isEnable}
                                    layerId={LayerId.LAWSON_TRADE_AREA_LAYER}
                                    layerName="Lawson Trade Area"
                                ></CheckboxFC>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <b>Focus Area</b>
                        <ul>
                            <li>
                                <CheckboxFC
                                    checked={layerObj[LayerId.FOCUSAREA_ALABANG].isEnable}
                                    layerId={LayerId.FOCUSAREA_ALABANG}
                                    layerName="Focus Area Aliabang"
                                ></CheckboxFC>
                            </li>
                            <li>
                                <CheckboxFC
                                    checked={layerObj[LayerId.FOCUSAREA_BGC].isEnable}
                                    layerId={LayerId.FOCUSAREA_BGC}
                                    layerName="Focus Area BCG"
                                ></CheckboxFC>
                            </li>
                            <li>
                                <CheckboxFC
                                    checked={layerObj[LayerId.FOCUSAREA_ORTIGAS].isEnable}
                                    layerId={LayerId.FOCUSAREA_ORTIGAS}
                                    layerName="Focus Area Ortigas"
                                ></CheckboxFC>
                            </li>
                            <li>
                                <CheckboxFC
                                    checked={layerObj[LayerId.FOCUSAREA_MAKATI].isEnable}
                                    layerId={LayerId.FOCUSAREA_MAKATI}
                                    layerName="Focus Area Makati"
                                ></CheckboxFC>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <b>Competitor</b>
                        <ul>
                            <li>
                                <CheckboxFC
                                    checked={layerObj[LayerId.SEVEN_ELEVEN_STORE_LAYER].isEnable}
                                    layerId={LayerId.SEVEN_ELEVEN_STORE_LAYER}
                                    layerName="Seven Eleven"
                                ></CheckboxFC>
                            </li>
                            <li>
                                <CheckboxFC
                                    checked={layerObj[LayerId.FAMILIMART_STORE_LAYER].isEnable}
                                    layerId={LayerId.FAMILIMART_STORE_LAYER}
                                    layerName="FamilyMart"
                                ></CheckboxFC>
                            </li>
                            <li>
                                <CheckboxFC
                                    checked={layerObj[LayerId.MINISTOP_STORE_LAYER].isEnable}
                                    layerId={LayerId.MINISTOP_STORE_LAYER}
                                    layerName="MiniStop"
                                ></CheckboxFC>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <AccordionFC shown={true} headingTxt={"Population Data"}>
                            <ul>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.TOTAL_MALE_AND_FEMALE_POPULATION_AS_POLYGON].isEnable}
                                        layerId={LayerId.TOTAL_MALE_AND_FEMALE_POPULATION_AS_POLYGON}
                                        layerName="ALL"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE0].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE0}
                                        layerName="Male 0"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE1].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE1}
                                        layerName="Male 1"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE5].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE5}
                                        layerName="Male 5"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE10].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE10}
                                        layerName="Male 10"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE15].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE15}
                                        layerName="Male 15"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE20].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE20}
                                        layerName="Male 20"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE25].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE25}
                                        layerName="Male 25"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE30].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE30}
                                        layerName="Male 30"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE35].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE35}
                                        layerName="Male 35"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE40].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE40}
                                        layerName="Male 40"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE45].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE45}
                                        layerName="Male 45"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE50].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE50}
                                        layerName="Male 50"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE55].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE55}
                                        layerName="Male 55"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE60].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE60}
                                        layerName="Male 60"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE65].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE65}
                                        layerName="Male 65"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE70].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE70}
                                        layerName="Male 70"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE75].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE75}
                                        layerName="Male 75"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.MALE_POPULATION_FOR_AGE80].isEnable}
                                        layerId={LayerId.MALE_POPULATION_FOR_AGE80}
                                        layerName="Male 80"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE0].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE0}
                                        layerName="Female 0"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE1].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE1}
                                        layerName="Female 1"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE5].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE5}
                                        layerName="Female 5"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE10].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE10}
                                        layerName="Female 10"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE15].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE15}
                                        layerName="Female 15"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE20].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE20}
                                        layerName="Female 20"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE25].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE25}
                                        layerName="Female 25"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE30].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE30}
                                        layerName="Female 30"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE35].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE35}
                                        layerName="Female 35"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE40].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE40}
                                        layerName="Female 40"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE45].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE45}
                                        layerName="Female 45"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE50].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE50}
                                        layerName="Female 50"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE55].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE55}
                                        layerName="Female 55"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE60].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE60}
                                        layerName="Female 60"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE65].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE65}
                                        layerName="Female 65"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE70].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE70}
                                        layerName="Female 70"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE75].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE75}
                                        layerName="Female 75"
                                    ></CheckboxFC>
                                </li>
                                <li>
                                    <CheckboxFC
                                        checked={layerObj[LayerId.FEMALE_POPULATION_FOR_AGE80].isEnable}
                                        layerId={LayerId.FEMALE_POPULATION_FOR_AGE80}
                                        layerName="Female 80"
                                    ></CheckboxFC>
                                </li>
                            </ul>
                        </AccordionFC>
                    </li>
                    <li>
                        <b>Base map</b>
                        <ul>
                            <BaseMapFC></BaseMapFC>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
});

export default LayerListFC;
