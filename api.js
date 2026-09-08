/**
 * SANHA SELASAK PORTFOLIO — API LAYER (js/api.js)
 * Reads content from Airtable (your flat database) once cms-config.js
 * is filled in. Nothing else on the site had to change — main.js,
 * projects.js, contact.js, and the inline scripts in skills.html /
 * experience.html all already call window.API.*, so this file is a
 * drop-in replacement for the old Firebase version.
 *
 * When Airtable isn't configured yet, or a request fails, every method
 * below falls back to the FALLBACK_DATA object at the bottom of this
 * file — so the site always renders something reasonable, live or not.
 */
import { CMS_CONFIG } from '../cms-config.js';
import {
  SITE_SETTINGS,
  PROJECTS,
  SKILLS,
  EXPERIENCE,
  EDUCATION,
  CERTIFICATIONS,
} from './site-data.js';

function isConfigured() {
  if (!CMS_CONFIG || !CMS_CONFIG.enabled) return false;
  const { baseId, apiKey } = CMS_CONFIG.airtable;
  const looksPlaceholder = (v) => !v || v.includes('PASTE_YOUR_') || v.includes('_HERE');
  return !looksPlaceholder(baseId) && !looksPlaceholder(apiKey);
}

async function airtableFetch(tableName, { method = 'GET', body } = {}) {
  const { baseId, apiKey } = CMS_CONFIG.airtable;
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Airtable ${tableName} ${method} failed: ${res.status} ${text}`);
  }
  return res.json();
}

// Airtable checkboxes come back as `true` or are omitted entirely (never `false`).
function bool(v) {
  return !!v;
}

// Accepts a real array (Airtable multi-select) or a comma-separated string
// (a plain long-text field), so either column type works from Airtable's side.
function toArray(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string' && v.trim()) return v.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

function bySortOrder(a, b) {
  return (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0);
}

async function fetchList(tableKey, mapFn) {
  const tableName = CMS_CONFIG.airtable.tables[tableKey];
  const json = await airtableFetch(tableName);
  return (json.records || []).map((r) => mapFn(r.fields || {}, r.id)).sort(bySortOrder);
}

// ---------- Field mappers: Airtable column names -> the field names ----------
// ---------- already used throughout main.js / projects.js / the HTML  ----------

function mapProject(f, id) {
  return {
    id,
    title: f['Title'] || '',
    slug: f['Slug'] || '',
    short_description: f['Short Description'] || '',
    full_description: f['Full Description'] || '',
    project_type: f['Project Type'] || '',
    role: f['Role'] || '',
    team_info: f['Team Info'] || '',
    technologies: toArray(f['Technologies']),
    github_url: f['GitHub URL'] || '',
    live_url: f['Live URL'] || '',
    thumbnail_url: f['Thumbnail URL'] || '',
    challenges: f['Challenges'] || '',
    solution: f['Solution'] || '',
    results: f['Results'] || '',
    lessons_learned: f['Lessons Learned'] || '',
    is_featured: bool(f['Featured']),
    sort_order: f['Sort Order'] || 0,
  };
}

function mapSkillCategory(f, id) {
  return {
    id,
    category: f['Category'] || '',
    description: f['Description'] || '',
    items: toArray(f['Items']),
    sort_order: f['Sort Order'] || 0,
  };
}

function mapExperience(f, id) {
  return {
    id,
    role: f['Role'] || '',
    organization: f['Organization'] || '',
    location: f['Location'] || '',
    employment_type: f['Employment Type'] || '',
    start_date: f['Start Date'] || '',
    end_date: f['End Date'] || '',
    is_current: bool(f['Current']),
    summary: f['Summary'] || '',
    responsibilities: toArray(f['Responsibilities']),
    technologies: toArray(f['Technologies']),
    sort_order: f['Sort Order'] || 0,
  };
}

function mapEducation(f, id) {
  return {
    id,
    institution: f['Institution'] || '',
    degree: f['Degree'] || '',
    field_of_study: f['Field Of Study'] || '',
    start_date: f['Start Date'] || '',
    end_date: f['End Date'] || '',
    is_current: bool(f['Current']),
    description: f['Description'] || '',
    relevant_coursework: toArray(f['Relevant Coursework']),
    sort_order: f['Sort Order'] || 0,
  };
}

function mapCertification(f, id) {
  return {
    id,
    name: f['Name'] || '',
    issuing_organization: f['Issuing Organization'] || '',
    credential_url: f['Credential URL'] || '',
    issue_date: f['Issue Date'] || '',
    description: f['Description'] || '',
    sort_order: f['Sort Order'] || 0,
  };
}

function mapSiteSettings(f) {
  return {
    name: f['Name'] || '',
    professional_title: f['Professional Title'] || '',
    tagline: f['Tagline'] || '',
    email: f['Email'] || '',
    phone: f['Phone'] || '',
    location: f['Location'] || '',
    university: f['University'] || '',
    major: f['Major'] || '',
    bio: f['Bio'] || '',
    about_background: f['About Background'] || '',
    about_focus: f['About Focus'] || '',
    about_approach: f['About Approach'] || '',
    availability_status: f['Availability Status'] || '',
    github_url: f['GitHub URL'] || '',
    linkedin_url: f['LinkedIn URL'] || '',
    resume_url: f['Resume URL'] || '',
  };
}

export const API = (() => ({
  // ==========================================
  // PUBLIC PORTFOLIO ENDPOINTS (Airtable)
  // ==========================================

  getPublicSite: async () => {
    if (!isConfigured()) return { success: true, data: FALLBACK_DATA.site_settings };
    try {
      const json = await airtableFetch(CMS_CONFIG.airtable.tables.siteSettings);
      const record = (json.records || [])[0];
      if (!record) return { success: true, data: FALLBACK_DATA.site_settings };
      return { success: true, data: mapSiteSettings(record.fields || {}) };
    } catch (err) {
      console.warn('[api] getPublicSite fell back:', err.message);
      return { success: true, data: FALLBACK_DATA.site_settings };
    }
  },

  getProjects: async () => {
    if (!isConfigured()) return { success: true, data: FALLBACK_DATA.projects };
    try {
      const data = await fetchList('projects', mapProject);
      return { success: true, data: data.length ? data : FALLBACK_DATA.projects };
    } catch (err) {
      console.warn('[api] getProjects fell back:', err.message);
      return { success: true, data: FALLBACK_DATA.projects };
    }
  },

  getSkills: async () => {
    if (!isConfigured()) return { success: true, data: FALLBACK_DATA.skills };
    try {
      const data = await fetchList('skills', mapSkillCategory);
      return { success: true, data: data.length ? data : FALLBACK_DATA.skills };
    } catch (err) {
      console.warn('[api] getSkills fell back:', err.message);
      return { success: true, data: FALLBACK_DATA.skills };
    }
  },

  getExperience: async () => {
    if (!isConfigured()) return { success: true, data: FALLBACK_DATA.experience };
    try {
      const data = await fetchList('experience', mapExperience);
      return { success: true, data: data.length ? data : FALLBACK_DATA.experience };
    } catch (err) {
      console.warn('[api] getExperience fell back:', err.message);
      return { success: true, data: FALLBACK_DATA.experience };
    }
  },

  getEducation: async () => {
    if (!isConfigured()) return { success: true, data: FALLBACK_DATA.education };
    try {
      const data = await fetchList('education', mapEducation);
      return { success: true, data: data.length ? data : FALLBACK_DATA.education };
    } catch (err) {
      console.warn('[api] getEducation fell back:', err.message);
      return { success: true, data: FALLBACK_DATA.education };
    }
  },

  getCertifications: async () => {
    if (!isConfigured()) return { success: true, data: FALLBACK_DATA.certifications };
    try {
      const data = await fetchList('certifications', mapCertification);
      return { success: true, data: data.length ? data : FALLBACK_DATA.certifications };
    } catch (err) {
      console.warn('[api] getCertifications fell back:', err.message);
      return { success: true, data: FALLBACK_DATA.certifications };
    }
  },

  submitContact: async (formData) => {
    // Honeypot spam trap: this hidden field (name="website_url_hp") should
    // always be empty for a real visitor — only bots that fill in every
    // field populate it. Pretend success without actually sending anything,
    // so the bot has no signal that it was caught.
    if (formData.honeypot) {
      return { success: true, message: 'Thank you! Your message has been sent successfully.' };
    }

    if (!formData.name || !formData.email || !formData.message) {
      throw new Error('Name, email, and message are required.');
    }
    const payload = {
      name: String(formData.name).trim(),
      email: String(formData.email).trim().toLowerCase(),
      phone: String(formData.phone || '').trim(),
      company: String(formData.company || '').trim(),
      subject: String(formData.subject || 'Portfolio Inquiry').trim(),
      message: String(formData.message).trim(),
    };

    const canWrite = isConfigured() && CMS_CONFIG.allowContactWrites;
    if (canWrite) {
      try {
        await airtableFetch(CMS_CONFIG.airtable.tables.messages, {
          method: 'POST',
          body: {
            fields: {
              Name: payload.name,
              Email: payload.email,
              Phone: payload.phone,
              Company: payload.company,
              Subject: payload.subject,
              Message: payload.message,
              Status: 'Unread',
              'Submitted At': new Date().toISOString(),
            },
          },
        });
        return { success: true, message: 'Message sent successfully! Thank you for reaching out.' };
      } catch (err) {
        console.warn('[api] submitContact Airtable write failed, falling back to mailto:', err.message);
      }
    }

    // Fallback: no write-capable Airtable token configured — open the
    // visitor's email client with the message pre-filled instead.
    const to = FALLBACK_DATA.site_settings.email;
    const subject = encodeURIComponent(payload.subject);
    const body = encodeURIComponent(
      `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nCompany: ${payload.company}\n\n${payload.message}`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    return { success: true, message: 'Opening your email client to send this message…' };
  },
}))();

// Legacy global — the site's older inline scripts call window.API directly.
window.API = API;

// ===================== FALLBACK CONTENT =====================
// Shown when Airtable isn't configured yet, or a request fails.
// Edit this directly if you'd rather ship static content with no
// database at all — everything above still works either way.
const FALLBACK_DATA = {
  site_settings: SITE_SETTINGS,
  projects: PROJECTS,
  skills: SKILLS,
  experience: EXPERIENCE,
  education: EDUCATION,
  certifications: CERTIFICATIONS,
};
