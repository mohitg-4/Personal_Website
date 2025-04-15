document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    
    // Load all components
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
            
            // Initialize gallery functionality
            initGallery();
            
            // Initialize background effect
            initBackgroundEffect();

            initEventTracking();
            
            // Initialize text analysis
            initTextAnalysis();
            
            // Dispatch event to notify animations.js that content is loaded
            document.dispatchEvent(new Event('contentLoaded'));
            
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
    
    loadComponents();
});

function initBackgroundEffect() {
    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Matrix characters
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charArray = characters.split('');
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to track the y position of each column
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    function draw() {
        // Semi-transparent black to create fade effect
        ctx.fillStyle = 'rgba(12, 12, 12, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(0, 255, 65, 0.3)'; // Matrix green with low opacity
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            
            // Draw the character
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            
            // Move the drop down
            drops[i]++;
            
            // Reset with random chance when off the screen
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
        }
    }
    
    // Draw at a slower rate for subtle background effect
    setInterval(draw, 100);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function initGallery() {
    // Gallery filtering functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!filterBtns.length || !galleryItems.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Animate filtering with GSAP
            if (window.gsap) {
                // Hide all items first
                gsap.to(galleryItems, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.3,
                    stagger: 0.05,
                    onComplete: () => {
                        // Update display property
                        galleryItems.forEach(item => {
                            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                                item.style.display = 'block';
                            } else {
                                item.style.display = 'none';
                            }
                        });
                        
                        // Show filtered items
                        gsap.to(
                            [...galleryItems].filter(item => 
                                filter === 'all' || item.getAttribute('data-category') === filter
                            ), 
                            {
                                opacity: 1,
                                scale: 1,
                                duration: 0.5,
                                stagger: 0.05,
                                delay: 0.1,
                                ease: "back.out(1.7)"
                            }
                        );
                    }
                });
            } else {
                // Fallback without GSAP
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    });
}

// Event tracking function
function initEventTracking() {
    // Track page view on load
    console.log(`${new Date().toISOString()}, view, page_load`);
    
    // Track clicks on all elements
    document.addEventListener('click', function(e) {
        let target = e.target;
        let elementType = 'unknown';
        
        // Determine element type
        if (target.tagName) {
            if (target.tagName === 'A') elementType = 'link';
            else if (target.tagName === 'BUTTON') elementType = 'button';
            else if (target.tagName === 'IMG') elementType = 'image';
            else if (target.tagName === 'INPUT') elementType = target.type || 'input';
            else if (target.tagName === 'SELECT') elementType = 'dropdown';
            else if (target.tagName === 'TEXTAREA') elementType = 'textarea';
            else elementType = target.tagName.toLowerCase();
        }
        
        // Get additional context if available
        let context = '';
        if (target.id) context += ` id:${target.id}`;
        if (target.className) context += ` class:${target.className}`;
        if (target.alt) context += ` alt:${target.alt}`;
        if (target.title) context += ` title:${target.title}`;
        if (target.name) context += ` name:${target.name}`;
        
        // Log the event
        console.log(`${new Date().toISOString()}, click, ${elementType}${context}`);
    });
    
    // Track element views using Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let target = entry.target;
                let elementType = target.dataset.trackType || target.tagName.toLowerCase();
                let context = target.dataset.trackContext || '';
                
                console.log(`${new Date().toISOString()}, view, ${elementType} ${context}`);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe important elements
    document.querySelectorAll('[data-track="true"]').forEach(el => {
        observer.observe(el);
    });
}

