/*
 COPYRIGHT (C) 2019, HITACHI SOLUTIONS, LTD. ALL RIGHTS RESERVED.
 Hitachi Solutions, Ltd. Confidential
 */
import React, { useState, useEffect, useContext, useRef } from 'react';
import { LayerId } from './Map1/constants';

export type LayerType = LayerId.A_STORE_LAYER | LayerId.TRADE_AREA_LAYER | LayerId.B_STORE_LAYER | LayerId.C_STORE_LAYER | LayerId.D_STORE_LAYER | LayerId.E_STORE_LAYER | LayerId.POPULATION_COUNT | LayerId.TOTAL_MALE_AND_FEMALE_POPULATION | LayerId.TOTAL_MALE_AND_FEMALE_POPULATION_AS_POLYGON | LayerId.TOTAL_MALE_POPULATION | LayerId.TOTAL_MALE_POPULATION_AS_POLYGON | LayerId.TOTAL_FEMALE_POPULATION | LayerId.TOTAL_FEMALE_POPULATION_AS_POLYGON | LayerId.MALE_POPULATION_FOR_AGE0 | LayerId.MALE_POPULATION_FOR_AGE1 | LayerId.MALE_POPULATION_FOR_AGE5 | LayerId.MALE_POPULATION_FOR_AGE10 | LayerId.MALE_POPULATION_FOR_AGE15 | LayerId.MALE_POPULATION_FOR_AGE20 | LayerId.MALE_POPULATION_FOR_AGE25 | LayerId.MALE_POPULATION_FOR_AGE30 | LayerId.MALE_POPULATION_FOR_AGE35 | LayerId.MALE_POPULATION_FOR_AGE40 | LayerId.MALE_POPULATION_FOR_AGE45 | LayerId.MALE_POPULATION_FOR_AGE50 | LayerId.MALE_POPULATION_FOR_AGE55 | LayerId.MALE_POPULATION_FOR_AGE60 | LayerId.MALE_POPULATION_FOR_AGE65 | LayerId.MALE_POPULATION_FOR_AGE70 | LayerId.MALE_POPULATION_FOR_AGE75 | LayerId.MALE_POPULATION_FOR_AGE80 | LayerId.FEMALE_POPULATION_FOR_AGE0 | LayerId.FEMALE_POPULATION_FOR_AGE1 | LayerId.FEMALE_POPULATION_FOR_AGE5 | LayerId.FEMALE_POPULATION_FOR_AGE10 | LayerId.FEMALE_POPULATION_FOR_AGE15 | LayerId.FEMALE_POPULATION_FOR_AGE20 | LayerId.FEMALE_POPULATION_FOR_AGE25 | LayerId.FEMALE_POPULATION_FOR_AGE30 | LayerId.FEMALE_POPULATION_FOR_AGE35 | LayerId.FEMALE_POPULATION_FOR_AGE40 | LayerId.FEMALE_POPULATION_FOR_AGE45 | LayerId.FEMALE_POPULATION_FOR_AGE50 | LayerId.FEMALE_POPULATION_FOR_AGE55 | LayerId.FEMALE_POPULATION_FOR_AGE60 | LayerId.FEMALE_POPULATION_FOR_AGE65 | LayerId.FEMALE_POPULATION_FOR_AGE70 | LayerId.FEMALE_POPULATION_FOR_AGE75 | LayerId.FEMALE_POPULATION_FOR_AGE80 |  LayerId.A_STORE_SELECTION_LAYER;

export type LayersContextInfoType = {
    [key in LayerType]: LayersInfo
}

export interface LayersInfo {
    isEnable: boolean;
    featureList: GeoJSON.Feature[];
}

