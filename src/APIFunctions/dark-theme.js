import Cookies from 'universal-cookie';
// What is this code doing here you wonder? Well if we unconditionally
// import darkreader, our frontend tests break because aren't in a
// browser environment.
// See https://github.com/SCE-Development/Core-v4/issues/570
let enableDarkMode, disableDarkMode, setFetchMethod = () => { };
if (process.env.NODE_ENV !== 'test') {
  import('darkreader')
    .then(darkreader => {
      enableDarkMode = darkreader.enable;
      disableDarkMode = darkreader.disable;
      setFetchMethod = darkreader.setFetchMethod;
      setFetchMethod(window.fetch);
      enableDarkMode({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
      checkIfDarkThemeActive();
    })
    .catch(_ => { });
}

export function checkIfDarkThemeActive() {
  const cookie = new Cookies();
  if (cookie.get('dark') === 'true') {
    document.body.className = 'dark';
    enableDarkMode && enableDarkMode();
  } else {
    document.body.className = 'light';
    disableDarkMode && disableDarkMode();
  }
}

export function toggleDarkTheme() {
  const cookie = new Cookies();
  if (document.body.className === 'light') {
    document.body.className = 'dark';
    enableDarkMode && enableDarkMode();
    cookie.set('dark', 'true', { path: '/' });
  } else {
    document.body.className = 'light';
    disableDarkMode && disableDarkMode();
    cookie.set('dark', 'false', { path: '/' });
  }
}
