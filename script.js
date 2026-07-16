let projects;

const titleContainer = document.getElementById('title-container');
const imageContainer = document.getElementById('project-images-list');
const description = document.getElementById('project-description');
const labelContainer = document.getElementById('label-container');
const linkContainer = document.getElementById('link-container');
let indexOnFocus = 0;

document.getElementById('theme-button').addEventListener('click', changeTheme);

for (const title of titleContainer.children) {
  title.addEventListener('click', () => selectProject(Number(title.dataset.projectIndex)));
}

for (const item of imageContainer.children) {
  item.addEventListener('click', () => selectProject(Number(item.dataset.projectIndex)));
}

async function setProjects() {
  await getProjects();
  styleProjectOnFocus(0);
  setProjectText(0);
  setProjectColors(0);
}

function getProjects() {
  return fetch(projectsPath)
    .then(response => response.json())
    .then(json => projects = json)
}

function setProjectText(index) {
  labelContainer.setAttribute('class', 'label-container label-container_mt label-container_faded')
  description.setAttribute('class', 'project-description project-description_faded');
  setTimeout(() => {
    setLabels(index);
    setLinks(index);
    description.textContent = projects[index].description;
    labelContainer.setAttribute('class', 'label-container label-container_mt');
    description.setAttribute('class', 'project-description');
  }, 200);
}

function setLabels(index) {
  while (labelContainer.firstChild) {
    labelContainer.removeChild(labelContainer.firstChild);
  }
  for (const technology of projects[index].stack) {
    const label = document.createElement('li');
    label.appendChild(document.createTextNode(technology));
    label.setAttribute('class', 'label');
    labelContainer.appendChild(label);
  }
}

function setLinks(index) {
  while (linkContainer.firstChild) {
    linkContainer.removeChild(linkContainer.firstChild);
  }
  for (const [linkKey, linkVal] of Object.entries(projects[index].links)) {
    const anchor = document.createElement('a');
    anchor.appendChild(document.createTextNode(linkKey));
    anchor.setAttribute('class', 'link');
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('href', linkVal);
    linkContainer.appendChild(anchor);
  }
}

function styleProjectOnFocus(index) {
  titleContainer
    .children[index].setAttribute('class', 'project-title project-title_selected');
  imageContainer.children[index]
    .setAttribute('class', 'project-images project-images_selected project-images_slide');
}

async function selectProject(i) {
  if (i == indexOnFocus) return;
  indexOnFocus = Number(i);
  
  focusTitle(indexOnFocus);
  styleProjectOnFocus(indexOnFocus);
  setProjectText(indexOnFocus);
  setProjectColors(indexOnFocus);

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      imageContainer.children[indexOnFocus]
        .setAttribute('style', `z-index: ${imageContainer.children.length};`);
      resolve();
    }, 500)
  });

  for (const item of imageContainer.children) {
    const index = Number(item.dataset.projectIndex);
    if (index === indexOnFocus) continue;

    const stackPosition = (index < indexOnFocus) ? projects.length - (indexOnFocus - index) : projects.length - (index - indexOnFocus);
    const rotationAngle = (index - indexOnFocus) * 5;
    const translationX = (index - indexOnFocus) * 25;
    const timeOut = (index < indexOnFocus) ? 400 : 100;

    item.setAttribute('class', 'project-images');

    new Promise((resolve, reject) => setTimeout(() => {
      item.setAttribute('style', `z-index: ${stackPosition}; transform: rotate(${rotationAngle}deg) translate(${translationX}px);`);
      resolve();
    }, timeOut));
  }
}

function focusTitle(index) {
  const titleElement = titleContainer.children[index];
  const currentlyFocusTitle = titleContainer.getElementsByClassName('project-title project-title_selected')[0]
  currentlyFocusTitle.setAttribute('class', 'project-title');
  currentlyFocusTitle.removeAttribute('style');
  titleContainer.scrollTo({ top: index * 35, behavior: 'smooth' });
  titleElement.setAttribute('class', 'project-title project-title_selected');
}

function setProjectColors(i) {
  const projectMainColor = projects[i].mainColor;
  const projectThemeIsDark = projects[i].isDark;
  const projectSecondaryColor = projects[i].secondaryColor;
  const body = document.querySelector('body');
  body.style.setProperty('--projects-color', projectThemeIsDark ? '#fff' : '#111');
  body.style.setProperty('--projects-bg', projectMainColor);
  body.style.setProperty('--projects-accent', projectSecondaryColor);
}

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

setProjects();