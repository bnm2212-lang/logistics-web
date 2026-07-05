import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Coffee,
  FileText,
  History,
  Home,
  Info,
  LineChart,
  MessageSquare,
  Newspaper,
  PackageCheck,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
  Trash2,
  Truck,
} from 'lucide-react';
import './styles.css';

const inventoryItems = [
  { id: 'MILK-01', name: '우유', category: '유제품', supplier: '서울 데일리팜', currentStock: 10, requiredStock: 34, unit: 'L', unitCost: 2600, psi: 37, dailySalesChange: 22, weeklyConsumption: 126, forecastSales: 52, actualSales: 44, stockoutHours: 7, leadTimeHours: 18, reason: '토요일, 비 예보, 관광객 증가 사례가 겹쳐 라떼류 수요가 커집니다.' },
  { id: 'BEAN-01', name: '원두', category: '커피', supplier: '로스터리 362', currentStock: 27, requiredStock: 38, unit: 'kg', unitCost: 18000, psi: 67, dailySalesChange: 16, weeklyConsumption: 84, forecastSales: 35, actualSales: 32, stockoutHours: 22, leadTimeHours: 30, reason: '이번 주 원두 소비량이 16% 증가했고 주말 매출 패턴이 강합니다.' },
  { id: 'CUP-01', name: '테이크아웃컵', category: '소모품', supplier: '카페 사장마켓', currentStock: 420, requiredStock: 580, unit: '개', unitCost: 95, psi: 46, dailySalesChange: 12, weeklyConsumption: 860, forecastSales: 510, actualSales: 486, stockoutHours: 11, leadTimeHours: 12, reason: '기관 방문 및 관광객 증가 시 테이크아웃 비중이 상승합니다.' },
  { id: 'ICE-01', name: '얼음', category: '냉동', supplier: '쿨체인 새벽배송', currentStock: 12, requiredStock: 28, unit: '봉', unitCost: 2100, psi: 44, dailySalesChange: 26, weeklyConsumption: 92, forecastSales: 31, actualSales: 24, stockoutHours: 6, leadTimeHours: 8, reason: '31도 흐림 예보에도 아이스 음료 수요가 높게 예측됩니다.' },
  { id: 'SYRUP-01', name: '바닐라시럽', category: '시럽', supplier: '모닌 코리아', currentStock: 9, requiredStock: 22, unit: '병', unitCost: 7200, psi: 48, dailySalesChange: 21, weeklyConsumption: 58, forecastSales: 27, actualSales: 21, stockoutHours: 13, leadTimeHours: 24, reason: '신메뉴 판매와 라떼류 증가로 안전재고를 올려야 합니다.' },
  { id: 'STRAW-01', name: '빨대', category: '소모품', supplier: '카페 사장마켓', currentStock: 900, requiredStock: 1100, unit: '개', unitCost: 18, psi: 74, dailySalesChange: 7, weeklyConsumption: 1200, forecastSales: 650, actualSales: 612, stockoutHours: 36, leadTimeHours: 12, reason: '아이스 음료 판매 증가로 소모 속도가 평소보다 빠릅니다.' },
  { id: 'WATER-01', name: '생수', category: '음료', supplier: '익산 로컬푸드', currentStock: 34, requiredStock: 50, unit: '병', unitCost: 540, psi: 82, dailySalesChange: 3, weeklyConsumption: 120, forecastSales: 38, actualSales: 37, stockoutHours: 72, leadTimeHours: 10, reason: '행사일 보조 판매 품목이지만 현재는 안정권입니다.' },
];

const trendData = [
  { label: '월', consumption: 82, forecast: 88, actual: 84, psi: 76, waste: 13 },
  { label: '화', consumption: 89, forecast: 91, actual: 90, psi: 72, waste: 12 },
  { label: '수', consumption: 96, forecast: 98, actual: 101, psi: 66, waste: 10 },
  { label: '목', consumption: 108, forecast: 112, actual: 109, psi: 61, waste: 9 },
  { label: '금', consumption: 126, forecast: 132, actual: 124, psi: 54, waste: 8 },
  { label: '토', consumption: 142, forecast: 149, actual: 145, psi: 49, waste: 7 },
  { label: '일', consumption: 137, forecast: 141, actual: 139, psi: 52, waste: 6 },
];

const operationVariables = {
  day: '토요일',
  weather: '흐림',
  temperature: '31도',
  rainChance: '45%',
  similarDay: '과거 토요일 평균 매출 +18%',
  similarWeather: '흐림/고온일 아이스 음료 +14%',
  similarEvent: '7월 관광객 증가 및 기관 방문 사례 존재',
  recommendation: '우유 +8%, 컵 +12% 추천 발주',
};

const eventSeed = [
  { id: 1, date: '2026.06.03', title: '전국동시지방선거', type: '선거', region: '익산', store: '카페362 익산점', visitors: '약 3000명', salesChange: '오후 매출 +24%', volumeChange: '아이스음료 +31%', items: '아메리카노, 생수, 컵, 빨대', memo: '투표소 이동 인구와 관광객이 함께 증가', image: '첨부됨', ai: true },
  { id: 2, date: '2026.07.04', title: '익산시장 및 국무총리 방문', type: '공공기관 방문', region: '익산', store: '카페362 익산점', visitors: '기관 방문객 집중', salesChange: '오전 매출 +35%', volumeChange: '테이크아웃 +28%', items: '아메리카노, 라떼, 테이크아웃컵', memo: '오늘과 유사한 오전 집중 패턴', image: '없음', ai: true },
  { id: 3, date: '2026.07.27', title: '유튜브 풍향중 촬영', type: '방송촬영', region: '익산 미륵사지', store: '카페362 익산점', visitors: '관광객 증가', salesChange: '주말 매출 +29%', volumeChange: '아이스음료 +34%', items: '우유, 얼음, 컵', memo: '유재석, 지석진, 양세찬 촬영 이슈', image: '첨부됨', ai: true },
];

