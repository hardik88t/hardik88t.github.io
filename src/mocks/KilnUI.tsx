import { Icon } from '../shared/icons';
import s from './KilnUI.module.css';

const BRAND: [string, string][] = [
  ['50', '#FDF3EF'],
  ['100', '#FBE3DA'],
  ['200', '#F7C4B3'],
  ['300', '#F1A08A'],
  ['400', '#EC7D62'],
  ['500', '#E85D3C'],
  ['600', '#CC4A2B'],
  ['700', '#A63B22'],
  ['800', '#7D2C19'],
  ['900', '#521D10'],
];

const NEUTRAL: [string, string][] = [
  ['0', '#FFFFFF'],
  ['50', '#F7F7F5'],
  ['100', '#EEEEEB'],
  ['200', '#DEDDD8'],
  ['400', '#9A9891'],
  ['600', '#5B5A55'],
  ['800', '#2A2925'],
  ['900', '#161513'],
];

const SEMANTIC: [string, string][] = [
  ['Success', '#2F8F5B'],
  ['Warning', '#C98200'],
  ['Danger', '#B42318'],
  ['Info', '#2563EB'],
];

const SPACING: number[] = [4, 8, 12, 16, 24, 32, 48, 64];

const TYPE: { token: string; spec: string; cls: string; sample: string }[] = [
  { token: 'display', spec: '48 / 52 · 800', cls: 't-display', sample: 'Calm software' },
  { token: 'heading', spec: '32 / 40 · 700', cls: 't-heading', sample: 'Orders this week' },
  { token: 'title', spec: '20 / 28 · 700', cls: 't-title', sample: 'Stock and invoices' },
  { token: 'body', spec: '16 / 24 · 400', cls: 't-body', sample: 'Components read like one product.' },
  { token: 'caption', spec: '13 / 18 · 500', cls: 't-caption', sample: 'Last updated 2 minutes ago' },
];

const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Disabled'];

const BUTTONS: { variant: string; cls: string; label: string }[] = [
  { variant: 'Primary', cls: 'b-primary', label: 'Save draft' },
  { variant: 'Secondary', cls: 'b-secondary', label: 'Preview' },
  { variant: 'Ghost', cls: 'b-ghost', label: 'Cancel' },
  { variant: 'Danger', cls: 'b-danger', label: 'Delete' },
];

