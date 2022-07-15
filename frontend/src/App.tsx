import { useState } from 'react';
import InfoPopup from './components/InfoPopup'
import ScanningPage from './pages/ScanninPage';
import ErrorPopupProvider from './components/ErrorPopup'

function App() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="App">
      {showInfo && <InfoPopup setShowInfo={setShowInfo}/>}
      <ErrorPopupProvider>
        <ScanningPage setShowInfo={setShowInfo}/>
      </ErrorPopupProvider>

    </div>
  );
}

export default App;
