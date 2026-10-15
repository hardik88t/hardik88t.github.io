import { useEffect, useRef, useState } from 'react';
import { bio, headline, person, services } from '../content';
import { Icon } from '../shared/icons';
import { copyText } from '../shared/clipboard';
import { UI } from './copy';
import './cards.css';

export type CardVariant = 'canvas' | 'mobile';

/** Anchor card: name, headline, bio, services and contact buttons. */
export function HelloCard({ variant }: { variant: CardVariant }) {
  return (
    <div className={`card card--hello card--${variant}`}>
      <div className="card-head">
        <span className="monogram" aria-hidden="true">
          {person.monogram}
        </span>
        <p className="card-name">
          <strong>{person.name}</strong>
          <span>{person.title}</span>
        </p>
      </div>

      <h1 className="hello-title">{headline}</h1>
      <p className="hello-bio">{bio}</p>

      <ul className="services">
        {services.map((s, i) => (
          <li key={s.id}>
            <span className="services-index">{String(i + 1).padStart(2, '0')}</span>
            <strong>{s.title}</strong>
          </li>
        ))}
      </ul>

      <div className="card-actions">
        <a className="btn btn--primary" href={`mailto:${person.email}`}>
          {UI.helloCta}
        </a>
        <a className="btn" href={person.links.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a className="btn" href={person.links.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </div>
  );
}

/** Contact card: selectable email with copy, links, availability. Never claims a message was sent. */
export function ContactCard({ variant }: { variant: CardVariant }) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onCopy() {
    const ok = await copyText(person.email);
    setCopyState(ok ? 'copied' : 'manual');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopyState('idle'), 2400);
  }

  return (
    <div className={`card card--contact card--${variant}`}>
      <h2 className="contact-title">Contact</h2>
      <p className="contact-intro">{UI.contactIntro}</p>

      <div className="email-block">
        <p className="email selectable">{person.email}</p>
        <button type="button" className="btn btn--primary" onClick={onCopy} aria-live="polite">
          {copyState === 'copied' ? UI.copied : UI.copyEmail}
        </button>
      </div>
      <p className="copy-status" role="status">
        {copyState === 'manual' ? UI.copyManual : ''}
      </p>

      <ul className="link-list">
        <li>
          <a href={person.links.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn <Icon name="arrow-up-right" size={16} />
          </a>
        </li>
        <li>
          <a href={person.links.github} target="_blank" rel="noopener noreferrer">
            GitHub <Icon name="arrow-up-right" size={16} />
          </a>
        </li>
        <li>
          <a href={person.links.cv} target="_blank" rel="noopener noreferrer">
            CV (PDF) <Icon name="arrow-up-right" size={16} />
          </a>
        </li>
      </ul>

      <div className="availability">
        <p>
          <span className="dot" aria-hidden="true" />
          {person.availability}
        </p>
        <p className="where">
          {person.location} · {person.timezone}
        </p>
      </div>
    </div>
  );
}
