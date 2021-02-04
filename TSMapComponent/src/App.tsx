import React, { useEffect } from 'react';

import MapboxContext from 'components/MapboxContext';
import ContainerFC from 'components/Container';

export interface AppProps {
}

const App: React.FC<AppProps> = (props) => {

  useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://kit.fontawesome.com/a076d05399.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
          document.body.removeChild(script);
      }
  }, []);

  return (
    <div className="App">
      <MapboxContext>
        <ContainerFC></ContainerFC>
      </MapboxContext>
    </div>
  );
}

export default App;
