
import { useState, useRef } from 'react'
import './PhotoLoader.css'

interface props {
    onImageLoaded: (img: HTMLImageElement) => void;
}

function PhotoUploader(props: props){
    const [imageURL, setImageURL] = useState<string>("")
    const previewRef = useRef(null);


    const handleImageChange = (e: React.FormEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files){
            const path = files[0];
            
            const img = new Image();
            img.src = URL.createObjectURL(path);
            img.onload = () => {
                console.log("onload triggered")
                props.onImageLoaded(img);
            }
        }
    }
/*     const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        props.onImageLoaded(e.currentTarget);
    } */
    return (
        <section>
            <form className="form">
                <label>Select image:</label>
                <input type="file" id="img" name="img" accept="image/*" onChange={handleImageChange}></input>
            </form>
            {/* <div className="image-preview">
                <div className="image-shell">
                    <img  ref={previewRef} id="image" src={imageURL} className="image" width="200" onLoad={handleImageLoad} />	
                </div>
            </div> */}
        </section>
    )
}

export default PhotoUploader