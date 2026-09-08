// ===================== CMS CONFIG =====================
// This is the ONLY file you need to edit to connect this site to your
// Airtable base. Until you fill this in and set `enabled: true`, every
// page shows its built-in fallback content and no network request is
// made — the site can never break because of a missing/incomplete config.
//
// Full setup steps + the exact Airtable table/column names to create
// are in AIRTABLE-SETUP.md at the project root.

export const CMS_CONFIG = {

  // Flip to true once baseId + apiKey below are filled in for real.
  enabled: false,

  airtable: {
    // 1) Your base's URL looks like:
    //    https://airtable.com/appXXXXXXXXXXXXXX/...
    //    Copy the "appXXXXXXXXXXXXXX" part.
    baseId: "PASTE_YOUR_AIRTABLE_BASE_ID_HERE",

    // 2) Create a token at https://airtable.com/create/tokens
    //    Scope: data.records:read (add data.records:write ONLY if you
    //    also want the contact form to write into Airtable — see
    //    allowContactWrites below). Grant it access to this one base.
    //    WARNING: this key ships inside your site's JavaScript and is
    //    visible to anyone who views page source — this is a static
    //    site with no server to hide it behind. Keep it read-only
    //    unless you specifically need contact-form writes.
    apiKey: "PASTE_YOUR_AIRTABLE_PERSONAL_ACCESS_TOKEN_HERE",

    // 3) Table names — must match your Airtable base exactly (case-sensitive).
    //    Rename the values here (not the keys) if you name your tables
    //    differently. See AIRTABLE-SETUP.md for the exact columns each
    //    table needs.
    tables: {
      siteSettings: "Site Settings",
      projects: "Projects",
      skills: "Skills",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications",
      messages: "Messages",
    },
  },

  // If true, the contact form writes submissions into the "Messages"
  // table above (requires a token with data.records:write scope).
  // If false (default), the contact form falls back to opening the
  // visitor's email client with a pre-filled message instead — no
  // write-capable key needed anywhere.
  allowContactWrites: false,
};
