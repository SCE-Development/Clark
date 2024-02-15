import React, { Component } from 'react';
import Footer from '../../Components/Footer/Footer.js';
import { motion } from 'framer-motion';

class Home extends Component {
  render() {
    return (
      <div className='flex flex-col min-h-[calc(100vh-86px)] z-[-200] bg-gradient-to-r from-gray-800 to-gray-600'>
        <div className="flex flex-col flex-wrap items-center justify-center flex-1 h-full my-4 md:flex-row xl:my-0">
          <div className="flex flex-col items-center justify-center w-full p-4 overflow-y-hidden xl:w-2/5">
            <div className="flex flex-col mb-8 xl:ml-10">
              <motion.h1
                initial={{ opacity: 0, y: -75}}
                animate={{ opacity: 1, y:0}}
                transition={{ duration: 1.5}}
                className="my-4 text-3xl font-bold text-center text-white opacity-75 md:text-5xl xl:text-left">
                The Software and Computer Engineering Society
              </motion.h1>
              <motion.h3
                initial={{ opacity: 0, x: 100}}
                animate={{ opacity: 1, x:0}}
                transition={{ duration: 1, delay: 0.5}}
                className="text-base text-center xl:text-left md:text-2xl">
                SJSU's Largest Engineering Club
              </motion.h3>
            </div>
            <motion.div
              initial={{ opacity: 0, y:100}}
              animate={{ opacity: 1, y:0}}
              transition={{ duration: 0.5, delay: 1.5}}
              className='flex justify-center space-x-3'>
              <a href="/about" rel="nofollow noreferrer" target="_blank">
                <button className="btn btn-outline btn-primary hover:!text-white">Learn More</button>
              </a>
              <a href="/register" rel="nofollow noreferrer" target="_blank">
                <button className="btn btn-outline btn-accent hover:!text-white">Join Us!</button>
              </a>
            </motion.div>
          </div>


          <div className="w-full h-full p-12 overflow-hidden xl:w-3/5">
            <motion.img
              initial={{ opacity: 0}}
              animate={{ opacity: 1}}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.7, 0, 0.58, 1]}}
              className="w-full mx-auto transform md:w-4/5 rounded-xl"
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
