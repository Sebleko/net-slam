import React from 'react';
import './App.css';
import PhotoUploader from './components/PhotoUploader'

function App() {

  
  return (
    <div className="App">
      <nav>

      </nav>
      <p className="description">
        This is an implementation of the <a href="http://www.gwylab.com/download/ORB_2012.pdf">ORB feature detection algorithm</a> in WebAssembly running in the browser.
      </p>
      <div>
        <PhotoUploader />
      </div>
    </div>
  );
}

export default App;
