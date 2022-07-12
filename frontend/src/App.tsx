import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import PhotoLoader from './components/PhotoLoader'
import slamPromise from './wasm'
import { WebSlam } from './wasm/slam';
import { addAlphaChannelToRGB } from './util/image_ops';


function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContextRef = useRef<CanvasRenderingContext2D|null>(null);
  const [slam, setSlam] = useState<WebSlam | null>(null);


  async function loadWasmModule() {
    const slam = await slamPromise;
    setSlam(() => slam);
  }

  useEffect(() => {
    if (!slam){
      loadWasmModule();
    }
    if (canvasRef.current){
      const c = canvasRef.current;
    
      c.width = 500;
      c.height = 800;

      canvasContextRef.current = c.getContext("2d");
    }
  }, [slam])

  function detectAndPaintFeatures(src: HTMLCanvasElement | HTMLVideoElement | ImageBitmap | HTMLImageElement){
    if (canvasContextRef.current && slam && canvasRef.current) {
      const ctx = canvasContextRef.current;
      const canvas = canvasRef.current;
      canvas.width = src.width;
      canvas.height = src.height;

      ctx.drawImage(src, 0, 0);
      const pixels = ctx.getImageData(0, 0, src.width, src.height);

      const without_alpha = pixels.data.filter((value, index) => {return (((index+1) % 4) !== 0)});
      const res = slam.processFrameAndDrawFeatures(without_alpha, pixels.width, pixels.height, 3);
      const with_alpha = addAlphaChannelToRGB(res, 255);

      pixels.data.set(with_alpha); 
      ctx.putImageData(pixels, 0, 0);

    }
  }

  function handleImageLoad(img: HTMLImageElement){
    detectAndPaintFeatures(img)
  }

  return (
    <div className="App">
      <nav>

      </nav>
      <p className="description">
        This is an implementation of the <a href="http://www.gwylab.com/download/ORB_2012.pdf">ORB feature detection algorithm</a> in WebAssembly running in the browser.
      </p>
{/*       <video ref={videoRef} id="v" src="test.mp4"></video> */}
      <div>
        <PhotoLoader onImageLoaded={handleImageLoad}/>
      </div>
      <canvas id="canvas" ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
