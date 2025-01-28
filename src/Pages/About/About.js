import React from 'react';

export default function AboutPage() {
  return (
<<<<<<< HEAD
    <div className="flex flex-col p-6 space-y-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold">What Happens at SCE</h1>
      <hr className="w-1/2 border-gray-300" />

      <section>
        <h2 className="text-2xl font-semibold">Introduction</h2>
        <p>
          The Software and Computer Engineering Society is a student-run club at San Jose State that aims to provide
          students with a sense of community, industry-relevant experience, and mentorship.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Location</h2>
        <p>
          We are located in the second floor of the Engineering Building, room 294. When the school semester is in session, our hours are:
        </p>

        <pre>
          Monday - Thursday: 10:00 AM - 5:00 PM
          <br></br>
          Friday:            10:00 AM - 2:00 PM
        </pre>

        <p>
          During open hours, the room is open to the public. Outside of hours, SCE members and officers may access the room with a numerical door code.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Becoming an SCE Member</h2>
        <p>Membership is limited to San Jose State students. Membership duration is based on semesters and require a fee:</p>
        <pre>
          Single semester: $20
          <br></br>
          Two semesters:   $30
        </pre>
        <p>
          Benefits include after-hours room access, free paper printing, free 3D printing, company tours, and a free T-shirt.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Development Team</h2>
        <p>
          The development team works on projects including full stack, distributed systems, site reliability, networking, and more.
          Members often land top internships and job offers through their experience and receive mentorship from SCE alumni.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Summer Internship</h2>
        <p>
          Every summer, SCE runs a remote internship program where students design, implement, and maintain large-scale projects.
        </p>
        <p>
          The internship begins in early June and runs for 10 weeks. We host in-person game nights, and at the end, interns present
          their projects to alumni and faculty.
        </p>
        <p>Details and important dates are announced on our Discord as June approaches.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Discord</h2>
        <p>
          Join us using the link below. We encourage new users to ask questions in our discussion channels!
        </p>
        <br></br>
        <a href="https://sce.sjsu.edu/s/discord" className="text-blue-500 underline hover:text-blue-700" rel="nofollow noreferrer" target="_blank">
          https://sce.sjsu.edu/s/discord
        </a>
      </section>

      <img
        src="https://user-images.githubusercontent.com/36345325/78325084-81350300-752b-11ea-8571-032ed04b3018.png"
        alt="sce collage"></img>
    </div>
  );
}
=======
      <div className='dark:bg-gray-900'>
      <div className="container mx-auto px-5 py-8 ">
        <div className="flex flex-col md:flex-row">
          <div className="w-full p-4">
  
            {/* Title Section */}
            <div className="w-full p-2">
              {/*<div className="border-t border-gray-300 dark:border-gray-700"></div> */}
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white my-4 text-center p-4">What Happens at SCE</h1>
              <div className="border-b border-gray-300 mb-6"></div>
            </div>
  
            {/* Sections */}
            <div className="space-y-8">
              {/* Introduction */}
              <section id="sce-history" className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">About SCE</h2>
                <p className="text-gray-700 dark:text-gray-300 text-xl ">
                  Since 1992, the <b>Software and Computer Engineering Society (SCE)</b> at San José State University has 
                  <b> empowered students</b> with <b>learning opportunities beyond the classroom</b>. We strive to 
                  develop a community that supports each member's educational journey and <b>career aspirations</b>.
                </p>
              </section>
  
              {/* Alumni */}
              <section id="alumni" className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-sm">
                <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Companies with SCE Alumni</h2>
                <div className="flex items-center"> 
                  <img src="images/sce_google.jpeg" alt="google photo" className="w-1/2 rounded-lg mb-4"/>
                  <p className="text-gray-700 dark:text-gray-300 text-xl p-4">
                    SCE alumni have gone on to <b>pioneer innovations</b> at leading tech giants and startups. 
                    Notable companies include <b>Google</b>, <b>Apple</b>, <b>Facebook</b>, <b>Tesla</b>, and many more across Silicon Valley and beyond.
                  </p>
                </div>
              </section>
  
              {/* Internships */}
              <section id="internships" className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Internship Opportunities</h2>
                <div className="flex items-center"> 
                <img src="images/sce_intern.jpg" alt="Internal Group Image" className="w-1/2 rounded-lg mb-4"/>
                <p className="text-gray-700 dark:text-gray-300 text-xl p-4">
                  Since 2020, SCE has hosted a <b>summer internship program</b>, exposing students to projects 
                  ranging from full stack development to site reliability and developer tooling. These opportunities 
                  equip our youth with real-world experience and industry contacts.
                </p>
                </div>
              </section>
  
              {/* Projects */}
              <section id="projects" className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-sm">
                <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Our Projects</h2>
                <div className="flex items-center"> 
                <img src="images/sce_internal.jpeg" alt="People Internal" className="w-1/2 rounded-lg mb-4"/>
                <p className="text-gray-700 dark:text-gray-300 text-xl p-4">
                  At SCE, we tackle the next <b>frontier of innovation</b>. Our projects span various domains, 
                  including <b>web development</b>, <b>API design</b>, <b>distributed systems</b>, and more! 
                   <a href="https://sce.sjsu.edu/projects" className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"> 
                    <b> Learn more about our projects.</b>
                  </a>
                </p>
                </div>
              </section>
  
              {/* Community */}
              <section id="community" className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Community and Engagement</h2>
                <div className="flex items-center"> 
                  
                  <img src="images/sce_winter2.jpg" alt="People Eating" className="w-1/2 rounded-lg mb-4 p-1"/>
                  <p className="text-gray-700 dark:text-gray-300 text-xl p-4"> 
                    <b>SCE isn't just about learning</b>, it's about growing within a <b>vibrant community</b>. Join us for 
                    <b> regular meetups</b>, <b>social events</b>, <b>gatherings</b>, and our always-open 
                    <a href="https://sce.sjsu.edu/s/discord" className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"> 
                      <b> Discord Server</b>
                    </a> to connect, share, and build together.
                  </p>
                </div>
              </section>
  
              {/* Join Us */}
              <section id="join" className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-sm">
                <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Join Us!</h2>
                <div className="flex items-center"> 
                <img src="images/sce_winter.jpg" alt="Group Photo" className="w-1/2 rounded-lg mb-4"/>
                <p className="text-gray-700 dark:text-gray-300 text-xl p-4">
                  Get hands-on with industry standards in web development, API design, and code reviews. For more information, 
                  <a href="https://sce.sjsu.edu/s/discord" className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300">
                    <b> join our discord!</b>
                  </a>
                </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
      </div>
    );
  };
>>>>>>> 82dc6e9 (Rebuilt About Page, Added Images)
