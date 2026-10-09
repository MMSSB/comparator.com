// --- Theme Management ---
const themeBtns = {
    light: document.getElementById('theme-light'),
    dark: document.getElementById('theme-dark'),
    system: document.getElementById('theme-system')
};

function applyTheme(theme) {
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function updateActiveThemeBtn(theme) {
    Object.values(themeBtns).forEach(btn => {
        if(btn) btn.classList.remove('active');
    });
    if (themeBtns[theme]) {
        themeBtns[theme].classList.add('active');
    }
}

function setTheme(theme) {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    updateActiveThemeBtn(theme);
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    updateActiveThemeBtn(savedTheme);

    // Listeners for buttons
    if(themeBtns.light) themeBtns.light.addEventListener('click', () => setTheme('light'));
    if(themeBtns.dark) themeBtns.dark.addEventListener('click', () => setTheme('dark'));
    if(themeBtns.system) themeBtns.system.addEventListener('click', () => setTheme('system'));
});

// Watch System Theme Changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if ((localStorage.getItem('theme') || 'system') === 'system') applyTheme('system');
});

// --- Mobile Navigation Logic with Animation ---
document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-center-group');

    if(mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            navMenu.classList.toggle('menu-open');
            mobileBtn.classList.toggle('is-active'); // Triggers hamburger CSS animation
        });

        document.addEventListener('click', (e) => {
            // Close menu if clicking outside of the nav bounds
            if (!navMenu.contains(e.target) && !mobileBtn.contains(e.target) && navMenu.classList.contains('menu-open')) {
                navMenu.classList.remove('menu-open');
                mobileBtn.classList.remove('is-active');
            }
        });
    }
});