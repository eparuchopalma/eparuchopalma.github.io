document.getElementById('theme-button').addEventListener('click', changeTheme);

function changeTheme() {
  const body = document.getElementById('body');
  const themeButton = document.getElementById('theme-button');
  const themeIsLight = body.style.getPropertyValue('--bg-color') === '#fff';

  if (themeIsLight) {
    body.style.setProperty('--bg-color', '#191919');
    body.style.setProperty('--font-color', '#fff');
    themeButton.setAttribute('class', 'theme-button theme-button_dark');
  } else {
    body.style.setProperty('--bg-color', '#fff');
    body.style.setProperty('--font-color', '#191919');
    themeButton.setAttribute('class', 'theme-button');
  }
}

const carousels = document.querySelectorAll('.carousel');

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