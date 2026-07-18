document.getElementById('theme-button').addEventListener('click', changeTheme);

function changeTheme() {
  const body = document.getElementById('body');
  const themeButton = document.getElementById('theme-button');
  const themeIsLight = body.style.getPropertyValue('--bg-color') === '#fff';

  if (themeIsLight) {
    body.style.setProperty('--bg-color', '#191919');
    body.style.setProperty('--font-color', '#fff');
    themeButton.setAttribute('class', 'theme-button theme-button_dark')
  } else {
    body.style.setProperty('--bg-color', '#fff');
    body.style.setProperty('--font-color', '#191919');
    themeButton.setAttribute('class', 'theme-button');
  }
}
