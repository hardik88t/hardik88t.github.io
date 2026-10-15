import { Icon, type IconName } from '../shared/icons';
import s from './WholesaleOS.module.css';

const NAV: { icon: IconName; label: string; count?: string; on?: boolean }[] = [
  { icon: 'grid', label: 'Overview' },
  { icon: 'box', label: 'Orders', count: '24', on: true },
  { icon: 'users', label: 'Customers' },
  { icon: 'layers', label: 'Stock', count: '3' },
  { icon: 'file', label: 'Invoices' },
  { icon: 'route', label: 'Routes' },
  { icon: 'calendar', label: 'Dispatch' },
];

const ORDERS: { id: string; customer: string; items: number; total: string; status: string; tone: string; updated: string; sel?: boolean }[] = [
  { id: 'WO-10482', customer: 'Northgate Pharmacy', items: 14, total: '38,240', status: 'Packed', tone: 'packed', updated: '09:14' },
  { id: 'WO-10481', customer: 'Green Basket Grocers', items: 6, total: '12,760', status: 'Confirmed', tone: 'confirmed', updated: '08:52' },
  { id: 'WO-10479', customer: 'Lotus Kirana', items: 22, total: '61,090', status: 'Awaiting stock', tone: 'awaiting', updated: 'Yesterday' },
  { id: 'WO-10477', customer: 'Maple Cafe Supplies', items: 9, total: '18,430', status: 'Invoiced', tone: 'invoiced', updated: 'Yesterday', sel: true },
  { id: 'WO-10474', customer: 'Riverside Mart', items: 31, total: '1,04,600', status: 'Delivered', tone: 'delivered', updated: '12 Oct' },
  { id: 'WO-10472', customer: 'Shanti Stores', items: 4, total: '6,120', status: 'Confirmed', tone: 'confirmed', updated: '12 Oct' },
  { id: 'WO-10470', customer: 'Bluebird Foods', items: 12, total: '27,880', status: 'Packed', tone: 'packed', updated: '11 Oct' },
];

const STOCK: { name: string; qty: number; par: number; unit: string; tone: 'crit' | 'low' | 'ok' }[] = [
  { name: 'Basmati rice 5 kg', qty: 42, par: 120, unit: 'bags', tone: 'crit' },
  { name: 'Sunflower oil 1 L', qty: 96, par: 200, unit: 'bottles', tone: 'low' },
  { name: 'Garam masala 100 g', qty: 18, par: 80, unit: 'packs', tone: 'crit' },
  { name: 'Ghee 500 ml', qty: 260, par: 150, unit: 'jars', tone: 'ok' },
];

const LINES: { item: string; qty: number; amount: string }[] = [
  { item: 'Basmati rice 5 kg', qty: 12, amount: '6,840' },
  { item: 'Sunflower oil 1 L', qty: 8, amount: '3,360' },
  { item: 'Ghee 500 ml', qty: 4, amount: '3,520' },
  { item: 'Garam masala 100 g', qty: 8, amount: '3,832' },
];

