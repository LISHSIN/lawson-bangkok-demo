import React, { useState, useContext, useEffect } from 'react';

import './index.css';
import allPopulationImg from './images/allPopulation.png';
import ageAndGenderWisePopulationImg from './images/ageAndGenderWisePopulation.png';

import { mapboxReactContext } from 'components/MapboxContext';
import { layerReactContext } from 'components/LayerContext';
import { LayerId } from 'components/Map1/constants';

export interface LegendProps {
}

export const LegendFC: React.FC<LegendProps> = (props => {
    const context = useContext(mapboxReactContext);
    const layerContext = useContext(layerReactContext);
    const { map } = context;
    const { visibleLayers } = layerContext;

    // State Variables
    const [showAllPopulationLegend, setShowAllPopulationLegend] = useState(isEnableAllPopulationLayer());
    const [showAgeAndGenderWisePopulationLegend, setShowAgeAndGenderWisePopulationLegend] = useState(isEnableAnyAgeAndGenderWisePopulationLayer());

    useEffect(() => {
      if (map !== undefined) {
        updateLegendDisplay();
      }
    }, [visibleLayers]);

    /**
     * Check if all population layer is
     * checked or not
     * @return boolean value
     */
    function isEnableAllPopulationLayer() {
      return visibleLayers.indexOf(LayerId.TOTAL_MALE_AND_FEMALE_POPULATION_AS_POLYGON) !== -1 ? true : false;
    }

    /**
     * Check if any one of age and gender wise
     * population layer is checked or not
     * @return boolean value
     */
    function isEnableAnyAgeAndGenderWisePopulationLayer() {
      let allMaleAgeWiseLayers = [LayerId.MALE_POPULATION_FOR_AGE0, LayerId.MALE_POPULATION_FOR_AGE1, LayerId.MALE_POPULATION_FOR_AGE5, LayerId.MALE_POPULATION_FOR_AGE10, LayerId.MALE_POPULATION_FOR_AGE15, LayerId.MALE_POPULATION_FOR_AGE20, LayerId.MALE_POPULATION_FOR_AGE25, LayerId.MALE_POPULATION_FOR_AGE30, LayerId.MALE_POPULATION_FOR_AGE35, LayerId.MALE_POPULATION_FOR_AGE40, LayerId.MALE_POPULATION_FOR_AGE45, LayerId.MALE_POPULATION_FOR_AGE50, LayerId.MALE_POPULATION_FOR_AGE55, LayerId.MALE_POPULATION_FOR_AGE60, LayerId.MALE_POPULATION_FOR_AGE65, LayerId.MALE_POPULATION_FOR_AGE70, LayerId.MALE_POPULATION_FOR_AGE75, LayerId.MALE_POPULATION_FOR_AGE80];
      let allFemaleAgeWiseLayers = [LayerId.FEMALE_POPULATION_FOR_AGE0, LayerId.FEMALE_POPULATION_FOR_AGE1, LayerId.FEMALE_POPULATION_FOR_AGE5, LayerId.FEMALE_POPULATION_FOR_AGE10, LayerId.FEMALE_POPULATION_FOR_AGE15, LayerId.FEMALE_POPULATION_FOR_AGE20, LayerId.FEMALE_POPULATION_FOR_AGE25, LayerId.FEMALE_POPULATION_FOR_AGE30, LayerId.FEMALE_POPULATION_FOR_AGE35, LayerId.FEMALE_POPULATION_FOR_AGE40, LayerId.FEMALE_POPULATION_FOR_AGE45, LayerId.FEMALE_POPULATION_FOR_AGE50, LayerId.FEMALE_POPULATION_FOR_AGE55, LayerId.FEMALE_POPULATION_FOR_AGE60, LayerId.FEMALE_POPULATION_FOR_AGE65, LayerId.FEMALE_POPULATION_FOR_AGE70, LayerId.FEMALE_POPULATION_FOR_AGE75, LayerId.FEMALE_POPULATION_FOR_AGE80];

      let isAnyAgeAndGenderEnable = false;
      for (let i = 0; i < visibleLayers.length; i++) {
        let layer = visibleLayers[i];
        if ((allMaleAgeWiseLayers.indexOf(layer) !== -1) || (allFemaleAgeWiseLayers .indexOf(layer) !== -1)) {
          isAnyAgeAndGenderEnable = true;
          break;
        }
      }
      return isAnyAgeAndGenderEnable;
    }

    /**
     * Update the state variables to
     * Show/Hide the legends based on the
     * population layer checkbox values
     */
    function updateLegendDisplay() {
      let isAllChecked = isEnableAllPopulationLayer();
      let isAnyAgeAndGenderChecked = isEnableAnyAgeAndGenderWisePopulationLayer();

      setShowAllPopulationLegend(isAllChecked);
      setShowAgeAndGenderWisePopulationLegend(isAnyAgeAndGenderChecked);
    }

    let legendClasses;
    if ((showAllPopulationLegend === false) && (showAgeAndGenderWisePopulationLegend === false)) {
      legendClasses = 'legend hide';
    } else {
      legendClasses = 'legend show';
    }

    let allPopulationClasses = '';
    if (showAllPopulationLegend === false) {
      allPopulationClasses = 'disabled';
    }

    let ageAndGenderWisePopulationClasses = '';
    if (showAgeAndGenderWisePopulationLegend === false) {
      ageAndGenderWisePopulationClasses = 'disabled';
    }

    return (
      <div className={legendClasses}>
        <div id="allPopulation" className={allPopulationClasses}>
          <h4>All Population</h4>
          <div className="population-img">
            <img src={allPopulationImg} />
          </div>
        </div>
        <div id="ageAndGenderWisePopulation" className={ageAndGenderWisePopulationClasses}>
          <h4>Age and Gender</h4>
          <div className="population-img">
            <img src={ageAndGenderWisePopulationImg} />
          </div>
        </div>
      </div>
    );
});


export default LegendFC;
