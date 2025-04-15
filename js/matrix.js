document.addEventListener('DOMContentLoaded', () => {
    const matrixCanvas = document.getElementById('matrix-canvas');
    const ctx = matrixCanvas.getContext('2d');
    
    // Set the canvas dimensions
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    
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
    
    // This flag determines whether to continue resetting drops.
    let stopRain = false;
    let finalDropColumn = null;
    let finalDropPosition = null;
    let transitionTriggered = false;
    
    // After 6 seconds, stop resetting drops and also start one final drop.
    setTimeout(() => {
        stopRain = true;
        // Start one new drop in a random column as the final drop.
        finalDropColumn = Math.floor(Math.random() * columns);
        finalDropPosition = 0;
        drops[finalDropColumn] = finalDropPosition;
    }, 6000);
    
    // Draw function for the organic rain effect
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        let allDropsOffScreen = true;
        
        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            
            // Make the final drop brighter and more noticeable
            if (stopRain && i === finalDropColumn) {
                ctx.fillStyle = '#0f0'; // Bright green for final drop
                ctx.font = `${fontSize}px monospace`;
            } else {
                ctx.fillStyle = '#0f0';
                ctx.font = `${fontSize}px monospace`;
            }
            
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            drops[i]++; // Each drop falls uniformly
            
            // If not stopping the rain, reset drops that reach the bottom.
            if (!stopRain && drops[i] * fontSize > matrixCanvas.height) {
                drops[i] = 0;
            }
            
            // Check if any drops are still on screen
            if (drops[i] * fontSize <= matrixCanvas.height) {
                allDropsOffScreen = false;
            }
            
            // Special check for the final drop
            if (stopRain && i === finalDropColumn && 
                !transitionTriggered && drops[i] * fontSize > 0) {
                // Create a wipe effect that follows the raindrop
                const wipeEffect = document.createElement('div');
                wipeEffect.className = 'wipe-effect';
                document.querySelector('.matrix-page').appendChild(wipeEffect);
                
                // Update the wipe effect to follow the final drop
                function updateWipe() {
                    wipeEffect.style.height = `${drops[finalDropColumn] * fontSize}px`;
                    
                    if (drops[finalDropColumn] * fontSize >= matrixCanvas.height) {
                        clearInterval(wipeInterval);
                        setTimeout(() => {
                            window.location.href = 'main.html';
                        }, 500);
                    }
                }
                
                const wipeInterval = setInterval(updateWipe, 40);
                transitionTriggered = true;
            }
        }
    }
    
    // Start the rain draw interval
    const matrixInterval = setInterval(draw, 40);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    });
});
