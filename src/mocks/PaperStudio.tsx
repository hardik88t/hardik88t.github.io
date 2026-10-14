import { Icon } from '../shared/icons';
import s from './PaperStudio.module.css';

const QUESTIONS: { n: number; topic: string; marks: number; text: string; diff: 1 | 2 | 3; sel?: boolean }[] = [
  { n: 1, topic: 'Algebra', marks: 4, text: 'Solve 2x² − 5x − 3 = 0 by factorisation.', diff: 2 },
  { n: 2, topic: 'Algebra', marks: 2, text: 'Find the common difference of the AP 7, 13, 19, …', diff: 1, sel: true },
  { n: 3, topic: 'Trigonometry', marks: 4, text: 'Prove that (1 + tan²θ) cos²θ = 1.', diff: 2 },
  { n: 4, topic: 'Geometry', marks: 6, text: 'A sector of a circle of radius 7 cm subtends 60° at the centre. Find its area.', diff: 3 },
  { n: 5, topic: 'Statistics', marks: 3, text: 'Find the median of 12, 15, 9, 21, 18, 14.', diff: 2 },
];

/** Typeset fraction as it appears on the printed page. */
function Frac({ top, bottom }: { top: string; bottom: string }) {
  return (
    <span className={s.frac}>
      <span>{top}</span>
      <span>{bottom}</span>
    </span>
  );
}

function Paper() {
  return (
    <div className={s.page}>
      <p className={s.school}>GREENFIELD PUBLIC SCHOOL</p>
      <p className={s.exam}>Mid-Term Examination 2 · 2026–27</p>

      <div className={s.metaRow}>
        <span>Subject: Mathematics</span>
        <span>Class: X</span>
        <span>Time: 90 minutes</span>
      </div>
      <div className={s.rule} />
      <div className={s.rule2} />

      <div className={s.fields}>
        <span className={s.field}>
          Name <span className={s.line} style={{ width: 300 }} />
        </span>
        <span className={s.field}>
          Roll no. <span className={s.line} style={{ width: 120 }} />
        </span>
      </div>

      <p className={s.instr}>
        General instructions: (i) All questions are compulsory. (ii) Marks for each question are shown in brackets. Maximum marks: 80.
      </p>

      <p className={s.sec}>Section A</p>

      <div className={s.pq}>
        <span className={s.qn}>1.</span>
        <span>
          Solve <span className={s.v}>2x</span>
          <sup>2</sup> − 5<span className={s.v}>x</span> − 3 = 0 by factorisation.
        </span>
        <span className={s.qm}>[4]</span>
      </div>

      <div className={s.pq}>
        <span className={s.qn}>2.</span>
        <span>Find the common difference of the AP 7, 13, 19, …</span>
        <span className={s.qm}>[2]</span>
      </div>

      <div className={s.pq}>
        <span className={s.qn}>3.</span>
        <span>
          Prove that (1 + tan<sup>2</sup>θ) cos<sup>2</sup>θ = 1.
        </span>
        <span className={s.qm}>[4]</span>
      </div>

      <div className={s.pq}>
        <span className={s.qn}>4.</span>
        <span>
          A sector of a circle of radius 7 cm subtends 60° at the centre. Find its area. (Use π = <Frac top="22" bottom="7" />)
        </span>
        <span className={s.qm}>[6]</span>
      </div>

      <div className={s.pq}>
        <span className={s.qn}>5.</span>
        <span>Find the median of 12, 15, 9, 21, 18, 14.</span>
        <span className={s.qm}>[3]</span>
      </div>

      <div className={s.pq}>
        <span className={s.qn}>6.</span>
        <span>
          If sin θ = <Frac top="3" bottom="5" />, find the value of cos θ.
        </span>
        <span className={s.qm}>[1]</span>
      </div>

      <div className={s.opts}>
        <span>(a) <Frac top="4" bottom="5" /></span>
        <span>(b) <Frac top="3" bottom="4" /></span>
        <span>(c) <Frac top="5" bottom="3" /></span>
        <span>(d) <Frac top="4" bottom="3" /></span>
      </div>

      <p className={s.sec}>Section B</p>

      <div className={s.pq}>
        <span className={s.qn}>7.</span>
        <span>Draw the graph of y = 2x − 3 for x from −2 to 4, and read off the x-intercept.</span>
        <span className={s.qm}>[4]</span>
      </div>
      <div className={s.ruled}>
        <i />
        <i />
        <i />
        <i />
      </div>

      <div className={s.pq}>
        <span className={s.qn}>8.</span>
        <span>A cone has base radius 7 cm and height 24 cm. Find its slant height and curved surface area.</span>
        <span className={s.qm}>[6]</span>
      </div>
      <div className={s.ruled}>
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>

      <div className={s.footer}>
        <span>Mathematics · Mid-Term 2</span>
        <span>Page 1 of 6</span>
      </div>
    </div>
  );
}

export function PaperStudio() {
  return (
    <div className={s.root} aria-hidden="true">
      <header className={s.top}>
        <span className={s.back}>
          <Icon name="chevron-left" size={16} />
        </span>
        <div className={s.docMeta}>
          <p className={s.docTitle}>Mid-Term 2 · Mathematics · Class X</p>
          <p className={s.docSub}>Saved 2 min ago</p>
        </div>
        <span className={s.draft}>Draft v3</span>
        <span className={s.spacer} />
        <span className={s.ghost}>Answer key</span>
        <span className={s.ghost}>
          <Icon name="download" size={15} />
          Export PDF
        </span>
        <span className={s.aiBtn}>
          <Icon name="sparkle" size={15} strokeWidth={2} />
          AI draft
        </span>
      </header>

      <div className={s.body}>
        <aside className={s.list}>
          <div className={s.listHead}>
            <p>Question bank</p>
            <span>84 questions</span>
          </div>
          <div className={s.search}>
            <Icon name="search" size={15} />
            <span>Search by topic or text</span>
          </div>
          <div className={s.filters}>
            <span className={s.fOn}>All</span>
            <span>Algebra</span>
            <span>Geometry</span>
            <span>Trigonometry</span>
          </div>

          <div className={s.summary}>
            <p>
              <b>In this paper</b>
            </p>
            <p className={s.sumText}>8 questions · 80 marks</p>
          </div>

          {QUESTIONS.map((q) => (
            <div key={q.n} className={`${s.q} ${q.sel ? s.qSel : ''}`}>
              <div className={s.qTop}>
                <span className={s.qNum}>Q{q.n}</span>
                <span className={s.qTopic}>{q.topic}</span>
                <span className={s.qMarks}>{q.marks} marks</span>
                <span className={s.grip} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <p className={s.qText}>{q.text}</p>
              <div className={s.qBottom}>
                <span>Short answer</span>
                <span className={s.diff} aria-label={`Difficulty ${q.diff} of 3`}>
                  {[1, 2, 3].map((d) => (
                    <i key={d} className={d <= q.diff ? s.dOn : ''} />
                  ))}
                </span>
              </div>
            </div>
          ))}
        </aside>

        <section className={s.preview}>
          <div className={s.pvBar}>
            <span className={s.pvLabel}>A4 · Portrait</span>
            <span className={s.zoom}>
              <span>−</span>
              <b>62%</b>
              <span>+</span>
            </span>
            <span className={s.pvLabel}>Page 1 of 6</span>
          </div>
          <div className={s.stageWrap}>
            <div className={s.pageScale}>
              <Paper />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
