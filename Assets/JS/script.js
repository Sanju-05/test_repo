document.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    
    // Check if the header has the "scrolled" class before adding or removing it
    if (window.scrollY > 0) {
        if (!header.classList.contains("scrolled")) {
            header.classList.add("scrolled"); // Add class when scrolled, if not already added
        }
    } else {
        if (header.classList.contains("scrolled")) {
            header.classList.remove("scrolled"); // Remove class when at the top, if it exists
        }
    }
});


const burgerMenu = document.getElementById("burgerMenu");
const sideMenu = document.querySelector('.side-menu');
const header1 = document.querySelector("header");

burgerMenu.addEventListener("click", () => {
    const isOpen = burgerMenu.classList.contains("open");

    burgerMenu.classList.toggle("open"); // Toggle burger icon
    sideMenu.classList.toggle("open"); // Toggle the 'open' class to slide in/out

    // Check if the header should have the "scrolled" class or revert back to default
    if (!isOpen) {
        // If the menu is opening, add the "scrolled" class
        if (!header1.classList.contains("scrolled")) {
            header1.classList.add("scrolled");
        }
    } else {
        // If the menu is closing, remove the "scrolled" class
        header1.classList.remove("scrolled");
    }
});

let currentIndex = 0;
let isAnimating = false; // Prevent overlapping animations
let autoScrollInterval; // Auto-scroll interval ID

const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const carouselContainer = document.querySelector('.carousel-container');

// Update carousel to show the correct slide
function updateCarousel() {
  isAnimating = true; // Animation in progress
  carouselContainer.style.transition = 'transform 0.5s ease'; // Smooth animation
  carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

  setTimeout(() => {
    isAnimating = false; // Allow new actions after animation completes
  }, 500); // Match the duration of the transition

  // Disable/enable buttons based on position
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === totalSlides - 1;
}

// Move to the next or previous slide
function moveSlide(direction) {
  if (isAnimating) return; // Prevent overlapping actions

  currentIndex += direction;
  if (currentIndex < 0) currentIndex = 0; // Prevent moving before the first slide
  if (currentIndex >= totalSlides) currentIndex = totalSlides - 1; // Prevent moving after the last slide

  updateCarousel();
}

// Add swipe functionality
function handleSwipe() {
  let startX = 0;
  let endX = 0;

  carouselContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  carouselContainer.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;

    const diffX = endX - startX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) moveSlide(-1); // Swipe right
      else moveSlide(1); // Swipe left
    }
  });
}

// Add auto-scroll functionality
function startAutoScroll(interval = 2000) {
  autoScrollInterval = setInterval(() => {
    if (!isAnimating) { // Only auto-scroll if no animation is in progress
      if (currentIndex < totalSlides - 1) {
        moveSlide(1); // Move to the next slide
      } else {
        currentIndex = 0; // Reset to the first slide
        updateCarousel();
      }
    }
  }, interval);
}

// Stop auto-scroll on user interaction
function stopAutoScroll() {
  clearInterval(autoScrollInterval);
}

// Event Listeners
prevButton.addEventListener('click', () => {
  stopAutoScroll();
  moveSlide(-1);
  startAutoScroll();
});

nextButton.addEventListener('click', () => {
  stopAutoScroll();
  moveSlide(1);
  startAutoScroll();
});

carouselContainer.addEventListener('mouseenter', stopAutoScroll);
carouselContainer.addEventListener('mouseleave', () => startAutoScroll());

// Initial setup
updateCarousel();
handleSwipe();
startAutoScroll();
