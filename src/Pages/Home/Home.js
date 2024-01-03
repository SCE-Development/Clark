import React, { Component } from 'react';
import Footer from '../../Components/Footer/Footer.js';

class Home extends Component {
  render() {
    return (
      <div className='h-[84vh]'>
        <div className="flex flex-wrap flex-col md:flex-row justify-center items-center h-full">
          <div className="flex flex-col w-full xl:w-2/5 justify-center items-center  overflow-y-hidden">
            <div className="flex flex-col ml-10 justify-center items-center">
              <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center lg:text-left">
                The Software and Computer Engineering Society
              </h1>
              <p className="leading-normal text-base md:text-2xl mb-8 text-left">
                SJSU's largest Engineering Club
              </p>
            </div>
            <div className='space-x-3'>
              <a href="/about"
                rel="nofollow noreferrer"
                target="_blink"
              >
                <button className="btn btn-outline btn-primary">Learn More</button>
              </a>
              <a href="/register"
                rel="nofollow noreferrer"
                target="_blink"
              >
                <button className="btn btn-outline btn-accent">Join Us!</button>
              </a>
            </div>
          </div>

          <div className="w-full xl:w-3/5 p-12 overflow-hidden">
            <img
              className="mx-auto w-full md:w-4/5 transform"
              src="https://user-images.githubusercontent.com/63530023/230752289-defefe87-354d-4fcc-9e60-17e4356ba17e.png"
            />
          </div>

        </div>
        <div className='flex-grow'>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Home;
