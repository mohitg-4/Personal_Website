document.addEventListener('DOMContentLoaded', () => {
    const initialPage = document.querySelector('.initial-page');
    const cursor = document.querySelector('.cursor');
    
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
            
            // After cursor expansion, redirect to the matrix transition page
            setTimeout(() => {
                window.location.href = 'transition.html';
            }, 1200);
        }
    });
});