// Text analysis function
function initTextAnalysis() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (!analyzeBtn) return;
    
    analyzeBtn.addEventListener('click', function() {
        const textInput = document.getElementById('textInput').value;
        
        // Basic statistics
        const letterCount = (textInput.match(/[a-zA-Z]/g) || []).length;
        const wordCount = textInput.trim().split(/\s+/).length;
        const spaceCount = (textInput.match(/\s/g) || []).length;
        const newlineCount = (textInput.match(/\n/g) || []).length;
        const specialSymbolCount = (textInput.match(/[^\w\s]/g) || []).length;
        
        // Display basic statistics
        document.getElementById('basicStats').innerHTML = `
            <ul>
                <li>Letters: ${letterCount}</li>
                <li>Words: ${wordCount}</li>
                <li>Spaces: ${spaceCount}</li>
                <li>Newlines: ${newlineCount}</li>
                <li>Special Symbols: ${specialSymbolCount}</li>
            </ul>
        `;
        
        // Tokenize the text
        const words = textInput.toLowerCase().match(/\b\w+\b/g) || [];
        
        // Pronouns analysis
        const pronouns = {
            'personal': ['i', 'me', 'my', 'mine', 'myself', 'we', 'us', 'our', 'ours', 'ourselves', 
                        'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 
                        'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 
                        'their', 'theirs', 'themselves'],
            'relative': ['who', 'whom', 'whose', 'which', 'that'],
            'demonstrative': ['this', 'that', 'these', 'those'],
            'interrogative': ['who', 'whom', 'whose', 'which', 'what'],
            'indefinite': ['anybody', 'anyone', 'anything', 'each', 'either', 'everybody', 'everyone', 
                          'everything', 'neither', 'nobody', 'no one', 'nothing', 'one', 'somebody', 
                          'someone', 'something', 'both', 'few', 'many', 'several', 'all', 'any', 'most', 
                          'none', 'some']
        };
        
        let pronounCounts = {};
        let pronounGroupCounts = {
            'personal': 0,
            'relative': 0,
            'demonstrative': 0,
            'interrogative': 0,
            'indefinite': 0
        };
        
        // Count pronouns
        words.forEach(word => {
            for (let type in pronouns) {
                if (pronouns[type].includes(word)) {
                    pronounCounts[word] = (pronounCounts[word] || 0) + 1;
                    pronounGroupCounts[type]++;
                    break;
                }
            }
        });
        
        // Display pronoun counts
        let pronounHtml = '<table class="result-table"><tr><th>Pronoun</th><th>Count</th></tr>';
        for (let pronoun in pronounCounts) {
            pronounHtml += `<tr><td>${pronoun}</td><td>${pronounCounts[pronoun]}</td></tr>`;
        }
        pronounHtml += '</table>';
        
        document.getElementById('pronounStats').innerHTML = pronounHtml;
        
        // Prepositions analysis
        const prepositions = ['about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 
                             'around', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between', 
                             'beyond', 'by', 'concerning', 'considering', 'despite', 'down', 'during', 
                             'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near', 'of', 
                             'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'regarding', 
                             'round', 'since', 'through', 'throughout', 'to', 'toward', 'under', 
                             'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'];
        
        let prepositionCounts = {};
        
        // Count prepositions
        words.forEach(word => {
            if (prepositions.includes(word)) {
                prepositionCounts[word] = (prepositionCounts[word] || 0) + 1;
            }
        });
        
        // Display preposition counts
        let prepositionHtml = '<table class="result-table"><tr><th>Preposition</th><th>Count</th></tr>';
        for (let preposition in prepositionCounts) {
            prepositionHtml += `<tr><td>${preposition}</td><td>${prepositionCounts[preposition]}</td></tr>`;
        }
        prepositionHtml += '</table>';
        
        document.getElementById('prepositionStats').innerHTML = prepositionHtml;
        
        // Indefinite articles analysis
        const articles = ['a', 'an'];
        
        let articleCounts = {};
        
        // Count articles
        words.forEach(word => {
            if (articles.includes(word)) {
                articleCounts[word] = (articleCounts[word] || 0) + 1;
            }
        });
        
        // Display article counts
        let articleHtml = '<table class="result-table"><tr><th>Article</th><th>Count</th></tr>';
        for (let article in articleCounts) {
            articleHtml += `<tr><td>${article}</td><td>${articleCounts[article]}</td></tr>`;
        }
        articleHtml += '</table>';
        
        document.getElementById('articleStats').innerHTML = articleHtml;
    });
}
