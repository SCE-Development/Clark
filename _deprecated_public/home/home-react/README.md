# SCE Homepage

This should start alongside the server when running `npm start` on root.

## Dependencies:
- react
- [reactstrap](https://reactstrap.github.io/)

## Project Hierarchy
```
   .
   ├── public
   ├── src                                 # All the source files including pages and image assets
   │   ├── assets                          # Assets folder to hold images, logos, etc.
   │   │   └── img  
   │   ├── Components                      # Page components
   │   │   └── Home                        # Home component
   │   │   │   ├── Footer                  # Website Footer
   │   │   │   ├── Home                    # Main home container
   │   │   │   ├── Navbar                  # Website navbar
   │   │   │   └── Slideshow               # Homepage image slideshow
   │   ├── index.css                       # CSS for the whole homepage
   │   ├── index.js                        # renders this portion of the application
   │   └── serviceWorker.js                # Helps cache the page. Currently unregistered.
   ├── .gitignore                          
   ├── package.json                        # Holds all the required dependencies
   └── README.md
```
