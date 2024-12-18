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
const page_cover = document.getElementById("page-cover");
const sideMenu = document.querySelector('.side-menu');
const header1 = document.querySelector("header");
const body = document.querySelector("body");

burgerMenu.addEventListener("click", () => {
    const isOpen = burgerMenu.classList.contains("open");

    burgerMenu.classList.toggle("open"); // Toggle burger icon
    page_cover.classList.toggle("open"); // Toggle burger icon
    sideMenu.classList.toggle("open"); // Toggle the 'open' class to slide in/out
    body.classList.toggle("open"); // Toggle the 'open' class to slide in/out

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



const accordionItems = document.querySelectorAll('.accordion-item');
const imageTrack = document.querySelector('.image-track');
const images = document.querySelectorAll('.image'); // Select all images
const imageContainer = document.querySelector('.image-container'); // Select the image container

// Function to get the displayed height of an image
function getImageHeight(image) {
  return image.clientHeight || image.offsetHeight; // clientHeight returns the displayed height
}

// Function to update the image container height
function updateImageContainerHeight() {
  const imageHeight = getImageHeight(images[0]); // Get the displayed height of the first image
  imageContainer.style.height = `${imageHeight}px`; // Set the height of the container
}

// Function to update the image dimensions
function updateImageDimensions() {
  // Force a reflow by accessing the layout properties
  images.forEach(image => {
    image.style.display = 'none'; // Temporarily hide the image
    image.offsetHeight; // Trigger a reflow
    image.style.display = ''; // Show the image again
  });
}

// Wait until the images are loaded and then calculate the height
window.addEventListener('load', () => {
  // Initial height update after images are loaded
  updateImageContainerHeight();
  updateImageDimensions(); // Force the image to update its size

  // Add click event to each accordion item
  accordionItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      // Remove active class from all accordion items
      accordionItems.forEach((acc) => acc.classList.remove('active'));

      // Add active class to the clicked accordion item
      item.classList.add('active');

      // Calculate the translateY value based on the dynamic image height
      const translateY = index * -getImageHeight(images[0]);

      // Move the image container (vertical carousel)
      imageTrack.style.transform = `translateY(${translateY}px)`;

      // Update the image container height
      updateImageContainerHeight();
      updateImageDimensions(); // Force image resizing after accordion click
    });
  });
});

// Update the height and image dimensions on window resize
window.addEventListener('resize', () => {
  updateImageContainerHeight();  // Update container height based on image size
  updateImageDimensions();  // Ensure image is correctly sized after resize
});





// testimonial
document.addEventListener('DOMContentLoaded', function () {
  const slider = document.querySelector('.logo-slider');
  const slides = Array.from(document.querySelectorAll('.logo-slide'));
  const totalSlides = slides.length;
  let currentIndex = 0;

  // Get the width of each slide dynamically
  const slideWidth = slides[0].offsetWidth;

  // Clone slides to create an infinite loop
  slides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    slider.appendChild(clone);
  });

  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;
  let autoSlideInterval;

  // Auto-carousel functionality
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      moveToNextSlide();
    }, 3000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Function to move to the next slide
  function moveToNextSlide() {
    currentIndex++;
    updateSliderPosition();
  }

  // Function to move to the previous slide
  function moveToPrevSlide() {
    currentIndex--;
    updateSliderPosition();
  }

  // Function to update the slider position
  function updateSliderPosition() {
    slider.style.transition = 'transform 0.5s ease-in-out';
    slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    if (currentIndex >= totalSlides) {
      setTimeout(() => {
        slider.style.transition = 'none';
        currentIndex = 0;
        slider.style.transform = `translateX(0px)`;
      }, 500);
    } else if (currentIndex < 0) {
      setTimeout(() => {
        slider.style.transition = 'none';
        currentIndex = totalSlides - 1;
        slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      }, 500);
    }
  }

  // Touch events for swipe functionality
  slider.addEventListener('touchstart', (e) => {
    stopAutoSlide();
    startX = e.touches[0].clientX;
    isDragging = true;
    animationID = requestAnimationFrame(animate);
  });

  slider.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    currentTranslate = prevTranslate + deltaX;
    slider.style.transform = `translateX(${currentTranslate}px)`;
  });

  slider.addEventListener('touchend', () => {
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -50) {
      moveToNextSlide();
    } else if (movedBy > 50) {
      moveToPrevSlide();
    } else {
      slider.style.transform = `translateX(${prevTranslate}px)`;
    }

    prevTranslate = -currentIndex * slideWidth;

    startAutoSlide();
  });

  // Handle animation
  function animate() {
    if (isDragging) {
      requestAnimationFrame(animate);
    }
  }

  // Start auto-carousel
  startAutoSlide();
});


