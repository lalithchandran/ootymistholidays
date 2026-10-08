/* ==========================================================================
   OOTY MIST HOLIDAYS - INTERACTIVE JAVASCRIPT
   ========================================================================== */

/* THEME TOGGLE SYSTEM (LIGHT / DARK) */
function initTheme() {
  const savedTheme = localStorage.getItem('oomh_theme') || localStorage.getItem('jc_theme') || localStorage.getItem('jv_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('oomh_theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const themeIcons = document.querySelectorAll('#themeIcon');
  themeIcons.forEach(icon => {
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
      icon.style.color = '#f59e0b';
    } else {
      icon.className = 'fa-solid fa-moon';
      icon.style.color = '';
    }
  });
}

/* ULTRA-SMOOTH HORIZONTAL ROUTES LIST AUTO-SCROLL & TOUCH DRAG */
function initRoutesAutoScroll() {
  const grid = document.querySelector('.routes-grid');
  if (!grid) return;

  let isInteracting = false;
  let cooldownTimer = null;
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  function pauseAutoScroll() {
    isInteracting = true;
    if (cooldownTimer) clearTimeout(cooldownTimer);
    // Pause auto-scroll during touch/drag/scroll gesture and wait 4.5s after gesture ends
    cooldownTimer = setTimeout(() => {
      isInteracting = false;
    }, 4500);
  }

  // Mouse Hover
  grid.addEventListener('mouseenter', () => isInteracting = true);
  grid.addEventListener('mouseleave', () => {
    if (!isDown) isInteracting = false;
  });

  // Touch Events for Mobile
  grid.addEventListener('touchstart', pauseAutoScroll, { passive: true });
  grid.addEventListener('touchmove', pauseAutoScroll, { passive: true });
  grid.addEventListener('touchend', pauseAutoScroll, { passive: true });

  // Native Touch Scroll / Swipe Inertia
  grid.addEventListener('scroll', pauseAutoScroll, { passive: true });

  // Mouse Drag Support for Desktop
  grid.addEventListener('mousedown', (e) => {
    isDown = true;
    pauseAutoScroll();
    startX = e.pageX - grid.offsetLeft;
    scrollLeft = grid.scrollLeft;
  });

  grid.addEventListener('mouseleave', () => {
    isDown = false;
  });

  grid.addEventListener('mouseup', () => {
    isDown = false;
    pauseAutoScroll();
  });

  grid.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    pauseAutoScroll();
    const x = e.pageX - grid.offsetLeft;
    const walk = (x - startX) * 1.5;
    grid.scrollLeft = scrollLeft - walk;
  });

  // 60fps RequestAnimationFrame Loop
  let accumulatedScroll = 0;
  function smoothStep() {
    if (!isInteracting && grid.scrollWidth > grid.clientWidth) {
      accumulatedScroll += 0.5;
      if (accumulatedScroll >= 1) {
        const px = Math.floor(accumulatedScroll);
        accumulatedScroll -= px;
        if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 2) {
          grid.scrollLeft = 0;
        } else {
          grid.scrollLeft += px;
        }
      }
    }
    requestAnimationFrame(smoothStep);
  }

  requestAnimationFrame(smoothStep);
}

/* HORIZONTAL FILTER BAR TOUCH & MOUSE DRAG SCRAPING */
function initFilterBarDrag() {
  const filterBar = document.querySelector('.tour-filter-bar');
  if (!filterBar) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  filterBar.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - filterBar.offsetLeft;
    scrollLeft = filterBar.scrollLeft;
  });
  filterBar.addEventListener('mouseleave', () => isDown = false);
  filterBar.addEventListener('mouseup', () => isDown = false);
  filterBar.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - filterBar.offsetLeft;
    const walk = (x - startX) * 1.5;
    filterBar.scrollLeft = scrollLeft - walk;
  });
}

/* SMOOTH ANCHOR LINK SCROLLING FOR MOBILE NAVIGATION */
function initSmoothAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

initTheme();

document.addEventListener('DOMContentLoaded', () => {
  // Set default minimum date for date pickers to today
  const today = new Date().toISOString().split('T')[0];
  const modalDate = document.getElementById('mDate');
  if (modalDate) {
    modalDate.setAttribute('min', today);
    modalDate.value = today;
  }

  // Initialize Fare Calculator default state
  calculateFare();

  // Initialize Custom Luxury Dropdowns
  initCustomDropdowns();

  // Initialize Routes Auto-Scroll & Drag
  initRoutesAutoScroll();

  // Initialize Filter Bar Drag
  initFilterBarDrag();

  // Initialize Smooth Anchor Scroll
  initSmoothAnchorScroll();
});

