import { Icon } from '../shared/icons';
import { Phone } from './Phone';
import s from './Fieldbook.module.css';

type StopState = 'done' | 'next' | 'todo';

const STOPS: { time: string; shop: string; area: string; state: StopState; note: string }[] = [
  { time: '09:10', shop: 'Bluebird Foods', area: 'Navrangpura', state: 'done', note: 'Order · ₹ 2,140' },
  { time: '09:55', shop: 'Sunrise Pharmacy', area: 'Paldi', state: 'done', note: 'Order · ₹ 3,980' },
  { time: '10:40', shop: 'Northgate Pharmacy', area: 'Ring Road', state: 'next', note: 'Last order 9 days ago' },
  { time: '11:30', shop: 'Riverside Mart', area: 'Old City Road', state: 'todo', note: '' },
  { time: '12:15', shop: 'Maple Cafe Supplies', area: 'Ellis Bridge', state: 'todo', note: '' },
  { time: '13:00', shop: 'Lotus Kirana', area: 'Maninagar', state: 'todo', note: '' },
];

type Tone = 'violet' | 'peach' | 'mint' | 'sand';
const TONE_BG: Record<Tone, string> = { violet: '#EEE8FF', peach: '#FFEDE3', mint: '#E4F6EF', sand: '#FFF6D9' };
const TONE_INK: Record<Tone, string> = { violet: '#7C52EE', peach: '#E2683A', mint: '#1F9D73', sand: '#C98A10' };

