let projects;

const projectsSection = document.getElementById('projects');
const titleContainer = document.getElementById('title-container');
const imageContainer = document.getElementById('project-images-list');
const description = document.getElementById('project-description');
const labelContainer = document.getElementById('label-container');
const linkContainer = document.getElementById('link-container');
let indexOnFocus = 0;

async function setProjects() {
  await getProjects();

  for (let index in projects) {
    setProjectTitle(index);
    setProjectImages(index);
  }

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

function setProjectTitle(index) {
  const titleElement = document.createElement('li');
  const titleText = document.createTextNode(projects[index].title);
  titleElement.appendChild(titleText);
  titleElement.setAttribute('class', 'project-title');
  titleElement.addEventListener('click', () => selectProject(index));
  titleContainer.appendChild(titleElement);
}

function setProjectImages(index) {
  const projectImages = document.createElement('li');
  projectImages.setAttribute('class', 'project-images');
  projectImages.addEventListener('click', () => selectProject(index));

  const mobileImg = document.createElement('img');
  mobileImg.setAttribute('class', 'project-mobile-img');
  mobileImg.setAttribute('src', projects[index].mobileCover);

  const desktopImg = document.createElement('img');
  desktopImg.setAttribute('class', 'project-desktop-img');
  desktopImg.setAttribute('src', projects[index].desktopCover);

  projectImages.appendChild(desktopImg);
  projectImages.appendChild(mobileImg);
  imageContainer.appendChild(projectImages);

  projectImages.setAttribute('style', `transform: rotate(${index * 5}deg) translateX(${index * 25}px); z-index: ${projects.length - index};`);
}

function styleProjectOnFocus(index) {
  titleContainer
    .children[index].setAttribute('class', 'project-title project-title_selected');
  imageContainer.children[index]
    .setAttribute('class', 'project-images project-images_selected project-images_slide');
}

async function selectProject(i) {
  if (i == indexOnFocus) return;
  indexOnFocus = i;
  const selectedIndex = Number(i);

  focusTitle(selectedIndex);
  styleProjectOnFocus(selectedIndex);
  setProjectText(selectedIndex);
  setProjectColors(selectedIndex);

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      imageContainer.children[selectedIndex]
        .setAttribute('style', `z-index: ${imageContainer.children.length};`);
      resolve();
    }, 500)
  });

  for (let index = 0; index < imageContainer.children.length; index++) {
    if (index === selectedIndex) continue;

    const element = imageContainer.children[index];
    const stackPosition = (index < selectedIndex) ? projects.length - (selectedIndex - index) : projects.length - (index - selectedIndex);
    const rotationAngle = (index - selectedIndex) * 5;
    const translationX = (index - selectedIndex) * 25;
    const timeOut = (index < selectedIndex) ? 400 : 100;

    element.setAttribute('class', 'project-images');

    new Promise((resolve, reject) => setTimeout(() => {
      element.setAttribute('style', `z-index: ${stackPosition}; transform: rotate(${rotationAngle}deg) translate(${translationX}px);`);
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
  const projectTitle = titleContainer.children[i];
  const projectSecondaryColor = projects[i].secondaryColor;
  let style = `background-color: ${projectMainColor};`;
  if (projectThemeIsDark) style += 'color: white;';
  projectsSection.setAttribute('style', style);
  projectTitle.setAttribute('style', `background-color: ${projectSecondaryColor}`);
}

setProjects();