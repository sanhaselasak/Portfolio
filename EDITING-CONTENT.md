# Editing this site's content

This is a fully static site — plain HTML, CSS, and JavaScript. There is
no admin panel, no database, and no external service of any kind.

## Where content lives

Almost everything you'd want to update — your name, tagline, email,
phone, location, GitHub/LinkedIn links, projects, skills, work
experience, education, and certifications — lives in one file:

**`js/site-data.js`**

Open it and edit the values directly. Each section is a plain
JavaScript array or object with comments showing the expected shape.
For example, to add a project:

```js
export const PROJECTS = [
  {
    title: 'My First Project',
    slug: 'my-first-project',
    short_description: 'A short one-liner shown on the project card.',
    full_description: 'A longer write-up shown in the case study popup.',
    project_type: 'Personal',
    role: 'Developer',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    github_url: 'https://github.com/your-username/repo',
    live_url: '',
    is_featured: true,
  },
];
```

Save the file and reload any page — the Projects, Skills, and
Experience pages, plus the header/footer info on every page, all read
from this same file.

## A couple of things to fill in yourself

- **`SITE_SETTINGS.linkedin_url`** in `js/site-data.js` currently
  points at the generic `linkedin.com` homepage — replace it with your
  real profile URL (e.g. `https://linkedin.com/in/your-name`).

## Everything else

The rest of the site — layout, styling, and interactive behavior — is
in `css/` and `js/`, all plain CSS and vanilla JavaScript. No build
step, no dependencies to install: just open any `.html` file in a
browser, or serve the folder with any static file server.
