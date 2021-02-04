import React from 'react';

import LayerListFC from 'components/LayerList';
import WrapperFC from 'components/Wrapper';
import LayerContext from 'components/LayerContext';

export interface ContainerProps {
}

export const ContainerFC: React.FC<ContainerProps> = (props => {
    return (
        <div className='container'>
            <LayerContext>
                <LayerListFC></LayerListFC>
                <WrapperFC></WrapperFC>
            </LayerContext>
        </div>
    );
});

export default ContainerFC;
