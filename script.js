'use strict';

//Query selectors

const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const modal = document.querySelector('.modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');



const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
///////////////////////////////////////
// Modal window

const openModal = (e) => {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};



 btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


// ************************************* Event Listeners *****************************************************

// Learn more button

btnScrollTo.addEventListener('click', (e) => {

  
  //For older browsers
  
  //const section1Coords = section1.getBoundingClientRect();

  // Scrolling
  // window.scrollTo(section1Coords.left + window.scrollX, section1Coords.top + window.scrollY);

  // Smooth Scrolling
  // window.scrollTo({
  //   left: section1Coords.left + window.scrollX,
  //   top: section1Coords.top + window.scrollY,
  //   behavior: 'smooth',
  // });

  // For new browsers
  section1.scrollIntoView({behavior:"smooth"});
});



// Nav-link buttons

// Using old method

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (el) {
//     el.preventDefault();
//     const id = this.getAttribute('href');

//     document.querySelector(id).scrollIntoView({behavior: "smooth"});
//   });
// });



// Using event delegation

// 1) Add event listener to the common parent
// 2) Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', (e) => {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
   const id = e.target.getAttribute('href');

   // Preventing event when modal button is clicked aka Guard clause
   if(e.target.classList.contains('nav__link--btn')) return;

   document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  };
});


// Tabs



tabContainer.addEventListener('click', (e) => {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if(!clicked) return;

  //Removing active classes
  tabs.forEach((e) => e.classList.remove('operations__tab--active'));
  tabsContent.forEach((content) => content.classList.remove('operations__content--active'));

  //Activate tab
  clicked.classList.add('operations__tab--active');

  //Activate tab content
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');

});


// Nav Fade Animation

const handleHover =  (e) => {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

  const siblings = link.closest('.nav').querySelectorAll('.nav__link');
  const logo = link.closest('.nav').querySelector('img');

  siblings.forEach((el) => {
   if (el !== link) el.style.opacity = this;
  });

   logo.style.opacity = this;

  }};
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));


// Sticky navigation

//Old way / Inefficient way
// window.addEventListener('scroll', function (){
//   console.log(window.scrollY)
//   const section1Coords = section1.getBoundingClientRect();
//  window.scrollY > section1Coords.top + window.scrollY ?  nav.classList.add('sticky') : nav.classList.remove('sticky');
// });

//Interaction observer API

// const obsCallback = function (entries, observer) {

//   entries.forEach((entry) => console.log(entry));
// };

// const obsOptions = {
// root: null,
// threshold: 1,
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);

// observer.observe(section1);

const header = document.querySelector('.header__title');
const navHeight = nav.getBoundingClientRect().height;

// Callback function for Interaction Observer API
 const stickyNav = (entries) => {
  const [entry] = entries;
  entry.isIntersecting? nav.classList.remove('sticky') : nav.classList.add('sticky');
 };

 // Intersection observer API
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);




// Revealing sections on scroll

const allSections = document.querySelectorAll('.section');

const revealSections =  (entries, observer) => {
  const [entry] = entries;

  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver (revealSections, {
  root: null,
  threshold: 0.15, 
})


allSections.forEach((e) => {
 // e.classList.add('section--hidden');
  sectionObserver.observe(e);
});



// Lazy loading images

const allImg = document.querySelectorAll('.features__img');


const revealImages = function (entries, observer) {
  const [entry] = entries;

  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver (revealImages, {
  root: null,
  threshold: 0.4,
  rootMargin: '200px',
});

allImg.forEach((e) => {
  e.classList.add('lazy-img');
  imgObserver.observe(e);
});



// Slider

const slider = () => {
const slides = document.querySelectorAll('.slide');
const sliderBtnRight = document.querySelector('.slider__btn--right');
const sliderBtnLeft = document.querySelector('.slider__btn--left'); 
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length - 1;


//FUNCTIONS

// Creating Dots
const createDots = () => {
  slides.forEach((s, i) => {
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide=${i}></button>`);
  });
};

//Activating dots
const activateDots = (slide) => {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide ="${slide}"]`).classList.add('dots__dot--active');
};


// Goto slide
const goToSlide = (slide) => {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};


//Next slide
const nextSlide = () => {
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDots(curSlide);
};


//Previous slide
const prevSlide = () => {
  if (curSlide === 0) {
    curSlide = maxSlide;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDots(curSlide);
}


//Initialization
const init = () => {
  goToSlide(0);
  createDots();
  activateDots (0);
};

init();



// EVENT HANDLERS

sliderBtnRight.addEventListener('click', nextSlide);
sliderBtnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

//Event delegation for dots
dotContainer.addEventListener('click', (e) => {
  if(e.target.classList.contains('dots__dot')) {
  const slide = e.target.dataset.slide;
  goToSlide(slide);
  activateDots(slide);
  };
})

};
slider();

//Button inside modal
const modaButton = document.querySelector('.modal-btn');
modaButton.addEventListener('click', closeModal);