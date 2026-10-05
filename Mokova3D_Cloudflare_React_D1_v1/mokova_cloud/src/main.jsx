import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import productsSeed from './products.json';
import categoriesSeed from './categories.json';
import reviewsSeed from './reviews.json';
import faqSeed from './faq.json';
import siteSeed from './site-config.json';

const API = '/api';

const wa = (text = 'Hi Mokova, I want to enquire about a product.') =>
`https://wa.me/${siteSeed.whatsapp}?text=${encodeURIComponent(text)}`;

const slugify = s =>
String(s || '')
.toLowerCase()
.trim()
.replace(/[^a-z0-9]+/g, '-')
.replace(/^-|-$/g, '');

const money = v => String(v || '');

function useData() {
const [data, setData] = useState({
products: productsSeed.products,
categories: categoriesSeed.categories,
reviews: reviewsSeed.reviews,
faq: faqSeed.items,
site: siteSeed
});

useEffect(() => {
fetch(API + '/bootstrap')
.then(r => (r.ok ? r.json() : null))
.then(d => d && setData(d))
.catch(() => {});
}, []);

return data;
}

function track(type, productId) {
fetch(API + '/analytics', {
method: 'POST',
headers: {
'content-type': 'application/json'
},
body: JSON.stringify({
type,
productId
})
}).catch(() => {});
}

function Header() {
const [open, setOpen] = useState(false);

return (
<> <div className="topbar">
Custom orders available · Delhi & NCR ·{' '} <a href={wa()}>Chat with Mokova</a> </div>

```
  <header className="header">
    <a className="brand" href="/">
      <img src="/assets/logo.png" />
      <span>
        Mokova<span>3D</span>
      </span>
    </a>

    <button className="menu" onClick={() => setOpen(!open)}>
      ☰
    </button>

    <nav className={open ? 'nav open' : 'nav'}>
      <a href="/products">Shop</a>
      <a href="/gallery">Gallery</a>
      <a href="/blog">Blog</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
      <a className="nav-cta" href={wa()}>
        WhatsApp
      </a>
    </nav>
  </header>
</>
```

);
}

function Footer() {
return ( <footer> <div className="footer-grid"> <div> <div className="brand footer-brand"> <img src="/assets/logo.png" /> <span>
Mokova<span>3D</span> </span> </div>

```
      <p>
        Creative 3D printing, décor, gifts, prototypes and custom-made
        pieces.
      </p>
    </div>

    <div>
      <h4>Shop</h4>
      <a href="/products">All Products</a>
      <a href="/gallery">Gallery</a>
      <a href="/blog">Blog</a>
    </div>

    <div>
      <h4>Help</h4>
      <a href="/faq">FAQ</a>
      <a href="/shipping">Shipping</a>
      <a href="/returns">Returns</a>
      <a href="/contact">Contact</a>
    </div>

    <div>
      <h4>Legal</h4>
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
    </div>
  </div>

  <div className="footer-bottom">
    © {new Date().getFullYear()} Mokova3D · Made with creativity in India
  </div>
</footer>
```

);
}

function SEO({title, description}) {
useEffect(() => {
document.title = title || siteSeed.metaTitle;

```
let m = document.querySelector('meta[name=description]');

if (!m) {
  m = document.createElement('meta');
  m.name = 'description';
  document.head.appendChild(m);
}

m.content = description || siteSeed.metaDescription;
```

}, [title, description]);

return null;
}

function Layout({children, title, description}) {
return (
<> <SEO title={title} description={description} /> <Header /> <main>{children}</main> <Footer />
</>
);
}

