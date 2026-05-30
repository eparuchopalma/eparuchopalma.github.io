let projects;

const titleContainer = document.getElementById('title-container');
const imageContainer = document.getElementById('project-images-list');
const description = document.getElementById('project-description');
const labelContainer = document.getElementById('label-container');
const links = document.getElementById('link-container');
let indexOnFocus = 0;

async function setProjects() {
  await getProjects();

  for (let index in projects) {
    setProjectTitle(index);
    setProjectImages(index);
  }

  styleProjectOnFocus(0);
  setProjectText(0);
}

function getProjects() {
  return fetch('./projects.json')
    .then(response => response.json())
    .then(json => projects = json)
}

function setProjectText(index) {
  labelContainer.setAttribute('class', 'label-container label-container_mt label-container_faded')
  description.setAttribute('class', 'project-description project-description_faded');
  setTimeout(() => {
    setLabels(index);
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
  titleContainer.getElementsByClassName('project-title project-title_selected')[0].setAttribute('class', 'project-title');
  titleContainer.scrollTo({ top: index * 35, behavior: 'smooth' });
  titleElement.setAttribute('class', 'project-title project-title_selected');
}

setProjects();