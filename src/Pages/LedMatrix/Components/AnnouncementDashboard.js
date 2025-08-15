import React, { useState, useRef } from 'react';
import PresetVideos from './PresetVideos';
import PresetImages from './PresetImages';

export default function AnnouncementDashboard() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const imageRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // check if the image is a square
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          if (img.width === img.height) {
            setError('');
          } else {
            setError('Image is not square');
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage || isUploading) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedImage);

    // the following needs to be properly integrated with Clark and the LED Matrix URL:

    /*
    try {
      // First call to kill the current process
      await fetch(`${MAIN_URL}/uploadImage`, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
    }
    */
  };

  const resetImage = () => {
    setSelectedImage(null);
    imageRef.current.value = null;
    setError('');
    // Clean up the preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };


  return (
    <div className='[&>*]:py-2 flex flex-col items-center text-gray-700 dark:text-white'>
      <div>
        <h2 className='text-2xl font-bold py-2'>
          Announcements
        </h2>
        <h4 className='text-lg py-2'>Upload your announcement here, and it will be displayed on the LED Matrix!</h4>
        <p><strong><em>Ensure your image or video is square</em></strong></p>
      </div>
      <div className='border-2 border-dashed border-[#ccc] hover:border-[#2c3e50] rounded-lg text-center cursor-pointer mt-6 transition-colors duration-300 ease-in-out w-[400px] min-h-[150px] flex flex-col justify-center items-center p-2.5 relative'>
        <input
          type='file'
          accept='image/*,video/*'
          onChange={handleImageChange}
          id='image-input'
          className='hidden'
          ref={imageRef}
        />
        <label
          htmlFor='image-input'
          className='cursor-pointer text-[#666] text-base relative z-20 px-2.5 py-1.5 rounded mb-1.5'
        >
          {!selectedImage ? 'Choose an image or video' : ''}
        </label>
        {previewUrl && (
          <div
            className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] overflow-hidden rounded-lg bg-[#f5f5f5]'
          >
            <img
              src={previewUrl}
              alt='Preview'
              className='w-full h-full object-contain block'
            />
          </div>
        )}
      </div>
      <div className='h-12'>
        <p className='text-red-500 text-center my-2.5 text-sm'>
          {error ? 'Please input a square image.' : ''}
        </p>
      </div>
      <div className='flex justify-center gap-2.5 w-full'>
        <button
          className='px-6 py-3 text-base border-none rounded-lg cursor-pointer transition-all duration-300 ease-in-out min-w-[120px] max-w-[200px] w-full bg-[rgb(3,206,0)] text-black hover:text-white'
          disabled={!selectedImage || isUploading || error}
          onClick={handleImageUpload}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
        {selectedImage && (
          <button
            className='px-6 py-3 text-base border-none rounded-lg cursor-pointer transition-all duration-300 ease-in-out min-w-[120px] max-w-[200px] w-full bg-red-500 text-black hover:text-white'
            onClick={resetImage}
          >
            Reset
          </button>
        )}
      </div>
      <div className='flex flex-row w-full'>
        <PresetVideos/>
        <PresetImages/>
      </div>
    </div>
  );
}
