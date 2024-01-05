import React, { Component } from 'react';
import Footer from '../../Components/Footer/Footer.js';

class Home extends Component {
  render() {
    return (
      <div className='flex flex-col min-h-[calc(100vh-86px)] z-[-200] bg-gradient-to-r from-gray-800 to-gray-600'>
        <div className='h-[86px]'/>
        <div className="flex flex-col flex-wrap items-center justify-center flex-1 h-full md:flex-row">
          <div className="flex flex-col items-center justify-center w-full overflow-y-hidden xl:w-2/5">
            <div className="flex flex-col mb-8 ml-10">
              <h1 className="my-4 text-3xl font-bold text-center text-white opacity-75 md:text-5xl xl:text-left">
                The Software and Computer Engineering Society
              </h1>
              <h3 className="text-base text-center xl:text-left md:text-2xl">
                SJSU's largest Engineering Club
              </h3>
            </div>
            <div className='flex justify-center space-x-3'>
              <a href="/about" rel="nofollow noreferrer" target="_blank">
                <button className="btn btn-outline btn-primary hover:!text-white">Learn More</button>
              </a>
              <a href="/register" rel="nofollow noreferrer" target="_blank">
                <button className="btn btn-outline btn-accent hover:!text-white">Join Us!</button>
              </a>
            </div>
          </div>


          <div className="w-full h-full p-12 overflow-hidden xl:w-3/5">
            <img
              className="w-full mx-auto transform md:w-4/5"
              src="https://user-images.githubusercontent.com/63530023/230752289-defefe87-354d-4fcc-9e60-17e4356ba17e.png"
            />
          </div>

        </div>

        <Footer />
      </div>
    );
  }
}

export default Home;
