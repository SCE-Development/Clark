import React from 'react';

export default function AboutPage() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="px-6 py-12 mx-auto max-w-6xl">
      <div className="grid grid-cols-1 gap-12 xl:grid-cols-4">
        {/* Main Content */}
        <div className="space-y-12 xl:col-span-3">
          <div>
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-gray-100">What Happens at SCE</h1>
            <div className="mb-8 w-24 h-1 bg-blue-600 dark:bg-blue-400"></div>
            <p className="text-lg leading-relaxed text-gray-600 md:text-xl dark:text-gray-300">
              The Software and Computer Engineering Society is a student-run club at San Jose State that aims to provide
              students with a sense of community, industry-relevant experience, and mentorship.
            </p>
          </div>

          <section id="introduction" className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl dark:text-gray-100">Introduction</h2>
            <div className="text-gray-700 prose prose-lg dark:text-gray-300">
              <p>
                SCE is more than just a club—we're a community of passionate students building the future of technology.
                Our mission is to bridge the gap between academic learning and industry experience.
              </p>
              <p>What we offer:</p>
              <ul className="space-y-2">
                <li>• Hands-on project experience with real-world applications</li>
                <li>• Mentorship from industry professionals and alumni</li>
                <li>• Networking opportunities with tech companies</li>
                <li>• Collaborative workspace and community</li>
                <li>• Professional development workshops</li>
              </ul>
            </div>
          </section>

          <section id="location" className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl dark:text-gray-100">Location & Hours</h2>
            <div className="text-gray-700 prose prose-lg dark:text-gray-300">
              <p>
                Visit us at the Engineering Building, second floor, room 294. Our space is designed for collaboration,
                learning, and innovation.
              </p>

              <div className="p-6 my-4 bg-gray-50 rounded-lg border-l-4 border-blue-600 dark:bg-gray-800 dark:border-blue-400">
                <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">Open Hours (During Semester)</h3>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Thursday:</span>
                    <span>10:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friday:</span>
                    <span>10:00 AM - 2:00 PM</span>
                  </div>
                </div>
              </div>

              <p>
                During open hours, our room is accessible to all students. SCE members enjoy 24/7 access with a
                personalized door code for after-hours collaboration and study sessions.
              </p>
            </div>
          </section>

          <section id="membership" className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl dark:text-gray-100">Becoming an SCE Member</h2>
            <div className="text-gray-700 prose prose-lg dark:text-gray-300">
              <p>
                Membership is exclusive to San Jose State students and offers incredible value for your academic
                and professional journey.
              </p>

              <div className="p-6 my-4 bg-blue-50 rounded-lg border-l-4 border-blue-600 dark:bg-blue-900/20 dark:border-blue-400">
                <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">Membership Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Single Semester:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">$20</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Two Semesters:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">$30</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Payment must be made in person at the SCE room.</p>
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Member Benefits</h3>
              <ul className="space-y-2">
                <li>• 24/7 room access with personal door code</li>
                <li>• Unlimited free paper printing</li>
                <li>• Free 3D printing for personal and academic projects</li>
                <li>• Exclusive company tours and networking events</li>
                <li>• Complimentary SCE t-shirt</li>
                <li>• Priority access to workshops and events</li>
                <li>• Access to development team opportunities</li>
              </ul>
            </div>
          </section>

          <section id="development" className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl dark:text-gray-100">Development Team</h2>
            <div className="text-gray-700 prose prose-lg dark:text-gray-300">
              <p>
                Our development team is where students gain real-world experience working on production systems
                used by thousands of students and faculty.
              </p>

              <h3 className="my-2 font-semibold text-gray-900 dark:text-gray-100">What You'll Work On</h3>
              <ul className="space-y-2">
                <li>• Full-stack web applications</li>
                <li>• Distributed systems and microservices</li>
                <li>• Site reliability engineering</li>
                <li>• Networking and infrastructure</li>
                <li>• Mobile applications</li>
                <li>• DevOps and cloud platforms</li>
              </ul>

              <p className="mt-2">
                Many development team members secure prestigious internships at top tech companies. Our alumni
                network provides ongoing mentorship and career guidance throughout your journey.
              </p>
            </div>
          </section>

          <section id="internship" className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl dark:text-gray-100">Summer Internship Program</h2>
            <div className="text-gray-700 prose prose-lg dark:text-gray-300">
              <p>
                Each summer, we run an intensive 10-week remote internship program where students tackle
                large-scale, impactful projects.
              </p>

              <div className="p-6 my-4 bg-green-50 rounded-lg border-l-4 border-green-600 dark:bg-green-900/20 dark:border-green-400">
                <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">Program Details</h3>
                <ul className="space-y-2">
                  <li>• <strong>Duration:</strong> 10 weeks starting early June</li>
                  <li>• <strong>Format:</strong> Remote work with weekly check-ins</li>
                  <li>• <strong>Projects:</strong> Design, implement, and maintain production systems</li>
                  <li>• <strong>Networking:</strong> In-person game nights and social events</li>
                  <li>• <strong>Showcase:</strong> Final presentations to alumni and faculty</li>
                </ul>
              </div>

              <p>
                Application details and important dates are announced on our Discord community as June approaches.
                This program is highly competitive and provides unparalleled hands-on experience.
              </p>
            </div>
          </section>

          <section id="discord" className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl dark:text-gray-100">Join Our Community</h2>
            <div className="text-gray-700 prose prose-lg dark:text-gray-300">
              <p>
                Connect with fellow students, ask questions, and stay updated on events through our active Discord community.
              </p>

              <div className="p-6 my-4 text-center bg-indigo-50 rounded-lg border-l-4 border-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-400">
                <p className="mb-4">Ready to join? Click below to access our Discord server:</p>
                <a
                  href="https://sce.sjsu.edu/s/discord"
                  className="inline-block px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  rel="nofollow noreferrer"
                  target="_blank"
                >
                  Join SCE Discord
                </a>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                New to our community? Don't hesitate to introduce yourself and ask questions in our discussion channels!
              </p>
            </div>
          </section>

          <div className="pt-4">
            <img
              src="https://user-images.githubusercontent.com/36345325/78325084-81350300-752b-11ea-8571-032ed04b3018.png"
              alt="SCE community collage showing students collaborating and working on projects"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Table of Contents - Hidden on mobile/tablet, shown on desktop */}
        <div className="hidden xl:block xl:col-span-1">
          <div className="sticky top-8">
            <div className="p-6 bg-gray-50 rounded-lg border dark:bg-gray-800 dark:border-gray-700">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Contents</h3>
              <nav className="space-y-3">
                <button
                  onClick={() => scrollToSection('introduction')}
                  className="block w-full text-sm text-left text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Introduction
                </button>
                <button
                  onClick={() => scrollToSection('location')}
                  className="block w-full text-sm text-left text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Location & Hours
                </button>
                <button
                  onClick={() => scrollToSection('membership')}
                  className="block w-full text-sm text-left text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Membership
                </button>
                <button
                  onClick={() => scrollToSection('development')}
                  className="block w-full text-sm text-left text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Development Team
                </button>
                <button
                  onClick={() => scrollToSection('internship')}
                  className="block w-full text-sm text-left text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Summer Internship
                </button>
                <button
                  onClick={() => scrollToSection('discord')}
                  className="block w-full text-sm text-left text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Join Community
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
