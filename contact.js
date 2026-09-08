/**
 * SANHA SELASAK PORTFOLIO — CONTACT CONTROLLER (contact.js)
 * Form validation, direct database dispatch, feedback alerts, and email copy.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const alertContainer = document.getElementById('form-alert-container');
  const submitBtn = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear existing alerts
      if (alertContainer) alertContainer.innerHTML = '';

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone ? form.phone.value.trim() : '';
      const company = form.company ? form.company.value.trim() : '';
      const subject = form.subject ? form.subject.value.trim() : '';
      const message = form.message.value.trim();
      const honeypot = form.website_url_hp ? form.website_url_hp.value.trim() : '';

      // Validation
      if (!name) {
        showAlert('Please enter your full name.', 'error');
        return;
      }
      if (!email || !email.includes('@')) {
        showAlert('Please enter a valid email address.', 'error');
        return;
      }
      if (!message || message.length < 10) {
        showAlert('Please provide a message with at least 10 characters.', 'error');
        return;
      }

      // Submit state
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner"></span> <span>Sending...</span>`;
      }

      try {
        const response = await window.API.submitContact({
          name,
          email,
          phone,
          company,
          subject,
          message,
          honeypot,
        });

        showAlert(response.message || 'Thank you! Your message has been sent successfully.', 'success');
        form.reset();
        window.showToast(response.message || 'Message sent!', 'success');
      } catch (err) {
        showAlert(err.message || 'Failed to send message. Please try again or email directly.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }

  function showAlert(msg, type) {
    if (!alertContainer) return;
    alertContainer.innerHTML = `
      <div class="alert ${type === 'success' ? 'alert-success' : 'alert-error'} animate-fade-in">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;">
          ${type === 'success' 
            ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
            : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
          }
        </svg>
        <div>${msg}</div>
      </div>
    `;
  }
});
