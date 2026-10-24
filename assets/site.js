(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mt = $('.menu-t'), mn = $('.mnav');
  if (mt && mn) mt.addEventListener('click', function () { var o = mn.hidden; mn.hidden = !o; mt.setAttribute('aria-expanded', String(o)); });
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-copy'), ok = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1600); };
      var fb = function () { var t = b.parentNode.querySelector('.v'); if (!t) return; var r = document.createRange(); r.selectNodeContents(t); var s = getSelection(); s.removeAllRanges(); s.addRange(r); };
      try { navigator.clipboard.writeText(v).then(ok, fb); } catch (e) { fb(); }
    });
  });

  // ---------- Family Digital Wellbeing Check (conversation starter, not a screening tool) ----------
  var form = $('#check');
  if (form) {
    var AREAS = {
      sleep: { n: 'Sleep and routines', tips: ['Agree a time when phones leave the bedroom, and charge them elsewhere overnight.', 'Protect the hour before sleep: no short-form video feeds.'] },
      feeds: { n: 'Feeds and content', tips: ['Sit together and look at what their feed recommends. Ask what they like and what they skip.', 'Use the platform’s "not interested" and sensitive-content controls together.'] },
      mood: { n: 'Mood and connection', tips: ['Notice changes in mood after time online, without judgement. Ask how certain content makes them feel.', 'If low mood, withdrawal or talk of self-harm persists, speak with your doctor or a counsellor.'] },
      family: { n: 'Family agreements', tips: ['Write a short family media agreement together, including rules adults follow too.', 'Review it every few months. Autonomy should grow as they show they can manage it.'] }
    };
    var LABELS = ['Never', 'Sometimes', 'Often', 'Almost always'];
    function score() {
      var out = {}, answered = 0, total = 0;
      Object.keys(AREAS).forEach(function (k) { out[k] = { s: 0, n: 0 }; });
      $$('fieldset[data-area]', form).forEach(function (fs) {
        total++;
        var c = fs.querySelector('input:checked'); if (!c) return;
        answered++;
        var v = +c.value; if (fs.dataset.rev === '1') v = 3 - v;
        out[fs.dataset.area].s += v; out[fs.dataset.area].n++;
      });
      return { a: out, answered: answered, total: total };
    }
    function render() {
      var r = score(), bars = '', tips = [];
      Object.keys(AREAS).forEach(function (k) {
        var d = r.a[k], pct = d.n ? Math.round(d.s / (d.n * 3) * 100) : 0, cls = pct >= 60 ? 'high' : pct >= 34 ? 'mid' : '';
        var word = !d.n ? 'Not answered' : pct >= 60 ? 'Worth a conversation soon' : pct >= 34 ? 'Some things to watch' : 'Looking balanced';
        bars += '<div class="bar"><div class="top"><b>' + AREAS[k].n + '</b><span>' + word + '</span></div><div class="track"><i class="' + cls + '" style="width:' + (d.n ? Math.max(pct, 4) : 0) + '%"></i></div></div>';
        if (d.n && pct >= 34) tips = tips.concat(AREAS[k].tips);
      });
      $('#bars').innerHTML = bars;
      $('#progress').textContent = r.answered + ' of ' + r.total + ' answered';
      $('#tips').innerHTML = (tips.length ? tips : ['Keep talking regularly about what they enjoy online. Balance is something families maintain together, not a one-off fix.']).slice(0, 5).map(function (t) { return '<li>' + t + '</li>'; }).join('');
    }
    form.addEventListener('change', render);
    $('#reset') && $('#reset').addEventListener('click', function () { form.reset(); render(); });
    render();
  }

  // ---------- pilot form ----------
  var pf = $('#pilot');
  if (pf) pf.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var g = function (n) { return (pf.elements[n].value || '').trim(); }, m = $('.msg', pf);
    if (!g('name') || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g('email'))) { m.textContent = 'Please add your name and a valid email address.'; return; }
    var body = 'Name: ' + g('name') + '\nEmail: ' + g('email') + '\nI am: ' + g('type') + '\nCountry: ' + g('country') + '\n\n' + g('note');
    m.textContent = 'Your email app should open with this message. If it does not, copy the address shown and write to us directly.';
    location.href = 'mailto:' + pf.dataset.to + '?subject=' + encodeURIComponent('SafeGuardAI pilot interest: ' + g('type')) + '&body=' + encodeURIComponent(body);
  });
})();
