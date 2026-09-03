/* ============================================================================
   HERE & NOW — shared script, used by every page.

   Two halves to this file:

   1) Page chrome that's the same everywhere (nav, menu overlay, scroll
      reveal, homepage tile ambient wash, page-to-page transition). This
      part doesn't change when content changes.

   2) A generic BLOCK RENDERER. Every page (except the homepage, which has
      its own fixed tile grid) declares one content file to load:
        <script>window.PAGE_CONTENT_FILE = 'content-bulletin.json';</script>
      That file contains a "blocks" array — an ordered list of sections,
      each with a "type" (hero, text_image, statement, text, gallery,
      credits, faq, news_list, newsletter) and that type's own fields.
      renderBlocks() turns that array into the same HTML/CSS every block
      type already has in styles.css. This is what lets the Decap CMS
      "+ Add block" button work: adding a block in the CMS just adds one
      more entry to this array, no code change needed.
   ============================================================================ */

document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  setupNav();
  setupMenu();
  setupHomeTiles();
  setupReveal();
  setupFaqClicks();
  setupPageTransitions();
  loadBlocks();
  loadHomeTileContent();
});

/* ---------------- homepage tile content (image + caption from content.json) ---------------- */
function loadHomeTileContent() {
  var tiles = document.getElementById('tiles');
  if (!tiles) return;
  fetch('content.json').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }).then(function (data) {
    ['bulletin', 'victims', 'archive'].forEach(function (key) {
      var t = data['tile_' + key];
      if (!t) return;
      var tile = tiles.querySelector('[data-tile="' + key + '"]');
      if (!tile) return;
      if (t.image) {
        var img = tile.querySelector('.art');
        if (img) img.src = t.image;
      }
      var cap = tile.querySelector('.caption p');
      if (cap && (t.caption1 || t.caption2)) {
        cap.innerHTML = escapeHtml(t.caption1 || '') + (t.caption1 && t.caption2 ? '<br>' : '') + escapeHtml(t.caption2 || '');
      }
    });
  });
}

/* ---------------- nav scroll state ---------------- */
function setupNav() {
  var nav = document.querySelector('.nav');
  if (!nav) return;
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll);
  onScroll();
}

/* ---------------- burger / full-screen menu overlay ---------------- */
function setupMenu() {
  var burger = document.querySelector('.burger');
  var menuClose = document.querySelector('.menu-close');
  function toggleMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (burger) {
    burger.addEventListener('click', function () {
      toggleMenu(!document.body.classList.contains('menu-open'));
    });
  }
  if (menuClose) menuClose.addEventListener('click', function () { toggleMenu(false); });

  document.querySelectorAll('.menu-list > li').forEach(function (li) {
    var sub = li.querySelector('.menu-sub');
    if (!sub) return;
    var link = li.querySelector(':scope > a');
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var wasActive = li.classList.contains('active');
      document.querySelectorAll('.menu-list > li').forEach(function (other) { other.classList.remove('active'); });
      if (!wasActive) li.classList.add('active');
    });
  });
}

/* ---------------- homepage tile ambient hover-wash ---------------- */
function setupHomeTiles() {
  var ambient = document.getElementById('ambient');
  if (!ambient) return;
  document.querySelectorAll('.tile').forEach(function (tile) {
    tile.addEventListener('mouseenter', function () {
      ambient.style.background = tile.getAttribute('data-color');
      ambient.style.opacity = 0.4;
    });
  });
  var tiles = document.getElementById('tiles');
  if (tiles) tiles.addEventListener('mouseleave', function () { ambient.style.opacity = 0; });
}

/* ---------------- scroll reveal ---------------- */
function setupReveal() {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
}
/* re-run after blocks are injected, since they won't exist at DOMContentLoaded time */
function observeReveal(root) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.2 });
  (root || document).querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
}

/* ---------------- FAQ accordion (delegated, works for injected blocks too) ---------------- */
function setupFaqClicks() {
  document.addEventListener('click', function (e) {
    var item = e.target.closest && e.target.closest('.faq-item');
    if (item) item.classList.toggle('open');
  });
}

/* ---------------- page-to-page transition ---------------- */
function setupPageTransitions() {
  var glyph = document.querySelector('.transition-glyph');
  document.querySelectorAll('a[href$=".html"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || a.target === '_blank') return;
      e.preventDefault();
      document.body.classList.add('exiting');
      setTimeout(function () { window.location.href = href; }, 320);
    });
  });
}

