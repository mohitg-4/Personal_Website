document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, CSSPlugin);
    
    // Hero section animations
    const heroSection = document.getElementById('hero-section');
    const heroContent = document.querySelector('.hero-content');

    // Side glow effect
    const leftGlow = document.querySelector('.left-glow');
    const rightGlow = document.querySelector('.right-glow');
    const glows = [leftGlow, rightGlow];
    
    if (heroContent) {
        // Initial animation for hero content
        gsap.from(heroContent.children, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out"
        });
    }

    if (leftGlow && rightGlow) {
        // Initial position
        gsap.set([leftGlow, rightGlow], {
            '--cursor-y': '50vh'
        });
        
        // Create subtle wave animation
        const waveTimeline = gsap.timeline({
            repeat: -1,
            yoyo: true
        });
        
        waveTimeline.to([leftGlow, rightGlow], {
            scaleY: 2.5,
            opacity: 0.5,
            duration: 3,
            ease: "sine.inOut"
        }).to([leftGlow, rightGlow], {
            scaleY: 2,
            opacity: 0.4,
            duration: 3,
            ease: "sine.inOut"
        });
        
        // Track mouse movement for side glows
        document.addEventListener('mousemove', e => {
            // Calculate Y position relative to viewport height
            const yPos = e.clientY;
            
            // Animate the side glows with slight delay for smooth effect
            gsap.to([leftGlow, rightGlow], {
                '--cursor-y': `${yPos}px`,
                duration: 1.2,
                ease: "power2.out"
            });
        });
        document.addEventListener('click', (e) => {
            console.log("Document clicked"); // Debug message
            
            // Pause the wave animation temporarily
            waveTimeline.pause();
            
            // Animate both glows to larger and brighter
            gsap.to([leftGlow, rightGlow], {
                scaleY: 3.5,
                scaleX: 1.5,
                opacity: 0.9,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    // Animate back to normal
                    gsap.to([leftGlow, rightGlow], {
                        scaleY: 2,
                        scaleX: 1,
                        opacity: 0.4,
                        duration: 0.8,
                        ease: "elastic.out(1, 0.3)",
                        onComplete: () => {
                            // Resume the wave animation
                            waveTimeline.resume();
                        }
                    });
                }
            });
        });
    }
    
    
    // Cursor-following gradient effect
    if (heroSection) {
        const cursorGradient = document.querySelector('.cursor-gradient-tracking');
        
        // Set default position
        gsap.set(cursorGradient, {
            '--cursor-x': '50%',
            '--cursor-y': '50%'
        });
        
        // Create smooth animation for cursor tracking
        let xTo = gsap.quickTo(cursorGradient, "--cursor-x", {duration: 0.2, ease: "power3.out", unit: "%"});
        let yTo = gsap.quickTo(cursorGradient, "--cursor-y", {duration: 0.2, ease: "power3.out", unit: "%"});
        
        // Track mouse movement
        heroSection.addEventListener('mousemove', e => {
            const rect = heroSection.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            xTo(x);
            yTo(y);
        });
        
        // Reset position when mouse leaves
        heroSection.addEventListener('mouseleave', () => {
            xTo(50);
            yTo(50);
        });
    }
    
    // Animation for sections as they come into view
    function setupSectionAnimations() {
        // Animate section titles
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });
        
        // Animate about section
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const aboutImage = aboutSection.querySelector('.about-image');
            const aboutText = aboutSection.querySelector('.about-text');
            
            gsap.from(aboutImage, {
                scrollTrigger: {
                    trigger: aboutSection,
                    start: "top 70%",
                    toggleActions: "play none none none"
                },
                x: -100,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
            
            gsap.from(aboutText.children, {
                scrollTrigger: {
                    trigger: aboutSection,
                    start: "top 70%",
                    toggleActions: "play none none none"
                },
                x: 100,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: "power2.out"
            });
        }
        
        // Animate skill items
        gsap.utils.toArray('.skill-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: 0.6,
                delay: i * 0.05,
                ease: "power2.out"
            });
            
            // Animate skill level bars
            const skillLevel = item.querySelector('.skill-level');
            if (skillLevel) {
                const width = skillLevel.style.width;
                gsap.fromTo(skillLevel, 
                    { width: 0 },
                    {
                        scrollTrigger: {
                            trigger: item,
                            start: "top 85%",
                            toggleActions: "play none none none"
                        },
                        width: width,
                        duration: 1.2,
                        delay: 0.3 + i * 0.05,
                        ease: "power2.out"
                    }
                );
            }
        });
        
        // Animate timeline items
        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.1,
                ease: "power2.out"
            });
        });
        
        // Animate gallery items
        gsap.utils.toArray('.gallery-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%",
                    toggleActions: "play none none none"
                },
                scale: 0.8,
                opacity: 0,
                duration: 0.7,
                delay: i * 0.05,
                ease: "back.out(1.7)"
            });
        });
        
        // Animate contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const contactInfo = contactSection.querySelector('.contact-info');
            const contactForm = contactSection.querySelector('.contact-form');
            
            gsap.from(contactInfo.children, {
                scrollTrigger: {
                    trigger: contactSection,
                    start: "top 70%",
                    toggleActions: "play none none none"
                },
                x: -50,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power2.out"
            });
            
            gsap.from(contactForm, {
                scrollTrigger: {
                    trigger: contactSection,
                    start: "top 70%",
                    toggleActions: "play none none none"
                },
                x: 50,
                opacity: 0,
                duration: 0.8,
                delay: 0.3,
                ease: "power2.out"
            });
        }
    }
    
    // Call this function after content is loaded
    window.addEventListener('load', setupSectionAnimations);
    
    // Refresh ScrollTrigger when content is dynamically loaded
    document.addEventListener('contentLoaded', () => {
        ScrollTrigger.refresh();
        setupSectionAnimations();
    });
});
