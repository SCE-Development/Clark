## What pages should the webpage Have (MVP)?
- Home
- About
- Projects
- Log in/sign up
- Profile
- Printing
- admin page to list users, paginated
- admin page to edit users
- admin dashboard
- User Manager
- LED Sign
- Speakers
- URL Shortener

### In addition to pages
- User accounts, levels (banned - admin)
- tracking pages counted
- authenticated APIs, no bs

## Later cool stuff
- email list page, opted in user
- all the peripherals


## How do we get started? DONE
admin dashboard has no navbar
- just list out the pages like https://app.asana.com/0/1129253288630131/overview
    - see "Projects" section, highlighted on hover
    - has icon and title for each cool thing

- admin navbar visible on all other pages
- same as user navbar except dropdown different
    - home, <admin links>, <sign out>
    - have the same "signed in as" stuff
### admin dashboard links
- flex like: https://tailwindcss.com/docs/flex-direction#column
- hover https://daisyui.com/components/table/#table-with-a-row-that-highlights-on-hover
- visual but icons https://daisyui.com/components/table/#table-with-visual-elements
- take icons from https://heroicons.com/ and https://icons8.com/icons/set/aws

- Home
- Admin Navbar (Evan 12/29)
- About (Evan 12/29)
- Projects (Evan 12/29)
- Log in/sign up (Akshit 12/31)
- Profile (Pablo 12/31)
- Printing
- admin page to list users, paginated
- admin page to edit users
- admin dashboard (Evan 12/30)
- User Manager (Akshit 12/31)
- LED Sign (Akshit 12/31)
- Speakers (Akshit 12/31)
- URL Shortener


this looks good besides button doesnt work
```js
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={showSideBar}
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>

      <aside id="default-sidebar" className={`fixed top-0 left-0 z-40 w-60 h-screen transition-transform -translate-x-full lg:translate-x-0 `} aria-label="default-sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <a href="https://flowbite.com/" className="flex items-center ps-2.5 mb-5">
            <img id='logo-image' src='favicon.ico' className="h-6 me-3 sm:h-7" alt={'sce-logo'} />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">SCE Admin</span>
          </a>
          <ul className="space-y-2 font-medium">
            {getRoutesForNavbar()}
          </ul>
        </div>
      </aside>
```

- number of pages left
- print confirmation
- inputs all work
- after printing show success or error
- healthcheck

