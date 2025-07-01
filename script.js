// Presentation Controller
class PresentationController {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.slide').length;
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.progressBar = document.querySelector('.progress-fill');
        
        this.init();
    }

    init() {
        // Initialize controls
        this.setupControls();
        this.setupKeyboardNavigation();
        this.setupDotNavigation();
        this.setupTouchNavigation();
        this.updateSlideCounter();
        
        // Add animation classes to first slide elements
        this.animateSlideElements(0);
    }

    setupControls() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.addEventListener('click', () => this.previousSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    this.nextSlide();
                    break;
                case 'Home':
                    this.goToSlide(0);
                    break;
                case 'End':
                    this.goToSlide(this.totalSlides - 1);
                    break;
                case 'f':
                case 'F':
                    this.toggleFullscreen();
                    break;
                case 'Escape':
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                    break;
            }
        });
    }

    setupDotNavigation() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
    }

    setupTouchNavigation() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                this.nextSlide();
            }
            if (touchEndX > touchStartX + 50) {
                this.previousSlide();
            }
        };

        this.handleSwipe = handleSwipe;
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideIndex) {
        // Remove active classes
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        // Set direction for animation
        if (slideIndex > this.currentSlide) {
            this.slides[this.currentSlide].classList.add('prev');
        } else {
            this.slides[slideIndex].classList.remove('prev');
        }

        // Update current slide
        this.currentSlide = slideIndex;

        // Add active classes
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');

        // Update progress bar
        this.updateProgressBar();
        this.updateSlideCounter();

        // Animate elements in the new slide
        this.animateSlideElements(this.currentSlide);
    }

    updateProgressBar() {
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    updateSlideCounter() {
        document.getElementById('currentSlide').textContent = this.currentSlide + 1;
        document.getElementById('totalSlides').textContent = this.totalSlides;
    }

    animateSlideElements(slideIndex) {
        const slide = this.slides[slideIndex];
        const elements = slide.querySelectorAll('.card, .timeline-item, .stat-card, .feature-item, .process-step, .challenge-card, .lesson-card, .tech-item');
        
        elements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            element.style.animationFillMode = 'both';
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new PresentationController();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Auto-advance slides (optional - uncomment to enable)
    // setInterval(() => {
    //     if (presentation.currentSlide < presentation.totalSlides - 1) {
    //         presentation.nextSlide();
    //     }
    // }, 10000); // Change slide every 10 seconds
    
    // Initialize image carousels
    initializeCarousels();
    
    // Initialize tabs
    initializeTabs();
});

// Image Carousel functionality
function initializeCarousels() {
    const carousels = document.querySelectorAll('.image-carousel');
    
    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('.carousel-image');
        const indicators = carousel.querySelectorAll('.indicator');
        let currentIndex = 0;
        let interval;
        
        // Auto-rotate images
        function startRotation() {
            interval = setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            }, 3000); // Change image every 3 seconds
        }
        
        // Show specific image
        function showImage(index) {
            images.forEach(img => img.classList.remove('active'));
            indicators.forEach(ind => ind.classList.remove('active'));
            
            images[index].classList.add('active');
            indicators[index].classList.add('active');
        }
        
        // Add click events to indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                clearInterval(interval);
                currentIndex = index;
                showImage(currentIndex);
                startRotation();
            });
        });
        
        // Pause rotation on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(interval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            startRotation();
        });
        
        // Start auto-rotation
        startRotation();
    });
}

// Add mouse movement parallax effect
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.card, .lesson-card, .challenge-card');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardX = rect.left + rect.width / 2;
        const cardY = rect.top + rect.height / 2;
        
        const angleX = (cardX - e.clientX) * 0.01;
        const angleY = (cardY - e.clientY) * 0.01;
        
        card.style.transform = `perspective(1000px) rotateX(${angleY}deg) rotateY(${angleX}deg)`;
    });
});

// Reset card transforms when mouse leaves
document.addEventListener('mouseleave', () => {
    const cards = document.querySelectorAll('.card, .lesson-card, .challenge-card');
    cards.forEach(card => {
        card.style.transform = '';
    });
});

// Tab functionality
function initializeTabs() {
    const tabContainers = document.querySelectorAll('.tab-container');
    
    tabContainers.forEach(container => {
        const buttons = container.querySelectorAll('.tab-button');
        const panes = container.querySelectorAll('.tab-pane');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and panes
                buttons.forEach(btn => btn.classList.remove('active'));
                panes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button and corresponding pane
                button.classList.add('active');
                const targetPane = container.querySelector(`#${targetTab}`);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    });
}