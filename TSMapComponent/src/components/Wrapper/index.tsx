import React from 'react';

import ToolbarFC from 'components/Toolbar';
import Map1FC from 'components/Map1';
import { MAPBOX_CONFIG } from 'components/Map1/constants';

export interface WrapperProps {
}

export const WrapperFC: React.FC<WrapperProps> = (props => {
    return (
        <div className='wrapper'>
            <ToolbarFC></ToolbarFC>
            <Map1FC
                map = {{
                    style: MAPBOX_CONFIG.STYLE,
                    center: MAPBOX_CONFIG.CENTER,
                    containerStyle : {
                      height: '100%',
                      width: '100%'
                    },
                    zoom: MAPBOX_CONFIG.ZOOM
                }}
            ></Map1FC>
        </div>
    );
});

export default WrapperFC;
