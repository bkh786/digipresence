document.addEventListener('DOMContentLoaded', () => {
    console.log('Main JS loaded.');
    
    // Magnetic Button Effect
    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate movement (shift button towards cursor)
            const xShift = (x - rect.width / 2) * 0.2;
            const yShift = (y - rect.height / 2) * 0.2;
            
            btn.style.transform = `translate(${xShift}px, ${yShift}px) scale(1.05)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            // Reset to default on leave
            btn.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });

    // Mobile Menu Toggle for About Page
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Header scroll effect
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('bg-opacity-90', 'backdrop-blur-md', 'shadow-md');
                header.classList.remove('bg-transparent');
            } else {
                header.classList.remove('bg-opacity-90', 'backdrop-blur-md', 'shadow-md');
                header.classList.add('bg-transparent');
            }
        });
    }
});