/* ============================================================================
   BLOCK RENDERER
   ============================================================================ */

var COLOR_KEYS = {
  paper: 'var(--paper)', white: '#fff', accent: 'var(--accent)', ink: '#1a1a1a',
  bulletin: 'var(--bulletin)', 'bulletin-a': 'var(--bulletin-a)', 'bulletin-b': 'var(--bulletin-b)',
  victims: 'var(--victims)', 'victims-a': 'var(--victims-a)', 'victims-b': 'var(--victims-b)',
  archive: 'var(--archive)', 'archive-a': 'var(--archive-a)', 'archive-b': 'var(--archive-b)'
};
function resolveColor(key) {
  if (!key) return null;
  return COLOR_KEYS[key] || key; // falls through to a literal hex/CSS color if not a known key
}
// Which named background keys are dark enough to need white text. Anything
// not in this set (paper, white, bulletin, bulletin-b, archive, archive-b,
// or a plain hex an editor typed in) gets dark text instead.
var DARK_BACKGROUND_KEYS = { 'bulletin-a': 1, victims: 1, 'victims-a': 1, archive: 1, 'archive-a': 1, accent: 1, ink: 1 };
function isDarkBackground(key) { return !!(key && DARK_BACKGROUND_KEYS[key]); }

function loadBlocks() {
  var file = window.PAGE_CONTENT_FILE;
  var mount = document.getElementById('page-blocks');
  if (!file || !mount) return;

  fetch(file).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }).then(function (data) {
    var blocks = Array.isArray(data.blocks) ? data.blocks : [];
    mount.innerHTML = blocks.map(renderBlock).filter(Boolean).join('');
    observeReveal(mount);
  });
}

function renderBlock(block) {
  switch (block.type) {
    case 'hero': return renderHero(block);
    case 'text_image': return renderTextImage(block);
    case 'statement': return renderStatement(block);
    case 'text': return renderText(block);
    case 'gallery': return renderGallery(block);
    case 'credits': return renderCredits(block);
    case 'faq': return renderFaq(block);
    case 'news_list': return renderNewsList(block);
    case 'newsletter': return renderNewsletter(block);
    default: return '';
  }
}

function renderHero(b) {
  var overlay = b.dark === false ? '' :
    '<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.1) 0%,rgba(0,0,0,.75) 100%);"></div>';
  return '' +
    '<div class="hero">' +
      (b.image ? '<img class="photo" src="' + escapeAttr(b.image) + '" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">' : '') +
      '<div class="grain"></div>' + overlay +
      '<div class="hero__content">' +
        '<div class="title squeeze">' + escapeHtml(b.title || '') + '</div>' +
        (b.meta ? '<div class="meta">' + escapeHtml(b.meta) + '</div>' : '') +
      '</div>' +
    '</div>';
}

function paragraphs(body) {
  return String(body || '').split(/\n\s*\n/).map(function (p) {
    return '<p>' + escapeHtml(p.trim()) + '</p>';
  }).join('');
}

function renderTextImage(b) {
  var bg = resolveColor(b.background);
  var color = b.text_color ? resolveColor(b.text_color) : (isDarkBackground(b.background) ? '#fff' : '#1a1a1a');
  var sideClass = b.position === 'left' ? ' left' : '';
  var style = 'style="' + (bg ? 'background:' + bg + ';' : '') + 'color:' + color + ';"';
  return '' +
    '<section class="section reveal' + sideClass + '" ' + style + '>' +
      '<div class="wrap">' +
        (b.image ? '<div class="images"><img src="' + escapeAttr(b.image) + '" alt=""><div class="grain"></div></div>' : '') +
        '<div class="article">' +
          (b.heading ? '<h2>' + escapeHtml(b.heading) + '</h2>' : '') +
          paragraphs(b.body) +
          (b.link_text ? '<a href="' + escapeAttr(b.link_url || '#') + '" class="readmore" style="color:' + color + ';">' + escapeHtml(b.link_text) + ' <span class="arrow">&rarr;</span></a>' : '') +
        '</div>' +
      '</div>' +
    '</section>';
}

