import React from 'react';

import 'FontAwesome';
import AuthenticationFC from 'components/Authentication';
import MapboxContext from 'components/MapboxContext';
import ContainerFC from 'components/Container';

export interface AppProps {
}

const App: React.FC<AppProps> = (props) => {
  return (
    <div className="App">
      <AuthenticationFC>
        <MapboxContext>
          <ContainerFC></ContainerFC>
        </MapboxContext>
      </AuthenticationFC>
    </div>
  );
}

export default App;
