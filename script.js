document.addEventListener('DOMContentLoaded', () => {
    const initialPage = document.querySelector('.initial-page');
    const cursor = document.querySelector('.cursor');
    const matrixCanvas = document.getElementById('matrix-canvas');
    const contentDiv = document.getElementById('content');
    
    let isExpanded = false;
    
    // Set up cursor following
    document.addEventListener('mousemove', (e) => {
        if (!isExpanded) {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        }
    });
    
    // Handle click event
    document.addEventListener('click', (e) => {
        if (!isExpanded) {
            isExpanded = true;
            
            // Position the cursor exactly where the click happened
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            
            // Add the expanded class to trigger the cursor expansion
            cursor.classList.add('expanded');
            
            // After cursor expansion, trigger the curtain drop effect
            setTimeout(() => {
                initialPage.classList.add('curtain-drop');
                
                // Initialize Matrix animation after curtain drop
                setTimeout(initMatrixAnimation, 1000);
            }, 1200);
        }
    });
    
    // Preload main page content in the background
    async function preloadMainContent() {
        try {
            // Load all components as in your main.js
            await loadComponents();
        } catch (error) {
            console.error('Error preloading components:', error);
        }
    }
    
    // Start preloading content immediately
    preloadMainContent();
    
    // Matrix animation code
    function initMatrixAnimation() {
        const ctx = matrixCanvas.getContext('2d');
        
        // Set the canvas dimensions
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        initialPage.style.display = 'none';
        document.querySelector('.matrix-page').style.zIndex = '15';
        
        // Set up the letters
        let letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ';
        letters = letters.split('');
        
        // Set up the font size and columns
        const fontSize = 16;
        const columns = Math.floor(matrixCanvas.width / fontSize);
        
        // Initialize drops with random starting positions (organic effect)
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * (matrixCanvas.height / fontSize));
        }
        
        // This flag determines whether to continue resetting drops
        let stopRain = false;
        let finalDropActive = false;
        let finalDropColumn = null;
        let finalDropPosition = 0;
        let wipePosition = 0;
        
        // After 6 seconds, stop resetting drops and prepare for final drop
        setTimeout(() => {
            stopRain = true;
            
            // After all existing drops have fallen off screen, create the final drop
            setTimeout(() => {
                // Select a column in the middle area of the screen for better visual effect
                const middleSection = Math.floor(columns / 3);
                finalDropColumn = Math.floor(middleSection + Math.random() * middleSection);
                finalDropPosition = 0;
                finalDropActive = true;
                
                // Create a div for the wipe effect that follows the raindrop
                const wipeEffect = document.createElement('div');
                wipeEffect.className = 'wipe-effect';
                document.querySelector('.matrix-page').appendChild(wipeEffect);
                
                // Position the main content behind the matrix page but make it visible
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.style.display = 'block';
                    mainContent.style.position = 'fixed';
                    mainContent.style.top = '0';
                    mainContent.style.left = '0';
                    mainContent.style.width = '100%';
                    mainContent.style.height = '100%';
                    mainContent.style.zIndex = '10';
                }
            }, 2000); // Wait for existing drops to clear
        }, 6000);
        
        // Draw function for the matrix rain effect
        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            
            // Draw all regular raindrops
            for (let i = 0; i < drops.length; i++) {
                // Skip drawing in the final drop column if final drop is active
                if (finalDropActive && i === finalDropColumn) continue;
                
                const text = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillStyle = '#0f0';
                ctx.font = `${fontSize}px monospace`;
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                // Move drops down
                drops[i]++;
                
                // Reset drops that reach the bottom if not in stop mode
                if (!stopRain && drops[i] * fontSize > matrixCanvas.height) {
                    drops[i] = 0;
                }
            }
            
            // Handle the final drop and wipe effect
            if (finalDropActive) {
                // Draw the final drop character
                const finalText = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillStyle = '#fff'; // Make it white for emphasis
                ctx.font = `bold ${fontSize}px monospace`;
                ctx.fillText(finalText, finalDropColumn * fontSize, finalDropPosition * fontSize);
                
                // Move the final drop down
                finalDropPosition++;
                
                // Update the wipe effect to follow the final drop
                const wipeEffect = document.querySelector('.wipe-effect');
                wipeEffect.style.height = `${finalDropPosition * fontSize}px`;
                
                // If the final drop reaches the bottom, complete the transition
                if (finalDropPosition * fontSize >= matrixCanvas.height) {
                    clearInterval(matrixInterval);
                    completeTransition();
                }
            }
        }
        
        function completeTransition() {
            // Create a smooth fade-out effect for the matrix page
            const matrixPage = document.querySelector('.matrix-page');
            matrixPage.style.transition = 'opacity 1s ease-out';
            matrixPage.style.opacity = '0';
            
            // After fade completes, clean up
            setTimeout(() => {
                matrixPage.style.display = 'none';
                
                // Reset main content positioning to normal flow
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.style.position = 'relative';
                    mainContent.style.zIndex = '1';
                }
                
                document.body.style.overflowY = 'auto';
                
                // Trigger any animations for the main content
                document.dispatchEvent(new Event('contentRevealed'));
            }, 1000);
        }
        
        // Start the matrix animation
        const matrixInterval = setInterval(draw, 40);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (isExpanded) {
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;
        }
    });
    
    // Function to load components from main.js
    async function loadComponents() {
        try {
            // Load header
            const headerResponse = await fetch('components/header.html');
            if (!headerResponse.ok) throw new Error('Failed to load header');
            const headerHTML = await headerResponse.text();
            contentDiv.innerHTML += headerHTML;
            
            // Load about section
            const aboutResponse = await fetch('components/about.html');
            if (!aboutResponse.ok) throw new Error('Failed to load about');
            const aboutHTML = await aboutResponse.text();
            contentDiv.innerHTML += aboutHTML;
            
            // Load skills section
            const skillsResponse = await fetch('components/skills.html');
            if (!skillsResponse.ok) throw new Error('Failed to load skills');
            const skillsHTML = await skillsResponse.text();
            contentDiv.innerHTML += skillsHTML;
            
            // Load resume section
            const resumeResponse = await fetch('components/resume.html');
            if (!resumeResponse.ok) throw new Error('Failed to load resume');
            const resumeHTML = await resumeResponse.text();
            contentDiv.innerHTML += resumeHTML;
            
            // Load gallery section
            const galleryResponse = await fetch('components/gallery.html');
            if (!galleryResponse.ok) throw new Error('Failed to load gallery');
            const galleryHTML = await galleryResponse.text();
            contentDiv.innerHTML += galleryHTML;
            
            // Load text analysis section instead of contact
            const textAnalysisResponse = await fetch('components/text-analysis.html');
            if (!textAnalysisResponse.ok) throw new Error('Failed to load text analysis');
            const textAnalysisHTML = await textAnalysisResponse.text();
            contentDiv.innerHTML += textAnalysisHTML;
            
            // Initialize all the components but keep them hidden until the transition completes
            document.addEventListener('contentRevealed', () => {
                // Initialize gallery functionality
                initGallery();
                
                // Initialize background effect
                initBackgroundEffect();
                
                initEventTracking();
                
                // Initialize text analysis
                initTextAnalysis();
                
                // Dispatch event to notify animations.js that content is loaded
                document.dispatchEvent(new Event('contentLoaded'));
            });
            
        } catch (error) {
            console.error('Error loading components:', error);
            contentDiv.innerHTML = `
                <div style="text-align: center; padding: 50px; color: var(--matrix-green);">
                    <h2>Error Loading Content</h2>
                    <p>${error.message}</p>
                    <p>This may be due to CORS restrictions when running locally.</p>
                    <p>Try using a local server or see the alternative solution below.</p>
                </div>
            `;
        }
    }
});