export function KilnUI() {
  return (
    <div className={s.root} aria-hidden="true">
      <header className={s.top}>
        <div className={s.brand}>
          <span className={s.logo}>
            <i />
            <i />
            <i />
          </span>
          <p>Kiln UI</p>
        </div>
        <nav className={s.tabs}>
          <span className={s.tabOn}>Foundations</span>
          <span>Components</span>
          <span>Patterns</span>
          <span>Accessibility</span>
        </nav>
        <span className={s.spacer} />
        <span className={s.sync}>
          <i />
          Synced with Figma
        </span>
      </header>

      <div className={s.body}>
        <section className={s.left}>
          <p className={s.sec}>Colour</p>
          <p className={s.secSub}>Brand ramp · used for actions and focus</p>
          <div className={s.ramp}>
            {BRAND.map(([k, hex]) => (
              <div key={k} className={s.sw}>
                <span className={s.chip} style={{ background: hex }} />
                <p className={s.swK}>{k}</p>
                <p className={s.swH}>{hex}</p>
              </div>
            ))}
          </div>

          <p className={`${s.secSub} ${s.gapTop}`}>Neutral ramp · surfaces, text and borders</p>
          <div className={s.ramp8}>
            {NEUTRAL.map(([k, hex]) => (
              <div key={k} className={s.sw}>
                <span className={`${s.chip} ${s.chipLine}`} style={{ background: hex }} />
                <p className={s.swK}>{k}</p>
                <p className={s.swH}>{hex}</p>
              </div>
            ))}
          </div>

          <div className={s.semantic}>
            {SEMANTIC.map(([name, hex]) => (
              <div key={name} className={s.sem}>
                <span className={s.semChip} style={{ background: hex }} />
                <div>
                  <p className={s.semName}>{name}</p>
                  <p className={s.swH}>{hex}</p>
                </div>
              </div>
            ))}
          </div>

          <p className={`${s.sec} ${s.gapTop}`}>Type scale</p>
          <div className={s.type}>
            {TYPE.map((t) => (
              <div key={t.token} className={s.typeRow}>
                <div className={s.typeMeta}>
                  <p>{t.token}</p>
                  <p className={s.swH}>{t.spec}</p>
                </div>
                <p className={`${s[t.cls]}`}>{t.sample}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={s.right}>
          <p className={s.sec}>Buttons</p>
          <div className={s.btnGrid}>
            <span />
            {STATES.map((st) => (
              <span key={st} className={s.colHead}>
                {st}
              </span>
            ))}
            {BUTTONS.map((b) => (
              <div key={b.variant} className={s.btnRow}>
                <span className={s.rowHead}>{b.variant}</span>
                {STATES.map((st) => {
                  const stateCls = s[`st_${st.toLowerCase()}`];
                  return (
                    <span key={st} className={s.cell}>
                      <span className={`${s.btn} ${s[b.cls]} ${stateCls}`}>{b.label}</span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          <div className={s.pair}>
            <div>
              <p className={s.sec}>Inputs</p>
              <div className={s.inputs}>
                <div className={s.field}>
                  <p className={s.label}>Customer name</p>
                  <div className={`${s.input} ${s.inDefault}`}>
                    <span className={s.ph}>Customer name</span>
                  </div>
                  <p className={s.help}>Shown on invoices</p>
                </div>
                <div className={s.field}>
                  <p className={s.label}>Customer name</p>
                  <div className={`${s.input} ${s.inFocus}`}>
                    <span>Maple Cafe Supplies</span>
                    <span className={s.caret} />
                  </div>
                  <p className={s.help}>Focus ring, 2 px brand-600</p>
                </div>
                <div className={s.field}>
                  <p className={s.label}>GST number</p>
                  <div className={`${s.input} ${s.inError}`}>
                    <span>24AAAPL1234C1</span>
                  </div>
                  <p className={s.errText}>
                    <Icon name="alert" size={14} strokeWidth={2} /> Enter a 15-character GSTIN
                  </p>
                </div>
                <div className={s.field}>
                  <p className={s.label}>Invoice total</p>
                  <div className={`${s.input} ${s.inDisabled}`}>
                    <span>₹ 18,430</span>
                  </div>
                  <p className={s.help}>Calculated from lines</p>
                </div>
              </div>
            </div>
          </div>

          <div className={s.bottomRow}>
            <div>
              <p className={s.sec}>Toggles</p>
              <div className={s.controls}>

                <div className={s.ctrl}>
                  <span className={`${s.toggle} ${s.tOn}`}>
                    <i />
                  </span>
                  <span>Reminders on</span>
                </div>
                <div className={s.ctrl}>
                  <span className={s.toggle}>
                    <i />
                  </span>
                  <span>Auto-send</span>
                </div>
                <div className={`${s.ctrl} ${s.dis}`}>
                  <span className={`${s.toggle} ${s.tDis}`}>
                    <i />
                  </span>
                  <span>Locked</span>
                </div>
              </div>
            </div>
            <div>
              <p className={s.sec}>Checkboxes</p>
              <div className={s.checks}>
                <div className={s.ctrl}>
                  <span className={`${s.box} ${s.boxOn}`}>
                    <Icon name="check" size={13} strokeWidth={3} />
                  </span>
                  <span>Include tax</span>
                </div>
                <div className={s.ctrl}>
                  <span className={s.box} />
                  <span>Send copy to me</span>
                </div>
                <div className={s.ctrl}>
                  <span className={`${s.box} ${s.boxMixed}`}>
                    <i />
                  </span>
                  <span>Select all</span>
                </div>
              </div>
            </div>
            <div>
              <p className={s.sec}>Tags</p>
              <div className={s.tags}>
                <span className={`${s.tag} ${s.tagOk}`}>Paid</span>
                <span className={`${s.tag} ${s.tagBad}`}>Overdue</span>
                <span className={`${s.tag} ${s.tagWarn}`}>Due soon</span>
                <span className={`${s.tag} ${s.tagNew}`}>New</span>
                <span className={`${s.tag} ${s.tagDraft}`}>Draft</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className={s.spacing}>
        <p className={s.sec}>Spacing</p>
        <div className={s.steps}>
          {SPACING.map((v) => (
            <div key={v} className={s.step}>
              <span className={s.stepBox} style={{ width: v, height: v }} />
              <p>{v}</p>
            </div>
          ))}
        </div>
        <div className={s.radii}>
          <span className={s.r4} />
          <span className={s.r8} />
          <span className={s.r12} />
          <span className={s.r999} />
          <p>Radius 4 · 8 · 12 · pill</p>
        </div>
      </footer>
    </div>
  );
}
