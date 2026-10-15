import { Icon } from '../shared/icons';
import s from './Footnote.module.css';

function Cite({ n }: { n: number }) {
  return <sup className={s.cite}>{n}</sup>;
}

function Sidebar() {
  return (
    <aside className={s.side}>
      <div className={s.brand}>
        <span className={s.mark}>F</span>
        <span className={s.brandName}>Footnote</span>
      </div>

      <div className={s.newChat}>
        <Icon name="plus" size={15} strokeWidth={2.2} />
        New chat
      </div>

      <p className={s.label}>Library</p>
      <div className={s.folder}>
        <Icon name="chevron-down" size={14} />
        <span>Q3 market research</span>
      </div>
      <div className={s.doc}>
        <Icon name="file" size={15} />
        <span>Annual report 2025.pdf</span>
      </div>
      <div className={`${s.doc} ${s.docOn}`}>
        <Icon name="file" size={15} />
        <span>Customer interviews.docx</span>
      </div>
      <div className={s.doc}>
        <Icon name="file" size={15} />
        <span>Pricing memo.md</span>
      </div>
      <div className={s.folder}>
        <Icon name="chevron-right" size={14} />
        <span>Board notes</span>
      </div>

      <p className={s.label}>Recent</p>
      <p className={`${s.recent} ${s.recentOn}`}>Churn in the SMB segment</p>
      <p className={s.recent}>Pricing options</p>
      <p className={s.recent}>Onboarding funnel</p>

      <div className={s.me}>
        <span className={s.avatar}>PS</span>
        <div>
          <p className={s.meName}>Priya Shah</p>
          <p className={s.meRole}>Research lead</p>
        </div>
      </div>
    </aside>
  );
}

function Chat() {
  return (
    <section className={s.chat}>
      <header className={s.chatHead}>
        <p className={s.chatTitle}>Churn in the SMB segment</p>
        <span className={s.docCount}>
          <Icon name="file" size={13} />
          3 documents
        </span>
        <span className={s.spacer} />
        <span className={s.iconBtn}>
          <Icon name="link" size={15} />
        </span>
        <span className={s.iconBtn}>
          <Icon name="more" size={15} />
        </span>
      </header>

      <div className={s.thread}>
        <div className={s.userMsg}>What drove churn in the SMB segment last quarter?</div>

        <div className={s.answer}>
          <span className={s.aMark}>F</span>
          <div className={s.aBody}>
            <p className={s.aText}>
              SMB churn rose to 6.8% in Q2, mostly from onboarding drop-off.
              <Cite n={1} /> Accounts that did not connect a payment source within seven days were three times more likely to cancel.
              <Cite n={2} /> In interviews, setup effort came up more often than price.
              <Cite n={3} />
            </p>
            <p className={s.aMeta}>Answered from 3 passages in 2 documents</p>
          </div>
        </div>

        <div className={`${s.userMsg} ${s.userMsgGap}`}>Which plan is affected most?</div>

        <div className={s.answer}>
          <span className={s.aMark}>F</span>
          <div className={s.aBody}>
            <p className={s.aText}>
              Starter plan accounts churned at 9.1%, while Growth stayed under 4%.
              <Cite n={3} />
            </p>
            <p className={s.aMeta}>Answered from 1 passage in 1 document</p>

            <div className={s.followUps}>
              <span>Compare with Q1 churn</span>
              <span>Show the interview quotes</span>
              <span>Summarise for the board</span>
            </div>
          </div>
        </div>
      </div>

      <div className={s.composer}>
        <div className={s.input}>
          <span className={s.placeholder}>Ask about your documents</span>
          <span className={s.send}>
            <Icon name="send" size={15} strokeWidth={2} />
          </span>
        </div>
        <p className={s.hint}>Every answer cites the passages it comes from.</p>
      </div>
    </section>
  );
}

function Sources() {
  return (
    <aside className={s.sources}>
      <div className={s.srcHead}>
        <p className={s.srcTitle}>Sources</p>
        <span className={s.srcCount}>3 of 3</span>
      </div>

      <div className={s.viewer}>
        <div className={s.vHead}>
          <p className={s.vName}>Customer interviews.docx</p>
          <p className={s.vPage}>Page 4 of 11</p>
        </div>

        <div className={s.vBody}>
          <p className={s.vMeta}>Interview 7 · Owner, 12 staff · Trial in SMB plan</p>
          <p className={s.vPara}>
            <mark className={s.hl}>
              “I signed up on a Tuesday, but I never connected the bank feed. By day six I had forgotten the product existed.”
            </mark>
            <span className={s.chipRef}>2</span>
          </p>
          <p className={s.vPara}>“Setting it up felt like homework, so I left it for later. Price was never the problem.”</p>

          <p className={s.vMeta}>Interview 8 · Founder, 4 staff</p>
          <p className={s.vPara}>“We paid for the plan before we understood the reports, so we stopped looking at them.”</p>
        </div>
      </div>

      <p className={s.srcListLabel}>Also cited</p>
      <div className={s.srcRow}>
        <span className={s.srcNum}>1</span>
        <div>
          <p className={s.srcName}>Annual report 2025.pdf</p>
          <p className={s.srcPage}>Page 14 · Retention table</p>
        </div>
        <Icon name="chevron-right" size={16} />
      </div>
      <div className={s.srcRow}>
        <span className={s.srcNum}>3</span>
        <div>
          <p className={s.srcName}>Pricing memo.md</p>
          <p className={s.srcPage}>Section 2 · Plan changes</p>
        </div>
        <Icon name="chevron-right" size={16} />
      </div>
    </aside>
  );
}

export function Footnote() {
  return (
    <div className={s.root} aria-hidden="true">
      <Sidebar />
      <Chat />
      <Sources />
    </div>
  );
}
