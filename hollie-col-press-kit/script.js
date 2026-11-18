/* Hollie Col — glitter cursor trail and click-to-play YouTube videos */
(function () {
  // ---- Click-to-play YouTube (loads the player only when clicked) ----
  document.querySelectorAll('.yt[data-id]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-id');
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      frame.title = btn.getAttribute('aria-label') || 'YouTube video';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      frame.allowFullscreen = true;
      btn.innerHTML = '';
      btn.appendChild(frame);
      btn.style.cursor = 'default';
    }, { once: true });
  });

  // ---- Glitter cursor (mouse/trackpad only, off for reduced motion) ----
  if (!window.matchMedia || !matchMedia('(pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var colours = ['#F2C14E', '#FFF4CC', '#F6B7C6', '#BFD6EE', '#FFFFFF', '#E9A93B', '#D9C3F0'];
  var layer = document.createElement('div');
  layer.className = 'glitter-layer';
  layer.setAttribute('aria-hidden', 'true');
  var pool = [];
  for (var i = 0; i < 70; i++) {
    var s = document.createElement('span');
    var size = [2, 3, 2, 4, 3][i % 5];
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.background = colours[i % colours.length];
    s.style.borderRadius = i % 3 ? '1px' : '50%';
    layer.appendChild(s);
    pool.push({ el: s, life: 0, x: 0, y: 0, vx: 0, vy: 0, r: 0, tw: 0 });
  }
  document.body.appendChild(layer);

  var next = 0, lastX = -999, lastY = -999, last = 0;
  function spawn(x, y) {
    var p = pool[next];
    next = (next + 1) % pool.length;
    p.x = x + (Math.random() * 16 - 8);
    p.y = y + (Math.random() * 16 - 8);
    p.vx = Math.random() * 0.08 - 0.04;
    p.vy = Math.random() * 0.03 - 0.01;
    p.r = Math.random() * 180;
    p.tw = Math.random() * 6.28;
    p.life = 0.7 + Math.random() * 0.5;
  }
  window.addEventListener('mousemove', function (e) {
    var dx = e.clientX - lastX, dy = e.clientY - lastY;
    if (dx * dx + dy * dy < 36) return;
    lastX = e.clientX; lastY = e.clientY;
    spawn(lastX, lastY); spawn(lastX, lastY); spawn(lastX, lastY);
  }, { passive: true });

  function tick(t) {
    var dt = last ? Math.min(t - last, 50) : 16;
    last = t;
    for (var j = 0; j < pool.length; j++) {
      var q = pool[j];
      if (q.life <= 0) continue;
      q.life -= dt / 900;
      q.vy += 0.00012 * dt;
      q.x += q.vx * dt; q.y += q.vy * dt; q.r += dt * 0.3; q.tw += dt * 0.025;
      var a = Math.max(q.life, 0);
      q.el.style.opacity = (Math.min(a * 1.6, 1) * (0.55 + 0.45 * Math.sin(q.tw))).toFixed(2);
      q.el.style.transform = 'translate(' + q.x.toFixed(1) + 'px,' + q.y.toFixed(1) + 'px) rotate(' + q.r.toFixed(0) + 'deg)';
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
