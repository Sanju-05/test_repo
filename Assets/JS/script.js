// Add 'scrolled' class to header on scroll
document.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  const scrolled = window.scrollY > 0;
  header.classList.toggle("scrolled", scrolled);
});

// Burger menu functionality
const burgerMenu = document.getElementById("burgerMenu");
const pageCover = document.getElementById("page-cover");
const sideMenu = document.querySelector('.side-menu');
const header = document.querySelector("header");
const body = document.body;
const menuLinks = document.querySelectorAll('.side-menu a');

burgerMenu.addEventListener("click", () => {
  const isOpen = burgerMenu.classList.contains("open");
  [burgerMenu, pageCover, sideMenu, body].forEach(el => el.classList.toggle("open"));
  header.classList.toggle("scrolled", !isOpen);
});
// Close the menu when a link is clicked
menuLinks.forEach(link => {
  link.addEventListener("click", () => {
    // Remove 'open' class from burger menu, page cover, side menu, and body
    [burgerMenu, pageCover, sideMenu, body].forEach(el => el.classList.remove("open"));
    // header.classList.remove("scrolled"); // Optionally remove 'scrolled' class from the header
  });
});

// Carousel functionality
const slides = document.querySelectorAll('.carousel-slide');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const carouselContainer = document.querySelector('.carousel-container');
let currentIndex = 0, isAnimating = false, autoScrollInterval;

const updateCarousel = () => {
  isAnimating = true;
  carouselContainer.style.transition = 'transform 0.5s ease';
  carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === slides.length - 1;
  setTimeout(() => (isAnimating = false), 500);
};

const moveSlide = direction => {
  if (isAnimating) return;
  currentIndex = Math.max(0, Math.min(currentIndex + direction, slides.length - 1));
  updateCarousel();
};

const startAutoScroll = (interval = 3000) => {
  autoScrollInterval = setInterval(() => {
      if (!isAnimating && currentIndex < slides.length - 1) moveSlide(1);
      else if (!isAnimating) {
          currentIndex = 0;
          updateCarousel();
      }
  }, interval);
};

const stopAutoScroll = () => clearInterval(autoScrollInterval);

prevButton.addEventListener('click', () => { stopAutoScroll(); moveSlide(-1); startAutoScroll(); });
nextButton.addEventListener('click', () => { stopAutoScroll(); moveSlide(1); startAutoScroll(); });
carouselContainer.addEventListener('mouseenter', stopAutoScroll);
carouselContainer.addEventListener('mouseleave', () => startAutoScroll());
window.addEventListener('load', updateCarousel);
startAutoScroll();

// Swipe functionality for touch and mouse events
(() => {
  let startX = 0;

  // For touch events
  carouselContainer.addEventListener('touchstart', e => (startX = e.touches[0].clientX));
  carouselContainer.addEventListener('touchend', e => {
      const diffX = e.changedTouches[0].clientX - startX;
      if (Math.abs(diffX) > 50) moveSlide(diffX > 0 ? -1 : 1);
  });

  // For mouse events
  carouselContainer.addEventListener('mousedown', e => (startX = e.clientX));
  carouselContainer.addEventListener('mouseup', e => {
      const diffX = e.clientX - startX;
      if (Math.abs(diffX) > 50) moveSlide(diffX > 0 ? -1 : 1);
  });
})();

// Accordion functionality
const accordionItems = document.querySelectorAll('.accordion-item');
const imageTrack = document.querySelector('.image-track');
const images = document.querySelectorAll('.image');
const imageContainer = document.querySelector('.image-container');

const getImageHeight = () => images[0]?.clientHeight || 0;
const updateImageContainerHeight = () => imageContainer.style.height = `${getImageHeight()}px`;

window.addEventListener('load', () => {
  updateImageContainerHeight();
  accordionItems.forEach((item, index) => {
      item.addEventListener('click', () => {
          accordionItems.forEach(acc => acc.classList.remove('active'));
          item.classList.add('active');
          imageTrack.style.transform = `translateY(${-index * getImageHeight()}px)`;
          updateImageContainerHeight();
      });
  });
});

window.addEventListener('resize', () => {
  updateImageContainerHeight();
});

// Logo slider functionality
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.logo-slider');
  const slides = Array.from(document.querySelectorAll('.logo-slide'));
  const slideWidth = slides[0]?.offsetWidth || 0;
  let currentIndex = 0, autoSlideInterval, isDragging = false, startX = 0, currentTranslate = 0, prevTranslate = 0;

  slides.forEach(slide => slider.appendChild(slide.cloneNode(true)));

  const moveToNextSlide = () => {
      currentIndex++;
      updateSliderPosition();
  };

  const moveToPrevSlide = () => {
      currentIndex--;
      updateSliderPosition();
  };

  const updateSliderPosition = () => {
      slider.style.transition = 'transform 0.5s ease-in-out';
      slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      if (currentIndex >= slides.length) setTimeout(() => {
          slider.style.transition = 'none';
          currentIndex = 0;
          slider.style.transform = `translateX(0)`;
      }, 500);
      else if (currentIndex < 0) setTimeout(() => {
          slider.style.transition = 'none';
          currentIndex = slides.length - 1;
          slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      }, 500);
  };

  const startAutoSlide = () => {
      autoSlideInterval = setInterval(moveToNextSlide, 1000);
  };

  const stopAutoSlide = () => clearInterval(autoSlideInterval);

  const startDragging = (position, e) => {
      e.preventDefault(); // Prevent text/image selection on touch/mouse events
      stopAutoSlide();
      startX = position;
      isDragging = true;
  };

  const drag = (position, e) => {
      if (!isDragging) return;
      e.preventDefault(); // Prevent text/image selection on touch/mouse events
      const deltaX = position - startX;
      currentTranslate = prevTranslate + deltaX;
      slider.style.transform = `translateX(${currentTranslate}px)`;
  };

  const endDragging = () => {
      isDragging = false;
      const movedBy = currentTranslate - prevTranslate;
      if (movedBy < -50) moveToNextSlide();
      else if (movedBy > 50) moveToPrevSlide();
      prevTranslate = -currentIndex * slideWidth;
      startAutoSlide();
  };

  // Touch Events
  slider.addEventListener('touchstart', (e) => startDragging(e.touches[0].clientX, e));
  slider.addEventListener('touchmove', (e) => drag(e.touches[0].clientX, e));
  slider.addEventListener('touchend', endDragging);

  // Mouse Events
  slider.addEventListener('mousedown', (e) => startDragging(e.clientX, e));
  slider.addEventListener('mousemove', (e) => drag(e.clientX, e));
  slider.addEventListener('mouseup', endDragging);
  slider.addEventListener('mouseleave', () => {
      if (isDragging) endDragging();
  });

  startAutoSlide();
});
