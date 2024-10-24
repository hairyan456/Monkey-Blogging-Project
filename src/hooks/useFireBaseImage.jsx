import { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { toast } from 'react-toastify';


export default function useFireBaseImage(setValue, getValues, imageName = '', callback = () => { }) {
    const [progress, setProgress] = useState(0);
    const [imageURL, setImageURL] = useState('');

    if (!setValue || !getValues) return;

    const handleUploadImage = (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, 'images/' + file?.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progressPercent);
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        console.log('Nothing at all!');
                        break;
                }
            },
            (error) => {
                console.log('Error:', error);
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageURL(downloadURL);
                    setProgress(0);
                });
            }
        );
    }

    const handleOnchangeImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setValue('image_name', file?.name); // set value trong RHF
        handleUploadImage(file);
    }

    const handleResetUpload = () => {
        setImageURL(''); setProgress(0);
    }

    const handleDeleteImage = async () => {
        const storage = getStorage();
        // Create a reference to the file to delete
        const desertRef = ref(storage, `images/${imageName || getValues('image_name')}`);
        // Delete the file
        await deleteObject(desertRef)
            .then(() => {
                handleResetUpload();
                callback && callback();
                toast.success('Remove image success');
            })
            .catch((error) => {
                toast.error(error?.message);
                console.log(error);
            });
    }


    return { progress, imageURL, setImageURL, handleResetUpload, handleOnchangeImage, handleDeleteImage };
}