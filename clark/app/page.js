'use client';
import React, { useEffect, useState } from 'react';
import {Link} from 'react-scroll';
import GithubIcon from '@/util/icons/GithubIcon';
import DiscordIcon from '@/util/icons/DiscordIcon';
import InstagramIcon from '@/util/icons/InstagramIcon';
import style from './aboutus.module.css';
import Head from 'next/head';

export default function Home() {
  const [blur, setBlur] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scroll = window.scrollY;
            const maxBlur = 10; // Maximum blur value
            const newBlur = Math.min((scroll / window.innerHeight) * maxBlur, maxBlur);            
            setBlur(newBlur);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

  return (
    <main>
      <Head>
        <style>
          {`
            body::before {
              content: "";
              background-image: url("https://user-images.githubusercontent.com/63530023/230752289-defefe87-354d-4fcc-9e60-17e4356ba17e.png");
              filter: blur(${blur}px);
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: -1;
              background-size: cover;
              background-position: center;
              brightness: 75%;
            }
          `}
        </style>
      </Head>
      <div id='section-1' className='flex h-screen' style={{ filter: `blur(${blur}px)` }}>
        {/* Background Image */}
        <div id='background-image' className='fixed inset-0 h-screen bg-cover bg-center brightness-75 z-[-1]' style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/63530023/230752289-defefe87-354d-4fcc-9e60-17e4356ba17e.png")' }} />

        {/* Page Content */}
        <div id='sce-intro' className='sticky flex justify-start h-screen items-center -mt-10 mx-10'>
          <div id='sce-intro-content' className='flex flex-col text-white ml-'>
            <h1 className='text-6xl font-bold'>This is SCE</h1>
            <h2 className='text-3xl inset-x-10'>Software and Computer Engineering <br />Society</h2>
            <Link to='section-2' smooth={true} duration={300} className='btn btn-md btn-primary w-2/5'>About Us</Link>
          </div>
        </div>
      </div>
      <div id="section-2" className="h-full">
        <h1 className={`${style.largestHeader} text-white`}>The largest engineering club at SJSU.</h1>
        <div className={`${style.aboutUsRowDiv}`}>
          <div className={`${style.glasspane} ${style.quarterDiv} text-white`}>
            <div className={`${style.centerDiv}`}>
              <label className={`${style.missionPillLabel} text-black my-2`}>Our mission</label>
            </div>
            <p className={`${style.aboutParagraph} text-white mb-1`}>
              The mission of the Software and Computer Engineering Society (SCE)
              is two-fold: making valuable connections and building technical
              skills. As the largest engineering club at SJSU, SCE strives for
              the success of Computer Engineering (CMPE) and Software
              Engineering (SE) students, though we are open to all majors,
              ranging from other types of engineering to design. As a
              student-run organization, our alumni network stretches to Google,
              Apple, Meta, HP, and many more.
            </p>
          </div>
          <div className={`${style.quarterDiv}`}>
            <div className={`${style.centerDiv}`}>
              <label className={`${style.placeHolder}`}>PLACEHOLDER</label>
            </div>
          </div>
        </div>
        <div className={`${style.aboutUsRowDiv}`}>
          <div className={`${style.quarterDiv}`}>
            <div className={`${style.centerDiv}`}>
              <label className={`${style.placeHolder}`}>PLACEHOLDER</label>
            </div>
          </div>
          <div className={`${style.glasspane} ${style.quarterDiv}`}>
            <div className={`${style.centerDiv}`}>
              <label className={`${style.pillLabel} text-black my-2`}>Connect & Collaborate</label>
            </div>
            <p className={`${style.aboutParagraph} text-white mb-1`}>
              SCE provides a social space for students to congregate and
              collaborate. We encourage members to connect and make new friends
              through social events such as potlucks, game nights, and movie
              nights. We also wish for members to facilitate connections, not
              only personally, but also professionally. Throughout the years,
              SCE has hosted networking/recruiting events and company tours with
              Tesla, Cisco, SAP, Capital One, Texas Instruments, and more.
            </p>
          </div>
        </div>
      </div>
      <div id='section-3' className='relative flex flex-col h-screen'>
        <div className='flex-grow'>
          Upcoming Events
        </div>
        <div id='double-footer'>
          <footer className="footer p-10 bg-blue-900 text-base-content">
            {/* <header className='footer-title text-4xl text-white'>Contact Us</header> */}
            <nav className='text-white'>
              <header className="footer-title text-lg">General Inquiries</header> 
              <header className="footer-title text-base">SCE Email</header> 
              <a className="link link-hover text-sm">sce.sjsu@gmail.com</a> 
            </nav> 
            <nav className='text-white'>
              <header className="footer-title text-lg">Sponsor and Relations</header> 
              <header className="footer-title text-base">Pablo Nava Barrera</header> 
              <a className="link link-hover text-sm">pablo.navabarrera@sjsu.edu</a> 
            </nav>
            <form className=''>
              <header className="footer-title text-white text-lg">Contact Us</header> 
              <fieldset className="form-control w-">
                <label className="label">
                  <span className="label-text text-white">Submit a question</span>
                </label> 
                <div className="relative">
                  <input type="text" placeholder="Enter here" className="input input-bordered w-full pr-16 text-black" /> 
                  <button className="btn btn-primary absolute top-0 right-0 rounded-l-none">Submit</button>
                </div>
              </fieldset>
            </form>
          </footer> 
          <footer className="footer px-10 py-4 border-t bg-blue-900 text-base-content border-base-300">
            <aside className="items-center grid-flow-col text-white">
              <p>Brought to you by SCE Dev Team <br/>Coding projects since 1992.</p>
            </aside> 
            <nav className="md:place-self-center md:justify-self-end text-white">
              <div className="grid grid-flow-col gap-4">
                {/* <a><DiscordIcon /></a> 
                <a><GithubIcon /></a>
                <a><InstagramIcon /></a> */}
              </div>
            </nav>
          </footer>
        </div>
      </div>
    </main>
  );
}