const communitySeed = [
  { id: 1, category: '발주 고민', title: '주말 비 예보인데 우유를 얼마나 더 잡으세요?', author: '익산 사장님', region: '익산', views: 421, comments: 18, likes: 44, time: '12분 전', tags: ['우유', '주말'], badge: '발주왕', accepted: false, useful: 9, meToo: 12 },
  { id: 2, category: '재고관리', title: '컵은 행사 전날 몇 퍼센트 올려두는 게 좋나요?', author: '커피장인', region: '전주', views: 300, comments: 25, likes: 38, time: '1시간 전', tags: ['컵', '행사'], badge: '재고관리 고수', accepted: true, useful: 15, meToo: 8 },
  { id: 3, category: '지역 정보', title: '이번 주 미륵사지 관광객이 많이 늘었습니다', author: '베타테스터', region: '익산', views: 188, comments: 7, likes: 21, time: '3시간 전', tags: ['관광객', '익산'], badge: '익산 사장님', accepted: false, useful: 6, meToo: 19 },
];

const issueSeed = [
  {
    id: 1,
    category: '원두 가격',
    title: '브라질 산지 가격 변동성 확대',
    summary: '다음 달 원두 매입 단가가 5~8% 오를 가능성이 있습니다.',
    detail: '브라질 주요 산지의 건조한 날씨와 물류비 상승이 겹치며 생두 가격 변동성이 커졌습니다. 원두 소진 속도가 빠른 매장은 2주치 안전재고를 먼저 확보하는 전략이 유효합니다.',
    items: '원두',
    impact: '원가 상승',
    date: '2026.07.03',
    source: '사용자 등록 · 커피 시세 메모',
    sourceUrl: 'https://www.ico.org/',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
    ai: true,
  },
  {
    id: 2,
    category: '기상',
    title: '주말 고온 다습 예보',
    summary: '아이스 음료와 얼음 소모가 평소보다 증가할 수 있습니다.',
    detail: '31도 안팎의 흐림 날씨와 높은 습도로 체감온도가 올라갈 가능성이 있습니다. 얼음, 컵, 빨대, 우유의 동시 소모가 늘 수 있어 AI 발주 추천에 반영됩니다.',
    items: '얼음, 컵, 빨대',
    impact: '판매량 증가',
    date: '2026.07.04',
    source: '사용자 등록 · 기상 관찰',
    sourceUrl: 'https://www.weather.go.kr/',
    imageUrl: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80',
    ai: true,
  },
  {
    id: 3,
    category: '소상공인 정책',
    title: '지역 상권 활성화 행사 지원',
    summary: '익산 중심 상권 방문객 증가가 예상됩니다.',
    detail: '지역 상권 행사와 공공기관 방문 일정이 겹치면 오전 테이크아웃 매출이 먼저 반응하는 경향이 있습니다. 관련 품목은 아메리카노, 생수, 컵입니다.',
    items: '아메리카노, 생수',
    impact: '방문객 증가',
    date: '2026.07.02',
    source: '사용자 등록 · 지역 정책 메모',
    sourceUrl: 'https://www.sbiz.or.kr/',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    ai: false,
  },
];

const productRecipes = [
  { id: 1, product: '아메리카노', price: 4500, recipe: [{ name: '원두', amount: '18g' }, { name: '컵', amount: '1개' }, { name: '뚜껑', amount: '1개' }, { name: '빨대', amount: '1개' }], note: '판매 시 자동 차감' },
  { id: 2, product: '카페라떼', price: 5200, recipe: [{ name: '원두', amount: '18g' }, { name: '우유', amount: '220ml' }, { name: '컵', amount: '1개' }, { name: '뚜껑', amount: '1개' }], note: '우유 PSI에 즉시 반영' },
  { id: 3, product: '바닐라라떼', price: 5800, recipe: [{ name: '원두', amount: '18g' }, { name: '우유', amount: '210ml' }, { name: '바닐라시럽', amount: '25ml' }, { name: '컵', amount: '1개' }], note: '시럽 안전재고 반영' },
];

const menus = [
  { key: 'analysis', label: 'AI 분석', icon: Sparkles },
  { key: 'forecast', label: 'AI 예측', icon: LineChart },
  { key: 'orders', label: 'AI 발주', icon: Truck },
  { key: 'cart', label: '발주 장바구니', icon: ShoppingCart },
  { key: 'history', label: '발주 내역', icon: History },
  { key: 'inventory', label: '재고관리', icon: Boxes },
  { key: 'products', label: '제품관리', icon: PackageCheck },
  { key: 'events', label: '특이사항 아카이브', icon: CalendarDays },
  { key: 'community', label: '사장님 커뮤니티', icon: MessageSquare },
  { key: 'issues', label: '커피 이슈', icon: Newspaper },
  { key: 'reports', label: 'AI 리포트', icon: ClipboardList },
  { key: 'settings', label: '설정', icon: Settings },
];

function numberFormat(value) {
  return Number(value || 0).toLocaleString('ko-KR');
}

function currency(value) {
  return `${numberFormat(value)}원`;
}

function getPsiStatus(psi) {
  if (psi >= 80) return { label: '안전', className: 'safe' };
  if (psi >= 50) return { label: '주의', className: 'watch' };
  return { label: '위험', className: 'danger' };
}

