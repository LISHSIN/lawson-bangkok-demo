import React from 'react';

import ToolbarFC from 'components/Toolbar';
import Map1FC from 'components/Map1';
import { MapboxConfig } from 'components/Map1/constants';

export interface WrapperProps {
}

export const WrapperFC: React.FC<WrapperProps> = (props => {
    return (
        <div className='wrapper'>
            <ToolbarFC></ToolbarFC>
            <Map1FC
                map = {{
                    style: MapboxConfig.STYLE,
                    center: MapboxConfig.CENTER,
                    containerStyle : {
                      height: '100%',
                      width: '100%'
                    },
                    zoom: MapboxConfig.ZOOM
                }}
            ></Map1FC>
        </div>
    );
});

export default WrapperFC;
