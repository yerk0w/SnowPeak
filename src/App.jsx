import { useEffect, useMemo, useState } from "react";

const apiCats = [
  "Все",
  "Лыжи",
  "Сноуборды",
  "Ботинки",
  "Экипировка",
  "Аксессуары",
];
const keys = ["all", "skis", "snowboards", "boots", "gear", "accessories"];
const photo = {
  1: "/assets/product-skis.png",
  2: "/assets/product-snowboard.png",
  3: "/assets/product-helmet.png",
  4: "/assets/product-goggles.png",
  5: "/assets/product-boots.png",
  6: "/assets/product-poles.png",
};
const text = {
  ru: {
    lang: "РУС",
    nav: ["Каталог", "О нас", "Доставка", "Контакты"],
    login: "Войти",
    cart: "Корзина",
    season: "СЕЗОН 2026 / 27",
    hero: (
      <>
        Твой пик
        <br />
        <em>начинается здесь.</em>
      </>
    ),
    heroP:
      "От первого склона до больших гор — подберём надёжное снаряжение для зимы, которую запомнишь.",
    choose: "Выбрать снаряжение",
    cats: ["Все", "Лыжи", "Сноуборды", "Ботинки", "Экипировка", "Аксессуары"],
    eq: "СНАРЯЖЕНИЕ",
    title: "Собрано для гор",
    desc: "Новое снаряжение и необходимые детали для яркого сезона.",
    about: "О SNOWPEAK",
    aboutT: "Мы знаем, что горы меняют всё.",
    aboutP:
      "Snowpeak — магазин зимнего спорта для тех, кто не ждёт идеальной погоды. Мы тестируем снаряжение, слушаем райдеров и отбираем вещи, которые работают на склоне.",
    delivery: "ДОСТАВКА И ГАРАНТИЯ",
    deliveryT: (
      <>
        Спокойно выбирайте.
        <br />
        <em>Остальное — наша забота.</em>
      </>
    ),
    deliveryP: [
      "Курьером по Алматы за 1–2 дня или по Казахстану транспортной компанией.",
      "В шоуруме можно примерить ботинки и подобрать комплект с экспертом.",
      "Официальная гарантия производителя и сервисная поддержка Snowpeak.",
    ],
    contact: "СВЯЗАТЬСЯ С НАМИ",
    contactT: (
      <>
        Есть вопрос?
        <br />
        Мы на связи.
      </>
    ),
    book: "Забронировать примерку",
    details: "Подробнее",
    add: "В корзину",
    added: "Товар добавлен в корзину",
    empty: "Корзина пуста",
    total: "Итого",
    checkout: "Оформить заказ",
    name: "Ваше имя",
    phone: "Телефон",
    send: "Отправить сообщение",
    feedback: "Ваш вопрос или сообщение",
    order: "ОФОРМЛЕНИЕ ЗАКАЗА",
    confirm: "Подтвердить заказ",
    footer: "Зимний спорт.",
  },
  kk: {
    lang: "ҚАЗ",
    nav: ["Каталог", "Біз туралы", "Жеткізу", "Байланыс"],
    login: "Кіру",
    cart: "Себет",
    season: "2026 / 27 МАУСЫМЫ",
    hero: (
      <>
        Сенің шыңың
        <br />
        <em>осы жерден басталады.</em>
      </>
    ),
    heroP: "Алғашқы беткейден биік тауларға дейін сенімді жабдық таңдаймыз.",
    choose: "Жабдықты таңдау",
    cats: ["Барлығы", "Шаңғы", "Сноуборд", "Етік", "Жабдық", "Аксессуарлар"],
    eq: "ЖАБДЫҚ",
    title: "Таулар үшін жиналған",
    desc: "Жарқын маусымға арналған жаңа жабдық.",
    about: "SNOWPEAK ТУРАЛЫ",
    aboutT: "Таулар бәрін өзгертетінін білеміз.",
    aboutP:
      "Snowpeak — қысқы спорт дүкені. Біз жабдықты сынаймыз және беткейде жұмыс істейтін заттарды таңдаймыз.",
    delivery: "ЖЕТКІЗУ ЖӘНЕ КЕПІЛДІК",
    deliveryT: (
      <>
        Еркін таңдаңыз.
        <br />
        <em>Қалғаны — біздің қамқорлығымыз.</em>
      </>
    ),
    deliveryP: [
      "Алматы бойынша 1–2 күнде курьермен немесе Қазақстан бойынша тасымалдаушымен.",
      "Шоурумда етікті киіп көріп, сарапшымен жинақ таңдаңыз.",
      "Өндірушінің ресми кепілдігі және Snowpeak сервисі.",
    ],
    contact: "БІЗБЕН БАЙЛАНЫС",
    contactT: (
      <>
        Сұрағыңыз бар ма?
        <br />
        Біз байланыстамыз.
      </>
    ),
    book: "Киіп көруге жазылу",
    details: "Толығырақ",
    add: "Себетке",
    added: "Тауар себетке қосылды",
    empty: "Себет бос",
    total: "Барлығы",
    checkout: "Тапсырыс беру",
    name: "Аты-жөніңіз",
    phone: "Телефон",
    send: "Хабарлама жіберу",
    feedback: "Сұрағыңыз немесе хабарламаңыз",
    order: "ТАПСЫРЫСТЫ РӘСІМДЕУ",
    confirm: "Тапсырысты растау",
    footer: "Қысқы спорт.",
  },
  en: {
    lang: "ENG",
    nav: ["Catalog", "About", "Delivery", "Contacts"],
    login: "Sign in",
    cart: "Cart",
    season: "SEASON 2026 / 27",
    hero: (
      <>
        Your peak
        <br />
        <em>starts here.</em>
      </>
    ),
    heroP:
      "From your first slope to big mountains — dependable gear for a winter to remember.",
    choose: "Choose equipment",
    cats: ["All", "Skis", "Snowboards", "Boots", "Gear", "Accessories"],
    eq: "EQUIPMENT",
    title: "Built for the mountains",
    desc: "New gear and essential details for a brilliant season.",
    about: "ABOUT SNOWPEAK",
    aboutT: "We know mountains change everything.",
    aboutP:
      "Snowpeak is a winter sports shop. We test equipment and select gear that works on the slope.",
    delivery: "DELIVERY AND WARRANTY",
    deliveryT: (
      <>
        Choose with confidence.
        <br />
        <em>We handle the rest.</em>
      </>
    ),
    deliveryP: [
      "Courier delivery in Almaty within 1–2 days or nationwide by carrier.",
      "Try boots in our showroom and choose a kit with an expert.",
      "Official manufacturer warranty and Snowpeak service support.",
    ],
    contact: "CONTACT US",
    contactT: (
      <>
        Have a question?
        <br />
        We are here.
      </>
    ),
    book: "Book a fitting",
    details: "Details",
    add: "Add to cart",
    added: "Item added to cart",
    empty: "Your cart is empty",
    total: "Total",
    checkout: "Checkout",
    name: "Your name",
    phone: "Phone",
    send: "Send message",
    feedback: "Your question or message",
    order: "CHECKOUT",
    confirm: "Confirm order",
    footer: "Winter sports.",
  },
};
const price = (n, l) =>
  new Intl.NumberFormat(l === "en" ? "en-US" : "ru-RU").format(n) + " ₸";
