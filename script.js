const carousels = document.querySelectorAll('.carousel');
const projectsTitles = document.getElementById('projects-titles');
const projectsSection = document.getElementById('projects');
const projectsImages = document.getElementById('projects-images').children;
const description = document.getElementById('project-description');
const expansionPanels = document.getElementById('expansion-panels');
const linkContainer = document.getElementById('link-container');
const projectsTabs = document.getElementById('projects-tabs');
const themeButton = document.getElementById('theme-button');
const body = document.getElementById('body');

let indexOnFocus = 0;
let z = projectsImages.length;

function changeTheme() {
  const themeIsDark = body.classList.contains('body_dark');

  if (themeIsDark) {
    body.classList.add('body_light');
    body.classList.remove('body_dark');
    themeButton.classList.remove('theme-button_dark');
  } else {
    body.classList.add('body_dark');
    body.classList.remove('body_light');
    themeButton.classList.add('theme-button_dark');
  }
}

carousels.forEach((carousel) => {
  const track = carousel.querySelector('.carousel__track');
  const slides = carousel.querySelectorAll('.carousel__item');
  const dots = carousel.querySelectorAll('.dot');
  const btnPrev = carousel.querySelector('.btn-prev');
  const btnNext = carousel.querySelector('.btn-next');

  if (!track || !slides.length) return;

  function moveCarousel(direction) {
    const slideWidth = track.clientWidth;
    track.scrollLeft += direction * slideWidth;
  }

  btnNext?.addEventListener('click', () => moveCarousel(1));
  btnPrev?.addEventListener('click', () => moveCarousel(-1));

  const observerOptions = {
    root: track,
    threshold: 0.5
  };

  const slidesArr = Array.from(slides);
  slidesArr.forEach((slide, idx) => {
    slide.dataset.carouselIndex = idx;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = Number(entry.target.dataset.carouselIndex);

        dots.forEach((dot) => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
      }
    });
  }, observerOptions);

  slidesArr.forEach((slide) => observer.observe(slide));

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const slideWidth = track.clientWidth;
      track.scrollLeft = index * slideWidth;
    });
  });
});

function styleProjectOnFocus(index, projectColor) {
  projectsTitles
    .children[index].classList.add('project-title_selected');
  projectsSection
    .style.setProperty('--project-color', projectColor);
}

async function selectProject(e) {
  const indexToFocus = e.dataset.projectIndex;
  if (indexToFocus == indexOnFocus) return;

  focusTitle(indexToFocus);
  styleProjectOnFocus(indexToFocus, e.dataset.projectColor);
  setProjectText(indexToFocus);

  const itemOnFocus = projectsImages[indexOnFocus];
  const itemToFocus = projectsImages[indexToFocus];

  itemOnFocus.classList.remove('mockup-container_selected', 'mockup-container_slide');
  itemToFocus.classList.add('mockup-container_selected', 'mockup-container_slide');
  setTimeout(() => itemToFocus.style.setProperty('z-index', z++), 500);
  setTimeout(() => itemOnFocus.style.setProperty('transform', `rotate(${-2}deg)`), 900);

  let rotationDegrees = -4;

  for (let index = 0; index < projectsImages.length; index++) {
    const image = projectsImages[index];
    image.style.setProperty('transform', 'rotate(0)');
    if (index == indexToFocus || index == indexOnFocus) continue;
    setTimeout(() => {
      image.style.setProperty('transform', `rotate(${rotationDegrees}deg)`)
      rotationDegrees -= 2;
    }, 900);
  }

  indexOnFocus = Number(indexToFocus);

}

function focusTitle(index) {
  const titleElement = projectsTitles.children[index];
  const currentlyFocusTitle = projectsTitles.getElementsByClassName('project-title project-title_selected')[0];
  currentlyFocusTitle.classList.remove('project-title_selected');
  projectsTitles.scrollTo({ top: index * 35, behavior: 'smooth' });
  titleElement.classList.add('project-title_selected');
}

const titles = Array.from(projectsTitles.children);

for (const i in titles) titles[i].addEventListener('click', (e) => selectProject(e.target));

themeButton.addEventListener('click', changeTheme);

function setProjectText(index) {
  projectsTabs.classList.add('fade');
  setLinks(index);
  setPanels(index);
  setTimeout(() => projectsTabs.classList.remove('fade'), 200);
}

function setPanels(index) {
  let firstPanelOpened = false;
  for (const panel of expansionPanels.children) {
    if (panel.getAttribute('open')) panel.setAttribute('open', false)
    if (panel.dataset.projectIndex == index) {
      panel.style.setProperty('display', 'block');
      if (!firstPanelOpened) {
        panel.setAttribute('open', true);
        firstPanelOpened = true;
      }
    }
    else panel.style.setProperty('display', 'none');
  }
}

function setLinks(index) {
  for (const child of linkContainer.children) {
    if (child.dataset.projectIndex == index) child.style.setProperty('display', 'block');
    else child.style.setProperty('display', 'none');
  }
}
