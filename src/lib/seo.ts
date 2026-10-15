// JSON-LD for the page: one @graph with Person, WebSite, ProfilePage and an ItemList of the six projects.
// Built from content-v2.json and SITE_URL. No client names; project links only where the content has a public link.
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL, absUrl } from './site';
import { content, currentEmployer, isConcept, projects, skillList } from './content';

export function jsonLd(): Record<string, unknown> {
  const p = content.person;
  const personId = absUrl('/#person');
  const websiteId = absUrl('/#website');
  const pageId = absUrl('/#profile');
  const employer = currentEmployer();

  const person = {
    '@type': 'Person',
    '@id': personId,
    name: p.name,
    givenName: p.firstName,
    jobTitle: p.title,
    description: p.titleLong,
    url: absUrl('/'),
    email: p.email,
    sameAs: [p.links.github, p.links.linkedin],
    knowsAbout: skillList(),
    ...(employer ? { worksFor: { '@type': 'Organization', name: employer } } : {}),
    alumniOf: { '@type': 'EducationalOrganization', name: content.education.org },
    address: { '@type': 'PostalAddress', addressLocality: 'Ahmedabad', addressRegion: 'Gujarat', addressCountry: 'IN' },
  };

  const website = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: SITE_URL + '/',
    name: p.name,
    description: SITE_DESCRIPTION,
    inLanguage: 'en-IN',
    publisher: { '@id': personId },
  };

  const profile = {
    '@type': 'ProfilePage',
    '@id': pageId,
    url: absUrl('/'),
    name: SITE_TITLE,
    description: SITE_DESCRIPTION,
    inLanguage: 'en-IN',
    isPartOf: { '@id': websiteId },
    mainEntity: { '@id': personId },
    dateModified: content._meta.updated,
  };

  const items = projects.map((proj, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'CreativeWork',
      name: proj.title,
      description: proj.oneLiner,
      about: { '@type': 'Thing', name: proj.type },
      creator: { '@id': personId },
      dateCreated: proj.year,
      keywords: proj.stack.join(', '),
      ...(isConcept(proj) ? { creativeWorkStatus: 'Concept' } : {}),
      ...(proj.links?.github ? { codeRepository: proj.links.github } : {}),
    },
  }));

  const list = {
    '@type': 'ItemList',
    '@id': absUrl('/#work'),
    name: 'Selected work',
    numberOfItems: items.length,
    itemListElement: items,
  };

  return { '@context': 'https://schema.org', '@graph': [person, website, profile, list] };
}
