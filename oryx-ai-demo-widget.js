/* Oryx AI — Phase 0 guided demo widget, chatbot-style redesign.
   HONEST BY DESIGN: this LOOKS like a chat window but it is a scripted
   demo, NOT a live AI agent. It makes no network requests, stores nothing,
   and sends nothing. The only outbound action is a "Request a pilot" button
   that opens the visitor's own email app with a prefilled message (mailto:)
   — nothing is sent until the visitor presses Send in their own mail
   client. Loaded lazily: this file is fetched only when a visitor clicks
   the demo button on oryx-ai.html. All state lives in memory only and is
   forgotten when the panel closes or the page reloads. */
(function () {
  if (window.OryxDemoWidget) { window.OryxDemoWidget.open(); return; }

  var NAVY = '#0A2240', GOLD = '#C9A227', PAPER = '#FAF8F2';

  /* ---------- styles: chat-window look ---------- */
  var css = [
    '#oryx-demo-panel{position:fixed;z-index:9999;right:20px;bottom:96px;width:400px;max-width:calc(100vw - 32px);height:580px;max-height:calc(100vh - 120px);background:#fff;border:1px solid rgba(10,34,64,.25);border-radius:18px 18px 12px 12px;box-shadow:0 24px 48px -16px rgba(10,34,64,.4);display:flex;flex-direction:column;font-family:"Public Sans",Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#16233C;overflow:hidden}',
    '#oryx-demo-panel *{box-sizing:border-box}',
    '.od-head{background:' + NAVY + ';color:#fff;padding:12px 14px;display:flex;align-items:center;gap:11px}',
    '.od-avatar{flex:0 0 auto;width:40px;height:40px;border-radius:50%;background:' + GOLD + ';color:' + NAVY + ';font-family:"Source Serif 4",Georgia,serif;font-size:20px;font-weight:700;display:flex;align-items:center;justify-content:center}',
    '.od-head-txt{flex:1;min-width:0}',
    '.od-head-txt b{font-family:"Source Serif 4",Georgia,serif;font-size:18px;display:block;line-height:1.2}',
    '.od-head-txt span{display:block;font-size:11px;color:#C7D0DE;margin-top:2px}',
    '.od-head-txt span em{font-style:normal;color:' + GOLD + ';font-weight:700}',
    '.od-head-btn{background:none;border:1px solid rgba(255,255,255,.4);color:#fff;font-size:18px;line-height:1;width:30px;height:30px;border-radius:50%;cursor:pointer;flex:0 0 auto}',
    '.od-head-btn:hover{background:rgba(255,255,255,.15)}',
    '.od-body{flex:1;overflow-y:auto;padding:16px 14px;background:#fff}',
    '.od-row{display:flex;gap:8px;margin:0 0 4px;animation:od-in .25s ease-out}',
    '.od-row.user{justify-content:flex-end}',
    '.od-row .od-avatar{width:28px;height:28px;font-size:14px;margin-top:2px}',
    '.od-bubble-wrap{max-width:82%;display:flex;flex-direction:column}',
    '.od-row.user .od-bubble-wrap{align-items:flex-end}',
    '.od-msg{padding:10px 13px;border-radius:16px}',
    '.od-msg.bot{background:' + PAPER + ';border:1px solid rgba(10,34,64,.12);border-bottom-left-radius:4px}',
    '.od-msg.user{background:' + NAVY + ';color:#fff;border-bottom-right-radius:4px}',
    '.od-time{font-size:11px;color:#8A94A8;margin:3px 2px 10px}',
    '.od-msg h4{font-family:"Source Serif 4",Georgia,serif;font-size:16px;color:' + NAVY + ';margin:0 0 6px}',
    '.od-msg p{margin:0 0 8px}',
    '.od-msg p:last-child{margin-bottom:0}',
    '.od-msg ul,.od-msg ol{margin:4px 0 8px 18px;padding:0}',
    '.od-msg li{margin-bottom:4px}',
    '.od-msg .od-metric{font-size:13px;color:#52607A;border-top:1px solid rgba(10,34,64,.12);margin-top:8px;padding-top:8px}',
    '.od-card-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px}',
    '.od-card-head span:first-child{font-size:11px;font-weight:700;letter-spacing:.12em;color:#52607A}',
    '.od-draft{background:' + GOLD + ';color:' + NAVY + ';font-size:10px;font-weight:700;letter-spacing:.1em;padding:3px 8px}',
    '.od-linkbtn{display:inline-block;margin-top:10px;background:' + NAVY + ';color:#fff !important;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:.06em;padding:9px 14px;border-radius:999px}',
    '.od-chips{display:flex;flex-wrap:wrap;gap:8px;margin:2px 0 14px 36px}',
    '.od-row.user + .od-chips,.od-chips:first-child{margin-left:0}',
    '.od-chip{background:#fff;border:1px solid rgba(10,34,64,.35);border-radius:999px;padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;color:' + NAVY + '}',
    '.od-chip:hover{border-color:' + GOLD + ';background:rgba(201,162,39,.12)}',
    '.od-typing{display:flex;gap:4px;align-items:center;padding:12px 14px}',
    '.od-typing i{width:8px;height:8px;border-radius:50%;background:#8A94A8;animation:od-bounce 1.2s infinite}',
    '.od-typing i:nth-child(2){animation-delay:.15s}',
    '.od-typing i:nth-child(3){animation-delay:.3s}',
    '@keyframes od-bounce{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-5px);opacity:1}}',
    '@keyframes od-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}',
    '.od-foot{border-top:1px solid rgba(10,34,64,.12);padding:10px 12px;display:flex;gap:8px;align-items:center;background:#fff}',
    '.od-foot input{flex:1;border:1px solid rgba(10,34,64,.35);border-radius:999px;padding:10px 14px;font-size:14px;font-family:inherit;min-width:0}',
    '.od-foot button{background:' + NAVY + ';color:#fff;border:1px solid ' + NAVY + ';border-radius:50%;width:40px;height:40px;font-size:18px;line-height:1;cursor:pointer;flex:0 0 auto}',
    '.od-foot button:hover{background:#12305A}',
    '#oryx-demo-panel.od-busy .od-foot input:disabled{opacity:.6}',
    '#oryx-demo-panel.od-busy .od-chip{opacity:.55;pointer-events:none}',
    '.od-form{margin:0 0 14px}',
    '.od-form label{display:block;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#52607A;margin:10px 0 4px}',
    '.od-form input,.od-form textarea{width:100%;border:1px solid rgba(10,34,64,.35);border-radius:8px;padding:9px 11px;font-size:14px;font-family:inherit}',
    '.od-form textarea{min-height:90px;resize:vertical}',
    '.od-form .od-send{display:block;width:100%;margin-top:14px;background:' + GOLD + ';border:1px solid ' + GOLD + ';color:' + NAVY + ';padding:13px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;border-radius:999px}',
    '.od-note{font-size:12px;color:#52607A;margin-top:10px}',
    '@media(max-width:480px){#oryx-demo-panel{right:8px;left:8px;bottom:84px;width:auto;height:calc(100vh - 100px);max-height:none;border-radius:18px 18px 0 0}}'
  ].join('\n');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- panel ---------- */
  var panel = document.createElement('div');
  panel.id = 'oryx-demo-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Oryx AI guided demo');
  panel.innerHTML =
    '<div class="od-head"><div class="od-avatar" aria-hidden="true">O</div>' +
    '<div class="od-head-txt"><b>Oryx AI</b>' +
    '<span><em>Guided demo</em> &middot; Scripted walkthrough &mdash; not a live agent</span></div>' +
    '<button class="od-head-btn" id="od-restart" aria-label="Restart demo" title="Restart demo">&#8635;</button>' +
    '<button class="od-head-btn od-close" aria-label="Close demo">&times;</button></div>' +
    '<div class="od-body" id="od-body"></div>' +
    '<form class="od-foot" id="od-form"><input id="od-input" type="text" placeholder="Ask about the pilot, sample, or verification&hellip;" aria-label="Ask about Oryx AI" autocomplete="off">' +
    '<button type="submit" aria-label="Send message">&#10148;</button></form>';
  document.body.appendChild(panel);

  var body = panel.querySelector('#od-body');
  var input = panel.querySelector('#od-input');
  var form = panel.querySelector('#od-form');

  function timeNow() {
    try { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
    catch (e) { return ''; }
  }
  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function bot(html) {
    var row = document.createElement('div');
    row.className = 'od-row';
    var av = document.createElement('div');
    av.className = 'od-avatar';
    av.setAttribute('aria-hidden', 'true');
    av.textContent = 'O';
    var wrap = document.createElement('div');
    wrap.className = 'od-bubble-wrap';
    var bubble = document.createElement('div');
    bubble.className = 'od-msg bot';
    bubble.innerHTML = html;
    var time = document.createElement('div');
    time.className = 'od-time';
    time.textContent = timeNow();
    wrap.appendChild(bubble);
    wrap.appendChild(time);
    row.appendChild(av);
    row.appendChild(wrap);
    body.appendChild(row);
    scrollDown();
    return row;
  }
  function user(text) {
    var row = document.createElement('div');
    row.className = 'od-row user';
    var wrap = document.createElement('div');
    wrap.className = 'od-bubble-wrap';
    var bubble = document.createElement('div');
    bubble.className = 'od-msg user';
    bubble.textContent = text;
    var time = document.createElement('div');
    time.className = 'od-time';
    time.textContent = timeNow();
    wrap.appendChild(bubble);
    wrap.appendChild(time);
    row.appendChild(wrap);
    body.appendChild(row);
    scrollDown();
  }
  /* ---------- scroll: show the answer, not just the chips ----------
     Blind scroll-to-bottom after every reply hid the top of long answers:
     the menu chips re-appear below the reply, the view jumped to the very
     bottom, and the reply scrolled up out of sight. So after chips render,
     scroll to the bottom only when the latest reply plus chips fit in one
     viewport; otherwise scroll to the TOP of the reply, so the answer is
     read from the start and the chips sit just below it. */
  function scrollToLatest() {
    var nodes = body.children, reply = null, i;
    for (i = nodes.length - 1; i >= 0; i--) {
      if (nodes[i].classList && nodes[i].classList.contains('od-row') &&
          !nodes[i].querySelector('.od-typing')) { reply = nodes[i]; break; }
    }
    if (!reply) { scrollDown(); return; }
    var replyTop = reply.getBoundingClientRect().top -
      body.getBoundingClientRect().top + body.scrollTop;
    var tail = body.scrollHeight - replyTop;
    if (tail <= body.clientHeight) { scrollDown(); }
    else { body.scrollTop = Math.max(0, replyTop - 8); }
  }
  function chips(list) {
    var d = document.createElement('div');
    d.className = 'od-chips';
    list.forEach(function (item) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'od-chip';
      b.textContent = item.label;
      b.addEventListener('click', function () { user(item.label); respond(item.action); });
      d.appendChild(b);
    });
    body.appendChild(d);
    scrollToLatest();
  }

  /* ---------- typing indicator: the chatbot feel ----------
     Every bot reply is preceded by a short typing animation. This is a
     timed local animation only — no network, no live agent behind it. */
  var busy = false, queue = [];
  function setBusy(on) {
    busy = on;
    if (on) { panel.classList.add('od-busy'); input.setAttribute('disabled', 'disabled'); }
    else { panel.classList.remove('od-busy'); input.removeAttribute('disabled'); }
  }
  function respond(fn) {
    if (busy) { queue.push(fn); return; }
    setBusy(true);
    var row = document.createElement('div');
    row.className = 'od-row';
    var av = document.createElement('div');
    av.className = 'od-avatar';
    av.setAttribute('aria-hidden', 'true');
    av.textContent = 'O';
    var bubble = document.createElement('div');
    bubble.className = 'od-msg bot od-typing';
    bubble.innerHTML = '<i></i><i></i><i></i>';
    row.appendChild(av);
    row.appendChild(bubble);
    body.appendChild(row);
    scrollDown();
    setTimeout(function () {
      row.remove();
      fn();
      setBusy(false);
      if (queue.length) { respond(queue.shift()); }
    }, 850);
  }

  /* ---------- content blocks ---------- */
  function showSample() {
    bot('<div class="od-card-head"><span>SAMPLE REPORT</span><span class="od-draft">DRAFT</span></div>' +
      '<h4>AI adoption in Indian hotels</h4>' +
      '<p><b>Question:</b> What does recent evidence say about AI adoption in Indian hotels — where is it helping, and where are hotels still skeptical?</p>' +
      '<p><b>Executive answer (condensed):</b> Adoption is concentrated in cybersecurity, marketing and operational efficiency — seven in ten hoteliers see AI as helpful for fraud prevention and cybersecurity [S1]. Skepticism persists around manual tasks: 30% of hoteliers rate AI as not helpful for housekeeping and maintenance scheduling [S1].</p>' +
      '<p><b>What the evidence does NOT show:</b> no comparison of adoption between luxury chains and budget properties, no implementation cost figures, and no data on workforce headcount effects. A real report states its gaps plainly instead of papering over them.</p>' +
      '<p><b>Sources:</b></p><ul>' +
      '<li>[S1] Statista / Booking.com — India Accommodation Barometer 2025</li>' +
      '<li>[S2] Rawal &amp; Kumar — AI service adoption in Indian five-star hotels (2025)</li>' +
      '<li>[S3] Acharya &amp; Mahapatra — AI and staff operational efficiency in hospitality (2025)</li></ul>' +
      '<div class="od-metric">Mechanical verification record — 15 citation markers, 0 invalid, all 3 sources cited, 14 of 33 claim sentences cited (42% sourced-claim rate), 10 adversarial flags raised. Status: DRAFT — human review required before delivery.</div>' +
      '<a class="od-linkbtn" href="oryx-ai-sample-report.html">Read the full sample report &rarr;</a>' +
      '<p class="od-note">This is a condensed sample from our own launch test — not a client delivery. In a real engagement, this draft would stay a draft until a human reviewer resolves every flag.</p>');
    showMenu();
  }

  function showHow() {
    bot('<h4>How it works — six stages, one audit trail</h4><ol style="margin:4px 0 8px 18px;padding:0">' +
      '<li><b>Question framing</b> — your question is sharpened into an answerable brief.</li>' +
      '<li><b>Evidence acquisition</b> — real, published sources are gathered, never invented.</li>' +
      '<li><b>Synthesis</b> — a draft report is written from the evidence, with citation markers.</li>' +
      '<li><b>Claim-level verification</b> — every citation is mechanically checked: does it resolve, and does it say what the claim says?</li>' +
      '<li><b>Adversarial review</b> — unsupported claims and overstatements are flagged, never silently fixed.</li>' +
      '<li><b>Human review gate</b> — no report becomes final until a human approves it.</li></ol>' +
      '<p>Each report also carries an evidence table (one row per source) and a screening log (why each source was included or excluded).</p>');
    showMenu();
  }

  function showVerify() {
    bot('<h4>What “auditable” actually means here</h4>' +
      '<p>Most AI tools give you an answer and ask you to trust it. Oryx AI gives you the answer <i>plus the receipt</i>:</p><ul>' +
      '<li>Every material claim carries a citation marker to a real source.</li>' +
      '<li>A mechanical check counts how many citations resolve and how many claims are cited — the model writing the report never writes its own score.</li>' +
      '<li>Claims that cannot be sourced are quarantined in plain sight, not deleted quietly.</li>' +
      '<li>An adversarial pass flags overstatements — and a human reviewer, not the model, resolves them.</li></ul>' +
      '<p>When a draft is weak, it stays a draft. That is the whole point.</p>');
    showMenu();
  }

  function showPilot() {
    bot('<h4>The pilot offer</h4><ul>' +
      '<li>One report, against criteria agreed with you upfront.</li>' +
      '<li><b>Pay only if it passes.</b> If it does not meet the agreed criteria, you pay nothing.</li>' +
      '<li>You have five working days to accept or decline it.</li>' +
      '<li>Pricing is agreed per pilot — no public price list yet.</li>' +
      '<li>Pilot engagements are currently contracted through Riya Nalwa\'s Udyam-registered proprietorship.</li></ul>' +
      '<p>For pharma, automobile, hospitality, and college/institute research teams.</p>');
    chips([{ label: 'Request a pilot', action: showForm }]);
    showMenu();
  }

  function showForm(prefill) {
    var wrap = document.createElement('div');
    wrap.className = 'od-msg bot od-form';
    wrap.innerHTML =
      '<h4>Request a pilot</h4>' +
      '<p>This opens your own email app with a prefilled message to contact@oryxcentre.dpdns.org. Nothing is sent from this site, and nothing you type here is stored anywhere.</p>' +
      '<label for="od-name">Your name</label><input id="od-name" type="text" autocomplete="name">' +
      '<label for="od-org">Organisation</label><input id="od-org" type="text" autocomplete="organization">' +
      '<label for="od-email">Your email</label><input id="od-email" type="email" autocomplete="email">' +
      '<label for="od-q">Research question</label><textarea id="od-q"></textarea>' +
      '<button type="button" class="od-send">Compose email to Oryx</button>' +
      '<p class="od-note">Pressing this opens your email app. Review the message, then press Send there — that is the only step that sends anything.</p>';
    body.appendChild(wrap);
    if (prefill) { wrap.querySelector('#od-q').value = prefill; }
    wrap.querySelector('.od-send').addEventListener('click', function () {
      var name = wrap.querySelector('#od-name').value.trim();
      var org = wrap.querySelector('#od-org').value.trim();
      var email = wrap.querySelector('#od-email').value.trim();
      var q = wrap.querySelector('#od-q').value.trim();
      var subject = 'Oryx AI pilot request' + (org ? ' — ' + org : '');
      var lines = ['Hello Oryx team,', '', 'I would like to request an Oryx AI pilot report.'];
      if (name) lines.push('Name: ' + name);
      if (org) lines.push('Organisation: ' + org);
      if (email) lines.push('Email: ' + email);
      if (q) lines.push('', 'Research question:', q);
      lines.push('', 'Sent via the guided demo on the Oryx AI page.');
      window.location.href = 'mailto:contact@oryxcentre.dpdns.org?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      bot('<p>Your email app should now open with the pilot request prefilled. If it did not, you can write directly to <b>contact@oryxcentre.dpdns.org</b>.</p>');
    });
    scrollDown();
  }

  function showMenu() {
    chips([
      { label: 'See a sample report', action: showSample },
      { label: 'How it works', action: showHow },
      { label: 'How verification works', action: showVerify },
      { label: 'Pilot & pricing', action: showPilot },
      { label: 'Request a pilot', action: function () { showForm(''); } }
    ]);
  }

  function welcome() {
    bot('<p>Welcome. This is a <b>guided demo</b> of Oryx AI — a scripted walkthrough, not a live agent. Pick a path, or type a question:</p>');
    showMenu();
  }

  /* ---------- FAQ matching ---------- */
  var FAQS = [
    { keys: ['price', 'cost', 'pay', 'fee', 'charge'], fn: showPilot },
    { keys: ['long', 'time', 'fast', 'deliver', 'when'], fn: function () { bot('<p>A pilot report is delivered within the window agreed upfront — the pilot terms give you five working days to accept or decline it once delivered. A real report is never instant: the verification and human-review stages take time, and that time is the product.</p>'); showMenu(); } },
    { keys: ['source', 'citation', 'evidence', 'reference'], fn: showVerify },
    { keys: ['human', 'review', 'approve', 'gate'], fn: function () { bot('<p>No report becomes final until a human reviewer approves it. Until then it stays a draft — including our own launch report, which stayed a draft pending review. The adversarial pass flags problems; the human resolves them.</p>'); showMenu(); } },
    { keys: ['fail', 'wrong', 'pass', 'criteria', 'accept'], fn: showPilot },
    { keys: ['confidential', 'private', 'data', 'secret'], fn: function () { bot('<p>Client questions and reports are confidential by default: never published, never used to train anything, and never shared. This demo itself stores nothing — it runs entirely in your browser.</p>'); showMenu(); } },
    { keys: ['who', 'for', 'industry', 'company', 'college', 'hotel', 'pharma'], fn: function () { bot('<p>Oryx AI serves research departments of pharmaceutical companies, automobile firms, hospitality businesses, and colleges and institutes — teams that cannot afford a confident-sounding error.</p>'); showMenu(); } },
    { keys: ['live', 'real', 'agent', 'chatbot', 'you'], fn: function () { bot('<p>Honest answer: I am not a live agent. This is a scripted demo that shows how a real audited report works. A live engagement happens through a pilot — ask for one and a human takes it from there.</p>'); showMenu(); } },
    { keys: ['what', 'do', 'oryx ai', 'about'], fn: showHow }
  ];

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    user(text);
    input.value = '';
    var lower = text.toLowerCase();
    /* Greetings are matched as whole words only — a substring test for
       "hi" would misfire on words like "this". */
    if (/^(hi|hello|hey)([ !?.,]|$)/.test(lower)) {
      respond(function () { bot('<p>Hello — welcome to the Oryx AI guided demo. I am scripted, not live, but I can walk you through a sample report, the verification method, or the pilot offer. Pick a path:</p>'); showMenu(); });
      return;
    }
    for (var i = 0; i < FAQS.length; i++) {
      for (var j = 0; j < FAQS[i].keys.length; j++) {
        if (lower.indexOf(FAQS[i].keys[j]) !== -1) { respond(FAQS[i].fn); return; }
      }
    }
    respond(function () {
      bot('<p>This demo does not answer live questions — that is what a pilot is for. If you put your question in a pilot request, a human-reviewed report comes back.</p>');
      chips([{ label: 'Request a pilot with this question', action: function () { showForm(text); } }]);
      showMenu();
    });
  });

  panel.querySelector('.od-close').addEventListener('click', function () { panel.remove(); });
  panel.querySelector('#od-restart').addEventListener('click', function () {
    body.innerHTML = '';
    welcome();
    input.focus();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.getElementById('oryx-demo-panel')) { panel.remove(); }
  });

  /* ---------- open ---------- */
  welcome();

  window.OryxDemoWidget = {
    open: function () {
      if (!document.getElementById('oryx-demo-panel')) { document.body.appendChild(panel); }
      body.scrollTop = body.scrollHeight;
      input.focus();
    }
  };
})();