export function WholesaleOS() {
  return (
    <div className={s.root} aria-hidden="true">
      <aside className={s.side}>
        <div className={s.brand}>
          <span className={s.brandMark}>
            <Icon name="layers" size={17} strokeWidth={2} />
          </span>
          <div>
            <p className={s.brandName}>Wholesale OS</p>
            <p className={s.brandSub}>Northline Foods</p>
          </div>
        </div>

        <p className={s.navLabel}>Operations</p>
        {NAV.map((n) => (
          <div key={n.label} className={`${s.nav} ${n.on ? s.navOn : ''}`}>
            <Icon name={n.icon} size={16} />
            <span>{n.label}</span>
            {n.count ? <span className={s.badge}>{n.count}</span> : null}
          </div>
        ))}

        <div className={s.me}>
          <span className={s.avatar}>AP</span>
          <div>
            <p className={s.meName}>Asha Patel</p>
            <p className={s.meRole}>Office manager</p>
          </div>
        </div>
      </aside>

      <section className={s.main}>
        <div className={s.top}>
          <div className={s.search}>
            <Icon name="search" size={15} />
            <span>Search orders, customers, SKUs</span>
            <span className={s.kbd}>⌘K</span>
          </div>
          <span className={s.spacer} />
          <span className={s.iconBtn}>
            <Icon name="bell" size={16} />
          </span>
          <span className={s.primary}>
            <Icon name="plus" size={15} strokeWidth={2.2} />
            New order
          </span>
        </div>

        <div className={s.pageHead}>
          <div>
            <p className={s.h1}>Orders</p>
            <p className={s.sub}>Tuesday, 14 October 2026 · 38 open</p>
          </div>
          <div className={s.seg}>
            <span className={s.segOn}>Today</span>
            <span>This week</span>
            <span>All</span>
          </div>
        </div>

        <div className={s.kpis}>
          <div className={s.kpi}>
            <p className={s.kLabel}>Open orders</p>
            <p className={s.kValue}>38</p>
            <p className={s.kDelta}>+6 since 9 am</p>
          </div>
          <div className={s.kpi}>
            <p className={s.kLabel}>Awaiting stock</p>
            <p className={s.kValue}>7</p>
            <p className={`${s.kDelta} ${s.kWarn}`}>3 SKUs short</p>
          </div>
          <div className={s.kpi}>
            <p className={s.kLabel}>To dispatch</p>
            <p className={s.kValue}>12</p>
            <p className={s.kMuted}>4 routes today</p>
          </div>
          <div className={s.kpi}>
            <p className={s.kLabel}>Invoices due</p>
            <p className={s.kValue}>₹ 4,82,400</p>
            <p className={`${s.kDelta} ${s.kBad}`}>3 overdue</p>
          </div>
        </div>

        <div className={s.stock}>
          <div className={s.stockHead}>
            <p className={s.stockTitle}>Stock levels</p>
            <p className={s.link}>View all</p>
          </div>
          <div className={s.stockGrid}>
            {STOCK.map((k) => {
              const pct = Math.min(100, Math.round((k.qty / k.par) * 100));
              return (
                <div key={k.name} className={s.sku}>
                  <p className={s.skuName}>{k.name}</p>
                  <p className={s.skuQty}>
                    {k.qty} of {k.par} {k.unit}
                  </p>
                  <div className={`${s.bar} ${s[k.tone]}`}>
                    <span className={s.fill} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={s.orders}>
          <div className={`${s.row} ${s.head}`}>
            <span>Order</span>
            <span>Customer</span>
            <span className={s.num}>Items</span>
            <span className={s.num}>Total ₹</span>
            <span>Status</span>
            <span className={s.num}>Updated</span>
          </div>
          {ORDERS.map((o) => (
            <div key={o.id} className={`${s.row} ${o.sel ? s.sel : ''}`}>
              <span className={s.id}>{o.id}</span>
              <span className={s.cust}>{o.customer}</span>
              <span className={s.num}>{o.items}</span>
              <span className={s.num}>{o.total}</span>
              <span>
                <span className={`${s.pill} ${s[`p_${o.tone}`]}`}>{o.status}</span>
              </span>
              <span className={`${s.num} ${s.muted}`}>{o.updated}</span>
            </div>
          ))}
        </div>
      </section>

      <aside className={s.drawer}>
        <div className={s.dHead}>
          <div>
            <p className={s.dLabel}>Invoice</p>
            <p className={s.dTitle}>INV-2411</p>
          </div>
          <span className={s.iconBtn}>
            <Icon name="close" size={15} />
          </span>
        </div>
        <span className={`${s.pill} ${s.p_awaiting} ${s.dStatus}`}>Unpaid · due 28 Oct</span>

        <div className={s.dCust}>
          <p className={s.cName}>Maple Cafe Supplies</p>
          <p className={s.cAddr}>Plot 14, Industrial Estate, Vadodara</p>
          <p className={s.cAddr}>From order WO-10477 · 9 items</p>
        </div>

        <div className={s.lines}>
          <div className={`${s.lineRow} ${s.lineHead}`}>
            <span>Item</span>
            <span className={s.num}>Qty</span>
            <span className={s.num}>Amount</span>
          </div>
          {LINES.map((l) => (
            <div key={l.item} className={s.lineRow}>
              <span>{l.item}</span>
              <span className={s.num}>{l.qty}</span>
              <span className={s.num}>{l.amount}</span>
            </div>
          ))}
        </div>

        <div className={s.totals}>
          <div className={s.tRow}>
            <span>Subtotal</span>
            <span className={s.num}>17,552</span>
          </div>
          <div className={s.tRow}>
            <span>GST 5%</span>
            <span className={s.num}>878</span>
          </div>
          <div className={`${s.tRow} ${s.tTotal}`}>
            <span>Balance due</span>
            <span className={s.num}>₹ 18,430</span>
          </div>
        </div>

        <div className={s.dates}>
          <div>
            <p className={s.dLabel}>Issued</p>
            <p className={s.dVal}>14 Oct 2026</p>
          </div>
          <div>
            <p className={s.dLabel}>Due</p>
            <p className={s.dVal}>28 Oct 2026</p>
          </div>
        </div>

        <div className={s.activity}>
          <p>
            <span className={s.dot} />
            Invoice sent to office email · 10:02
          </p>
          <p>
            <span className={s.dot} />
            Reminder scheduled for 21 Oct
          </p>
        </div>

        <div className={s.dActions}>
          <span className={s.dPrimary}>
            <Icon name="send" size={15} />
            Send to customer
          </span>
          <div className={s.dRow}>
            <span className={s.dSecondary}>Record payment</span>
            <span className={s.iconBtn}>
              <Icon name="download" size={16} />
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
