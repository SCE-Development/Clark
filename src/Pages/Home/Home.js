import React, { Component } from 'react';
import Footer from '../../Components/Footer/Footer.js';

class Home extends Component {
  render() {
    return (
      <div className='flex flex-col min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#000000] via-[#0c143f] to-[#000000]'>
        <div className='h-4 sm:h-16' />

        <div className='items-center justify-center flex-1 px-4 mx-auto text-white'>
          <h1 className='text-4xl font-bold text-center'>Redeem Code</h1>

          <div className='relative w-full max-w-5xl p-8 mt-8 border bg-black/40 transform-gpu rounded-xl border-white/10 backdrop-blur'>
            <h3 className='text-lg text-center text-white'>Paste Your Code Below</h3>
            <input
              type="text"
              placeholder="Paste Code Here!"
              className="my-5 w-full outline-none text-center text-sm bg-transparent hover:bg-[#30313D]/50 focus:bg-[#30313D]/50 border-white/10 focus:border-blue-500 border-[1px] focus:border-2 placeholder-grey-300 hover:placeholder-grey-100 focus:placeholder-grey-100 transition ease-in-out duration-300 rounded-md px-8 py-4 sm:py-3 text-white"
            />
            <button className='text-white btn btn-info btn-block hover:bg-cyan-700'>Redeem Code</button>
          </div>
        </div>
        <div className='h-8 sm:h-16' />

        <Footer />
      </div>
    );
  }
}

export default Home;
