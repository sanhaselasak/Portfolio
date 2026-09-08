/**
 * SANHA SELASAK PORTFOLIO — MAIN APPLICATION ENTRY (main.js)
 * Global bootstrapping, year updater, and static site-data synchronizer.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Update copyright years
  const yearSpans = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearSpans.forEach((span) => (span.textContent = currentYear));

  // 2. Sync site settings (name/email/phone/etc.) from js/site-data.js
  try {
    if (window.API && typeof window.API.getPublicSite === 'function') {
      const res = await window.API.getPublicSite();
      const s = res && res.data ? res.data : (res && res.siteSettings ? res.siteSettings : res);

      if (s && typeof s === 'object') {
        // Update elements with data-bind attributes
        if (s.name) document.querySelectorAll('[data-bind="name"]').forEach((el) => (el.textContent = s.name));
        if (s.professional_title || s.title) {
          const t = s.professional_title || s.title;
          document.querySelectorAll('[data-bind="title"]').forEach((el) => (el.textContent = t));
        }
        if (s.tagline) document.querySelectorAll('[data-bind="tagline"]').forEach((el) => (el.textContent = s.tagline));
        if (s.email) {
          document.querySelectorAll('[data-bind="email"]').forEach((el) => {
            el.textContent = s.email;
            if (el.tagName === 'A') el.href = `mailto:${s.email}`;
          });
        }
        if (s.location) document.querySelectorAll('[data-bind="location"]').forEach((el) => (el.textContent = s.location));
        if (s.availability_status) document.querySelectorAll('[data-bind="availability_status"]').forEach((el) => (el.textContent = s.availability_status));
        if (s.phone) {
          document.querySelectorAll('[data-bind="phone"]').forEach((el) => {
            el.textContent = s.phone;
            if (el.tagName === 'A') el.href = `tel:${s.phone.replace(/\s+/g, '')}`;
          });
        }

        // Update github & linkedin links
        if (s.github_url) {
          document.querySelectorAll('[data-bind="github_url"]').forEach((el) => {
            el.href = s.github_url;
          });
        }
        if (s.linkedin_url) {
          document.querySelectorAll('[data-bind="linkedin_url"]').forEach((el) => {
            el.href = s.linkedin_url;
          });
        }
      }
    }
  } catch (err) {
    console.error('Unable to sync site settings from js/site-data.js:', err);
  }
});
