import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import * as jwt_decode from 'jwt-decode';
import Loader from 'react-spinners/SyncLoader'



export const UploadImage = () => {
    const { jwtToken } = useOutletContext();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploaded, setUploaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [canceled, setCanceled] = useState(false);

    const toggleCancel = () => {
        if (canceled) {
            setCanceled(!canceled);
        } else {
            setCanceled(true);
        };
    }
    useEffect(() => {

    }, [uploaded, canceled, selectedFile]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (file && !allowedTypes.includes(file.type)) {
            alert('Invalid file type. Please select an image (JPEG, PNG, or GIF).');
        } else {
            setSelectedFile(file);
        };
    };

    const handleUpload = () => {
        let userID = jwt_decode.jwtDecode(jwtToken).sub;
        if (selectedFile) {
            setLoading(true);
            const maxSizeBytes = 5 * 1024 * 1024; // 5MB
            if (selectedFile.size > maxSizeBytes) {
                alert('File size exceeds the maximum allowed size (5MB).');
                return;
            };

            const formData = new FormData();
            formData.append('image', selectedFile);
            fetch(`http://localhost:8082/logged_in/upload?uID=${userID}`, {
                method: "POST",
                headers: { "Authorization": "Bearer " + jwtToken },
                body: formData
            }).then((response) => response.json()).then((data) => {
                setUploaded(true);
                setSelectedFile(false);
            }).catch(error => console.error(error.message)).finally(() => setLoading(false))

        } else {
            alert('No file selected');
        };
    };

    const resetFileInput = () => {
        // Set the selectedFile state to null to reset the input
        setSelectedFile(null);
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <h1 className="h1 mt-4 mb-4" style={{ fontWeight: 700, color: '#06186860' }}>Uploading the Logo</h1>
                <div className='row justify-content-center'>
                    <Loader className='mt-4' color="#06186860" size={20} loading={loading}></Loader>
                </div>
            </div>
        )
    } else {
        return (
            <div className="mt-5 px-5   " st>
                <p className=" mb-4 mt-5" style={{ color: '#061868', fontSize: 18, fontWeight: 600 }}>
                    Upload your new logo
                </p>
                <input
                    className="custom-file-input"
                    type="file"
                    id="file-input"
                    style={{ fontSize: 16, color: '#888', display: 'flex', alignItems: 'center' }}
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {selectedFile && <button className="btn btn-submit-dark-small mt-4" onClick={handleUpload}>Submit</button>}
                {selectedFile && <button className="btn btn-secondary mt-4 ms-3" style={{ fontSize: 18 }} onClick={resetFileInput}>Cancel</button>}

                {uploaded ? <p className="mt-2">Logo successfully uploaded!</p> : ""}
            </div>
        );
    }

};