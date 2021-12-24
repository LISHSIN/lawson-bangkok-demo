import './index.css';
import React from 'react';

import PopulationLegendFC from './populationLegend';

export interface LegendProps {
}

export const LegendFC: React.FC<LegendProps> = (props => {
    return (
        <div className="legend-container">
            <PopulationLegendFC></PopulationLegendFC>
        </div>
    );
});


export default LegendFC;
