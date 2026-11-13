/* Projects page: category filter */
(function () {
  var cats = document.querySelectorAll('[data-cat]');
  var cards = document.querySelectorAll('[data-card]');
  var count = document.getElementById('count');
  function pick(k) {
    var shown = 0;
    cards.forEach(function (c) {
      var show = k === 0 || Number(c.getAttribute('data-card')) === k;
      c.style.display = show ? '' : 'none';
      if (show) shown++;
    });
    cats.forEach(function (li) {
      var on = Number(li.getAttribute('data-cat')) === k;
      li.style.color = on ? '#1F1B1A' : '#5E5450';
      li.style.fontWeight = on ? '500' : '';
      li.firstElementChild.style.opacity = on ? '1' : '0';
      li.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (count) count.textContent = shown + (shown === 1 ? ' project' : ' projects');
  }
  cats.forEach(function (li) {
    var k = Number(li.getAttribute('data-cat'));
    li.addEventListener('click', function () { pick(k); });
    li.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(k); }
    });
  });
})();

/* Project pages: gallery popup viewer */
(function () {
  var btns = Array.prototype.slice.call(document.querySelectorAll('[data-g]'));
  if (!btns.length) return;
  var urls = btns.map(function (b) {
    var m = /url\(["']?([^"')]+)["']?\)/.exec(b.style.backgroundImage || getComputedStyle(b).backgroundImage);
    return m ? m[1] : '';
  });
  var overlay, big, thumbs, closeBtn, idx = 0, opener = null;
  var ICON = function (d) {
    return '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  };
  function roundBtn(label, svg, css) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.innerHTML = ICON(svg);
    b.style.cssText = 'position:fixed;z-index:2;width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#111;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.25);' + css;
    return b;
  }
  function build() {
    overlay = document.createElement('div');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image viewer');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:1000;background:rgba(17,17,17,.6);display:none';
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    big = document.createElement('div');
    big.setAttribute('role', 'img');
    big.style.cssText = 'position:fixed;top:6vh;left:8vw;right:8vw;bottom:20vh;background:#F3F3F3 center / contain no-repeat;border-radius:12px';
    closeBtn = roundBtn('Close', '<path d="M6 6l12 12M18 6L6 18"/>', 'top:2.5vh;right:3vw');
    var prev = roundBtn('Previous image', '<path d="M15 6l-6 6 6 6"/>', 'top:43vh;left:calc(8vw + 12px);transform:translateY(-50%)');
    var next = roundBtn('Next image', '<path d="M9 6l6 6-6 6"/>', 'top:43vh;right:calc(8vw + 12px);transform:translateY(-50%)');
    thumbs = document.createElement('div');
    thumbs.style.cssText = 'position:fixed;left:0;right:0;bottom:4vh;display:flex;justify-content:center;gap:10px;flex-wrap:wrap;padding:0 16px';
    urls.forEach(function (u, i) {
      var t = document.createElement('button');
      t.type = 'button';
      t.setAttribute('aria-label', 'Show image ' + (i + 1));
      t.style.cssText = 'width:72px;height:56px;padding:0;border-radius:4px;border:2px solid #fff;cursor:pointer;background:url(' + u + ') center / cover no-repeat';
      t.addEventListener('click', function () { show(i); });
      thumbs.appendChild(t);
    });
    closeBtn.addEventListener('click', close);
    prev.addEventListener('click', function () { show((idx + urls.length - 1) % urls.length); });
    next.addEventListener('click', function () { show((idx + 1) % urls.length); });
    [big, closeBtn, prev, next, thumbs].forEach(function (el) { overlay.appendChild(el); });
    document.body.appendChild(overlay);
  }
  function show(i) {
    idx = i;
    big.style.backgroundImage = 'url(' + urls[i] + ')';
    big.setAttribute('aria-label', 'Gallery image ' + (i + 1) + ' of ' + urls.length);
    Array.prototype.forEach.call(thumbs.children, function (t, k) {
      t.style.borderColor = k === i ? '#111' : '#fff';
      t.style.opacity = k === i ? '1' : '.75';
    });
  }
  function open(i, el) {
    if (!overlay) build();
    opener = el;
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    show(i);
    closeBtn.focus();
  }
  function close() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    if (opener) opener.focus();
  }
  btns.forEach(function (b, i) { b.addEventListener('click', function () { open(i, b); }); });
  document.addEventListener('keydown', function (e) {
    if (!overlay || overlay.style.display === 'none') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show((idx + urls.length - 1) % urls.length);
    if (e.key === 'ArrowRight') show((idx + 1) % urls.length);
  });
})();
