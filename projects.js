/**
 * SANHA SELASAK PORTFOLIO — PROJECTS & CASE STUDY SYSTEM (projects.js)
 * Real-time filter tabs, search filter, and detailed case study modal reader.

 */
import { API } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('projects-grid');
  const searchInput = document.getElementById('projects-search');
  const filterTabs = document.querySelectorAll('.project-filter-btn');
  const modal = document.getElementById('case-study-modal');
  const modalContent = document.getElementById('modal-case-study-content');
  const closeModalBtn = document.getElementById('close-modal-btn');

  let allProjects = [];
  let currentFilter = 'all';
  let searchQuery = '';

  // 1. Load projects from js/site-data.js
  async function loadProjects() {
    if (!container) return;
    try {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; font-family: var(--font-mono); color: var(--color-text-muted);"><span class="spinner" style="border-color: var(--color-primary); border-top-color: transparent; margin-bottom: 0.5rem;"></span><p>Loading projects...</p></div>`;
      
      const res = await (window.API ? window.API.getProjects() : API.getProjects());
      if (Array.isArray(res)) {
        allProjects = res;
      } else if (res && Array.isArray(res.data)) {
        allProjects = res.data;
      } else {
        allProjects = [];
      }
      renderProjects();
    } catch (err) {
      console.error('Failed to load projects:', err);
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem;" class="card"><p class="alert-error" style="display:inline-block;">Unable to load projects.</p></div>`;
    }
  }

  // 2. Render filtered list of projects
  function renderProjects() {
    if (!container) return;
    if (!Array.isArray(allProjects)) {
      allProjects = [];
    }

    const isHomepage = !searchInput && filterTabs.length === 0;

    const filtered = allProjects.filter((p) => {
      if (!p) return false;
      if (isHomepage && p.is_featured === false && allProjects.some((x) => x.is_featured)) {
        return false;
      }
      const matchesType = currentFilter === 'all' || p.project_type === currentFilter;
      const query = (searchQuery || '').toLowerCase().trim();
      const title = (p.title || '').toLowerCase();
      const desc = (p.short_description || p.full_description || '').toLowerCase();
      const techs = Array.isArray(p.technologies) ? p.technologies : [];
      const matchesSearch =
        !query ||
        title.includes(query) ||
        desc.includes(query) ||
        techs.some((t) => typeof t === 'string' && t.toLowerCase().includes(query));
      return matchesType && matchesSearch;
    });

    const displayList = isHomepage ? filtered.slice(0, 4) : filtered;

    if (displayList.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;" class="card">
          <div class="tag tag-gold" style="margin-bottom: 1rem;">In Progress</div>
          <h3 style="margin-bottom: 0.5rem;">No projects found</h3>
          <p style="max-width: 400px; margin: 0 auto 1.5rem;">
            ${searchQuery ? `No projects matching "${searchQuery}".` : 'Check back soon for newly published projects and case studies.'}
          </p>
          ${searchQuery ? `<button class="btn btn-sm btn-line" onclick="document.getElementById('projects-search').value=''; document.getElementById('projects-search').dispatchEvent(new Event('input'));">Clear Search</button>` : ''}
        </div>
      `;
      return;
    }

    container.innerHTML = displayList.map((project) => `
      <article class="card project-card hover-lift" data-slug="${project.slug}">
        <div class="project-header">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
            <span class="tag tag-gold">${project.project_type || 'Project'}</span>
            ${project.is_featured ? '<span class="tag tag-gold" style="font-size: 0.65rem;">★ Featured</span>' : ''}
          </div>
          <h3 class="project-title" style="margin-top: 0.75rem;">${project.title}</h3>
          ${project.role ? `<p style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--color-primary); margin-bottom: 0.5rem;">Role: ${project.role}</p>` : ''}
        </div>

        <p class="project-description">
          ${project.short_description || project.full_description || ''}
        </p>

        <div class="project-tech-stack">
          ${(project.technologies || []).slice(0, 4).map((tech) => `
            <span class="tag" style="font-size: 0.72rem;">${tech}</span>
          `).join('')}
          ${(project.technologies || []).length > 4 ? `<span class="tag" style="font-size: 0.72rem;">+${project.technologies.length - 4}</span>` : ''}
        </div>

        <div class="project-actions" style="margin-top: auto; display: flex; gap: 0.75rem; align-items: center; border-top: 1px solid var(--color-border-soft); padding-top: 1rem;">
          <button class="btn btn-sm btn-line read-case-study-btn" data-slug="${project.slug}">
            <span>Read Case Study</span> →
          </button>
          ${project.live_url ? `
            <a href="${project.live_url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-line" title="Live Preview" style="padding: 0.4rem 0.6rem;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          ` : ''}
          ${project.github_url ? `
            <a href="${project.github_url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-line" title="GitHub Repository" style="padding: 0.4rem 0.6rem;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
          ` : ''}
        </div>
      </article>
    `).join('');

    // Attach click listeners to "Read Case Study" buttons
    container.querySelectorAll('.read-case-study-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const slug = btn.getAttribute('data-slug');
        const project = allProjects.find((p) => p.slug === slug);
        if (project) openCaseStudyModal(project);
      });
    });
  }

  // 3. Modal Opening Handler
  function openCaseStudyModal(project) {
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
          <span class="tag tag-gold">${project.project_type || 'Case Study'}</span>
          ${project.role ? `<span class="tag">${project.role}</span>` : ''}
        </div>
        <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">${project.title}</h2>
        <p style="font-size: 1.05rem; color: var(--color-text-muted); line-height: 1.6;">${project.short_description || ''}</p>
      </div>

      ${project.thumbnail_url || project.cover_image ? `
        <div style="margin-bottom: 2rem; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--color-border-soft);">
          <img src="${project.thumbnail_url || project.cover_image}" alt="${project.title}" style="width: 100%; height: auto; max-height: 350px; object-fit: cover;" />
        </div>
      ` : ''}

      <div style="margin-bottom: 2rem;">
        <h4 style="font-size: 1rem; color: var(--color-gold); text-transform: uppercase; margin-bottom: 0.75rem; font-family: var(--font-mono);">Architecture & Narrative</h4>
        <div style="font-size: 0.95rem; line-height: 1.8; color: var(--color-text); white-space: pre-line;">
          ${project.full_description || project.short_description || 'Detailed technical breakdown in progress.'}
        </div>
      </div>

      <div style="margin-bottom: 2rem;">
        <h4 style="font-size: 1rem; color: var(--color-gold); text-transform: uppercase; margin-bottom: 0.5rem; font-family: var(--font-mono);">Technologies & Tools</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
          ${(project.technologies || []).map((t) => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap; pt-2; border-top: 1px solid var(--color-border-soft); padding-top: 1.25rem;">
        ${project.live_url ? `<a href="${project.live_url}" target="_blank" rel="noopener noreferrer" class="btn btn-solid btn-sm"><span>Visit Live Demo</span> ↗</a>` : ''}
        ${project.github_url ? `<a href="${project.github_url}" target="_blank" rel="noopener noreferrer" class="btn btn-line btn-sm"><span>View Code on GitHub</span> ↗</a>` : ''}
      </div>
    `;

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  // 4. Modal Close Handlers
  if (closeModalBtn && modal) {
    const closeModal = () => {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  // 5. Search & Filter Input Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProjects();
    });
  }

  if (filterTabs.length > 0) {
    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        filterTabs.forEach((t) => {
          t.classList.remove('btn-solid');
          t.classList.add('btn-line');
        });
        tab.classList.remove('btn-line');
        tab.classList.add('btn-solid');

        currentFilter = tab.getAttribute('data-filter') || 'all';
        renderProjects();
      });
    });
  }

  // Initialize
  loadProjects();
});
