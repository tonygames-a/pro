// Web Vitals Monitoring
import {onCLS, onFID, onLCP} from 'web-vitals';

// Navigation Module
export const initNavigation = () => {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', 
        menuToggle.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
      );
    });
  }

  // Active link highlighting
  const currentPage = window.location.pathname;
  document.querySelectorAll('.nav-menu a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
};

// Scroll progress indicator
export const initScrollProgress = () => {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
};

// Performance monitoring
export const initPerformanceMonitoring = () => {
  onCLS(console.log);
  onFID(console.log);
  onLCP(console.log);
};

// Theme toggle
export const initThemeToggle = () => {
  const themeToggle = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  const setTheme = (isDark) => {
    document.documentElement.classList.toggle('dark-theme', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  // Initialize theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme === 'dark');
  } else {
    setTheme(prefersDark.matches);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(!document.documentElement.classList.contains('dark-theme'));
    });
  }
};