export interface LayerContextProps {
}
export const LayerContext: React.FC<LayerContextProps> = (props) => {
    const context = useContext(layerReactContext);
    const Provider = layerReactContext.Provider;

    // State Variables
    const [isRefreshAllLayers, setIsRefreshAllLayers] = useState<boolean>(false);
    const [visibleLayers, setVisibleLayers] = useState<LayerType[]>([]);

    // Ref Variables
    const { current: layerObjRef } = useRef<LayersContextInfoType>(globalContextValue.layerObj);

    /**
     * Update the visible layers array
     * @param list of visible layers
     */
    function updateVisibleLayers(list: LayerType[]) {
        let updatedList = list.slice();
        setVisibleLayers(updatedList);
    }

    /**
     * Update all custom layers using boolean value
     * @param boolean value
     */
    function updateIsRefreshAllLayers(value: boolean) {
        setIsRefreshAllLayers(value);
    }

    return (
        <Provider value={{
            layerObj: layerObjRef,
            visibleLayers: visibleLayers,
            updateVisibleLayers: updateVisibleLayers,
            isRefreshAllLayers: isRefreshAllLayers,
            updateIsRefreshAllLayers: updateIsRefreshAllLayers,
        }}>
            <LayerContextInitializer>{props.children}</LayerContextInitializer>
        </Provider>
    );
}

interface LayerContextInitializerProps {
}
const LayerContextInitializer: React.FC<LayerContextInitializerProps> = (props) => {
    const context = useContext(layerReactContext);
    useEffect(() => {
        return () => {
        }
    }, [context]);
    return (
        <>{props.children}</>
    );
}

export interface ContextType {
    layerObj: LayersContextInfoType;
    visibleLayers: LayerType[];
    updateVisibleLayers: (list: LayerType[]) => void;
    isRefreshAllLayers: boolean;
    updateIsRefreshAllLayers: (value: boolean) => void;
}

/**
 * Define Initial values for layer context
 * @return ContextType object
 */
const initialContext = () => {
    return {
        visibleLayers: [],
        updateVisibleLayers: (list: LayerType[]) => {},
        isRefreshAllLayers: false,
        updateIsRefreshAllLayers: (value: boolean) => {},
        layerObj: {
            [LayerId.A_STORE_LAYER]: {
                isEnable: true,
                featureList: [],
            },
            [LayerId.A_STORE_SELECTION_LAYER]: {
                isEnable: true,
                featureList: [],
            },
            [LayerId.TRADE_AREA_LAYER]: {
                isEnable: true,
                featureList: [],
            },
            [LayerId.B_STORE_LAYER]: {
                isEnable: true,
                featureList: [],
            },
            [LayerId.C_STORE_LAYER]: {
                isEnable: true,
                featureList: [],
            },
            [LayerId.D_STORE_LAYER]: {
                isEnable: true,
                featureList: [],
            },
            [LayerId.E_STORE_LAYER]: {
                isEnable: true,
                featureList: [],
            },
            [LayerId.POPULATION_COUNT]: {
                isEnable: true,
                featureList: [],
            },
            [LayerId.TOTAL_MALE_AND_FEMALE_POPULATION]: {
                isEnable: true,
                featureList: [],
            },
            [LayerId.TOTAL_MALE_AND_FEMALE_POPULATION_AS_POLYGON]: {
                isEnable: true,
                featureList: [],
            },
            [LayerId.TOTAL_MALE_POPULATION]: {
                isEnable: true,
                featureList: [],
            },
            [LayerId.TOTAL_MALE_POPULATION_AS_POLYGON]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.TOTAL_FEMALE_POPULATION]: {
                isEnable: true,
                featureList: [],
            },
            [LayerId.TOTAL_FEMALE_POPULATION_AS_POLYGON]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE0]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE1]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE5]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE10]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE15]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE20]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE25]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE30]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE35]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE40]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE45]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE50]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE55]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE60]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE65]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE70]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE75]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.MALE_POPULATION_FOR_AGE80]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE0]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE1]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE5]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE10]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE15]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE20]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE25]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE30]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE35]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE40]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE45]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE50]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE55]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE60]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE65]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE70]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE75]: {
                isEnable: false,
                featureList: [],
            },
            [LayerId.FEMALE_POPULATION_FOR_AGE80]: {
                isEnable: false,
                featureList: [],
            },
        },
    };
};


export const globalContextValue: ContextType = initialContext();
export const layerReactContext = React.createContext<ContextType>(globalContextValue);

export default LayerContext;
