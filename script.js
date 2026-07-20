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

const track = document.querySelector('.carousel__track');
const slides = document.querySelectorAll('.carousel__item');
const dots = document.querySelectorAll('.dot');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');

function moveCarousel(direction) {
  const slideWidth = track.clientWidth;
  track.scrollLeft += direction * slideWidth;
}

btnNext.addEventListener('click', () => moveCarousel(1));
btnPrev.addEventListener('click', () => moveCarousel(-1));

const observerOptions = {
  root: track,
  threshold: 0.5 
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = Array.from(slides).indexOf(entry.target);
      
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
    }
  });
}, observerOptions);

slides.forEach(slide => observer.observe(slide));

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    const slideWidth = track.clientWidth;
    track.scrollLeft = index * slideWidth;
  });
});