import React from 'react';

export default function PresetImages() {
  const presets = Array(9).fill(null);
  return (
    <div className='w-full max-w-sm mx-auto p-2.5'>
      <h1 className='text-center text-2xl font-inter relative'>
        Preset Images
        <div className='absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-[100px] h-[2px] bg-black'></div>
      </h1>
      <div className='grid grid-cols-3 gap-2.5 p-1.5'>
        {presets.map((_, index) => (
          <div key={index} className='aspect-square transition-transform duration-200 ease-in-out hover:scale-105'>
            <button className='w-full h-full border-2 border-black rounded-md cursor-pointer bg-white text-sm font-inter transition-all duration-200 ease-in-out p-1.5 hover:bg-gray-100'>
              Preset {index + 1}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
