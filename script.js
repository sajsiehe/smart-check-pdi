(function () {
  'use strict';
 
  /* ========================================================================
     1. DATA — checklist sections (from the original PDF)
     ======================================================================== */
  const SECTIONS = [
    { title: 'Exterior / Body Inspection', icon: 'car', items: [
      'Body panels alignment', 'Paint finish & colour matching', 'Scratches / dents / rust',
      'Panel gaps (doors, bonnet, boot)', 'Windshield & glass condition', 'Wipers & washers',
      'Rear view mirrors', 'Number plates & VIN plate' ] },
    { title: 'Tyres & Wheels', icon: 'wheel', items: [
      'Tyre brand & size (as per spec)', 'Tyre condition & wear', 'Tread depth',
      'Spare wheel & tools', 'Wheel alignment (visual check)', 'Wheel nuts tightness' ] },
    { title: 'Engine & Compartment', icon: 'engine', items: [
      'Engine condition & cleanliness', 'Leaks (oil, coolant, fuel, etc.)', 'Hoses & belts condition',
      'Coolant level', 'Brake fluid level', 'Power steering fluid', 'Washer fluid level',
      'Air filter & other components' ] },
    { title: 'Engine Number (Check)', icon: 'hash', items: [
      'Engine number match with RC', 'Clean & properly stamped', 'No tampering / damage' ] },
    { title: 'Battery & Electricals', icon: 'battery', items: [
      'Battery condition & charge', 'Terminals & cables', 'Horn', 'Headlights (low/high beam)',
      'Indicators (front & rear)', 'Brake lights', 'Reverse light', 'Fog lamps', 'Interior lights',
      'Key / Remote functions' ] },
    { title: 'AC & Infotainment', icon: 'fan', items: [
      'AC cooling performance', 'Heater function', 'Fan speed', 'Infotainment system',
      'Bluetooth / USB / AUX', 'Speakers (all)', 'Navigation (if available)', 'Steering audio controls' ] },
    { title: 'Interior Inspection', icon: 'seat', items: [
      'Seats & seat belts', 'Upholstery & trims', 'Dashboard & instruments', 'Steering wheel condition',
      'Gearbox (manual/automatic)', 'Handbrake', 'Sunroof (if available)', 'Cabin space & storage',
      'Boot space & spare tools', 'Floor mats & accessories' ] },
    { title: 'Test Drive', icon: 'steering', items: [
      'Engine performance', 'Gear shifting', 'Braking (front & rear)', 'Steering response',
      'Suspension & noise', 'ABS / ESP (if available)', 'Vibration / unusual sound' ] },
    { title: 'Documents & Accessories', icon: 'file', items: [
      'RC, Insurance, PUC (verify)', 'User manual & service book', 'Keys (main + spare)',
      'Jack, tool kit, spare wheel', 'Floor mats, charger, accessories', 'Other accessories (as per model)' ] },
    { title: 'Accident / Damage Check', icon: 'shield', items: [
      'Accident history (visual check)', 'Frame / chassis damage', 'Undercarriage inspection',
      'Rust / corrosion', 'Repainted areas (mismatch)' ] }
  ];
 
  // Screen flow: details → 3 sections per screen → final
  const STEPS = [
    { type: 'details',   label: 'Vehicle & customer details' },
    { type: 'checklist', sections: [0, 1, 2] },
    { type: 'checklist', sections: [3, 4, 5] },
    { type: 'checklist', sections: [6, 7, 8] },
    { type: 'checklist', sections: [9] },
    { type: 'final',     label: 'Result & notes' }
  ];
 
  const RESULTS = {
    good:  { label: 'All Good',     sub: 'Ready for Delivery' },
    minor: { label: 'Minor Issues', sub: 'To be fixed' },
    major: { label: 'Major Issues', sub: 'Not Recommended' }
  };
 
  /* ========================================================================
     2. ICONS & LOGO
     ======================================================================== */
  const ICONS = {
    user:    '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.400 3.600-7 8-7s8 2.600 8 7"/>',
    doc:     '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    car:     '<path d="M4 15l1.600-5.200A2 2 0 0 1 7.500 8.500h9a2 2 0 0 1 1.900 1.300L20 15"/><rect x="3" y="15" width="18" height="4.500" rx="1.500"/><path d="M6.500 19.500V21M17.500 19.500V21"/><circle cx="7.500" cy="17.200" r=".6"/><circle cx="16.500" cy="17.200" r=".6"/>',
    wheel:   '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/>',
    engine:  '<rect x="6" y="8" width="11" height="9" rx="1.500"/><path d="M3 11v3M20 11v3M9 8V5h5v3M9 17v2h5v-2"/>',
    hash:    '<path d="M5 9h14M5 15h14M10 4L8 20M16 4l-2 16"/>',
    battery: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V5.500h3V8M14 8V5.500h3V8M8 14h4M10 12v4"/>',
    fan:     '<circle cx="12" cy="12" r="1.500"/><path d="M12 10.500C12 6 14 3 17 4c2 1 1 5-3.500 7M13.500 12c4.500 0 7.500 2 6.500 5-1 2-5 1-7-3.500M12 13.500C12 18 10 21 7 20c-2-1-1-5 3.500-7M10.500 12C6 12 3 10 4 7c1-2 5-1 7 3.500"/>',
    seat:    '<path d="M8 4h4a2.500 2.500 0 0 1 2.500 2.500V13H19v4.500H9A4 4 0 0 1 5 13.500V8a4 4 0 0 1 3-4z"/><path d="M8 20h11"/>',
    steering:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M3 12h7M14 12h7M12 14v7"/>',
    file:    '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    shield:  '<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/><path d="M8.500 12l2.500 2.500 4.500-5"/>',
    note:    '<path d="M5 4h14v16H5z"/><path d="M8 9h8M8 13h8M8 17h5"/>',
    chart:   '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
    pen:     '<path d="M4 20l1-4L16.500 4.500a2 2 0 0 1 3 3L8 19z"/><path d="M14 7l3 3"/>',
    pdf:     '<path d="M12 3v12M7 11l5 5 5-5M5 21h14"/>',
    info:    '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    trash:   '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'
  };
  const icon = n => '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[n] + '</svg>';
 
  const LOGO_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true">' +
    '<rect x="26" y="8" width="44" height="52" rx="6" fill="#fff" stroke="#0f1f3d" stroke-width="4"/>' +
    '<rect x="38" y="3" width="20" height="10" rx="3" fill="#0f1f3d"/>' +
    '<path d="M33 23l3 3 5-6M33 36l3 3 5-6" stroke="#1e63c4" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M47 24h16M47 37h16" stroke="#9db9e0" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M6 68c0-6 4-10 10-12l9-2c6-4 12-6 22-6s16 2 20 6l9 2c6 2 10 6 10 12v8H6z" fill="#0f1f3d"/>' +
    '<circle cx="26" cy="77" r="8" fill="#0f1f3d" stroke="#fff" stroke-width="3"/>' +
    '<circle cx="76" cy="77" r="8" fill="#0f1f3d" stroke="#fff" stroke-width="3"/>' +
    '<path d="M16 74l24 18L94 38" stroke="#fff" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M16 74l24 18L94 38" stroke="#1e63c4" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';
 
  const CHECK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path d="M2 6.500l2.600 2.600L10 3.200" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 
  // Base64 data-URIs: the logo and ticks are embedded in the file, so the PDF never depends on the network
  const toDataUri = svg => 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  const LOGO_DATA_URI = toDataUri(LOGO_SVG);
  const CHECK_DATA_URI = toDataUri(CHECK_SVG);
 
  // Rasterise an SVG data-URI to a PNG data-URI (most reliable format for html2canvas/jsPDF on every device)
  const pngCache = {};
  function svgToPng(key, dataUri, size) {
    if (pngCache[key]) return Promise.resolve(pngCache[key]);
    return new Promise(resolve => {
      let done = false;
      const finish = v => { if (!done) { done = true; resolve(v); } };
      const timer = setTimeout(() => finish(dataUri), 3000);
      const img = new Image();
      img.onload = () => {
        try {
          const c = document.createElement('canvas');
          c.width = c.height = size;
          c.getContext('2d').drawImage(img, 0, 0, size, size);
          const png = c.toDataURL('image/png');
          pngCache[key] = png;
          clearTimeout(timer); finish(png);
        } catch (e) { clearTimeout(timer); finish(dataUri); }
      };
      img.onerror = () => { clearTimeout(timer); finish(dataUri); };
      img.src = dataUri;
    });
  }
 
  /* ========================================================================
     3. STATE & PERSISTENCE (localStorage)
     ======================================================================== */
  const KEY = 'smartcheck_pdi_v1';
 
  const todayStr = () => {
    const t = new Date();
    return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
  };
 
  const defaultState = () => ({
    step: 0,
    d: { customerName: '', phone: '', make: '', model: '', dealer: '', location: '', inspDate: todayStr(),
         vin: '', engineNo: '', odo: '', mfgDate: '', regNo: '', colour: '', inspType: 'New' },
    c: {},                       // checklist answers: { "sec-item": { v: 'ok'|'na'|'', r: 'remark' } }
    results: [],                 // selected PDI result options: any of 'good' | 'minor' | 'major'
    resultRemarks: '', notes: ''
  });
 
  function loadState() {
    const base = defaultState();
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return base;
      const s = JSON.parse(raw);
      const merged = Object.assign(base, s, { d: Object.assign(base.d, s.d), c: s.c || {} });
      // migrate older saves (single result, declaration and recommendation no longer exist)
      if (!Array.isArray(s.results)) merged.results = (typeof s.result === 'string' && RESULTS[s.result]) ? [s.result] : [];
      merged.results = merged.results.filter(k => RESULTS[k]);
      delete merged.result; delete merged.decl; delete merged.recommendation;
      return merged;
    } catch (e) { return base; }
  }
 
  let state = loadState();
  if (!(state.step >= 0 && state.step < STEPS.length)) state.step = 0;
 
  /* ---- Auto-save: every change is written to localStorage and confirmed by a small indicator ---- */
  let saveTimer = null, pillTimer = null;
 
  function showSave(kind) {
    const pill = document.getElementById('savePill');
    if (!pill) return;
    pill.dataset.kind = kind;
    pill.querySelector('.save-t').textContent =
      kind === 'saving' ? 'Saving…' : kind === 'saved' ? 'Progress auto-saved' : 'Could not save on this device';
    pill.classList.add('show');
    clearTimeout(pillTimer);
    if (kind !== 'error') pillTimer = setTimeout(() => pill.classList.remove('show'), 2200);
  }
 
  function saveNow(silent) {
    clearTimeout(saveTimer);
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      if (!silent) showSave('saved');
      return true;
    } catch (e) {                                   // storage full / blocked (e.g. private mode)
      if (!silent) showSave('error');
      return false;
    }
  }
  function queueSave() { showSave('saving'); clearTimeout(saveTimer); saveTimer = setTimeout(() => saveNow(), 250); }
 
  // Also save silently whenever the page is hidden or closed (mobile browsers often skip "beforeunload")
  window.addEventListener('beforeunload', () => saveNow(true));
  window.addEventListener('pagehide', () => saveNow(true));
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveNow(true); });
 
  const getPath = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const setPath = (o, p, v) => {
    const ks = p.split('.'); const last = ks.pop();
    ks.reduce((a, k) => a[k], o)[last] = v;
  };
 
  /* ========================================================================
     4. HELPERS
     ======================================================================== */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtDate = s => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    return m ? parseInt(m[3], 10) + ' ' + MONTHS[parseInt(m[2], 10) - 1] + ' ' + m[1] : '';
  };
 
  function calcStats() {
    let total = 0, ok = 0, na = 0, rem = 0;
    SECTIONS.forEach((sec, si) => sec.items.forEach((_, ii) => {
      total++;
      const c = state.c[si + '-' + ii];
      if (c) {
        if (c.v === 'ok') ok++;
        else if (c.v === 'na') na++;
        if (c.r && c.r.trim()) rem++;
      }
    }));
    return { total, ok, na, pending: total - ok - na, rem };
  }
 
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
  }
 
  function confirmDialog(title, text, okLabel, cancelLabel, danger, extra) {
    return new Promise(resolve => {
      const m = $('#modal');
      $('#mTitle').textContent = title; $('#mText').textContent = text;
      $('#mOk').textContent = okLabel || 'Confirm';
      $('#mCancel').textContent = cancelLabel || 'Cancel';
      $('#mOk').className = 'btn ' + (danger ? 'btn-danger' : 'btn-primary');
      $('.modal-box', m).classList.toggle('danger', !!danger);
      $('#mIcon').hidden = !danger;
      $('#mExtra').hidden = !extra; $('#mExtra').textContent = extra || '';
      m.hidden = false;
      (danger ? $('#mCancel') : $('#mOk')).focus();          // destructive dialogs default to the safe choice
      const done = v => { m.hidden = true; $('#mOk').onclick = $('#mCancel').onclick = null; resolve(v); };
      $('#mOk').onclick = () => done(true);
      $('#mCancel').onclick = () => done(false);
    });
  }
 
  /* ========================================================================
     5. VIEWS
     ======================================================================== */
  function field(label, key, opts) {
    opts = opts || {};
    const id = 'f_' + key;
    return '<div class="field">' +
      '<label for="' + id + '">' + label + (opts.req ? ' <span aria-hidden="true">*</span>' : '') + '</label>' +
      '<div><input id="' + id + '" type="' + (opts.type || 'text') + '" data-bind="d.' + key + '"' +
      ' value="' + esc(state.d[key]) + '"' +
      (opts.ph ? ' placeholder="' + esc(opts.ph) + '"' : '') +
      (opts.mode ? ' inputmode="' + opts.mode + '"' : '') +
      (opts.cls ? ' class="' + opts.cls + '"' : '') +
      ' autocomplete="off"' + (opts.req ? ' required' : '') + '>' +
      '<small class="err" hidden>' + esc(opts.err || 'This field is required') + '</small></div></div>';
  }
 
  function viewDetails() {
    const typeRadio = (v, label) =>
      '<label class="pill"><input type="radio" name="inspType" data-bind="d.inspType" value="' + v + '"' +
      (state.d.inspType === v ? ' checked' : '') + '><span>' + label + '</span></label>';
    return '' +
      '<div class="step-strip"><div class="row-t"><span>Step 1 of ' + STEPS.length + '</span><small>Vehicle &amp; customer details</small></div>' +
        '<div class="bar"><i style="width:' + (100 / STEPS.length).toFixed(1) + '%"></i></div></div>' +
      '<div class="info-note" role="note">' + icon('info') +
        '<p>Your progress is auto-saved on this device. Please <strong>always download the PDF</strong> after completing the inspection.</p></div>' +
      '<div class="grid2">' +
        '<section class="card"><div class="card-h"><span class="ic">' + icon('user') + '</span>Vehicle &amp; Customer Details</div><div class="card-b">' +
          field('Customer Name', 'customerName', { req: true, ph: 'Full name' }) +
          field('Phone Number', 'phone', { type: 'tel', mode: 'tel', ph: '10-digit mobile number', err: 'Enter a valid phone number' }) +
          field('Vehicle Make', 'make', { req: true, ph: 'e.g. Maruti Suzuki' }) +
          field('Model / Variant', 'model', { ph: 'e.g. Brezza ZXi' }) +
          field('Dealer / Showroom', 'dealer') +
          field('Location', 'location', { ph: 'City / area' }) +
          field('Inspection Date', 'inspDate', { type: 'date' }) +
        '</div></section>' +
        '<section class="card"><div class="card-h"><span class="ic">' + icon('doc') + '</span>Inspection Details</div><div class="card-b">' +
          field('Chassis Number (VIN)', 'vin', { cls: 'upper', ph: '17-character VIN' }) +
          field('Engine Number', 'engineNo', { cls: 'upper' }) +
          field('Odometer Reading', 'odo', { mode: 'decimal', ph: 'in km' }) +
          field('Manufacturing Date', 'mfgDate', { ph: 'e.g. 18 July 2004' }) +
          field('Registration No.', 'regNo', { cls: 'upper', ph: 'e.g. OD 02 AB 1234' }) +
          field('Colour', 'colour') +
          '<div class="field"><span class="lbl">Inspection Type</span><div class="pills" role="radiogroup" aria-label="Inspection type">' +
            typeRadio('New', 'New') + typeRadio('Used', 'Used (Pre-Owned)') + '</div></div>' +
        '</div></section>' +
      '</div>' +
      '<div class="page-actions"><button type="button" class="btn btn-ghost" data-action="clearinfo-details">' + icon('trash') + 'Clear Information</button></div>';
  }
 
  function viewChecklist(step) {
    return step.sections.map(si => {
      const sec = SECTIONS[si];
      const rows = sec.items.map((name, ii) => {
        const key = si + '-' + ii;
        const c = state.c[key] || { v: '', r: '' };
        return '<div class="row" data-key="' + key + '" data-state="' + c.v + '">' +
          '<div class="r-name">' + esc(name) + '</div>' +
          '<label class="chk chk-ok"><input type="checkbox" data-chk="ok" aria-label="OK – ' + esc(name) + '"' + (c.v === 'ok' ? ' checked' : '') + '><span class="box"></span><span class="chk-l">OK</span></label>' +
          '<label class="chk chk-na"><input type="checkbox" data-chk="na" aria-label="Not available – ' + esc(name) + '"' + (c.v === 'na' ? ' checked' : '') + '><span class="box"></span><span class="chk-l">NA</span></label>' +
          '<input class="rem" type="text" data-rem placeholder="Remarks" aria-label="Remarks – ' + esc(name) + '" value="' + esc(c.r) + '" autocomplete="off">' +
        '</div>';
      }).join('');
      return '<section class="card sec" data-sec="' + si + '">' +
        '<div class="card-h"><span class="ic">' + icon(sec.icon) + '</span>' +
          '<span class="grow">' + (si + 1) + '. ' + esc(sec.title) + '</span>' +
          '<span class="sec-count"></span>' +
          '<button type="button" class="sec-btn" data-action="allok" data-sec="' + si + '"></button>' +
        '</div>' +
        '<div class="cols-head" aria-hidden="true"><span>Item</span><span>OK</span><span>NA</span><span>Remarks</span></div>' +
        rows + '</section>';
    }).join('');
  }
 
  function viewFinal() {
    const st = calcStats();
    const picked = k => state.results.indexOf(k) !== -1;
    const opt = (k, cls) =>
      '<label class="opt ' + cls + '"><input type="checkbox" data-result="' + k + '"' + (picked(k) ? ' checked' : '') + '>' +
      '<span class="opt-body"><span class="opt-dot"></span><span class="opt-t">' + RESULTS[k].label + '<small>' + RESULTS[k].sub + '</small></span></span></label>';
 
    return '' +
      '<section class="card"><div class="card-h"><span class="ic">' + icon('chart') + '</span>Inspection Summary</div><div class="card-b">' +
        '<div class="stats">' +
          '<div class="stat s-ok"><b>' + st.ok + '</b><span>Marked OK</span></div>' +
          '<div class="stat s-na"><b>' + st.na + '</b><span>Not available</span></div>' +
          '<div class="stat s-pend"><b>' + st.pending + '</b><span>Not marked yet</span></div>' +
          '<div class="stat s-rem"><b>' + st.rem + '</b><span>With remarks</span></div>' +
        '</div>' +
        (st.pending ? '<p class="note-warn">' + st.pending + ' of ' + st.total + ' items are not marked. Go back to finish them, or continue and they will appear blank in the report.</p>' : '') +
      '</div></section>' +
 
      '<section class="card" id="resultCard"><div class="card-h"><span class="ic">' + icon('note') + '</span>PDI Result</div><div class="card-b">' +
        '<p class="hint-text">Select all that apply.</p>' +
        '<div class="opts" role="group" aria-label="PDI result">' + opt('good', 'good') + opt('minor', 'minor') + opt('major', 'major') + '</div>' +
        '<div class="field stack res-rem"><label for="resRem">Remarks</label><textarea id="resRem" class="xl-remarks" data-bind="resultRemarks" placeholder="Remarks about the PDI result">' + esc(state.resultRemarks) + '</textarea></div>' +
      '</div></section>' +
 
      '<section class="card"><div class="card-h"><span class="ic">' + icon('pen') + '</span>Inspection Notes</div><div class="card-b">' +
        '<div class="field stack"><label for="notes">Detailed inspection notes</label><textarea id="notes" class="xl-notes" data-bind="notes" placeholder="Additional observations, defects and recommendations">' + esc(state.notes) + '</textarea></div>' +
      '</div></section>' +
 
      '<button type="button" class="btn btn-primary btn-big" id="btnPdf" data-action="pdf">' + icon('pdf') + '<span>Generate PDF Report</span></button>' +
      '<div class="pdf-status" id="pdfStatus" role="alert" hidden></div>' +
      '<div class="page-actions">' +
        '<button type="button" class="btn btn-ghost" data-action="clearinfo-result">' + icon('trash') + 'Clear Information</button>' +
        '<button type="button" class="btn btn-danger" data-action="resetall">' + icon('trash') + 'Reset All</button>' +
      '</div>';
  }
 
  /* ========================================================================
     6. RENDER & NAVIGATION
     ======================================================================== */
  function render(keepScroll) {
    const step = STEPS[state.step];
    const screen = $('#screen');
    screen.innerHTML = step.type === 'details' ? viewDetails() : step.type === 'checklist' ? viewChecklist(step) : viewFinal();
 
    $('#hero').hidden = state.step !== 0;
    $('#topbar').hidden = state.step === 0;
 
    if (step.type === 'checklist') step.sections.forEach(updateSection);
 
    // progress + labels
    $('#progressBar').style.width = ((state.step + 1) / STEPS.length * 100) + '%';
    let sub = step.label || '';
    if (step.type === 'checklist') {
      const a = step.sections[0] + 1, b = step.sections[step.sections.length - 1] + 1;
      sub = a === b ? 'Section ' + a : 'Sections ' + a + '–' + b;
    }
    $('#tbStep').innerHTML = 'Step ' + (state.step + 1) + ' of ' + STEPS.length + '<small>' + esc(sub) + '</small>';
 
    // bottom nav
    const last = state.step === STEPS.length - 1;
    $('#btnPrev').hidden = state.step === 0;
    $('#btnClear').hidden = step.type !== 'checklist';
    $('#btnNext').hidden = last;
    $('#btnNextLabel').textContent = state.step === STEPS.length - 2 ? 'Next: Result' : 'Next';
    syncNavHeight();
    if (!keepScroll) window.scrollTo(0, 0);
  }
 
  // The bottom bar changes height between pages; keep content / toasts / save pill clear of it
  function syncNavHeight() {
    const nav = document.getElementById('nav');
    if (nav) document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  }
  window.addEventListener('resize', syncNavHeight);
  if (window.ResizeObserver) new ResizeObserver(syncNavHeight).observe(document.getElementById('nav'));
 
  function go(delta) {
    if (delta > 0 && state.step === 0 && !validateDetails()) return;
    const n = state.step + delta;
    if (n < 0 || n >= STEPS.length) return;
    state.step = n; saveNow(); render();
  }
 
  function validateDetails() {
    const rules = {
      customerName: v => v.trim() !== '',
      make: v => v.trim() !== '',
      phone: v => !v.trim() || v.replace(/\D/g, '').length >= 10
    };
    let first = null;
    Object.keys(rules).forEach(k => {
      const el = $('[data-bind="d.' + k + '"]');
      const bad = !rules[k](state.d[k] || '');
      el.classList.toggle('invalid', bad);
      $('.err', el.parentNode).hidden = !bad;
      if (bad && !first) first = el;
    });
    if (first) {
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      first.focus({ preventScroll: true });
      toast('Please fix the highlighted fields');
      return false;
    }
    return true;
  }
 
  /* ========================================================================
     7. CHECKLIST INTERACTION
     ======================================================================== */
  function setItem(key, v) {
    const c = state.c[key] || (state.c[key] = { v: '', r: '' });
    c.v = v;
    const row = $('.row[data-key="' + key + '"]');
    if (row) {
      row.dataset.state = v;
      $$('[data-chk]', row).forEach(i => { i.checked = i.dataset.chk === v; });
      row.classList.remove('flash'); void row.offsetWidth; row.classList.add('flash');
    }
    updateSection(parseInt(key, 10));
    queueSave();
  }
 
  function updateSection(si) {
    const card = $('.sec[data-sec="' + si + '"]');
    if (!card) return;
    const items = SECTIONS[si].items;
    let answered = 0, allOk = true;
    items.forEach((_, ii) => {
      const v = (state.c[si + '-' + ii] || {}).v || '';
      if (v) answered++;
      if (v !== 'ok') allOk = false;
    });
    $('.sec-count', card).textContent = answered + '/' + items.length;
    const btn = $('.sec-btn', card);   // short label on phones, full label on larger screens
    btn.innerHTML = allOk
      ? '<span class="lbl-long">Clear all</span><span class="lbl-short">Clear</span>'
      : '<span class="lbl-long">Mark rest OK</span><span class="lbl-short">All OK</span>';
    btn.setAttribute('aria-label', allOk ? 'Clear all marks in this section' : 'Mark remaining items in this section OK');
  }
 
  function markAll(si) {
    const items = SECTIONS[si].items;
    const allOk = items.every((_, ii) => (state.c[si + '-' + ii] || {}).v === 'ok');
    items.forEach((_, ii) => {
      const key = si + '-' + ii;
      const v = (state.c[key] || {}).v || '';
      if (allOk) setItem(key, '');
      else if (!v) setItem(key, 'ok');
    });
  }
 
  /* "Clear Tick Marks" — checklist pages only: unticks OK / NA and clears remarks for the sections on screen */
  async function clearTicks() {
    const step = STEPS[state.step];
    if (step.type !== 'checklist') return;
    const ok = await confirmDialog('Clear tick marks?', 'This unticks every OK / NA box and clears all remarks on this page.', 'Clear', 'Cancel');
    if (!ok) return;
    step.sections.forEach(si => {
      SECTIONS[si].items.forEach((_, ii) => {
        const key = si + '-' + ii;
        state.c[key] = { v: '', r: '' };
        const row = $('.row[data-key="' + key + '"]');
        if (row) {
          row.dataset.state = '';
          $$('[data-chk]', row).forEach(i => { i.checked = false; });
          const rem = $('[data-rem]', row);
          if (rem) rem.value = '';
        }
      });
      updateSection(si);
    });
    saveNow();
    toast('Tick marks cleared');
  }
 
  /* ========================================================================
     8. CLEAR INFORMATION & RESET ALL (always behind a confirmation dialog)
     ======================================================================== */
  async function clearInfo(kind) {
    if (kind === 'details') {
      const ok = await confirmDialog('Clear vehicle & customer details?',
        'Everything entered on this page will be removed. This cannot be undone.', 'Yes, clear information', 'Cancel', true,
        'Your data is stored only on this device, so cleared information cannot be recovered.');
      if (!ok) return;
      state.d = defaultState().d;
      saveNow(); render(true);
      toast('Vehicle & customer details cleared');
    } else {
      const ok = await confirmDialog('Clear result & notes?',
        'The selected PDI Result options, their remarks and the Inspection Notes will be removed. This cannot be undone.', 'Yes, clear information', 'Cancel', true,
        'Tip: download your PDF report first if you still need it.');
      if (!ok) return;
      state.results = []; state.resultRemarks = ''; state.notes = '';
      saveNow(); render(true);
      toast('PDI result and notes cleared');
    }
  }
 
  async function resetAll() {
    const ok = await confirmDialog('Reset all data?',
      'Are you sure you want to clear all data? This cannot be undone. Vehicle & customer details, all OK / NA tick marks, remarks, the PDI result and the inspection notes will be erased.',
      'Yes, reset all', 'Cancel', true,
      'Tip: download your PDF report first. Reset cannot be undone.');
    if (!ok) return;
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    state = defaultState();
    if (lastPdf) { try { URL.revokeObjectURL(lastPdf.url); } catch (e) {} lastPdf = null; }
    const rp = $('#pdf-report'); if (rp) rp.innerHTML = '';
    saveNow(); render();
    toast('All data cleared');
  }
 
  /* ========================================================================
     9. EVENTS (delegated)
     ======================================================================== */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-action]');
    if (!b) return;
    switch (b.dataset.action) {
      case 'next': go(1); break;
      case 'prev': go(-1); break;
      case 'allok': markAll(parseInt(b.dataset.sec, 10)); break;
      case 'clearticks': clearTicks(); break;
      case 'clearinfo-details': clearInfo('details'); break;
      case 'clearinfo-result': clearInfo('result'); break;
      case 'resetall': resetAll(); break;
      case 'pdf': generatePDF(); break;
      case 'print': printReport(); break;
      case 'sharepdf': sharePdf(); break;
    }
  });
 
  document.addEventListener('input', e => {
    const t = e.target;
    if (t.matches('[data-rem]')) {
      const key = t.closest('.row').dataset.key;
      (state.c[key] || (state.c[key] = { v: '', r: '' })).r = t.value;
      queueSave();
    } else if (t.dataset && t.dataset.bind && t.type !== 'radio') {
      setPath(state, t.dataset.bind, t.value);
      if (t.classList.contains('invalid') && t.value.trim()) {
        t.classList.remove('invalid');
        const er = $('.err', t.parentNode); if (er) er.hidden = true;
      }
      queueSave();
    }
  });
 
  document.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('[data-chk]')) {
      setItem(t.closest('.row').dataset.key, t.checked ? t.dataset.chk : '');
    } else if (t.matches('input[data-result]')) {
      const picked = new Set(state.results);
      if (t.checked) picked.add(t.dataset.result); else picked.delete(t.dataset.result);
      state.results = ['good', 'minor', 'major'].filter(k => picked.has(k));
      saveNow();
    } else if (t.matches('input[type=radio][data-bind]')) {
      setPath(state, t.dataset.bind, t.value);
      saveNow();
    }
  });
 
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !$('#modal').hidden) $('#mCancel').click();
  });
 
  /* ========================================================================
     10. PDF REPORT
     The report is built as fixed A4 pages inside #pdf-report (a dedicated,
     off-screen container). html2pdf renders ONE page at a time, so memory use
     stays low on phones and the report can be any length.
     ======================================================================== */
  const PAGE_H = 1120;   // px, just under A4 @96dpi (1123) so no blank extra page appears
  const FOOT_H = 32, HEAD_H = 30, SAFETY = 16;
 
  // CDN chain: tried in order until one loads (all official html2pdf.js bundles)
  const PDF_LIBS = [
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.14.0/html2pdf.bundle.min.js'
  ];
  let libPromise = null;
  let logoSrc = LOGO_DATA_URI, checkSrc = CHECK_DATA_URI;   // upgraded to PNG data-URIs right before every export
 
  async function prepareAssets() {
    const r = await Promise.all([svgToPng('logo', LOGO_DATA_URI, 320), svgToPng('check', CHECK_DATA_URI, 64)]);
    logoSrc = r[0]; checkSrc = r[1];
  }
 
  function waitForImages(root) {
    return Promise.all(Array.from(root.querySelectorAll('img')).map(img =>
      img.complete ? Promise.resolve() : new Promise(res => { img.onload = img.onerror = res; setTimeout(res, 3000); })));
  }
 
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      const timer = setTimeout(() => { s.remove(); reject(new Error('Timed out loading ' + src)); }, 15000);
      s.src = src; s.async = true;
      s.onload = () => { clearTimeout(timer); resolve(); };
      s.onerror = () => { clearTimeout(timer); s.remove(); reject(new Error('Could not load ' + src)); };
      document.head.appendChild(s);
    });
  }
 
  function ensureHtml2pdf() {
    if (typeof window.html2pdf === 'function') return Promise.resolve();
    if (!libPromise) {
      libPromise = (async () => {
        for (const url of PDF_LIBS) {
          try { await loadScript(url); if (typeof window.html2pdf === 'function') return; }
          catch (e) { console.warn(e.message); }
        }
        throw new Error('The PDF library could not be downloaded. Check your internet connection and try again.');
      })().catch(err => { libPromise = null; throw err; });
    }
    return libPromise;
  }
 
  /* ---- Text layout for the PDF ------------------------------------------------
     Free text is wrapped here (measured with a canvas, using the report's own font)
     and drawn as one single-line <div> per line. html2canvas therefore never has to
     wrap text itself - which is what used to clip long unbroken words. Each text box
     stays ONE box whose height follows the amount of text. */
  const PDF_FONT_STACK = "'Poppins','Segoe UI',Arial,sans-serif";
  const BOX_INNER_W = 712;      // px available for text inside a notes / remarks box
  const BOX_MAX_TEXT_H = 940;   // px: the most text height a single A4 page can hold
  const CELL_INNER_W = 246;     // px available inside a checklist "Remarks" cell
  let measureCtx = null;
 
  const graphemes = str => (window.Intl && Intl.Segmenter)
    ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(str), x => x.segment)
    : Array.from(str);
 
  function wrapText(text, fontPx, maxW) {
    if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
    const ctx = measureCtx;
    ctx.font = '400 ' + fontPx + 'px ' + PDF_FONT_STACK;
    const width = str => ctx.measureText(str).width;
    const lines = [];
    String(text || '').replace(/\r\n?/g, '\n').replace(/\t/g, '    ').split('\n').forEach(par => {
      if (!par.trim()) { lines.push(''); return; }
      let line = '';
      par.split(' ').forEach(word => {
        const candidate = line ? line + ' ' + word : word;
        if (width(candidate) <= maxW) { line = candidate; return; }
        if (line) { lines.push(line); line = ''; }
        if (width(word) <= maxW) { line = word; return; }
        let chunk = '';                                   // one very long word: break it by characters
        graphemes(word).forEach(g => {
          if (chunk && width(chunk + g) > maxW) { lines.push(chunk); chunk = g; } else { chunk += g; }
        });
        line = chunk;
      });
      lines.push(line);
    });
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    return lines;
  }
 
  const lineDivs = (lines, fs, lh) => lines.map(l =>
    '<div class="rp-ln" style="height:' + lh + 'px;line-height:' + lh + 'px;font-size:' + fs + 'px">' + (l ? esc(l) : '&nbsp;') + '</div>').join('');
 
  // One single box; its height grows with the text. Font only shrinks in the (very rare) case of more than one page of text.
  function textBox(title, text, emptyText) {
    const raw = String(text || '').trim();
    let inner;
    if (!raw) {
      inner = lineDivs([emptyText], 10.5, 15);
    } else {
      const sizes = [10.5, 9.5, 8.5, 7.5];
      let fs = 10.5, lh = 16, lines = [];
      for (let k = 0; k < sizes.length; k++) {
        fs = sizes[k]; lh = Math.round(fs * 1.5);
        lines = wrapText(raw, fs, BOX_INNER_W);
        if (lines.length * lh <= BOX_MAX_TEXT_H) break;
      }
      const maxLines = Math.floor(BOX_MAX_TEXT_H / lh);
      if (lines.length > maxLines) {
        lines = lines.slice(0, maxLines);
        lines[maxLines - 1] = '… (text shortened: too long for one page)';
      }
      inner = lineDivs(lines, fs, lh);
    }
    return '<div class="rp-note-box"><h3>' + esc(title) + '</h3><div class="rp-nt">' + inner + '</div></div>';
  }
 
  // Returns the report as an ordered list of blocks (each block is never split across pages)
  function reportBlocks() {
    const d = state.d, st = calcStats(), now = new Date();
    const val = v => (v && String(v).trim()) ? esc(String(v).trim()) : '—';
    const up = v => val(v ? String(v).toUpperCase() : '');
    const odo = d.odo && /^[\d.,\s]+$/.test(d.odo) ? esc(d.odo.trim()) + ' km' : val(d.odo);
    const kv = (k, v) => '<div class="rp-kv"><span>' + k + '</span><b>' + v + '</b></div>';
    const mk = (cls, on) => '<span class="rp-mk' + (on ? ' ' + cls : '') + '">' + (on ? '<img src="' + checkSrc + '" alt="">' : '') + '</span>';
    const picked = ['good', 'minor', 'major'].filter(k => state.results.indexOf(k) !== -1);
    const stamp = now.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const blocks = [];
 
    // 1. Brand header + title
    blocks.push({ flush: true, html:
      '<div class="rp-head"><div class="rp-brand"><img class="rp-logo" src="' + logoSrc + '" alt="" width="62" height="62">' +
        '<div><span class="rp-w1">SMART</span><span class="rp-w2">CHECK PDI</span><span class="rp-sub">INSPECT | VERIFY | DRIVE WITH CONFIDENCE</span></div></div>' +
        '<div class="rp-tag"><div class="rp-script">Your Car<br>Our Inspection</div><div class="rp-loc">Bhubaneswar &amp; All Odisha</div></div></div>' +
      '<div class="rp-title"><b>PRE-DELIVERY INSPECTION (PDI) REPORT</b><i>A small check today, a worry-free tomorrow.</i></div>' +
      '<div class="rp-meta"><span>Report generated: ' + esc(stamp) + '</span><span>Inspection date: ' + (fmtDate(d.inspDate) || '—') + '</span></div>' });
 
    // 2. Details
    blocks.push({ html: '<div class="rp-two">' +
      '<div class="rp-box"><h3>Vehicle &amp; Customer Details</h3>' +
        kv('Customer Name', val(d.customerName)) + kv('Phone Number', val(d.phone)) + kv('Vehicle Make', val(d.make)) +
        kv('Model / Variant', val(d.model)) + kv('Dealer / Showroom', val(d.dealer)) + kv('Location', val(d.location)) +
        kv('Inspection Date', fmtDate(d.inspDate) || '—') + '</div>' +
      '<div class="rp-box"><h3>Inspection Details</h3>' +
        kv('Chassis No. (VIN)', up(d.vin)) + kv('Engine Number', up(d.engineNo)) + kv('Odometer Reading', odo) +
        kv('Manufacturing Date', fmtDate(d.mfgDate) || val(d.mfgDate)) + kv('Registration No.', up(d.regNo)) + kv('Colour', val(d.colour)) +
        kv('Inspection Type', d.inspType === 'Used' ? 'Used (Pre-Owned)' : d.inspType === 'New' ? 'New' : '—') + '</div></div>' });
 
    // 3. Result badges (one per selected option) + stats
    const badges = picked.length
      ? picked.map(k => '<div class="rp-badge ' + k + '"><small>PDI Result</small><b>' + esc(RESULTS[k].label) + '</b><em>' + esc(RESULTS[k].sub) + '</em></div>').join('')
      : '<div class="rp-badge none"><small>PDI Result</small><b>Not selected</b><em>No result chosen</em></div>';
    blocks.push({ html: '<div class="rp-result"><div class="rp-badges">' + badges + '</div>' +
      '<div class="rp-stats">' +
        '<div class="rp-stat"><b style="color:#1aa35a">' + st.ok + '</b><span>Marked OK</span></div>' +
        '<div class="rp-stat"><b style="color:#6b7c99">' + st.na + '</b><span>Not available</span></div>' +
        '<div class="rp-stat"><b style="color:#d98a00">' + st.pending + '</b><span>Not marked</span></div>' +
        '<div class="rp-stat"><b style="color:#1e63c4">' + st.rem + '</b><span>With remarks</span></div>' +
      '</div></div>' });
    if (state.resultRemarks && state.resultRemarks.trim()) {
      blocks.push({ html: textBox('PDI Result Remarks', state.resultRemarks, '') });
    }
 
    // 4. One block per checklist section
    SECTIONS.forEach((sec, si) => {
      const rows = sec.items.map((name, ii) => {
        const c = state.c[si + '-' + ii] || { v: '', r: '' };
        return '<tr class="' + (c.v ? 'is-' + c.v : '') + '"><td>' + esc(name) + '</td>' +
          '<td class="c">' + mk('ok', c.v === 'ok') + '</td><td class="c">' + mk('na', c.v === 'na') + '</td>' +
          '<td class="rm">' + (c.r && c.r.trim() ? lineDivs(wrapText(c.r.trim(), 10, CELL_INNER_W), 10, 14) : '') + '</td></tr>';
      }).join('');
      const done = sec.items.filter((_, ii) => (state.c[si + '-' + ii] || {}).v).length;
      blocks.push({ html: '<div class="rp-sec"><h3><span>' + (si + 1) + '. ' + esc(sec.title) + '</span><span>' + done + '/' + sec.items.length + '</span></h3>' +
        '<table><colgroup><col><col style="width:38px"><col style="width:38px"><col style="width:36%"></colgroup><thead><tr><th>Item</th><th>OK</th><th>NA</th><th>Remarks</th></tr></thead><tbody>' + rows + '</tbody></table></div>' });
    });
 
    // 5. Inspection notes (a single box that grows with the text)
    blocks.push({ html: textBox('Detailed Inspection Notes', state.notes, 'No additional notes recorded.') });
 
    return blocks;
  }
 
  // Measures every block, packs them into A4 pages and writes them into #pdf-report
  function renderReport() {
    const host = $('#pdf-report');
    const blocks = reportBlocks();
    const wrap = b => '<div class="rp-b' + (b.flush ? ' flush' : '') + '">' + b.html + '</div>';
 
    host.innerHTML = '<div class="rp-page rp-measure">' + blocks.map(wrap).join('') + '</div>';
    const heights = Array.from(host.firstElementChild.children).map(el => el.getBoundingClientRect().height);
 
    const pages = [[]];
    let used = 0;
    heights.forEach((h, i) => {
      const cap = PAGE_H - FOOT_H - SAFETY - (pages.length > 1 ? HEAD_H : 0);
      if (used + h > cap && pages[pages.length - 1].length) { pages.push([]); used = 0; }
      pages[pages.length - 1].push(i);
      used += h;
    });
 
    const d = state.d;
    const who = [d.customerName, [d.make, d.model].filter(Boolean).join(' '), d.regNo ? d.regNo.toUpperCase() : '']
      .map(s => (s || '').trim()).filter(Boolean).join('  •  ');
    const running = '<div class="rp-ph"><b>SMART CHECK PDI</b><span>' + esc(who || 'Pre-Delivery Inspection Report') + '</span></div>';
 
    host.innerHTML = pages.map((idxs, pi) =>
      '<div class="rp-page">' + (pi ? running : '') + idxs.map(i => wrap(blocks[i])).join('') +
      '<div class="rp-pf"><span>SMART CHECK PDI  •  Inspect Before You Accept  •  Bhubaneswar &amp; All Odisha</span>' +
      '<span>Page ' + (pi + 1) + ' of ' + pages.length + '</span></div></div>').join('');
 
    return Array.from(host.querySelectorAll('.rp-page'));
  }
 
  function pdfFileName() {
    const slug = s => String(s || '').trim().replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    return ['SmartCheck_PDI_Report', slug(state.d.customerName), state.d.inspDate].filter(Boolean).join('_') + '.pdf';
  }
 
  function setPdfStatus(html, kind) {
    const el = $('#pdfStatus');
    if (!el) return;
    el.hidden = !html;
    el.className = 'pdf-status' + (kind ? ' ' + kind : '');
    el.setAttribute('role', kind ? 'status' : 'alert');      // errors are announced immediately
    el.innerHTML = html || '';
  }
 
  function withTimeout(promise, ms, label) {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(label + ' took too long (over ' + Math.round(ms / 1000) + ' seconds).')), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }
 
  // Small preview image of a rendered page (shown after the PDF is ready)
  function makeThumb(canvas, thumbs) {
    try {
      const t = document.createElement('canvas');
      t.width = 420;
      t.height = Math.round(canvas.height * 420 / canvas.width);
      t.getContext('2d').drawImage(canvas, 0, 0, t.width, t.height);
      thumbs.push(t.toDataURL('image/jpeg', 0.75));
    } catch (e) { /* preview is optional */ }
  }
 
  // STRATEGY A — html2pdf.js, one canvas per A4 page, all added to one PDF
  async function buildWithHtml2pdf(pages, opt, thumbs, onProgress) {
    await ensureHtml2pdf();
    const grab = cv => { makeThumb(cv, thumbs); if (onProgress) onProgress(thumbs.length, pages.length); };
    let worker = html2pdf().set(opt).from(pages[0]).toCanvas().get('canvas').then(grab).toPdf();
    for (let i = 1; i < pages.length; i++) {
      const page = pages[i];
      worker = worker.get('pdf').then(pdf => { pdf.addPage(); })
        .from(page).toContainer().toCanvas().get('canvas').then(grab).toPdf();
    }
    return await worker.outputPdf('blob');
  }
 
  // STRATEGY B (automatic backup) — same pages rendered with html2canvas + jsPDF directly
  const JSPDF_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  const H2C_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
 
  async function buildManually(pages, scale, thumbs, onProgress) {
    if (typeof window.html2canvas !== 'function') await loadScript(H2C_URL);
    if (!(window.jspdf && window.jspdf.jsPDF)) await loadScript(JSPDF_URL);
    const jsPDF = window.jspdf.jsPDF;
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    const box = $('#pdf-container'), prevLeft = box.style.left;
    box.style.left = '0px';                       // render on-screen (hidden behind the app) for html2canvas
    try {
      for (let i = 0; i < pages.length; i++) {
        const canvas = await window.html2canvas(pages[i], {
          scale: scale, useCORS: true, backgroundColor: '#ffffff', logging: false, scrollX: 0, scrollY: 0
        });
        makeThumb(canvas, thumbs);
        if (onProgress) onProgress(i + 1, pages.length);
        if (i) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 210 * canvas.height / canvas.width);
      }
    } finally {
      box.style.left = prevLeft;
    }
    return pdf.output('blob');
  }
 
  // Hand the finished PDF to the user: automatic download + visible buttons + page preview
  let lastPdf = null;
  function deliverPdf(blob, name, thumbs) {
    if (lastPdf) { try { URL.revokeObjectURL(lastPdf.url); } catch (e) {} }
    const url = URL.createObjectURL(blob);
    lastPdf = { url: url, name: name, blob: blob };
 
    try {                                         // 1) automatic download
      const a = document.createElement('a');
      a.href = url; a.download = name; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e) { /* the buttons below still work */ }
 
    let canShare = false;                         // 2) manual buttons (some phones/sandboxes block automatic downloads)
    try { canShare = !!(navigator.canShare && navigator.canShare({ files: [new File([blob], name, { type: 'application/pdf' })] })); } catch (e) {}
 
    setPdfStatus(
      '<strong>Your PDF report is ready.</strong><br><span class="pdf-name">' + esc(name) + '</span> · ' +
      Math.max(1, Math.round(blob.size / 1024)) + ' KB · ' + thumbs.length + ' page' + (thumbs.length === 1 ? '' : 's') +
      '<div class="pdf-actions">' +
        '<a class="btn btn-primary" href="' + url + '" download="' + esc(name) + '">Download PDF</a>' +
        '<a class="btn btn-ghost" href="' + url + '" target="_blank" rel="noopener">Open PDF</a>' +
        (canShare ? '<button type="button" class="btn btn-ghost" data-action="sharepdf">Share</button>' : '') +
      '</div>' +
      (thumbs.length ? '<div class="pdf-thumbs">' + thumbs.map((t, i) => '<img src="' + t + '" alt="Report page ' + (i + 1) + '">').join('') + '</div>' : ''),
      'ok');
    const box = $('#pdfStatus');
    if (box) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
 
  async function sharePdf() {
    if (!lastPdf) return;
    try {
      await navigator.share({ files: [new File([lastPdf.blob], lastPdf.name, { type: 'application/pdf' })], title: 'Smart Check PDI Report' });
    } catch (e) {
      if (!e || e.name !== 'AbortError') toast('Sharing is not available on this device');
    }
  }
 
  async function generatePDF() {
    const btn = $('#btnPdf');
    if (!btn || btn.disabled) return;
    const label = $('span', btn);
    const original = label.textContent;
 
    if (!state.results.length) {
      const proceed = await confirmDialog('No PDI result selected',
        'The report will show "Not selected" as the result. Generate it anyway?', 'Generate anyway', 'Select result');
      if (!proceed) {
        const card = $('#resultCard');
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
 
    saveNow(true);
    const busy = msg => setPdfStatus('<div class="pdf-loading"><span class="spinner" aria-hidden="true"></span><span>' + esc(msg) + '</span></div>', 'loading');
    busy('Preparing your report…');
    btn.disabled = true;
    btn.classList.add('is-loading');
    btn.setAttribute('aria-busy', 'true');
    document.body.classList.add('is-generating');
    label.textContent = 'Generating PDF… Please wait';
    let stage = 'preparing the report';
    const progress = (n, total) => busy('Rendering page ' + n + ' of ' + total + '…');
 
    try {
      if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
      await prepareAssets();
      const pages = renderReport();
      await waitForImages($('#pdf-report'));
      const isMobile = /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);
      const scale = isMobile ? 1.75 : 2;
      const opt = {
        margin: 0,
        filename: pdfFileName(),
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: scale, useCORS: true, backgroundColor: '#ffffff', logging: false, scrollX: 0, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
        pagebreak: { mode: [] }                   // pages are already exactly A4 – no automatic splitting
      };
      const thumbs = [];
      let blob;
 
      try {
        stage = 'rendering the pages (html2pdf)';
        blob = await withTimeout(buildWithHtml2pdf(pages, opt, thumbs, progress), 90000, 'PDF rendering');
      } catch (primaryErr) {
        console.warn('html2pdf route failed, switching to the backup renderer:', primaryErr);
        document.querySelectorAll('.html2pdf__overlay').forEach(n => n.remove());
        thumbs.length = 0;
        stage = 'rendering the pages (backup renderer)';
        blob = await withTimeout(buildManually(pages, scale, thumbs, progress), 90000, 'Backup PDF rendering');
      }
 
      if (!blob || !blob.size) throw new Error('The PDF file came out empty.');
      stage = 'saving the file';
      deliverPdf(blob, opt.filename, thumbs);
      toast('PDF ready');
    } catch (err) {
      console.error('PDF generation failed while ' + stage + ':', err);
      const msg = err && err.message ? esc(err.message) : 'Unknown error.';
      setPdfStatus('<strong>The PDF could not be created.</strong><br>Problem while ' + esc(stage) + ': ' + msg +
        '<br><span>Your data is safe and still saved on this device. Please try again.</span>' +
        '<div class="pdf-actions">' +
        '<button type="button" class="btn btn-ghost" data-action="pdf">Try again</button>' +
        '<button type="button" class="btn btn-ghost" data-action="print">Print / Save as PDF instead</button></div>');
      toast('PDF generation failed');
    } finally {
      btn.disabled = false;
      btn.classList.remove('is-loading');
      btn.removeAttribute('aria-busy');
      document.body.classList.remove('is-generating');
      label.textContent = original;
    }
  }
 
  // Last-resort fallback: the browser's own print dialog (choose "Save as PDF")
  async function printReport() {
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    await prepareAssets();
    renderReport();
    await waitForImages($('#pdf-report'));
    setTimeout(() => window.print(), 150);
  }
 
  /* ========================================================================
     11. INIT
     ======================================================================== */
  $$('[data-logo]').forEach(n => { n.innerHTML = LOGO_SVG; });
  const fav = document.createElement('link'); fav.rel = 'icon'; fav.href = LOGO_DATA_URI; document.head.appendChild(fav);
  render();
  ensureHtml2pdf().catch(() => { /* retried when the user taps Generate */ });
})();