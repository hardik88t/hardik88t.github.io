import { Icon } from '../shared/icons';
import { Phone } from './Phone';
import s from './MedJot.module.css';

const SYMPTOMS: { label: string; on?: boolean }[] = [
  { label: 'Fever', on: true },
  { label: 'Cough', on: true },
  { label: 'Sore throat', on: true },
  { label: 'Headache' },
  { label: 'Body ache' },
  { label: 'Rash' },
  { label: 'Vomiting' },
  { label: 'Loss of appetite' },
];

function VisitScreen() {
  return (
    <div className={s.page}>
      <div className={s.hdr}>
        <span className={s.iconBtn}>
          <Icon name="chevron-left" size={18} />
        </span>
        <p className={s.title}>New visit</p>
        <span className={s.draft}>Draft saved</span>
      </div>

      <div className={s.patient}>
        <span className={s.avatar}>MD</span>
        <div className={s.pBody}>
          <p className={s.pName}>Meera Desai</p>
          <p className={s.pMeta}>34 · Female · MRN 00482</p>
        </div>
        <span className={s.visitPill}>Visit 4</span>
      </div>

      <div className={s.sectionHead}>
        <p>Symptoms</p>
        <p className={s.countText}>3 selected</p>
      </div>
      <div className={s.chips}>
        {SYMPTOMS.map((c) => (
          <span key={c.label} className={c.on ? s.chipOn : s.chip}>
            {c.on ? <Icon name="check" size={13} strokeWidth={2.4} /> : null}
            {c.label}
          </span>
        ))}
      </div>

      <div className={s.sectionHead}>
        <p>Duration</p>
      </div>
      <div className={s.seg}>
        <span>1 day</span>
        <span className={s.segOn}>3 days</span>
        <span>1 week</span>
        <span>Other</span>
      </div>

      <div className={s.vitals}>
        <div className={s.field}>
          <p className={s.fLabel}>Temperature</p>
          <p className={s.fValue}>
            101.2 <small>°F</small>
          </p>
        </div>
        <div className={s.field}>
          <p className={s.fLabel}>Pulse</p>
          <p className={s.fValue}>
            92 <small>/ min</small>
          </p>
        </div>
      </div>

      <div className={s.sectionHead}>
        <p>Notes</p>
      </div>
      <div className={s.notes}>Throat red and tender. No breathing difficulty. Drink fluids and rest.</div>

      <div className={s.ctaWrap}>
        <span className={s.cta}>
          Add medicines
          <Icon name="arrow" size={18} strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}

function MedicineScreen() {
  return (
    <div className={`${s.page} ${s.pageMed}`}>
      <div className={s.hdr}>
        <span className={s.iconBtn}>
          <Icon name="chevron-left" size={18} />
        </span>
        <p className={s.title}>Medicines</p>
        <span className={s.done}>Done</span>
      </div>

      <div className={s.search}>
        <Icon name="search" size={17} />
        <span className={s.typed}>
          Para<span className={s.caret} />
        </span>
      </div>

      <div className={s.dropdown}>
        <div className={s.suggest}>
          <div>
            <p className={s.sName}>
              <b>Para</b>cetamol 500 mg
            </p>
            <p className={s.sMeta}>Tablet</p>
          </div>
          <span className={s.often}>Often used</span>
        </div>
        <div className={s.suggest}>
          <div>
            <p className={s.sName}>
              <b>Para</b>cetamol 650 mg
            </p>
            <p className={s.sMeta}>Tablet</p>
          </div>
        </div>
        <div className={s.suggest}>
          <div>
            <p className={s.sName}>
              <b>Para</b>cetamol 125 mg / 5 ml
            </p>
            <p className={s.sMeta}>Syrup</p>
          </div>
        </div>
      </div>

      <div className={s.sectionHead}>
        <p>Added to visit</p>
      </div>
      <div className={s.added}>
        <div className={s.addRow}>
          <div>
            <p className={s.aName}>Paracetamol 500 mg</p>
            <p className={s.aDose}>1 tablet, 3 times a day, 3 days</p>
          </div>
          <span className={s.qty}>× 9</span>
        </div>
      </div>

      <div className={s.sheet}>
        <div className={s.grab} />
        <p className={s.rTitle}>Receipt preview</p>
        <div className={s.receipt}>
          <p className={s.clinic}>Shanti Clinic</p>
          <p className={s.rMeta}>Receipt R-1184 · 14 Oct 2026, 10:42</p>
          <div className={s.rLines}>
            <div>
              <span>Consultation</span>
              <span>₹ 300</span>
            </div>
            <div>
              <span>Paracetamol 500 mg × 9</span>
              <span>₹ 36</span>
            </div>
          </div>
          <div className={s.rTotal}>
            <span>Total</span>
            <span>₹ 336</span>
          </div>
        </div>
        <div className={s.sheetBtns}>
          <span className={s.btnOutline}>Share</span>
          <span className={s.btnSolid}>Print receipt</span>
        </div>
      </div>
    </div>
  );
}

export function MedJot() {
  return (
    <div className={s.root} aria-hidden="true">
      <Phone>
        <VisitScreen />
      </Phone>
      <Phone>
        <MedicineScreen />
      </Phone>
    </div>
  );
}