function enrichItem(item) {
  const shortage = Math.max(0, item.requiredStock - item.currentStock);
  const recommendedQty = Math.max(shortage, item.psi <= 49 ? Math.ceil(item.requiredStock * 0.25) : 1);
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + (item.leadTimeHours <= 12 ? 1 : 2));
  return {
    ...item,
    shortage,
    recommendedQty,
    orderQty: recommendedQty,
    expectedDeliveryDate: deliveryDate.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', weekday: 'short' }),
    action: item.psi <= 49 ? '즉시 발주' : item.psi < 80 ? '관찰' : '안전',
    status: 'draft',
  };
}

function makeOrderNumber() {
  const datePart = new Date().toISOString().slice(2, 10).replaceAll('-', '');
  return `PO-${datePart}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function useFilteredRows(rows, defaultCategory = '전체') {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [sortKey, setSortKey] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const filtered = useMemo(() => {
    const text = query.toLowerCase();
    const next = rows.filter((row) => {
      const matchesText = Object.values(row).join(' ').toLowerCase().includes(text);
      const matchesCategory = category === '전체' || row.category === category || row.type === category || row.status === category;
      return matchesText && matchesCategory;
    });
    if (!sortKey) return next;
    return [...next].sort((a, b) => String(a[sortKey] || '').localeCompare(String(b[sortKey] || ''), 'ko-KR'));
  }, [category, query, rows, sortKey]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  return { query, setQuery, category, setCategory, sortKey, setSortKey, page, setPage, pageSize, totalPages, visibleRows, filtered };
}

function App() {
  const [activePage, setActivePage] = useState('analysis');
  const [events, setEvents] = useState(eventSeed);
  const [communityPosts, setCommunityPosts] = useState(communitySeed);
  const [issues, setIssues] = useState(issueSeed);
  const [orders, setOrders] = useState([]);
  const [confirmItems, setConfirmItems] = useState([]);
  const [toast, setToast] = useState('');
  const [mockFail, setMockFail] = useState(false);

  const items = useMemo(() => inventoryItems.map(enrichItem), []);
  const [cart, setCart] = useState(() => Object.fromEntries(items.filter((item) => item.shortage > 0).map((item) => [item.id, item])));
  const [selectedIds, setSelectedIds] = useState(() => items.filter((item) => item.shortage > 0).map((item) => item.id));

  const cartItems = Object.values(cart);
  const selectedItems = cartItems.filter((item) => selectedIds.includes(item.id));
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.orderQty * item.unitCost, 0);
  const riskItems = items.filter((item) => item.psi <= 49);
  const recommended = [...items].filter((item) => item.shortage > 0).sort((a, b) => a.psi - b.psi || b.shortage - a.shortage).slice(0, 5);

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  }

  function addItemToCart(item) {
    setCart((prev) => ({ ...prev, [item.id]: { ...item, status: 'draft' } }));
    setSelectedIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
    showToast(`${item.name}을 장바구니에 담았습니다.`);
  }

  function addAllRecommendations() {
    setCart((prev) => {
      const next = { ...prev };
      recommended.forEach((item) => { next[item.id] = { ...item, status: 'draft' }; });
      return next;
    });
    setSelectedIds((prev) => Array.from(new Set([...prev, ...recommended.map((item) => item.id)])));
    showToast('추천 발주안을 장바구니에 담았습니다.');
  }

  function updateCartQty(itemId, orderQty) {
    setCart((prev) => (!prev[itemId] ? prev : { ...prev, [itemId]: { ...prev[itemId], orderQty: Math.max(1, Number(orderQty) || 1) } }));
  }

  function removeCartItem(itemId) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setSelectedIds((prev) => prev.filter((id) => id !== itemId));
  }

  function openOrderConfirm(itemsToOrder) {
    if (!itemsToOrder.length) {
      showToast('발주할 품목을 선택해 주세요.');
      return;
    }
    setCart((prev) => {
      const next = { ...prev };
      itemsToOrder.forEach((item) => {
        if (next[item.id]) next[item.id] = { ...next[item.id], status: 'pending' };
      });
      return next;
    });
    setConfirmItems(itemsToOrder);
  }

  function startImmediateOrder(item) {
    const orderItem = cart[item.id] || { ...item, status: 'draft' };
    addItemToCart(item);
    setConfirmItems([orderItem]);
  }

  function confirmOrder() {
    if (mockFail) {
      showToast('발주 실패 mock 상태입니다.');
      setConfirmItems([]);
      return;
    }
    const order = {
      orderNumber: makeOrderNumber(),
      createdAt: new Date().toLocaleString('ko-KR'),
      itemCount: confirmItems.length,
      totalAmount: confirmItems.reduce((sum, item) => sum + item.orderQty * item.unitCost, 0),
      supplier: Array.from(new Set(confirmItems.map((item) => item.supplier))).join(', '),
      status: 'ordered',
      items: confirmItems,
    };
    setOrders((prev) => [order, ...prev]);
    setCart((prev) => {
      const next = { ...prev };
      confirmItems.forEach((item) => delete next[item.id]);
      return next;
    });
    setSelectedIds((prev) => prev.filter((id) => !confirmItems.some((item) => item.id === id)));
    setConfirmItems([]);
    showToast('발주가 완료되었습니다.');
  }

  return (
    <div className="app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="content">
        <RiskBanner riskItems={riskItems} />
        <Header activePage={activePage} cartCount={cartItems.length} />

        {activePage === 'analysis' && <Dashboard items={items} riskItems={riskItems} recommended={recommended} addItemToCart={addItemToCart} addAllRecommendations={addAllRecommendations} startImmediateOrder={startImmediateOrder} events={events} />}
        {activePage === 'forecast' && <ForecastPage items={items} events={events} />}
        {activePage === 'orders' && <AutoOrderPage cartItems={cartItems} selectedIds={selectedIds} setSelectedIds={setSelectedIds} selectedItems={selectedItems} selectedTotal={selectedTotal} updateCartQty={updateCartQty} removeCartItem={removeCartItem} openOrderConfirm={openOrderConfirm} addAllRecommendations={addAllRecommendations} />}
        {activePage === 'cart' && <CartPage cartItems={cartItems} selectedIds={selectedIds} setSelectedIds={setSelectedIds} selectedItems={selectedItems} selectedTotal={selectedTotal} updateCartQty={updateCartQty} removeCartItem={removeCartItem} openOrderConfirm={openOrderConfirm} />}
        {activePage === 'history' && <OrderHistoryPage orders={orders} />}
        {activePage === 'inventory' && <InventoryPage items={items} addItemToCart={addItemToCart} startImmediateOrder={startImmediateOrder} />}
        {activePage === 'products' && <ProductsPage />}
        {activePage === 'events' && <EventsPage events={events} setEvents={setEvents} showToast={showToast} />}
        {activePage === 'community' && <CommunityPage posts={communityPosts} setPosts={setCommunityPosts} showToast={showToast} />}
        {activePage === 'issues' && <IssuesPage issues={issues} setIssues={setIssues} showToast={showToast} />}
        {activePage === 'reports' && <ReportPage addAllRecommendations={addAllRecommendations} setActivePage={setActivePage} />}
        {activePage === 'settings' && <SettingsPage mockFail={mockFail} setMockFail={setMockFail} />}
      </main>

      {!!confirmItems.length && <OrderConfirmModal items={confirmItems} onCancel={() => setConfirmItems([])} onConfirm={confirmOrder} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => setActivePage('analysis')} aria-label="홈"><Coffee size={22} /></button>
      <nav>
        {menus.map((item) => {
          const Icon = item.icon;
          return <button key={item.key} className={activePage === item.key ? 'active' : ''} onClick={() => setActivePage(item.key)}><Icon size={18} /><span>{item.label}</span></button>;
        })}
      </nav>
    </aside>
  );
}

function Header({ activePage, cartCount }) {
  const title = menus.find((item) => item.key === activePage)?.label || '카페인사이트';
  return (
    <header className="header">
      <div>
        <p className="eyebrow">카페인사이트 AI 운영 플랫폼</p>
        <h1>{title}</h1>
      </div>
      <div className="headerActions">
        <span><Bell size={16} /> AI 분석 갱신 3분 전</span>
        <span><ShoppingCart size={16} /> 장바구니 {cartCount}</span>
      </div>
    </header>
  );
}

function RiskBanner({ riskItems }) {
  const expectedLoss = riskItems.reduce((sum, item) => sum + item.shortage * item.unitCost, 0);
  return <section className="riskBanner"><AlertTriangle size={20} /><strong>오늘 {riskItems.length}개 품목이 PSI 위험입니다.</strong><span>예상 손실 {currency(expectedLoss)}. 추천 발주를 확인하세요.</span></section>;
}

function Card({ title, action, children, className = '' }) {
  return <section className={`card ${className}`}><div className="cardHeader"><h2>{title}</h2>{action}</div>{children}</section>;
}

function Metric({ label, value, detail, tone }) {
  return <article className={`metric ${tone || ''}`}><span>{label}</span><strong>{value}</strong>{detail && <em>{detail}</em>}</article>;
}

function Dashboard({ items, riskItems, recommended, addItemToCart, addAllRecommendations, startImmediateOrder, events }) {
  return (
    <>
      <section className="metricGrid">
        <Metric label="AI 재고 안정도" value="91점" tone="safe" />
        <Metric label="오늘 예상 판매" value="+8%" detail="전일 대비" />
        <Metric label="PSI 위험 품목" value={`${riskItems.length}개`} tone="danger" />
        <Metric label="추천 발주 금액" value={currency(recommended.reduce((sum, item) => sum + item.recommendedQty * item.unitCost, 0))} />
        <Metric label="유사 이벤트 반영" value="3건" tone="watch" />
      </section>

      <section className="dashboardGrid">
        <TodayVariableCard />
        <PsiGuide />
      </section>

      <section className="dashboardGrid wideRight">
        <Card title="PSI 위험 품목">
          <PsiList items={items} />
        </Card>
        <Card title="AI 추천 발주 TOP5" action={<button onClick={addAllRecommendations}>추천안 생성</button>}>
          <RecommendationCards items={recommended} addItemToCart={addItemToCart} startImmediateOrder={startImmediateOrder} />
        </Card>
      </section>

      <section className="dashboardGrid wideRight">
        <Card title="과거 유사 패턴">
          <SimilarEvent events={events} />
        </Card>
        <Card title="재고 흐름 차트">
          <TrendCharts />
        </Card>
      </section>
    </>
  );
}

function TodayVariableCard() {
  return (
    <Card title="오늘의 운영 변수">
      <div className="variableFlow">
        {[
          ['오늘', `${operationVariables.day} · ${operationVariables.temperature} · ${operationVariables.weather}`],
          ['강수확률', operationVariables.rainChance],
          ['유사 요일', operationVariables.similarDay],
          ['유사 날씨', operationVariables.similarWeather],
          ['유사 이벤트', operationVariables.similarEvent],
          ['AI 추천', operationVariables.recommendation],
        ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
    </Card>
  );
}

function PsiGuide() {
  return (
    <Card title="PSI란?">
      <div className="psiGuide">
        <p><b>PSI(Perceived Safety Index)</b>는 재료별 체감안전지수입니다. 단순 재고 수량이 아니라 판매량, 요일, 날씨, 공휴일, 지역행사, 과거 발주패턴, 운영자의 안전재고 성향, 품절 경험을 종합해 현재 운영자가 느끼는 재고 안정감을 점수화합니다.</p>
        <div className="psiExample"><span>우유 10개 남음 · 평일 오전</span><b className="safeText">PSI 92 안전</b><span>우유 10개 남음 · 토요일 · 비 예보 · 지역 행사</span><b className="dangerText">PSI 37 위험</b></div>
        <div className="psiLegend"><span className="safe">80~100 안전</span><span className="watch">50~79 주의</span><span className="danger">0~49 위험</span></div>
      </div>
    </Card>
  );
}

function PsiInfo() {
  return <span className="infoTip"><Info size={14} /><em>PSI는 판매량, 요일, 날씨, 행사, 품절 경험을 반영한 체감 재고 안정 지표입니다.</em></span>;
}

function PsiList({ items }) {
  return (
    <div className="psiList">
      {items.map((item) => {
        const status = getPsiStatus(item.psi);
        return <div className="psiRow" key={item.id}><div><strong>{item.name}</strong><span>{status.label} · PSI {item.psi} <PsiInfo /></span></div><div className="psiTrack"><i className={status.className} style={{ width: `${item.psi}%` }} /></div></div>;
      })}
    </div>
  );
}

function RecommendationCards({ items, addItemToCart, startImmediateOrder }) {
  return (
    <div className="recommendGrid">
      {items.map((item) => {
        const status = getPsiStatus(item.psi);
        return (
          <article className="recommendCard" key={item.id}>
            <div className="rowBetween"><strong>{item.name}</strong><span className={`pill ${status.className}`}>{item.action}</span></div>
            <dl>
              <div><dt>현재</dt><dd>{numberFormat(item.currentStock)}{item.unit}</dd></div>
              <div><dt>권장</dt><dd>{numberFormat(item.recommendedQty)}{item.unit}</dd></div>
              <div><dt>단가</dt><dd>{currency(item.unitCost)}</dd></div>
              <div><dt>PSI</dt><dd>{item.psi} <PsiInfo /></dd></div>
            </dl>
            <p>{item.reason}</p>
            <div className="buttonPair"><button onClick={() => addItemToCart(item)}>담기</button><button className="dangerButton" onClick={() => startImmediateOrder(item)}>즉시 발주</button></div>
          </article>
        );
      })}
    </div>
  );
}

function SimilarEvent({ events }) {
  const event = events[1] || events[0];
  return <div className="similarEvent"><b>{event.date} · {event.title}</b><p>{event.salesChange} 사례가 있어 오늘도 비슷한 패턴이 예상됩니다.</p><strong>권장 발주량 +8%</strong></div>;
}

function TrendCharts() {
  return <div className="chartStack"><MiniChart title="최근 7일 소비량" dataKey="consumption" /><MiniChart title="PSI 변화" dataKey="psi" /><MiniChart title="폐기율 변화" dataKey="waste" invert /><CompareChart /></div>;
}

function MiniChart({ title, dataKey, invert = false }) {
  const max = Math.max(...trendData.map((item) => item[dataKey]));
  return <div className="miniChart"><h3>{title}</h3><div className="bars">{trendData.map((item) => <span key={item.label}><i className={invert ? 'invert' : ''} style={{ height: `${Math.max(12, (item[dataKey] / max) * 100)}%` }} /><em>{item.label}</em></span>)}</div></div>;
}

function CompareChart() {
  const max = Math.max(...trendData.flatMap((item) => [item.forecast, item.actual]));
  return <div className="miniChart"><h3>예측 vs 실제</h3><div className="compareBars">{trendData.map((item) => <span key={item.label}><i className="forecast" style={{ height: `${(item.forecast / max) * 100}%` }} /><i className="actual" style={{ height: `${(item.actual / max) * 100}%` }} /><em>{item.label}</em></span>)}</div></div>;
}

function ForecastPage({ items, events }) {
  return (
    <section className="dashboardGrid">
      <TodayVariableCard />
      <Card title="품목별 수요 예측">
        <div className="forecastList">
          {items.slice(0, 6).map((item) => <div key={item.id}><strong>{item.name}</strong><span>예측 {numberFormat(item.forecastSales)} · 실제 {numberFormat(item.actualSales)}</span><b>{item.dailySalesChange > 10 ? '수요 급증' : '정상 범위'}</b></div>)}
        </div>
      </Card>
      <Card title="AI가 참고한 특이사항" className="spanAll"><SimilarEvent events={events} /></Card>
    </section>
  );
}

function AutoOrderPage(props) {
  return <Card title="AI 발주 추천" action={<button onClick={props.addAllRecommendations}>추천 전체 담기</button>}><CartOrderPanel {...props} /></Card>;
}

function CartPage(props) {
  return <Card title="발주 장바구니"><CartOrderPanel {...props} /></Card>;
}

function CartOrderPanel({ cartItems, selectedIds, setSelectedIds, selectedItems, selectedTotal, updateCartQty, removeCartItem, openOrderConfirm }) {
  const allSelected = cartItems.length > 0 && selectedIds.length === cartItems.length;
  const selectedDelivery = selectedItems[0]?.expectedDeliveryDate || '-';
  const toggleSelected = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));

  if (!cartItems.length) return <p className="empty">장바구니가 비었습니다. AI 발주에서 추천안을 생성해 주세요.</p>;

  return (
    <>
      <div className="cartOrderList">
        {cartItems.map((item) => {
          const status = getPsiStatus(item.psi);
          return (
            <article className="cartOrderCard" key={item.id}>
              <label className="checkLine"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelected(item.id)} /><strong>{item.name}</strong><span className={`pill ${status.className}`}>PSI {item.psi}</span></label>
              <div className="cartDetails">
                <span>현재 재고 <b>{numberFormat(item.currentStock)}{item.unit}</b></span>
                <span>AI 권장 <b>{numberFormat(item.recommendedQty)}{item.unit}</b></span>
                <label>수량 변경 <input type="number" min="1" value={item.orderQty} onChange={(event) => updateCartQty(item.id, event.target.value)} /></label>
                <span>단가 <b>{currency(item.unitCost)}</b></span>
                <span>총액 <b>{currency(item.orderQty * item.unitCost)}</b></span>
                <span>공급사 <b>{item.supplier}</b></span>
                <span>배송예정일 <b>{item.expectedDeliveryDate}</b></span>
                <span>추천 이유 <b>{item.reason}</b></span>
              </div>
              <div className="cartActions"><button className="subtleButton" onClick={() => removeCartItem(item.id)}><Trash2 size={15} /> 삭제</button><button onClick={() => openOrderConfirm([item])}>개별 발주</button></div>
            </article>
          );
        })}
      </div>
      <div className="stickyOrderBar">
        <label><input type="checkbox" checked={allSelected} onChange={() => setSelectedIds(allSelected ? [] : cartItems.map((item) => item.id))} /> 전체 선택</label>
        <span>선택 {selectedItems.length}개</span>
        <strong>{currency(selectedTotal)}</strong>
        <span>예상 배송 {selectedDelivery}</span>
        <button onClick={() => openOrderConfirm(selectedItems)}>선택 발주</button>
        <button className="dangerButton" onClick={() => openOrderConfirm(cartItems)}>전체 발주</button>
      </div>
    </>
  );
}

function OrderConfirmModal({ items, onCancel, onConfirm }) {
  const totalAmount = items.reduce((sum, item) => sum + item.orderQty * item.unitCost, 0);
  const suppliers = Array.from(new Set(items.map((item) => item.supplier))).join(', ');
  return (
    <div className="modalBackdrop">
      <section className="modal">
        <h2>발주 확인</h2>
        <div className="modalSummary"><span>총 품목 <b>{items.length}개</b></span><span>총 금액 <b>{currency(totalAmount)}</b></span><span>공급사 <b>{suppliers}</b></span><span>예상 배송일 <b>{items[0]?.expectedDeliveryDate || '-'}</b></span></div>
        <div className="modalItems">{items.map((item) => <div key={item.id}><strong>{item.name}</strong><span>{numberFormat(item.orderQty)}{item.unit} · {currency(item.orderQty * item.unitCost)}</span></div>)}</div>
        <p className="warningText">확정 시 주문번호가 생성되고 발주 내역에 저장되며 장바구니에서 제거됩니다.</p>
        <div className="modalActions"><button className="subtleButton" onClick={onCancel}>취소</button><button onClick={onConfirm}>발주 확정</button></div>
      </section>
    </div>
  );
}

function OrderHistoryPage({ orders }) {
  const rows = orders.length ? orders : [{ orderNumber: 'PO-260704-1024', createdAt: '2026.07.04 10:21', itemCount: 3, totalAmount: 84600, supplier: '서울 데일리팜 외 2', status: 'ordered', items: [] }, { orderNumber: 'PO-260703-8842', createdAt: '2026.07.03 18:04', itemCount: 2, totalAmount: 27600, supplier: '카페 사장마켓', status: 'pending', items: [] }];
  return <Card title="발주 내역"><DataTable rows={rows} columns={[['orderNumber', '주문번호'], ['createdAt', '발주일'], ['itemCount', '품목 수'], ['totalAmount', '금액', currency], ['supplier', '공급사'], ['status', '상태']]} action={(row) => alert(`${row.orderNumber}\n${row.supplier}\n${currency(row.totalAmount)}`)} /></Card>;
}

function InventoryPage({ items, addItemToCart, startImmediateOrder }) {
  return (
    <Card title="재고관리">
      <DataTable rows={items} columns={[['name', '품목'], ['category', '분류'], ['currentStock', '현재'], ['requiredStock', '필요'], ['shortage', '부족'], ['psi', 'PSI'], ['supplier', '공급사']]} action={(row) => <div className="tableActions"><button className="subtleButton" onClick={() => addItemToCart(row)}>담기</button><button className={row.psi <= 49 ? 'dangerButton' : ''} onClick={() => startImmediateOrder(row)}>즉시 발주</button></div>} />
    </Card>
  );
}

function ProductsPage() {
  return (
    <Card title="제품관리 · 레시피 기반 재고 차감">
      <div className="productGrid">
        {productRecipes.map((product) => <article key={product.id}><strong>{product.product}</strong><span>{currency(product.price)}</span><div>{product.recipe.map((item) => <b key={item.name}>{item.name} {item.amount}</b>)}</div><em>{product.note}</em></article>)}
      </div>
    </Card>
  );
}

function EventsPage({ events, setEvents, showToast }) {
  const [form, setForm] = useState({ title: '', type: '지역행사', region: '익산' });
  function addEvent() {
    if (!form.title.trim()) return showToast('제목을 입력해 주세요.');
    setEvents((prev) => [{ id: Date.now(), date: new Date().toLocaleDateString('ko-KR'), store: '카페362 익산점', visitors: '미정', salesChange: '분석 대기', volumeChange: '분석 대기', items: '미지정', memo: '운영자 등록', image: '없음', ai: true, ...form }, ...prev]);
    setForm({ title: '', type: '지역행사', region: '익산' });
    showToast('특이사항이 저장되었습니다.');
  }
  return <CrudPage title="특이사항 아카이브" rows={events} setRows={setEvents} form={form} setForm={setForm} addRow={addEvent} categories={['전체', '선거', '공공기관 방문', '방송촬영', '지역행사']} columns={[['date', '날짜'], ['title', '제목'], ['type', '유형'], ['region', '지역'], ['store', '관련 매장'], ['visitors', '예상 방문객'], ['salesChange', '실제 매출 변화'], ['volumeChange', '판매량 변화'], ['items', '관련 품목'], ['ai', 'AI 반영', (v) => (v ? '반영' : '미반영')]]} />;
}

function CommunityPage({ posts, setPosts, showToast }) {
  function react(id, key) {
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, [key]: post[key] + 1 } : post)));
  }
  return (
    <>
      <section className="communityHighlights">
        <Metric label="오늘 인기글" value={posts[0]?.likes || 0} detail={posts[0]?.title} />
        <Metric label="댓글 많은 글" value={Math.max(...posts.map((post) => post.comments))} />
        <Metric label="우리지역 게시글" value={`${posts.filter((post) => post.region === '익산').length}건`} />
        <Metric label="이번주 추천글" value="12건" />
      </section>
      <Card title="사장님 커뮤니티" action={<button onClick={() => showToast('게시글 작성 모달 mock입니다.')}>글쓰기</button>}>
        <DataTable rows={posts} columns={[['category', '카테고리'], ['title', '제목'], ['author', '작성자'], ['region', '지역'], ['views', '조회'], ['comments', '댓글'], ['likes', '좋아요'], ['time', '작성시간'], ['badge', '뱃지']]} action={(row) => <div className="tableActions"><button onClick={() => react(row.id, 'likes')}>좋아요</button><button className="subtleButton" onClick={() => react(row.id, 'useful')}>유용해요</button><button className="subtleButton" onClick={() => react(row.id, 'meToo')}>나도 겪었어요</button></div>} />
      </Card>
    </>
  );
}

function IssuesPage({ issues, setIssues, showToast }) {
  const [form, setForm] = useState({ title: '', category: '원두 가격', impact: '분석 대기' });
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const selectedIssue = issues.find((issue) => issue.id === selectedIssueId);

  function addIssue() {
    if (!form.title.trim()) return showToast('제목을 입력해 주세요.');
    setIssues((prev) => [{
      id: Date.now(),
      date: new Date().toLocaleDateString('ko-KR'),
      summary: '사용자 등록 이슈입니다. 향후 뉴스/API 자동 수집 구조로 확장됩니다.',
      detail: '운영자가 직접 등록한 커피 이슈입니다. 이후 뉴스, 커피 관련 사이트, 공공데이터, 식자재 가격 API를 연결하면 자동 수집된 상세 분석으로 대체할 수 있습니다.',
      items: '미지정',
      source: '사용자 등록',
      sourceUrl: 'https://www.sbiz.or.kr/',
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
      ai: false,
      ...form,
    }, ...prev]);
    setForm({ title: '', category: '원두 가격', impact: '분석 대기' });
    showToast('커피 이슈가 등록되었습니다.');
  }

  function toggleAiReflect(issueId) {
    setIssues((prev) => prev.map((issue) => (issue.id === issueId ? { ...issue, ai: !issue.ai } : issue)));
    showToast('AI 반영 상태가 변경되었습니다.');
  }

  if (selectedIssue) {
    return (
      <IssueDetail
        issue={selectedIssue}
        onBack={() => setSelectedIssueId(null)}
        onToggleAi={() => toggleAiReflect(selectedIssue.id)}
      />
    );
  }

  return (
    <>
      <Card title="커피 이슈 등록">
        <div className="quickForm">
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="제목" />
          <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{['원두 가격', '우유', '식자재', '카페 트렌드', '소상공인 정책', '기상', '지역 행사', '프랜차이즈', '기타'].map((item) => <option key={item}>{item}</option>)}</select>
          <input value={form.impact} onChange={(event) => setForm({ ...form, impact: event.target.value })} placeholder="예상 영향" />
          <button onClick={addIssue}><Plus size={16} /> 등록</button>
        </div>
      </Card>
      <Card title="커피 이슈">
        <DataTable
          rows={issues}
          columns={[['category', '카테고리'], ['title', '제목', (value, row) => <button className="linkButton" onClick={() => setSelectedIssueId(row.id)}>{value}</button>], ['summary', '요약'], ['items', '관련 품목'], ['impact', '예상 영향'], ['date', '작성일'], ['source', '출처'], ['ai', 'AI 반영', (v) => (v ? '반영' : '미반영')]]}
          categories={['전체', '원두 가격', '우유', '식자재', '카페 트렌드', '소상공인 정책', '기상', '지역 행사', '프랜차이즈', '기타']}
          action={(row) => <button onClick={() => setSelectedIssueId(row.id)}>상세보기</button>}
        />
      </Card>
    </>
  );
}

function IssueDetail({ issue, onBack, onToggleAi }) {
  return (
    <section className="issueDetail">
      <button className="subtleButton backButton" onClick={onBack}>목록으로</button>
      <Card title={issue.title} action={<button onClick={onToggleAi}>{issue.ai ? 'AI 반영 해제' : 'AI 반영'}</button>}>
        <div className="issueHero">
          <img src={issue.imageUrl} alt={`${issue.title} 참고 이미지`} />
          <div>
            <span className="pill watch">{issue.category}</span>
            <h3>{issue.summary}</h3>
            <p>{issue.detail}</p>
          </div>
        </div>
        <div className="issueMetaGrid">
          <span>관련 품목 <b>{issue.items}</b></span>
          <span>예상 영향 <b>{issue.impact}</b></span>
          <span>작성일 <b>{issue.date}</b></span>
          <span>AI 반영 여부 <b>{issue.ai ? '반영' : '미반영'}</b></span>
        </div>
        <div className="sourceBox">
          <FileText size={18} />
          <div>
            <strong>출처</strong>
            <a href={issue.sourceUrl} target="_blank" rel="noreferrer">{issue.source}</a>
          </div>
        </div>
      </Card>
    </section>
  );
}

function CrudPage({ title, rows, setRows, form, setForm, addRow, categories, columns }) {
  return (
    <>
      <Card title={`${title} 등록`}>
        <div className="quickForm">
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="제목" />
          <select value={form.type || form.category} onChange={(event) => setForm({ ...form, [form.type !== undefined ? 'type' : 'category']: event.target.value })}>{categories.filter((item) => item !== '전체').map((item) => <option key={item}>{item}</option>)}</select>
          <input value={form.region || form.impact} onChange={(event) => setForm({ ...form, [form.region !== undefined ? 'region' : 'impact']: event.target.value })} placeholder={form.region !== undefined ? '지역' : '예상 영향'} />
          <button onClick={addRow}><Plus size={16} /> 등록</button>
        </div>
      </Card>
      <Card title={title}>
        <DataTable rows={rows} columns={columns} categories={categories} action={(row) => <button className="subtleButton" onClick={() => setRows(rows.filter((item) => item.id !== row.id))}>삭제</button>} />
      </Card>
    </>
  );
}

function DataTable({ rows, columns, categories, action }) {
  const filter = useFilteredRows(rows);
  const availableCategories = categories || ['전체', ...Array.from(new Set(rows.map((row) => row.category || row.type || row.status).filter(Boolean)))];
  return (
    <>
      <section className="toolbar">
        <div className="searchBox"><Search size={18} /><input value={filter.query} onChange={(event) => { filter.setQuery(event.target.value); filter.setPage(1); }} placeholder="검색" /></div>
        <select value={filter.category} onChange={(event) => { filter.setCategory(event.target.value); filter.setPage(1); }}>{availableCategories.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={filter.sortKey} onChange={(event) => filter.setSortKey(event.target.value)}><option value="">정렬 없음</option>{columns.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
      </section>
      <div className="tableWrap">
        <table>
          <thead><tr>{columns.map(([key, label]) => <th key={key}>{label}</th>)}{action && <th>작업</th>}</tr></thead>
          <tbody>
            {filter.visibleRows.map((row) => <tr key={row.id || row.orderNumber}>{columns.map(([key, , format]) => <td key={key}>{format ? format(row[key], row) : String(row[key] ?? '')}</td>)}{action && <td>{action(row)}</td>}</tr>)}
          </tbody>
        </table>
      </div>
      <div className="pagination"><span>{filter.filtered.length}건 중 {filter.visibleRows.length}건 표시</span><button className="subtleButton" disabled={filter.page <= 1} onClick={() => filter.setPage(filter.page - 1)}>이전</button><strong>{filter.page} / {filter.totalPages}</strong><button className="subtleButton" disabled={filter.page >= filter.totalPages} onClick={() => filter.setPage(filter.page + 1)}>다음</button></div>
    </>
  );
}

function ReportPage({ addAllRecommendations, setActivePage }) {
  return (
    <section className="reportGrid">
      <Metric label="원두 소비량" value="+16%" detail="이번 주" />
      <Metric label="우유 폐기율" value="-8%" detail="예측 발주 효과" tone="safe" />
      <Metric label="라떼 판매" value="+21%" detail="주말 증가" />
      <Metric label="자동발주 성공률" value="94%" detail="최근 30일" tone="safe" />
      <Card title="AI 운영 의견">
        <p className="reportText">이번주는 원두 소비량이 16% 증가했고 우유 폐기율은 8% 감소했습니다. 라떼 판매 증가와 토요일 관광객 패턴을 고려하면 다음 주 우유 12개 추가 확보를 권장합니다.</p>
        <button onClick={() => { addAllRecommendations(); setActivePage('cart'); }}>추천 발주안 생성</button>
      </Card>
    </section>
  );
}

function SettingsPage({ mockFail, setMockFail }) {
  return (
    <Card title="설정">
      <div className="settingsGrid">
        <label><span>자동발주 모드</span><select defaultValue="review"><option value="review">검토 후 실행</option><option value="auto">위험 품목 자동 실행</option></select></label>
        <label><span>PSI 위험 기준</span><input defaultValue="49" /></label>
        <label><span>외부 연동 준비</span><input defaultValue="뉴스 API, 날씨 API, POS, ERP, 공급사 API" /></label>
        <label className="toggleLine"><input type="checkbox" checked={mockFail} onChange={(event) => setMockFail(event.target.checked)} /> 발주 실패 mock 테스트</label>
      </div>
    </Card>
  );
}

createRoot(document.getElementById('root')).render(<App />);
