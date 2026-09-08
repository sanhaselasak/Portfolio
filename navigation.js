/**
 * SANHA SELASAK PORTFOLIO — NAVIGATION CONTROLLER (navigation.js)
 * Manages sticky header blur, mobile hamburger drawer, keyboard access, and active links.
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  // 1. Sticky Header Scroll Effect
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Active Link Highlighting based on current pathname
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      const cleanHref = new URL(href, window.location.href).pathname.replace(/\/$/, '') || '/';
      const isMatch =
        cleanHref === currentPath ||
        (cleanHref !== '/' && currentPath.startsWith(cleanHref)) ||
        (cleanHref === '/projects.html' && currentPath.includes('project')) ||
        (cleanHref === '/about.html' && currentPath.includes('about')) ||
        (cleanHref === '/skills.html' && currentPath.includes('skill')) ||
        (cleanHref === '/experience.html' && currentPath.includes('experience')) ||
        (cleanHref === '/contact.html' && currentPath.includes('contact'));

      if (isMatch) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });

  // 3. Mobile Navigation Drawer Toggle
  if (hamburgerBtn && mobileDrawer) {
    const toggleDrawer = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        mobileDrawer.classList.add('is-open');
        hamburgerBtn.classList.add('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      } else {
        mobileDrawer.classList.remove('is-open');
        hamburgerBtn.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    };

    hamburgerBtn.addEventListener('click', () => toggleDrawer());

    // Close on link click
    mobileDrawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => toggleDrawer(false));
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        toggleDrawer(false);
      }
    });

    // Close when clicking outside the drawer and its trigger button
    document.addEventListener('click', (e) => {
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (!isOpen) return;
      const clickedInsideDrawer = mobileDrawer.contains(e.target);
      const clickedTrigger = hamburgerBtn.contains(e.target);
      if (!clickedInsideDrawer && !clickedTrigger) {
        toggleDrawer(false);
      }
    });
  }

  // 4. Subnav scroll-spy (about.html "Background / Currently Focused On /
  // My Approach / Education" tabs). Highlights whichever section is
  // currently in view as the user scrolls, and updates instantly on click
  // too so the highlight doesn't lag behind a smooth-scroll animation.
  // No-ops automatically on any page that has no .subnav-btn elements.
  const subnavButtons = document.querySelectorAll('.subnav-btn');
  if (subnavButtons.length > 0 && 'IntersectionObserver' in window) {
    const sections = Array.from(subnavButtons)
      .map((btn) => document.querySelector(btn.getAttribute('href')))
      .filter(Boolean);

    const setActiveSubnav = (id) => {
      subnavButtons.forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('href') === `#${id}`);
      });
    };

    if (sections.length > 0) {
      // Watch a thin horizontal band near the top of the viewport (below
      // the sticky header + subnav bar) — whichever section is crossing
      // that band is the "current" one.
      const spyObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((entry) => entry.isIntersecting);
          if (visible.length === 0) return;
          const topMost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveSubnav(topMost.target.id);
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      sections.forEach((section) => spyObserver.observe(section));
    }

    // Instant feedback on click, before the smooth-scroll animation finishes
    subnavButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('href').slice(1);
        setActiveSubnav(targetId);
      });
    });
  }
});
