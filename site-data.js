/**
 * SANHA SELASAK PORTFOLIO — SITE DATA (js/site-data.js)
 * All portfolio content lives here as plain JavaScript — no network
 * requests, no external database, no CMS, no backend of any kind.
 * To update what appears on the site, edit the values below directly
 * and refresh the page.
 *
 * Every page reads from this one file through the small `API` helper
 * at the bottom, so a change here shows up everywhere that content
 * is used (header/footer info, the Projects/Skills/Experience pages).
 */

export const SITE_SETTINGS = {
  name: 'Sanha Selasak',
  professional_title: 'Aspiring Software Engineer & IT Specialist',
  tagline:
    'Bridging business process analysis with modern software engineering, web architectures, and reliable database systems.',
  email: 'sanhaselasak2007@gmail.com',
  phone: '+855 70 494 706',
  location: 'Phnom Penh, Cambodia',
  university: 'Phnom Penh International University (PPIU)',
  major: 'Management Information Systems (MIS)',
  availability_status: 'Available for internships, developer roles & academic collaboration',
  github_url: 'https://github.com/sanhaselasak',
  // TODO: replace with your real LinkedIn profile URL (e.g. https://linkedin.com/in/your-name)
  linkedin_url: 'https://linkedin.com',
};

// Add one object per project as you build them. Example shape:
// {
//   title: 'Project Name',
//   slug: 'project-name',
//   short_description: 'One or two sentences shown on the card.',
//   full_description: 'Longer write-up shown in the case study modal.',
//   project_type: 'Personal', // shown as a tag; also used by the filter tabs
//   role: 'Developer',
//   technologies: ['HTML', 'CSS', 'JavaScript'],
//   github_url: 'https://github.com/...',
//   live_url: 'https://...',
//   is_featured: true, // shows on the homepage highlight grid
// }
export const PROJECTS = [];

export const SKILLS = [
  { category: 'Languages', items: ['Python', 'JavaScript'] },
  { category: 'Web', items: ['HTML', 'CSS', 'Tailwind CSS'] },
];

// { role: '', organization: '', location: '', employment_type: '',
//   start_date: '', end_date: '', is_current: false, summary: '',
//   responsibilities: [], technologies: [] }
export const EXPERIENCE = [];

export const EDUCATION = [
  {
    institution: 'Phnom Penh International University (PPIU)',
    degree: 'Bachelor of Science in Management Information Systems',
    field_of_study: 'Management Information Systems',
    start_date: '2026',
    end_date: '2029',
    is_current: true,
    description:
      'Specialized undergraduate curriculum integrating relational database management systems, object-oriented programming, systems analysis and design, data communications, and web application engineering.',
    relevant_coursework: [
      'Database Management Systems',
      'Object-Oriented Programming',
      'Systems Analysis and Design',
      'Data Communications & Networking',
      'Business Process Management',
      'Management Information Systems',
      'Web Application Engineering',
    ],
  },
];

// { name: '', issuing_organization: '', credential_url: '', issue_date: '', description: '' }
export const CERTIFICATIONS = [];

// ===================== Read-only helpers =====================
// Same call shape (`await API.getX()`) the pages already use, just
// backed by the constants above instead of a network request.
const asResult = (data) => Promise.resolve({ success: true, data });

export const API = {
  getPublicSite: () => Promise.resolve({ success: true, data: SITE_SETTINGS }),
  getProjects: () => asResult(PROJECTS),
  getSkills: () => asResult(SKILLS),
  getExperience: () => asResult(EXPERIENCE),
  getEducation: () => asResult(EDUCATION),
  getCertifications: () => asResult(CERTIFICATIONS),
};

// Legacy global — a couple of inline page scripts call window.API directly.
window.API = API;
