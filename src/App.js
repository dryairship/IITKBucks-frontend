import React from 'react';
import TabbedPane from './components/TabbedPane';

function App() {
  return (
    <div style={{
      width: '80%',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      margin: '50px auto',
    }}>
      <TabbedPane />
    </div>
  );
}

export default App;
