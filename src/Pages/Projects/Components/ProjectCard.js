import React from 'react';

export default function ProjectCard({project}) {
  return (
    <div className="flex justify-center">
      <div className="card md:card-side shadow-xl w-[85%] md:w-[75%] border dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-center items-center pb-0 md:pb-4 pt-4 md:pl-4">
          <img
            src={project.image}
            alt="Album"
            className="max-w-60 md:max-w-80 h-auto rounded-lg"/>
        </div>
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{project.name}</h2>
          <p className="font-light text-gray-500 dark:text-gray-400">{project.caption}</p>
          <span className="bg-primary-100 text-primary-800 text-xs font-medium dark:bg-primary-200 dark:text-primary-800 flex gap-2">
            {project.information}
          </span>
          <div className="card-actions justify-end">
            <a href={project.link} target="_blank">
              <button                   className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline"
              >
                GitHub Link
                <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd">
                  </path>
                </svg>
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>

  );
}