const productCopy = {
  en: {1:['Nordic Flow 84 Skis','Versatile alpine skis for confident descents.'],2:['Alpine Core Snowboard','Stable board with responsive camber.'],3:['Frost Guard Helmet','Lightweight protection with adjustable ventilation.'],4:['Ice Vision Pro Goggles','High-contrast lens for changing weather.'],5:['Summit 90 Boots','Warm boots with a precise fit.'],6:['Carbon Trail Poles','Strong and lightweight carbon poles.']},
  kk: {1:['Nordic Flow 84 шаңғысы','Сенімді түсуге арналған әмбебап тау шаңғысы.'],2:['Alpine Core сноуборды','Жауапты иілімі бар тұрақты тақтай.'],3:['Frost Guard дулығасы','Реттелетін желдеткіші бар жеңіл қорғаныс.'],4:['Ice Vision Pro маскасы','Ауа райы құбылмалы кезде контрастты линза.'],5:['Summit 90 етігі','Нақты қонуы бар жылы етік.'],6:['Carbon Trail таяқтары','Карбоннан жасалған берік әрі жеңіл таяқтар.']}
};
const displayProduct = (product, lang) => productCopy[lang]?.[product.id] ? {...product, name:productCopy[lang][product.id][0], description:productCopy[lang][product.id][1]} : product;
const badge = (value, lang) => ({'Хит': {en:'Bestseller',kk:'Таңдаулы'},'Новинка':{en:'New',kk:'Жаңа'}}[value]?.[lang] || value);
const ui = {en:{caption:'Fill in your contacts — we will confirm the order within 15 minutes.',payment:'PAYMENT METHOD',card:'Card payment',cardHint:'Secure demo payment',pickup:'Showroom pickup',pickupHint:'Pay when you collect',remove:'Remove item',colors:{'Графит':'Graphite','Ледяной синий':'Icy blue','Белый':'White'}},kk:{caption:'Байланыс деректерін толтырыңыз — тапсырысты 15 минут ішінде растаймыз.',payment:'ТӨЛЕМ ТӘСІЛІ',card:'Картамен төлеу',cardHint:'Қауіпсіз демо-төлем',pickup:'Шоурумнан алу',pickupHint:'Алар кезде төлеу',remove:'Тауарды жою',colors:{'Графит':'Графит','Ледяной синий':'Мұздай көк','Белый':'Ақ'}},ru:{caption:'Заполните контакты — мы подтвердим заказ в течение 15 минут.',payment:'СПОСОБ ОПЛАТЫ',card:'Оплата картой',cardHint:'Безопасная демо-оплата',pickup:'Самовывоз',pickupHint:'Оплата при получении',remove:'Удалить товар',colors:{'Графит':'Графит','Ледяной синий':'Ледяной синий','Белый':'Белый'}}};
export default function App() {
  const [lang, setLang] = useState(
      () => localStorage.getItem("snowpeak_lang") || "ru",
    ),
    t = text[lang],
    u = ui[lang];
  const [cat, setCat] = useState("all"),
    [products, setProducts] = useState([]),
    [cart, setCart] = useState([]),
    [cartOpen, setCartOpen] = useState(false),
    [order, setOrder] = useState(false),
    [configProduct, setConfigProduct] = useState(null),
    [auth, setAuth] = useState(false),
    [crm, setCrm] = useState(() => window.location.hash === "#crm"),
    [user, setUser] = useState(() => {
      try {
        return JSON.parse(localStorage.getItem("snowpeak_user")) || null;
      } catch {
        return null;
      }
    }),
    [notice, setNotice] = useState("");
  useEffect(() => {
    localStorage.setItem("snowpeak_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => {
    fetch(
      "/api/products?category=" +
        encodeURIComponent(apiCats[keys.indexOf(cat)]),
    )
      .then((r) => r.json())
      .then(setProducts);
  }, [cat]);
  useEffect(() => {
    const sync = () => setCrm(window.location.hash === "#crm");
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const total = useMemo(
    () => cart.reduce((s, x) => s + x.price * x.qty, 0),
    [cart],
  );
  const add = (p) => {
    setCart((a) =>
      a.some((x) => x.id === p.id && x.variant === p.variant)
        ? a.map((x) => (x.id === p.id && x.variant === p.variant ? { ...x, qty: x.qty + 1 } : x))
        : [...a, { ...p, qty: 1 }],
    );
    setNotice(t.added);
    setTimeout(() => setNotice(""), 1800);
  };
  return (
    <>
      <header className="header">
        <a className="brand" href="#top">
          <span>❄</span> SNOWPEAK
        </a>
        <nav>
          {t.nav.map((x, i) => (
            <a
              key={x}
              href={["#catalog", "#about", "#delivery", "#contacts"][i]}
            >
              {x}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <div className="language-switch">
            {[
              ["kk", "ҚАЗ"],
              ["ru", "РУС"],
              ["en", "ENG"],
            ].map(([v, n]) => (
              <button
                key={v}
                onClick={() => setLang(v)}
                className={lang === v ? "active" : ""}
              >
                {n}
              </button>
            ))}
          </div>
          {user?.role === "admin" && (
            <button
              className="admin-button"
              onClick={() => {
                window.location.hash = "crm";
              }}
            >
              CRM
            </button>
          )}
          <button
            className="account-button"
            onClick={() => (user ? setNotice(`✓ ${user.name}`) : setAuth(true))}
          >
            {user ? `✓ ${user.name.split(" ")[0]}` : t.login}
          </button>
          <button className="cart-button" onClick={() => setCartOpen(true)}>
            {t.cart} <b>{cart.reduce((s, x) => s + x.qty, 0)}</b>
          </button>
        </div>
      </header>
      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">{t.season}</p>
            <h1>{t.hero}</h1>
            <p>{t.heroP}</p>
            <a className="primary" href="#catalog">
              {t.choose} <span>→</span>
            </a>
          </div>
          <div className="hero-art" />
        </section>
        <section className="benefits">
          {t.deliveryP.map((x, i) => (
            <div key={x}>
              <span>0{i + 1}</span>
              <b>{["★", "◎", "✓"][i]}</b>
              <p>{x}</p>
            </div>
          ))}
        </section>
        <section id="catalog" className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">{t.eq}</p>
              <h2>{t.title}</h2>
            </div>
            <p>{t.desc}</p>
          </div>
          <div className="filters">
            {keys.map((x, i) => (
              <button
                key={x}
                className={cat === x ? "active" : ""}
                onClick={() => setCat(x)}
              >
                {t.cats[i]}
              </button>
            ))}
          </div>
          <div className="products">
            {products.map((p) => { const item = displayProduct(p, lang); return (
              <article className="product" key={p.id}>
                <div className="product-image">
                  <img src={photo[p.id]} alt={item.name} />
                  <small>{badge(p.badge, lang)}</small>
                  <button onClick={() => setConfigProduct(item)}>+</button>
                </div>
                <div className="product-info">
                  <p>
                    {
                      t.cats[
                        keys.indexOf(
                          apiCats.findIndex
                            ? keys[
                                keys.indexOf(
                                  keys.find(
                                    (k) =>
                                      apiCats[keys.indexOf(k)] === p.category,
                                  ),
                                )
                              ]
                            : "all",
                        )
                      ]
                    }{" "}
                    · ★ {p.rating}
                  </p>
                  <h3>{item.name}</h3>
                  <span>{item.description}</span>
                  <button className="details-link" onClick={() => setConfigProduct(item)}>
                    {t.details} <span>→</span>
                  </button>
                  <b>{price(p.price, lang)}</b>
                </div>
              </article>
            ); })}
          </div>
        </section>
        <section id="about" className="about section">
          <div className="about-image">
            <img src="/assets/about-alpine-skier.png" alt="Alpine skier" />
          </div>
          <div>
            <p className="eyebrow">{t.about}</p>
            <h2>{t.aboutT}</h2>
            <p>{t.aboutP}</p>
          </div>
        </section>
        <section id="delivery" className="delivery section">
          <p className="eyebrow">{t.delivery}</p>
          <h2>{t.deliveryT}</h2>
          <div className="delivery-grid">
            {t.deliveryP.map((x, i) => (
              <article key={x}>
                <b>0{i + 1}</b>
                <p>{x}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="contacts" className="contact section">
          <div>
            <p className="eyebrow">{t.contact}</p>
            <h2>{t.contactT}</h2>
            <p>
              Алматы, пр. Абая, 125
              <br />
              +7 (727) 222-55-66
              <br />
              hello@snowpeak.kz
            </p>
          </div>
          <form className="feedback">
            <input placeholder={t.name} />
            <input placeholder="Email" />
            <textarea placeholder={t.feedback} />
            <button className="primary">{t.send} →</button>
          </form>
        </section>
      </main>
      <footer>© 2026 Snowpeak. {t.footer}</footer>
      {notice && <div className="toast">✓ {notice}</div>}
      {cartOpen && (
        <div className="overlay" onMouseDown={() => setCartOpen(false)}>
          <aside className="drawer" onMouseDown={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setCartOpen(false)}>
              ×
            </button>
            <p className="eyebrow">{t.cart}</p>
            <h2>{cart.length ? t.cart : t.empty}</h2>
            {cart.map((x) => (
              <div className="cart-item" key={`${x.id}-${x.variant || ''}`}>
                <img className="cart-product-photo" src={photo[x.id]} />
                <div>
                  <b>{displayProduct(x, lang).name}</b>
                  {x.variant && <small>{x.variant.split(' · ').map((part) => u.colors[part] || part).join(' · ')}</small>}
                  <p>{price(x.price, lang)}</p>
                  <div className="quantity">
                    <button
                      onClick={() =>
                        setCart((a) =>
                          a.map((y) =>
                            y.id === x.id && y.variant === x.variant
                              ? { ...y, qty: Math.max(1, y.qty - 1) }
                              : y,
                          ),
                        )
                      }
                    >
                      −
                    </button>
                    {x.qty}
                    <button
                      onClick={() =>
                        setCart((a) =>
                          a.map((y) =>
                            y.id === x.id && y.variant === x.variant ? { ...y, qty: y.qty + 1 } : y,
                          ),
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <button className="remove-item" aria-label={u.remove} onClick={() => setCart((items) => items.filter((item) => !(item.id === x.id && item.variant === x.variant)))}>×</button>
              </div>
            ))}
            {cart.length > 0 && (
              <>
                <div className="cart-total">
                  <span>{t.total}</span>
                  <b>{price(total, lang)}</b>
                </div>
                <button
                  className="primary full"
                  onClick={() => {
                    setCartOpen(false);
                    setOrder(true);
                  }}
                >
                  {t.checkout} →
                </button>
              </>
            )}
          </aside>
        </div>
      )}
      {order && (
        <div className="overlay" onMouseDown={() => setOrder(false)}>
          <div className="modal checkout-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setOrder(false)}>
              ×
            </button>
            <p className="eyebrow">{t.order}</p>
            <h2>{t.checkout}</h2><p className="checkout-caption">{u.caption}</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.get('name'), phone: form.get('phone'), email: form.get('email') || '', delivery: form.get('payment') === 'pickup' ? 'Самовывоз' : 'Оплата картой', address: '', items: cart.map(({id,name,qty,variant}) => ({id,name,qty,variant})), total }) });
                if (!response.ok) { setNotice('Не удалось сохранить заказ'); return; }
                setOrder(false); setCart([]); setNotice(t.confirm);
              }}
            >
              <input required placeholder={t.name} />
              <input required placeholder={t.phone} />
              <input placeholder="Email" />
              <p className="payment-label">{u.payment}</p><div className="payment-choice"><label><input type="radio" name="payment" value="card" defaultChecked /> <span>💳</span><b>{u.card}</b><small>{u.cardHint}</small></label><label><input type="radio" name="payment" value="pickup" /> <span>🏪</span><b>{u.pickup}</b><small>{u.pickupHint}</small></label></div>
              <div className="fake-card"><span>SNOWPEAK PAY</span><input inputMode="numeric" placeholder="0000 0000 0000 0000" /><div><input placeholder="MM / ГГ" /><input placeholder="CVC" /></div></div>
              <button className="primary full">{t.confirm} →</button>
            </form>
          </div>
        </div>
      )}
      {configProduct && <ProductConfig product={configProduct} onClose={() => setConfigProduct(null)} onAdd={(variant) => { add({ ...configProduct, variant }); setConfigProduct(null); }} />}
      {auth && (
        <AuthModal
          onClose={() => setAuth(false)}
          onSuccess={(data) => {
            localStorage.setItem("snowpeak_user", JSON.stringify(data.user));
            localStorage.setItem("snowpeak_token", data.token);
            setUser(data.user);
            setAuth(false);
            setNotice(`✓ ${data.user.name}`);
          }}
        />
      )}
      {crm && (
        <CrmModal
          token={localStorage.getItem("snowpeak_token")}
          onClose={() => {
            window.location.hash = "";
          }}
        />
      )}
    </>
  );
}

function ProductConfig({ product, onClose, onAdd }) {
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('Графит');
  const [colorIndex, setColorIndex] = useState(0);
  const sizes = product.category === 'Ботинки' ? ['39','40','41','42','43','44'] : ['S','M','L','XL'];
  const colors = ['Графит', 'Ледяной синий', 'Белый'];
  const sheets = { 1:'/assets/variant-skis.png',2:'/assets/variant-boots.png',3:'/assets/variant-poles.png',4:'/assets/variant-snowboard.png',5:'/assets/variant-helmet.png',6:'/assets/variant-goggles.png' };
  const positions = ['0% 50%', '50% 50%', '100% 50%'];
  return <div className="overlay" onMouseDown={onClose}><div className="modal product-config" onMouseDown={(e) => e.stopPropagation()}><button className="close" onClick={onClose}>×</button><div className="config-photo variant-sheet"><img style={{ objectPosition: positions[colorIndex] }} src={sheets[product.id]} alt={`${product.name}, ${color}`} /><span>{color}</span></div><p className="eyebrow">ВЫБОР ВАРИАНТА</p><h2>{product.name}</h2><p>Выберите размер и цвет перед добавлением в корзину.</p><b>Размер</b><div className="option-row">{sizes.map((item) => <button className={size === item ? 'selected' : ''} onClick={() => setSize(item)} key={item}>{item}</button>)}</div><b>Цвет</b><div className="option-row colors">{colors.map((item, index) => <button className={color === item ? 'selected' : ''} onClick={() => { setColor(item); setColorIndex(index); }} key={item}><i className={`color-dot c${index}`} />{item}</button>)}</div><div className="detail-bottom"><b>{price(product.price, 'ru')}</b><button className="primary" onClick={() => onAdd(`${size} · ${color}`)}>В корзину <span>→</span></button></div></div></div>;
}

function AuthModal({ onClose, onSuccess }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const values = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      onSuccess(data);
    } catch (err) {
      setError(err.message || "Не удалось войти");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>
          ×
        </button>
        <p className="eyebrow">ЛИЧНЫЙ КАБИНЕТ</p>
        <h2>С возвращением</h2>
        <form onSubmit={submit}>
          <input name="email" type="email" required placeholder="Email" />
          <input
            name="password"
            type="password"
            required
            placeholder="Пароль"
          />
          {error && <p className="error">{error}</p>}
          <button className="primary full" disabled={loading}>
            {loading ? "Подождите…" : "Войти →"}
          </button>
        </form>
        <p className="demo-login">
          CRM: <b>admin@snowpeak.kz</b>
          <br />
          Пароль: <b>snowpeak2026</b>
        </p>
      </div>
    </div>
  );
}

function CrmModal({ token, onClose }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [view, setView] = useState("overview");
  const load = () => {
    fetch("/api/crm/overview", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok) throw new Error(json.error);
        return json;
      })
      .then(setData)
      .catch((err) => setError(err.message));
  };
  useEffect(() => {
    load();
  }, [token]);
  const update = async (kind, id, status) => {
    await fetch(`/api/crm/${kind}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    load();
  };
  const stages = ["Новый", "Подтверждён", "Собирается", "Передан в доставку", "Завершён"];
  const revenue = data?.orders.filter((order) => order.status !== "Отменён").reduce((sum, order) => sum + order.total, 0) || 0;
  return (
    <main className="crm-page">
      <aside className="crm-sidebar"><a className="brand" href="#top"><span>❄</span> SNOWPEAK</a><p>АДМИНИСТРАЦИЯ</p><div className="crm-nav">{[["overview","◈","Обзор"],["orders","▦","Заказы"],["reservations","◷","Брони"],["customers","◉","Клиенты"],["feedback","✉","Обращения"]].map(([id,icon,label]) => <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}><span>{icon}</span>{label}</button>)}</div><button className="crm-back" onClick={onClose}>← Вернуться в магазин</button></aside>
      <div className={`crm crm-view-${view}`}>
        <div className="crm-top"><div><p className="eyebrow">SNOWPEAK / CRM</p><h2>{{overview:"Обзор магазина",orders:"Управление заказами",reservations:"Бронирования",customers:"Клиентская база",feedback:"Обращения клиентов"}[view]}</h2></div><button className="admin-button" onClick={load}>Обновить данные</button></div>
        {error && <p className="error">{error}</p>}
        {!data && !error && <p>Загружаем данные…</p>}
        {data && (
          <>
            <div className="crm-stats">
              <div>
                <b>{data.stats.orders}</b>
                <span>заказов</span>
              </div>
              <div>
                <b>{data.stats.reservations}</b>
                <span>броней</span>
              </div>
              <div>
                <b>{data.stats.customers}</b>
                <span>клиентов</span>
              </div>
              <div>
                <b>{data.stats.feedback}</b>
                <span>обращений</span>
              </div>
            </div>
            <section className="crm-section crm-analytics"><div><p className="eyebrow">АНАЛИТИКА</p><h3>Продажи и воронка</h3><b className="revenue">{price(revenue, "ru")}</b><small>выручка по активным заказам</small></div><div className="bar-chart">{stages.map((stage) => { const count = data.orders.filter((order) => (order.status || "Новый") === stage).length; const height = Math.max(10, Math.round((count / Math.max(1, data.orders.length)) * 100)); return <div className="bar" key={stage}><span style={{ height: `${height}%` }}><i>{count}</i></span><small>{stage}</small></div>; })}</div></section>
            <section className="crm-section"><div className="crm-section-heading"><div><p className="eyebrow">ЗАКАЗЫ</p><h3>Kanban-доска</h3></div><small>Меняйте статус прямо на карточке</small></div>{data.orders.length ? <div className="kanban">{stages.map((stage) => <div className="kanban-column" key={stage}><div className="kanban-title"><b>{stage}</b><span>{data.orders.filter((order) => (order.status || "Новый") === stage).length}</span></div>{data.orders.filter((order) => (order.status || "Новый") === stage).map((order) => <article className="order-card" key={order.id}><div><small>ЗАКАЗ #{order.id}</small><b>{order.customer_name}</b><p>{order.phone}</p></div><strong>{price(order.total, "ru")}</strong><p className="order-delivery">{order.delivery}</p><select value={order.status || "Новый"} onChange={(e) => update("orders", order.id, e.target.value)}>{[...stages, "Отменён"].map((status) => <option key={status}>{status}</option>)}</select></article>)}</div>)}</div> : <p>Заказов пока нет.</p>}</section>
            <section className="crm-section">
              <h3>Брони</h3>
              {data.reservations.length ? (
                data.reservations.map((booking) => (
                  <div className="crm-row" key={booking.id}>
                    <span>
                      <b>{booking.customer_name}</b>
                      <small>{booking.phone}</small>
                    </span>
                    <span>{booking.reservation_date}</span>
                    <span>{booking.reservation_time}</span>
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        update("reservations", booking.id, e.target.value)
                      }
                    >
                      {["Новая", "Подтверждена", "Завершена", "Отменена"].map(
                        (status) => (
                          <option key={status}>{status}</option>
                        ),
                      )}
                    </select>
                  </div>
                ))
              ) : (
                <p>Броней пока нет.</p>
              )}
            </section>
            <section className="crm-section">
              <h3>Клиенты</h3>
              {data.customers.length ? (
                data.customers.map((customer) => (
                  <div className="crm-row" key={customer.id}>
                    <span>
                      <b>{customer.name}</b>
                    </span>
                    <span>{customer.email}</span>
                    <span>
                      {new Date(customer.created_at + "Z").toLocaleDateString(
                        "ru-RU",
                      )}
                    </span>
                  </div>
                ))
              ) : (
                <p>Клиентов пока нет.</p>
              )}
            </section>
            <section className="crm-section">
              <h3>Обращения</h3>
              {data.feedback.length ? (
                data.feedback.map((item) => (
                  <div className="crm-row" key={item.id}>
                    <span>
                      <b>{item.name}</b>
                      <small>{item.email}</small>
                    </span>
                    <span>{item.message}</span>
                  </div>
                ))
              ) : (
                <p>Сообщений пока нет.</p>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
