import ScanningPage from './pages/ScanninPage';
import ErrorPopupProvider from './components/ErrorPopup'
import FullscreenPopupProvider from './components/FullscreenPopup/FullscreenPopup';

function App() {

  return (
    <div className="App">   
      <FullscreenPopupProvider>
        <ErrorPopupProvider>
          <ScanningPage />
        </ErrorPopupProvider>
      </FullscreenPopupProvider>

    </div>
  );
}

export default App;
