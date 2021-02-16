import React from 'react';

import 'FontAwesome';
import MapboxContext from 'components/MapboxContext';
import ContainerFC from 'components/Container';

export interface AppProps {
}

const App: React.FC<AppProps> = (props) => {
  return (
    <div className="App">
      <MapboxContext>
        <ContainerFC></ContainerFC>
      </MapboxContext>
    </div>
  );
}

export default App;
