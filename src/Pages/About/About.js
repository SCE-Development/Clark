import React from 'react';

export default function AboutPage() {
  return (
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