function renderStatement(b) {
  var bg = resolveColor(b.background) || 'var(--ink)';
  return '' +
    '<section class="section section--dark reveal" style="background:' + bg + ';">' +
      '<div class="wrap">' +
        '<div class="article">' +
          (b.heading ? '<h2>' + escapeHtml(b.heading) + '</h2>' : '') +
          '<p style="font-style:italic;font-size:1.15rem;line-height:1.6;">' + escapeHtml(b.quote || '') + '</p>' +
          (b.attribution ? '<div style="margin-top:1.2rem;font-family:\'Chivo Mono\',monospace;font-weight:700;font-size:12px;letter-spacing:.06em;text-transform:uppercase;opacity:.8;">&mdash; ' + escapeHtml(b.attribution) + '</div>' : '') +
        '</div>' +
      '</div>' +
    '</section>';
}

function renderText(b) {
  var bg = resolveColor(b.background) || 'var(--paper)';
  var maxWidth = b.width === 'wide' ? 'none' : '800px';
  return '' +
    '<section class="section--paper reveal" style="background:' + bg + ';padding:50px 0;">' +
      '<div class="wrap" style="max-width:' + maxWidth + ';display:block;text-align:left;">' +
        (b.heading ? '<h2>' + escapeHtml(b.heading) + '</h2>' : '') +
        paragraphs(b.body).replace(/<p>/g, '<p style="max-width:none;">') +
      '</div>' +
    '</section>';
}

function renderGallery(b) {
  var items = Array.isArray(b.items) ? b.items : [];
  return '' +
    '<section class="section--paper reveal" style="padding:50px 0;">' +
      (b.heading ? '<div class="wrap" style="max-width:1300px;display:block;"><h2>' + escapeHtml(b.heading) + '</h2></div>' : '') +
      '<div class="gallery-grid" style="margin-top:2rem;">' +
        items.map(function (it) {
          return '<figure class="gallery-item">' +
            (it.image ? '<img src="' + escapeAttr(it.image) + '" alt="">' : '') +
            '<div class="grain"></div>' +
            (it.caption ? '<figcaption>' + escapeHtml(it.caption) + '</figcaption>' : '') +
            '</figure>';
        }).join('') +
      '</div>' +
    '</section>';
}

var CREDIT_FALLBACK_COLORS = ['var(--bulletin)', 'var(--victims)', 'var(--archive)'];
function renderCredits(b) {
  var items = Array.isArray(b.items) ? b.items : [];
  return '' +
    '<div class="lineup reveal">' +
      '<div class="head"><h2>' + escapeHtml(b.heading || "Who's involved") + '</h2></div>' +
      '<div class="list">' +
        items.map(function (it, i) {
          var color = it.color || CREDIT_FALLBACK_COLORS[i % CREDIT_FALLBACK_COLORS.length];
          return '<div class="item" style="background:' + resolveColor(color) + ';opacity:.85;">' +
            '<div class="img"><div class="swatch" style="background:' + resolveColor(color) + ';"></div></div>' +
            '<div><h3>' + escapeHtml(it.role || '') + '</h3><p>' + escapeHtml(it.name || 'TBC') + '</p></div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
}

function renderFaq(b) {
  var items = Array.isArray(b.items) ? b.items : [];
  return '' +
    '<div class="faq reveal">' +
      '<h2>' + escapeHtml(b.heading || 'Good to know') + '</h2>' +
      items.map(function (it) {
        return '<div class="faq-item"><div class="q">' + escapeHtml(it.question || '') + ' <span class="plus">+</span></div>' +
          '<div class="a">' + escapeHtml(it.answer || '') + '</div></div>';
      }).join('') +
    '</div>';
}

function renderNewsList(b) {
  var items = Array.isArray(b.items) ? b.items : [];
  return '' +
    '<section class="section--paper reveal" style="padding:50px 0;">' +
      '<div class="news-list">' +
        items.map(function (it) {
          return '<div class="news-item">' +
            (it.date ? '<div class="date">' + escapeHtml(it.date) + '</div>' : '') +
            '<h3>' + escapeHtml(it.headline || '') + '</h3>' +
            '<p>' + escapeHtml(it.body || '') + '</p>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</section>';
}

function renderNewsletter(b) {
  var bg = resolveColor(b.background) || 'var(--accent)';
  return '' +
    '<div class="newsletter reveal" style="background:' + bg + ';">' +
      '<h2>' + escapeHtml(b.heading || 'Stay in the loop') + '</h2>' +
      (b.subtext ? '<p style="color:rgba(255,255,255,.7);margin:-0.5rem 0 1.5rem;font-size:14px;">' + escapeHtml(b.subtext) + '</p>' : '') +
      '<form><input type="email" placeholder="Your email address"><button type="submit">Sign up</button></form>' +
    '</div>';
}

/* ---------------- helpers ---------------- */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}