/* 1. STICKY NAVBAR & MOBILE MENU TOGGLE */
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        if (mainNav.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }
});

/* 2. FILTERABLE TOUR PACKAGES */
function filterPackages(category, btnElement) {
  // Update active filter button state
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => btn.classList.remove('active'));
  if (btnElement) {
    btnElement.classList.add('active');
  }

  // Filter package cards with smooth transition
  const packageCards = document.querySelectorAll('.package-card, .tour-card-expanded');
  packageCards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    if (category === 'all' || cardCategory === category) {
      card.style.display = 'flex';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(15px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
}

/* 3. INSTANT FARE & COST CALCULATOR */
function calculateFare() {
  const routeSelect = document.getElementById('calcRoute');
  const cabSelect = document.getElementById('calcCabType');
  const daysInput = document.getElementById('calcDays');
  const priceDisplay = document.getElementById('calcTotalPrice');
  const summaryText = document.getElementById('calcSummaryText');

  if (!routeSelect || !cabSelect || !daysInput || !priceDisplay) return;

  const basePrice = parseFloat(routeSelect.value) || 2200;
  const cabMultiplier = parseFloat(cabSelect.value) || 1.0;
  const days = parseInt(daysInput.value) || 1;

  const selectedRouteName = routeSelect.options[routeSelect.selectedIndex].getAttribute('data-name') || 'Selected Tour';
  const selectedCabName = cabSelect.options[cabSelect.selectedIndex].getAttribute('data-cab') || 'Sedan Cab';

  // Calculate total fare
  const total = Math.round(basePrice * cabMultiplier * days);

  // Format price in Indian Rupees
  priceDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
  summaryText.textContent = `Includes ${selectedCabName}, Driver Allowance & Fuel for ${days} Day(s) (${selectedRouteName})`;
}

function changeDays(delta) {
  const daysInput = document.getElementById('calcDays');
  let currentVal = parseInt(daysInput.value) || 1;
  currentVal += delta;
  if (currentVal < 1) currentVal = 1;
  if (currentVal > 10) currentVal = 10;
  daysInput.value = currentVal;
  calculateFare();
}

function sendCalcBookingWhatsApp() {
  const routeSelect = document.getElementById('calcRoute');
  const cabSelect = document.getElementById('calcCabType');
  const daysInput = document.getElementById('calcDays');
  const priceDisplay = document.getElementById('calcTotalPrice').textContent;

  const selectedRouteName = routeSelect.options[routeSelect.selectedIndex].getAttribute('data-name');
  const selectedCabName = cabSelect.options[cabSelect.selectedIndex].getAttribute('data-cab');
  const days = daysInput.value;

  const text = `*INSTANT FARE ESTIMATE INQUIRY — OOTY MIST HOLIDAYS*\n` +
    `--------------------------------------------------\n\n` +
    `• *Route / Destination:* ${selectedRouteName}\n` +
    `• *Vehicle Type:* ${selectedCabName}\n` +
    `• *Duration:* ${days} Day(s)\n` +
    `• *Estimated Fare:* ${priceDisplay}\n\n` +
    `--------------------------------------------------\n` +
    `Hello Ooty Mist Holidays Team, I calculated this fare estimate on your website. Please confirm vehicle availability and final booking details. Thank you!`;

  window.open(`https://wa.me/919047512030?text=${encodeURIComponent(text)}`, '_blank');
}

/* 4. HERO QUICK SEARCH SUBMIT */
function handleQuickSearch(event) {
  event.preventDefault();
  
  const pickup = document.getElementById('pickupLocation').value;
  const service = document.getElementById('serviceType').value;
  const cab = document.getElementById('cabChoice').value;

  // Prefill modal and open it
  openBookingModal(`${service} (${cab})`);
  
  const mPickup = document.getElementById('mPickup');
  if (mPickup) {
    mPickup.value = pickup;
  }
}

/* 5. BOOKING MODAL CONTROL */
function openBookingModal(packageName) {
  const modal = document.getElementById('bookingModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalPkgInput = document.getElementById('modalPackageName');

  if (modalTitle) {
    modalTitle.textContent = `Book ${packageName || 'Your Ooty Cab'}`;
  }
  if (modalPkgInput) {
    modalPkgInput.value = packageName || 'General Booking';
  }

  if (modal) {
    modal.classList.add('active');
  }
  initCustomDropdowns();
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function handleModalSubmit(event) {
  event.preventDefault();

  const packageName = document.getElementById('modalPackageName').value || 'General Cab Inquiry';
  const name = document.getElementById('mName').value;
  const phone = document.getElementById('mPhone').value;
  const date = document.getElementById('mDate').value;
  const cab = document.getElementById('mCab').value;
  const pickup = document.getElementById('mPickup').value;
  const notes = document.getElementById('mNotes').value;

  const text = `*NEW BOOKING REQUEST — OOTY MIST HOLIDAYS*\n` +
    `--------------------------------------------------\n\n` +
    `• *Customer Name:* ${name}\n` +
    `• *Phone Number:* ${phone}\n` +
    `• *Travel Date:* ${date}\n\n` +
    `• *Service / Package:* ${packageName}\n` +
    `• *Vehicle Chosen:* ${cab}\n` +
    `• *Pickup Address:* ${pickup}\n` +
    (notes ? `• *Special Notes:* ${notes}\n` : '') +
    `\n--------------------------------------------------\n` +
    `Hello Ooty Mist Holidays Team, please review my booking request above and confirm availability along with the final quote. Thank you!`;

  window.open(`https://wa.me/919047512030?text=${encodeURIComponent(text)}`, '_blank');
  closeBookingModal();
}

/* 6. FAQ ACCORDION TOGGLE */
function toggleFaq(buttonElement) {
  const faqItem = buttonElement.parentElement;
  const isActive = faqItem.classList.contains('active');

  // Close all other active FAQ items
  const allFaqItems = document.querySelectorAll('.faq-item');
  allFaqItems.forEach(item => item.classList.remove('active'));

  // Toggle clicked item
  if (!isActive) {
    faqItem.classList.add('active');
  }
}

/* 7. IMAGE SLIDER FOR TOUR CARDS */
function prevSlide(btn) {
  const slider = btn.closest('.tour-card-slider');
  const slides = slider.querySelectorAll('.slide');
  const dots = slider.querySelectorAll('.dot');
  let activeIndex = Array.from(slides).findIndex(s => s.classList.contains('active'));
  if (activeIndex === -1) activeIndex = 0;
  slides[activeIndex].classList.remove('active');
  if (dots[activeIndex]) dots[activeIndex].classList.remove('active');

  let newIndex = (activeIndex - 1 + slides.length) % slides.length;
  slides[newIndex].classList.add('active');
  if (dots[newIndex]) dots[newIndex].classList.add('active');
}

function nextSlide(btn) {
  const slider = btn.closest('.tour-card-slider');
  const slides = slider.querySelectorAll('.slide');
  const dots = slider.querySelectorAll('.dot');
  let activeIndex = Array.from(slides).findIndex(s => s.classList.contains('active'));
  if (activeIndex === -1) activeIndex = 0;
  slides[activeIndex].classList.remove('active');
  if (dots[activeIndex]) dots[activeIndex].classList.remove('active');

  let newIndex = (activeIndex + 1) % slides.length;
  slides[newIndex].classList.add('active');
  if (dots[newIndex]) dots[newIndex].classList.add('active');
}

function setSlide(dot, index) {
  const slider = dot.closest('.tour-card-slider');
  const slides = slider.querySelectorAll('.slide');
  const dots = slider.querySelectorAll('.dot');
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  if (slides[index]) slides[index].classList.add('active');
  if (dots[index]) dots[index].classList.add('active');
}

/* 8. CUSTOM LUXURY DROPDOWN ENHANCER */
function initCustomDropdowns() {
  const selects = document.querySelectorAll('select');
  
  selects.forEach(select => {
    if (select.dataset.customInitialized) return;
    select.dataset.customInitialized = 'true';
    
    // Hide native select visually but keep accessible
    select.style.display = 'none';

    // Create custom wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';
    
    // Create trigger button
    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger';
    
    const label = document.createElement('span');
    label.className = 'custom-select-label';
    
    const chevron = document.createElement('i');
    chevron.className = 'fa-solid fa-chevron-down custom-chevron';
    
    trigger.appendChild(label);
    trigger.appendChild(chevron);
    wrapper.appendChild(trigger);
    
    // Create options menu
    const menu = document.createElement('div');
    menu.className = 'custom-select-menu';
    
    // Icon map based on option text keywords
    function getOptionIcon(text) {
      const lower = text.toLowerCase();
      if (lower.includes('sedan') || lower.includes('dzire') || lower.includes('etios')) return 'fa-car-side';
      if (lower.includes('suv') || lower.includes('innova') || lower.includes('ertiga')) return 'fa-truck-monster';
      if (lower.includes('tempo') || lower.includes('traveller') || lower.includes('bus')) return 'fa-van-shuttle';
      if (lower.includes('tour') || lower.includes('sightseeing')) return 'fa-map-location-dot';
      if (lower.includes('airport') || lower.includes('station') || lower.includes('pickup')) return 'fa-plane-arrival';
      return 'fa-car';
    }

    function updateTriggerText() {
      const selectedOption = select.options[select.selectedIndex];
      if (selectedOption) {
        const text = selectedOption.textContent;
        const iconClass = getOptionIcon(text);
        label.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${text}</span>`;
      }
    }

    // Populate options
    Array.from(select.options).forEach((opt, index) => {
      const optionEl = document.createElement('div');
      optionEl.className = 'custom-select-option';
      if (opt.selected) optionEl.classList.add('selected');
      
      const text = opt.textContent;
      const iconClass = getOptionIcon(text);
      
      optionEl.innerHTML = `
        <div class="custom-select-option-content">
          <i class="fa-solid ${iconClass}"></i>
          <span>${text}</span>
        </div>
        <i class="fa-solid fa-check check-icon"></i>
      `;
      
      optionEl.addEventListener('click', (e) => {
        e.stopPropagation();
        select.selectedIndex = index;
        
        // Trigger native change event for any attached listeners (like fare calc)
        const changeEvent = new Event('change', { bubbles: true });
        select.dispatchEvent(changeEvent);
        
        updateTriggerText();
        
        // Update selected state in menu
        menu.querySelectorAll('.custom-select-option').forEach(el => el.classList.remove('selected'));
        optionEl.classList.add('selected');
        
        wrapper.classList.remove('open');
      });
      
      menu.appendChild(optionEl);
    });

    wrapper.appendChild(menu);
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select); // keep native select inside wrapper

    updateTriggerText();

    // Toggle dropdown open/close
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close all other open dropdowns
      document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
        if (w !== wrapper) w.classList.remove('open');
      });
      wrapper.classList.toggle('open');
    });
  });
}

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.custom-select-wrapper.open').forEach(w => w.classList.remove('open'));
});

/* 6. REVIEW MODAL & DYNAMIC REVIEWS */
function openReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function setRating(rating) {
  const starsInput = document.getElementById('rStars');
  const ratingText = document.getElementById('ratingValueText');
  const starBtns = document.querySelectorAll('.star-rating-select .star-btn');
  
  const ratingLabels = {
    1: '1.0 Stars (Poor)',
    2: '2.0 Stars (Fair)',
    3: '3.0 Stars (Good)',
    4: '4.0 Stars (Very Good)',
    5: '5.0 Stars (Excellent)'
  };
  
  if (starsInput) starsInput.value = rating;
  if (ratingText) ratingText.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${ratingLabels[rating] || rating + '.0 Stars'}`;
  
  starBtns.forEach((btn, index) => {
    if (index < rating) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function handleReviewSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('rName')?.value.trim() || 'Anonymous Traveler';
  const location = document.getElementById('rLocation')?.value.trim() || 'Verified Guest';
  const stars = parseInt(document.getElementById('rStars')?.value || '5', 10);
  const message = document.getElementById('rMessage')?.value.trim() || '';

  if (!message) return;

  const reviewsGrid = document.querySelector('.reviews-grid');
  if (reviewsGrid) {
    const starIcons = '<i class="fa-solid fa-star"></i>'.repeat(stars) + '<i class="fa-regular fa-star"></i>'.repeat(5 - stars);
    const initial = name.charAt(0).toUpperCase();

    const newCard = document.createElement('div');
    newCard.className = 'review-card';
    newCard.style.border = '2px solid var(--accent-color)';
    newCard.innerHTML = `
      <div class="review-stars">${starIcons}</div>
      <p class="review-text">"${message}"</p>
      <div class="review-author">
        <div class="author-avatar">${initial}</div>
        <div>
          <h4>${name}</h4>
          <span class="verified"><i class="fa-solid fa-circle-check"></i> ${location} (Just Now)</span>
        </div>
      </div>
    `;

    reviewsGrid.insertBefore(newCard, reviewsGrid.firstChild);
  }

  alert('Thank you for your review! Your feedback has been added.');
  document.getElementById('reviewForm')?.reset();
  setRating(5);
  closeReviewModal();
}