function Banner({site}) {
const bs = site.banners || [];
const [i, setI] = useState(0);

useEffect(() => {
if (bs.length > 1) {
const t = setInterval(() => {
setI(x => (x + 1) % bs.length);
}, 5000);

```
  return () => clearInterval(t);
}
```

}, [bs.length]);

const b = bs[i] || {};

return ( <section className="hero">
<img src={b.image || '/assets/hero.jpg'} />

```
  <div className="hero-shade" />

  <div className="hero-copy">
    <span className="eyebrow">
      {b.badge || site.heroEyebrow}
    </span>

    <h1>{b.title || site.heroTitle}</h1>

    <p>
      {b.subtitle || site.heroDescription}
    </p>

    <div className="actions">
      <a
        className="btn primary"
        href={b.buttonUrl || b.link || '/products'}
      >
        {b.buttonText || b.button || site.heroPrimary}
      </a>

      <a className="btn ghost" href={wa()}>
        {site.heroSecondary || 'Start a Project'}
      </a>
    </div>
  </div>

  {bs.length > 1 && (
    <div className="hero-dots">
      {bs.map((_, n) => (
        <button
          key={n}
          className={n === i ? 'active' : ''}
          onClick={() => setI(n)}
        />
      ))}
    </div>
  )}
</section>
```

);
}

function ProductCard({p}) {
return ( <article className="card product-card">
<a
href={`/product/${p.id}`}
onClick={() => track('view', p.id)}
> <div className="product-image">
<img src={'/' + p.image} alt={p.name} />

```
      {p.badge && (
        <span className="badge">
          {p.badge}
        </span>
      )}
    </div>

    <div className="card-body">
      <div className="muted">
        {(p.categories || [p.category])
          .slice(0, 1)
          .join('')}
      </div>

      <h3>{p.name}</h3>

      <div className="price">
        {money(p.price || 'Ask on WhatsApp')}
      </div>

      <span className="view-link">
        View product →
      </span>
    </div>
  </a>
</article>
```

);
}

function Home({data}) {
const featured = data.products
.filter(p => p.active && p.featured)
.slice(0, 8);

return ( <Layout
   title={data.site.metaTitle}
   description={data.site.metaDescription}
 > <Banner site={data.site} />

```
  <section className="section">
    <div className="section-head">
      <div>
        <span className="eyebrow dark">
          Explore
        </span>

        <h2>Shop by category</h2>
      </div>

      <a href="/products">
        View all →
      </a>
    </div>

    <div className="category-grid">
      {data.categories.slice(0, 8).map(c => (
        <a
          className="category-tile"
          key={c.id}
          href={`/products?category=${c.id}`}
        >
          <div>
            {c.image ? (
              <img src={'/' + c.image} />
            ) : (
              <span>✦</span>
            )}
          </div>

          <h3>{c.name}</h3>

          <p>
            {c.description || 'Explore the collection'}
          </p>
        </a>
      ))}
    </div>
  </section>

  <section className="section alt">
    <div className="section-head">
      <div>
        <span className="eyebrow dark">
          Curated for you
        </span>

        <h2>Featured products</h2>
      </div>

      <a href="/products">
        Shop all →
      </a>
    </div>

    <div className="product-grid">
      {featured.map(p => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  </section>

  <section className="split-cta">
    <div>
      <span className="eyebrow dark">
        Made for your idea
      </span>

      <h2>
        Custom 3D printing without the hassle.
      </h2>

      <p>
        Have a model, reference image or just an idea?
        Tell us what you need and we’ll help turn it into
        a real object.
      </p>

      <a
        className="btn dark"
        href={wa(
          'Hi Mokova, I want a custom 3D printing quote.'
        )}
      >
        Start a custom project
      </a>
    </div>

    <img
      src="/assets/hero.jpg"
      alt="Custom 3D printing by Mokova3D"
    />
  </section>

  <section className="section">
    <div className="section-head">
      <div>
        <span className="eyebrow dark">
          Why Mokova
        </span>

        <h2>
          Designed, printed and packed with care.
        </h2>
      </div>
    </div>

    <div className="benefits">
      <div>
        <b>01</b>
        <h3>Made to order</h3>
        <p>
          Small-batch and custom pieces made around your
          requirement.
        </p>
      </div>

      <div>
        <b>02</b>
        <h3>Useful & creative</h3>
        <p>
          From décor and gifts to functional prints and
          prototypes.
        </p>
      </div>

      <div>
        <b>03</b>
        <h3>WhatsApp support</h3>
        <p>
          Quick human help before you place a custom
          enquiry.
        </p>
      </div>
    </div>
  </section>
</Layout>
```

);
}

function Products({data}) {
const params = new URLSearchParams(location.search);
const [q, setQ] = useState('');
const [cat, setCat] = useState(
params.get('category') || ''
);

const list = useMemo(
() =>
data.products.filter(
p =>
p.active &&
(!cat ||
(p.categoryIds || []).includes(cat) ||
p.categoryId === cat) &&
(!q ||
p.name
.toLowerCase()
.includes(q.toLowerCase()))
),
[data.products, cat, q]
);

return ( <Layout
   title="Shop 3D Printed Products | Mokova3D"
   description="Shop creative 3D printed décor, gifts, collectibles and custom products from Mokova3D."
 > <section className="page-head"> <span className="eyebrow dark">
Mokova3D shop </span>

```
    <h1>Products made to delight.</h1>

    <p>
      Browse ready-to-buy pieces or send us your idea
      for a custom print.
    </p>
  </section>

  <section className="shop-tools">
    <input
      value={q}
      onChange={e => setQ(e.target.value)}
      placeholder="Search products…"
    />

    <select
      value={cat}
      onChange={e => setCat(e.target.value)}
    >
      <option value="">
        All categories
      </option>

      {data.categories.map(c => (
        <option value={c.id} key={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  </section>

  <section className="section">
    <div className="result-count">
      {list.length} products
    </div>

    <div className="product-grid">
      {list.map(p => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  </section>
</Layout>
```

);
}

function Product({data, id}) {
const p = data.products.find(x => x.id === id);

const reviews = data.reviews.filter(
r =>
r.productId === id &&
r.visible !== false
);

const [ri, setRi] = useState(0);

useEffect(() => {
if (p) {
track('view', p.id);
}
}, [p?.id]);

if (!p) {
return ( <Layout> <section className="empty"> <h1>Product not found</h1>

```
      <a
        className="btn primary"
        href="/products"
      >
        Back to shop
      </a>
    </section>
  </Layout>
);
```

}

const review =
reviews[
ri % Math.max(reviews.length, 1)
];

const handleShare = async () => {
try {
if (navigator.share) {
await navigator.share({
title: p.name,
url: location.href
});
} else if (navigator.clipboard) {
await navigator.clipboard.writeText(
location.href
);

```
    alert('Product link copied!');
  } else {
    const text = location.href;

    window.prompt(
      'Copy this product link:',
      text
    );
  }

  track('share', p.id);
} catch (error) {
  console.log(
    'Share cancelled or failed:',
    error
  );
}
```

};

return (
<Layout
title={`${p.name} | Mokova3D`}
description={
p.seoDescription || p.description
}
> <section className="product-detail"> <div className="gallery-main">
<img
src={'/' + p.image}
alt={p.name}
/> </div>

```
    <div className="product-info">
      <div className="muted">
        {(p.categories || []).join(' · ')}
      </div>

      <h1>{p.name}</h1>

      <div className="big-price">
        {money(
          p.price || 'Ask on WhatsApp'
        )}
      </div>

      <p>{p.description}</p>

      <div className="product-meta">
        <span>✓ Quality checked</span>
        <span>✓ Delhi & NCR delivery</span>
        <span>✓ Customisation available</span>
      </div>

      <a
        className="btn primary full"
        href={wa(
          `Hi Mokova, I want to enquire about ${p.name}.`
        )}
        onClick={() =>
          track('whatsapp', p.id)
        }
      >
        Enquire on WhatsApp
      </a>

      <button
        className="btn secondary full"
        onClick={handleShare}
      >
        Share this product
      </button>
    </div>
  </section>

  <section className="section">
    <div className="section-head">
      <div>
        <span className="eyebrow dark">
          Customer reviews
        </span>

        <h2>
          What customers are saying
        </h2>
      </div>

      <span>
        {reviews.length} reviews
      </span>
    </div>

    {review ? (
      <div className="review-feature">
        <div className="stars">
          {'★'.repeat(
            Number(review.rating || 5)
          )}
        </div>

        <blockquote>
          “
          {review.comment ||
            'Great product and experience with Mokova.'}
          ”
        </blockquote>

        <strong>
          {review.reviewer_name ||
            review.name ||
            'Mokova customer'}
        </strong>

        <div className="review-controls">
          <button
            onClick={() =>
              setRi(
                (ri - 1 + reviews.length) %
                  reviews.length
              )
            }
          >
            ←
          </button>

          <span>
            {ri + 1} / {reviews.length}
          </span>

          <button
            onClick={() =>
              setRi(
                (ri + 1) %
                  reviews.length
              )
            }
          >
            →
          </button>
        </div>
      </div>
    ) : (
      <p>No reviews yet.</p>
    )}
  </section>

  <section className="section alt">
    <div className="detail-columns">
      <div>
        <h2>
          Need a custom version?
        </h2>

        <p>
          Tell us the size, colour, quantity or
          reference you have in mind.
        </p>
      </div>

      <a
        className="btn dark"
        href={wa(
          `Hi Mokova, I want a custom version of ${p.name}.`
        )}
      >
        Ask for customisation
      </a>
    </div>
  </section>
</Layout>
```

);
}

function StaticPage({title, children}) {
return (
<Layout title={`${title} | Mokova3D`}> <section className="page-head"> <span className="eyebrow dark">
Mokova3D </span>

```
    <h1>{title}</h1>
  </section>

  <section className="content-page">
    {children}
  </section>
</Layout>
```

);
}

function Blog({data}) {
const posts = data.blog || [];

return ( <StaticPage title="Mokova3D Journal | 3D Printing Guides & Ideas"> <p className="lead">
Ideas, guides and inspiration around 3D
printing, gifting, décor and making. </p>

```
  <div className="blog-grid">
    {posts.length ? (
      posts.map(p => (
        <article key={p.id}>
          <img
            src={
              p.featured_image
                ? `/${p.featured_image}`
                : '/assets/hero.jpg'
            }
          />

          <h2>{p.title}</h2>

          <p>
            {p.excerpt ||
              'Read the latest Mokova3D article.'}
          </p>

          <a href={`/blog/${p.slug}`}>
            Read article →
          </a>
        </article>
      ))
    ) : (
      <>
        <article>
          <img src="/assets/hero.jpg" />

          <h2>
            What can you make with 3D printing?
          </h2>

          <p>
            Explore practical, decorative and
            personalised possibilities.
          </p>

          <a href="/blog/3d-printing-ideas">
            Read article →
          </a>
        </article>

        <article>
          <img src="/assets/products/cat.jpg" />

          <h2>
            Why 3D printed décor makes a thoughtful
            gift
          </h2>

          <p>
            Small, personal and easy to customise.
          </p>

          <a href="/blog/3d-printed-gifts">
            Read article →
          </a>
        </article>
      </>
    )}
  </div>
</StaticPage>
```

);
}

function Admin() {
const [auth, setAuth] = useState(false);
const [pw, setPw] = useState('');
const [tab, setTab] = useState('dashboard');
const [data, setData] = useState(null);
const [msg, setMsg] = useState('');

useEffect(() => {
fetch(API + '/admin/me')
.then(r => r.ok && setAuth(true))
.catch(() => {});
}, []);

useEffect(() => {
if (auth) {
fetch(API + '/admin/data')
.then(r => r.json())
.then(setData)
.catch(() => {});
}
}, [auth]);

if (!auth) {
return ( <div className="admin-login"> <div className="admin-box"> <img src="/assets/logo.png" />

```
      <h1>Mokova Admin</h1>

      <p>
        Secure management dashboard
      </p>

      <input
        type="password"
        value={pw}
        onChange={e =>
          setPw(e.target.value)
        }
        placeholder="Admin password"
      />

      <button
        className="btn primary full"
        onClick={() =>
          fetch(API + '/admin/login', {
            method: 'POST',
            headers: {
              'content-type':
                'application/json'
            },
            body: JSON.stringify({
              password: pw
            })
          }).then(r => {
            if (r.ok) {
              setAuth(true);
              setMsg('');
            } else {
              setMsg(
                'Incorrect password'
              );
            }
          })
        }
      >
        Login
      </button>

      <small>{msg}</small>
    </div>
  </div>
);
```

}

const save = (endpoint, payload) =>
fetch(API + endpoint, {
method: 'PUT',
headers: {
'content-type': 'application/json'
},
body: JSON.stringify(payload)
})
.then(r => r.json())
.then(d => {
setData(d.data || data);
setMsg('Saved successfully');
});

return ( <div className="admin-shell"> <aside> <div className="admin-brand"> <img src="/assets/logo.png" />
Mokova Admin </div>

```
    {[
      'dashboard',
      'products',
      'banners',
      'reviews',
      'blog',
      'gallery',
      'pages',
      'enquiries',
      'analytics',
      'settings'
    ].map(x => (
      <button
        className={
          tab === x ? 'active' : ''
        }
        onClick={() => setTab(x)}
        key={x}
      >
        {x}
      </button>
    ))}
  </aside>

  <section className="admin-main">
    <div className="admin-top">
      <div>
        <span className="eyebrow dark">
          Control centre
        </span>

        <h1>{tab}</h1>
      </div>

      <a
        href="/"
        className="btn secondary"
      >
        View site
      </a>
    </div>

    {msg && (
      <div className="notice">
        {msg}
      </div>
    )}

    {!data ? (
      <p>Loading…</p>
    ) : tab === 'dashboard' ? (
      <div className="admin-cards">
        <Stat
          label="Products"
          value={data.products.length}
        />

        <Stat
          label="Reviews"
          value={data.reviews.length}
        />

        <Stat
          label="Blog posts"
          value={data.blog?.length || 0}
        />

        <Stat
          label="Enquiries"
          value={
            data.enquiries?.length || 0
          }
        />
      </div>
    ) : tab === 'products' ? (
      <ProductAdmin
        data={data}
        save={save}
      />
    ) : tab === 'banners' ? (
      <BannerAdmin
        data={data}
        save={save}
      />
    ) : tab === 'reviews' ? (
      <ReviewAdmin
        data={data}
        save={save}
      />
    ) : tab === 'blog' ? (
      <BlogAdmin
        data={data}
        save={save}
      />
    ) : tab === 'gallery' ? (
      <GalleryAdmin
        data={data}
        save={save}
      />
    ) : tab === 'pages' ? (
      <PagesAdmin
        data={data}
        save={save}
      />
    ) : tab === 'enquiries' ? (
      <EnquiryAdmin data={data} />
    ) : tab === 'analytics' ? (
      <AnalyticsAdmin data={data} />
    ) : (
      <SettingsAdmin
        data={data}
        save={save}
      />
    )}
  </section>
</div>
```

);
}

const Stat = ({label, value}) => (

  <div className="stat">
    <span>{label}</span>
    <b>{value}</b>
  </div>
);

function ProductAdmin({data, save}) {
const [items, setItems] = useState(
data.products
);

return ( <div> <div className="admin-actions">
<button
className="btn primary"
onClick={() =>
save('/admin/products', items)
}
>
Save products </button> </div>

```
  <div className="admin-table">
    {items.map((p, i) => (
      <div
        className="admin-row"
        key={p.id}
      >
        <input
          value={p.name}
          onChange={e => {
            const a = [...items];

            a[i] = {
              ...a[i],
              name: e.target.value
            };

            setItems(a);
          }}
        />

        <input
          value={p.price || ''}
          onChange={e => {
            const a = [...items];

            a[i] = {
              ...a[i],
              price: e.target.value
            };

            setItems(a);
          }}
        />

        <label>
          <input
            type="checkbox"
            checked={p.active}
            onChange={e => {
              const a = [...items];

              a[i] = {
                ...a[i],
                active: e.target.checked
              };

              setItems(a);
            }}
          />{' '}
          Active
        </label>
      </div>
    ))}
  </div>
</div>
```

);
}

function BannerAdmin({data, save}) {
const [items, setItems] = useState(
data.site.banners || []
);

return ( <div> <div className="admin-actions">
<button
className="btn primary"
onClick={() =>
save('/admin/site', {
...data.site,
banners: items
})
}
>
Save banners </button> </div>

```
  {items.map((b, i) => (
    <div
      className="editor-card"
      key={i}
    >
      <input
        placeholder="Image path"
        value={b.image || ''}
        onChange={e => {
          const a = [...items];

          a[i] = {
            ...a[i],
            image: e.target.value
          };

          setItems(a);
        }}
      />

      <input
        placeholder="Title"
        value={b.title || ''}
        onChange={e => {
          const a = [...items];

          a[i] = {
            ...a[i],
            title: e.target.value
          };

          setItems(a);
        }}
      />

      <input
        placeholder="Subtitle"
        value={b.subtitle || ''}
        onChange={e => {
          const a = [...items];

          a[i] = {
            ...a[i],
            subtitle: e.target.value
          };

          setItems(a);
        }}
      />

      <input
        placeholder="Button URL"
        value={b.buttonUrl || ''}
        onChange={e => {
          const a = [...items];

          a[i] = {
            ...a[i],
            buttonUrl: e.target.value
          };

          setItems(a);
        }}
      />
    </div>
  ))}

  <button
    className="btn secondary"
    onClick={() =>
      setItems([
        ...items,
        {
          image: '/assets/hero.jpg',
          title: 'New Mokova banner',
          subtitle:
            'Add your campaign message',
          buttonText: 'Shop now',
          buttonUrl: '/products'
        }
      ])
    }
  >
    + Add banner
  </button>
</div>
```

);
}

function ReviewAdmin({data, save}) {
const [items, setItems] = useState(
data.reviews
);

return ( <div>
<button
className="btn primary"
onClick={() =>
save('/admin/reviews', items)
}
>
Save reviews </button>

```
  <div className="admin-table">
    {items.slice(0, 50).map((r, i) => (
      <div
        className="admin-row"
        key={r.id || i}
      >
        <b>
          {r.reviewer_name || r.name}
        </b>

        <span>
          {r.rating} ★
        </span>

        <input
          value={r.comment || ''}
          onChange={e => {
            const a = [...items];

            a[i] = {
              ...a[i],
              comment: e.target.value
            };

            setItems(a);
          }}
        />
      </div>
    ))}
  </div>

  <p className="muted">
    Showing first 50 for quick editing;
    API supports the complete set.
  </p>
</div>
```

);
}

function BlogAdmin({data, save}) {
const [posts, setPosts] = useState(
data.blog || []
);

const add = () =>
setPosts([
...posts,
{
id: crypto.randomUUID(),
title: 'New blog post',
slug: 'new-blog-post',
excerpt: '',
content: '',
status: 'draft'
}
]);

return ( <div> <div className="admin-actions"> <button
       className="btn secondary"
       onClick={add}
     >
+ Add post </button>

```
    <button
      className="btn primary"
      onClick={() =>
        save('/admin/blog', posts)
      }
    >
      Save blog
    </button>
  </div>

  {posts.map((p, i) => (
    <div
      className="editor-card"
      key={p.id}
    >
      <input
        value={p.title}
        onChange={e => {
          const a = [...posts];

          a[i] = {
            ...a[i],
            title: e.target.value
          };

          setPosts(a);
        }}
      />

      <input
        value={p.slug}
        onChange={e => {
          const a = [...posts];

          a[i] = {
            ...a[i],
            slug: e.target.value
          };

          setPosts(a);
        }}
      />

      <textarea
        value={p.content || ''}
        onChange={e => {
          const a = [...posts];

          a[i] = {
            ...a[i],
            content: e.target.value
          };

          setPosts(a);
        }}
      />
    </div>
  ))}
</div>
```

);
}

function GalleryAdmin({data, save}) {
const [items, setItems] = useState(
data.gallery || []
);

return ( <div>
<button
className="btn primary"
onClick={() =>
save('/admin/gallery', items)
}
>
Save gallery </button>

```
  {items.map((g, i) => (
    <div
      className="editor-card"
      key={g.id || i}
    >
      <input
        value={g.image || g.src || ''}
        onChange={e => {
          const a = [...items];

          a[i] = {
            ...a[i],
            image: e.target.value
          };

          setItems(a);
        }}
      />

      <input
        value={g.category || ''}
        onChange={e => {
          const a = [...items];

          a[i] = {
            ...a[i],
            category: e.target.value
          };

          setItems(a);
        }}
      />
    </div>
  ))}
</div>
```

);
}

function PagesAdmin({data, save}) {
const [pages, setPages] = useState(
data.pages || {}
);

return ( <div>
<button
className="btn primary"
onClick={() =>
save('/admin/pages', pages)
}
>
Save pages </button>

```
  {Object.entries(pages).map(
    ([slug, p]) => (
      <div
        className="editor-card"
        key={slug}
      >
        <b>{slug}</b>

        <input
          value={
            p.title ||
            p.name ||
            ''
          }
          onChange={e =>
            setPages({
              ...pages,
              [slug]: {
                ...p,
                title: e.target.value
              }
            })
          }
        />

        <textarea
          value={
            p.content ||
            p.text ||
            ''
          }
          onChange={e =>
            setPages({
              ...pages,
              [slug]: {
                ...p,
                content: e.target.value
              }
            })
          }
        />
      </div>
    )
  )}
</div>
```

);
}

const EnquiryAdmin = ({data}) => (

  <div className="admin-table">
    {(data.enquiries || []).map(e => (
      <div
        className="admin-row"
        key={e.id}
      >
        <b>{e.name}</b>

```
    <span>
      {e.email || e.phone}
    </span>

    <span>{e.message}</span>
  </div>
))}

{!(data.enquiries || []).length && (
  <p>No enquiries yet.</p>
)}
```

  </div>
);

const AnalyticsAdmin = ({data}) => (

  <div className="admin-cards">
    <Stat
      label="Views"
      value={data.analytics?.views || 0}
    />

```
<Stat
  label="Shares"
  value={data.analytics?.shares || 0}
/>

<Stat
  label="WhatsApp clicks"
  value={
    data.analytics?.whatsapp || 0
  }
/>

<Stat
  label="Enquiries"
  value={
    data.analytics?.enquiries || 0
  }
/>
```

  </div>
);

function SettingsAdmin({data, save}) {
const [site, setSite] = useState(
data.site
);

return ( <div className="editor-card">
<input
value={site.metaTitle || ''}
onChange={e =>
setSite({
...site,
metaTitle: e.target.value
})
}
/>

```
  <textarea
    value={
      site.metaDescription || ''
    }
    onChange={e =>
      setSite({
        ...site,
        metaDescription:
          e.target.value
      })
    }
  />

  <input
    value={site.whatsapp || ''}
    onChange={e =>
      setSite({
        ...site,
        whatsapp: e.target.value
      })
    }
  />

  <button
    className="btn primary"
    onClick={() =>
      save('/admin/site', site)
    }
  >
    Save settings
  </button>
</div>
```

);
}

function Contact() {
const [f, setF] = useState({
name: '',
phone: '',
email: '',
product: '',
message: ''
});

const [sent, setSent] = useState(false);

const submit = e => {
e.preventDefault();

```
fetch(API + '/enquiry', {
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    ...f,
    source: 'website'
  })
}).then(r => {
  if (r.ok) {
    setSent(true);

    setF({
      name: '',
      phone: '',
      email: '',
      product: '',
      message: ''
    });

    track('enquiry');
  }
});
```

};

return ( <StaticPage title="Contact & Custom Orders"> <div className="contact-form"> <p className="lead">
Tell us what you need and we’ll get
back to you. </p>

```
    {sent && (
      <div className="notice">
        Thanks! Your enquiry has been
        received.
      </div>
    )}

    <form onSubmit={submit}>
      <input
        required
        placeholder="Name"
        value={f.name}
        onChange={e =>
          setF({
            ...f,
            name: e.target.value
          })
        }
      />

      <input
        required
        placeholder="Phone / WhatsApp"
        value={f.phone}
        onChange={e =>
          setF({
            ...f,
            phone: e.target.value
          })
        }
      />

      <input
        type="email"
        placeholder="Email"
        value={f.email}
        onChange={e =>
          setF({
            ...f,
            email: e.target.value
          })
        }
      />

      <input
        placeholder="Product / project"
        value={f.product}
        onChange={e =>
          setF({
            ...f,
            product: e.target.value
          })
        }
      />

      <textarea
        required
        placeholder="Tell us about your requirement"
        value={f.message}
        onChange={e =>
          setF({
            ...f,
            message: e.target.value
          })
        }
      />

      <button className="btn primary">
        Send enquiry
      </button>
    </form>
  </div>
</StaticPage>
```

);
}

function BlogPost({data, slug}) {
const p = (data.blog || []).find(
x => x.slug === slug
);

if (!p) {
return ( <StaticPage title="Article not found"> <a
       className="btn primary"
       href="/blog"
     >
Back to blog </a> </StaticPage>
);
}

return ( <StaticPage title={p.title}> <div className="article">
{p.featured_image && (
<img
src={
p.featured_image.startsWith('/')
? p.featured_image
: '/' + p.featured_image
}
alt={p.title}
/>
)}

```
    <div
      dangerouslySetInnerHTML={{
        __html:
          p.content ||
          `<p>${p.excerpt || ''}</p>`
      }}
    />
  </div>
</StaticPage>
```

);
}

function ContentPage({path, data}) {
const map = {
about: 'About Mokova3D',
contact: 'Contact & Custom Orders',
shipping: 'Shipping & Delivery',
returns: 'Returns & Replacement',
privacy: 'Privacy Policy',
terms: 'Terms & Conditions',
faq: 'Frequently Asked Questions'
};

const title =
map[path] || 'Mokova3D';

if (path === 'faq') {
return ( <StaticPage title={title}>
{data.faq.map((x, i) => ( <details key={i}> <summary>
{x.question} </summary>

```
        <p>{x.answer}</p>
      </details>
    ))}
  </StaticPage>
);
```

}

const page =
(data.pages || {})[path];

return ( <StaticPage title={title}>
{page?.content ? (
<div
dangerouslySetInnerHTML={{
__html: page.content
}}
/>
) : (
<> <p className="lead">
Mokova3D creates thoughtful 3D
printed products, custom décor,
gifts and functional pieces. </p>

```
      <p>
        For product enquiries and custom
        projects, chat with us on WhatsApp.
      </p>

      <a
        className="btn primary"
        href={wa()}
      >
        Chat with Mokova
      </a>
    </>
  )}
</StaticPage>
```

);
}

function App() {
const data = useData();

const path = location.pathname
.replace(/^//, '')
.replace(//$/, '');

if (path === 'admin') {
return <Admin />;
}

if (path === '') {
return <Home data={data} />;
}

if (path === 'products') {
return <Products data={data} />;
}

if (path.startsWith('product/')) {
return (
<Product
data={data}
id={path.split('/')[1]}
/>
);
}

if (path === 'blog') {
return <Blog data={data} />;
}

if (path.startsWith('blog/')) {
return (
<BlogPost
data={data}
slug={path.split('/')[1]}
/>
);
}

if (path === 'contact') {
return <Contact />;
}

if (
[
'about',
'shipping',
'returns',
'privacy',
'terms',
'faq'
].includes(path)
) {
return ( <ContentPage
     path={path}
     data={data}
   />
);
}

return ( <StaticPage title="Page not found"> <a
     className="btn primary"
     href="/"
   >
Go home </a> </StaticPage>
);
}

createRoot(
document.getElementById('root')
).render(<App />);