/** Simple product silhouettes, drawn in SVG. */
function Glyph({ kind, tone }: { kind: 'bag' | 'bottle' | 'tin' | 'tub'; tone: Tone }) {
  const ink = TONE_INK[tone];
  const fill = '#ffffff';
  if (kind === 'bag') {
    return (
      <svg viewBox="0 0 80 88" width="58" height="64" aria-hidden="true">
        <path d="M22 22h36l5 58a4 4 0 0 1-4 4H21a4 4 0 0 1-4-4z" fill={ink} />
        <path d="M30 22c0-9 20-9 20 0" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
        <rect x="27" y="44" width="26" height="14" rx="3" fill={fill} opacity="0.92" />
      </svg>
    );
  }
  if (kind === 'bottle') {
    return (
      <svg viewBox="0 0 80 88" width="46" height="66" aria-hidden="true">
        <rect x="32" y="6" width="16" height="12" rx="3" fill={ink} />
        <path d="M26 22h28v54a8 8 0 0 1-8 8H34a8 8 0 0 1-8-8z" fill={ink} />
        <rect x="31" y="44" width="18" height="16" rx="3" fill={fill} opacity="0.92" />
      </svg>
    );
  }
  if (kind === 'tin') {
    return (
      <svg viewBox="0 0 80 88" width="56" height="62" aria-hidden="true">
        <rect x="18" y="12" width="44" height="12" rx="3" fill={ink} />
        <rect x="16" y="24" width="48" height="56" rx="8" fill={ink} />
        <rect x="24" y="40" width="32" height="18" rx="3" fill={fill} opacity="0.92" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 88" width="60" height="50" aria-hidden="true">
      <rect x="10" y="34" width="60" height="36" rx="8" fill={ink} />
      <rect x="6" y="24" width="68" height="12" rx="5" fill={ink} />
      <rect x="22" y="44" width="36" height="14" rx="3" fill={fill} opacity="0.92" />
    </svg>
  );
}

function Tile({ tone, kind, size = 'lg' }: { tone: Tone; kind: 'bag' | 'bottle' | 'tin' | 'tub'; size?: 'lg' | 'sm' }) {
  return (
    <span className={`${s.tile} ${size === 'sm' ? s.tileSm : ''}`} style={{ background: TONE_BG[tone] }}>
      <Glyph kind={kind} tone={tone} />
    </span>
  );
}

function Tabs({ active }: { active: 'route' | 'catalogue' | 'cart' | 'orders' }) {
  const items: { id: typeof active; icon: 'route' | 'grid' | 'bag' | 'receipt'; label: string; badge?: string }[] = [
    { id: 'route', icon: 'route', label: 'Route' },
    { id: 'catalogue', icon: 'grid', label: 'Catalogue' },
    { id: 'cart', icon: 'bag', label: 'Cart', badge: '3' },
    { id: 'orders', icon: 'receipt', label: 'Orders' },
  ];
  return (
    <nav className={s.tabs}>
      {items.map((t) => (
        <span key={t.id} className={`${s.tab} ${t.id === active ? s.tabOn : ''}`}>
          <span className={s.tabIcon}>
            <Icon name={t.icon} size={21} strokeWidth={1.9} />
            {t.badge ? <span className={s.tabBadge}>{t.badge}</span> : null}
          </span>
          {t.label}
        </span>
      ))}
    </nav>
  );
}

function RouteScreen() {
  return (
    <div className={`${s.page} ${s.pageRoute}`}>
      <div className={s.hdr}>
        <div>
          <p className={s.greet}>Good morning, Ravi</p>
          <p className={s.title}>Today&apos;s route</p>
        </div>
        <span className={s.avatar}>RS</span>
      </div>

      <div className={s.chips}>
        <span className={s.chipOk}>
          <Icon name="check" size={13} strokeWidth={2.4} /> 2 done
        </span>
        <span className={s.chip}>4 stops left</span>
        <span className={s.chipOffline}>Offline ready</span>
      </div>
      <div className={s.progress}>
        <span style={{ width: '33%' }} />
      </div>

      <ol className={s.stops}>
        {STOPS.map((st) => (
          <li key={st.shop} className={`${s.stop} ${s[`stop_${st.state}`]}`}>
            <span className={s.time}>{st.time}</span>
            <span className={s.rail}>
              <span className={s.node} />
            </span>
            <div className={s.stopBody}>
              <p className={s.shop}>{st.shop}</p>
              <p className={s.area}>{st.area}</p>
              {st.state === 'next' ? (
                <div className={s.nextCard}>
                  <p>{st.note}</p>
                  <span className={s.startBtn}>Start visit</span>
                </div>
              ) : st.note ? (
                <p className={s.note}>{st.note}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <Tabs active="route" />
    </div>
  );
}

function CatalogueScreen() {
  const products: { name: string; pack: string; price: string; tone: Tone; kind: 'bag' | 'bottle' | 'tin' | 'tub'; qty?: number }[] = [
    { name: 'Basmati Rice Gold', pack: '5 kg bag', price: '570', tone: 'sand', kind: 'bag', qty: 2 },
    { name: 'Sunflower Oil', pack: '1 L bottle', price: '420', tone: 'sand', kind: 'bottle' },
    { name: 'Garam Masala', pack: '100 g pack', price: '479', tone: 'peach', kind: 'tin', qty: 1 },
    { name: 'Desi Ghee', pack: '500 ml jar', price: '880', tone: 'mint', kind: 'tub' },
  ];
  return (
    <div className={s.page}>
      <div className={s.hdr}>
        <p className={s.title}>Catalogue</p>
        <span className={s.iconBtn}>
          <Icon name="sliders" size={17} />
        </span>
      </div>

      <div className={s.search}>
        <Icon name="search" size={17} />
        <span>Search 480 products</span>
      </div>

      <div className={s.cats}>
        <span className={s.catOn}>All</span>
        <span>Rice</span>
        <span>Oil</span>
        <span>Spices</span>
        <span>Snacks</span>
      </div>

      <div className={s.banner}>
        <div>
          <p className={s.bannerTitle}>Reorder last visit</p>
          <p className={s.bannerSub}>Sunrise Pharmacy · 9 items</p>
        </div>
        <span className={s.bannerBtn}>Reorder</span>
      </div>

      <div className={s.grid}>
        {products.map((p) => (
          <div key={p.name} className={s.card}>
            <Tile tone={p.tone} kind={p.kind} />
            <p className={s.pName}>{p.name}</p>
            <p className={s.pPack}>{p.pack}</p>
            <div className={s.pFoot}>
              <p className={s.pPrice}>₹ {p.price}</p>
              {p.qty ? (
                <span className={s.stepper}>
                  <span>−</span>
                  <b>{p.qty}</b>
                  <span>+</span>
                </span>
              ) : (
                <span className={s.add}>Add</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={s.fade} />
      <Tabs active="catalogue" />
    </div>
  );
}

function CartScreen() {
  const lines: { name: string; each: string; qty: number; total: string; tone: Tone; kind: 'bag' | 'bottle' | 'tub' }[] = [
    { name: 'Basmati Rice Gold', each: '5 kg bag · ₹ 570 each', qty: 2, total: '1,140', tone: 'sand', kind: 'bag' },
    { name: 'Sunflower Oil', each: '1 L bottle · ₹ 420 each', qty: 6, total: '2,520', tone: 'sand', kind: 'bottle' },
    { name: 'Desi Ghee', each: '500 ml jar · ₹ 880 each', qty: 2, total: '1,760', tone: 'mint', kind: 'tub' },
  ];
  return (
    <div className={`${s.page} ${s.pageCart}`}>
      <div className={s.hdr}>
        <span className={s.iconBtn}>
          <Icon name="chevron-left" size={18} />
        </span>
        <p className={s.titleCenter}>Cart</p>
        <span className={s.clear}>Clear</span>
      </div>

      <div className={s.shopCard}>
        <div>
          <p className={s.shopName}>Sunrise Pharmacy</p>
          <p className={s.shopMeta}>Stop 2 · Paldi</p>
        </div>
        <span className={s.saved}>
          <Icon name="check" size={13} strokeWidth={2.4} />
          Saved on this device
        </span>
      </div>

      <div className={s.lines}>
        {lines.map((l) => (
          <div key={l.name} className={s.line}>
            <Tile tone={l.tone} kind={l.kind} size="sm" />
            <div className={s.lineBody}>
              <p className={s.pName}>{l.name}</p>
              <p className={s.pPack}>{l.each}</p>
              <span className={s.stepperSm}>
                <span>−</span>
                <b>{l.qty}</b>
                <span>+</span>
              </span>
            </div>
            <p className={s.lineTotal}>₹ {l.total}</p>
          </div>
        ))}
      </div>

      <div className={s.noteField}>Delivery note (optional)</div>

      <div className={s.summary}>
        <div className={s.sRow}>
          <span>Subtotal</span>
          <span>₹ 5,420</span>
        </div>
        <div className={s.sRow}>
          <span>GST 5%</span>
          <span>₹ 271</span>
        </div>
        <div className={`${s.sRow} ${s.sTotal}`}>
          <span>Total</span>
          <span>₹ 5,691</span>
        </div>
      </div>

      <div className={s.placeWrap}>
        <span className={s.place}>
          Place order · ₹ 5,691
          <Icon name="arrow" size={18} strokeWidth={2} />
        </span>
        <p className={s.placeNote}>Sends automatically when you are back online.</p>
      </div>
    </div>
  );
}

export function Fieldbook() {
  return (
    <div className={s.root} aria-hidden="true">
      <Phone>
        <RouteScreen />
      </Phone>
      <Phone>
        <CatalogueScreen />
      </Phone>
      <Phone>
        <CartScreen />
      </Phone>
    </div>
  );
}
