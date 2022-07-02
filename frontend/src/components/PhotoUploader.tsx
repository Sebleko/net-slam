
import { useState } from 'react'
import './PhotoUploader.css'

function PhotoUploader(){
    const [imageURL, setImageURL] = useState<string>("")


    const handleImageChange = (e: React.FormEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files){
            const img = files[0];
            
            setImageURL(() => URL.createObjectURL(files[0]));
        }
    }

    return (
        <section>
            <form className="form">
                <label>Select image:</label>
                <input type="file" id="img" name="img" accept="image/*" onChange={handleImageChange}></input>
            </form>
            <div className="image-preview">
                <div className="image-shell">
                    <img id="image" src={imageURL} className="image" width="200" />	
                </div>
            </div>
        </section>
    )
}

export default PhotoUploader