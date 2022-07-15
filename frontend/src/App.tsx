
import ScanningPage from './pages/ScanninPage';
import ErrorPopupProvider from './components/ErrorPopup'

function App() {

  return (
    <div className="App">
      <ErrorPopupProvider>
        <ScanningPage />
      </ErrorPopupProvider>

    </div>
  );
}

export default App;
