/* SOLIS ENERGY website interactions - GitHub Pages / static hosting */
const DATA = window.SOLIS_SITE_DATA || {};
const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => [...root.querySelectorAll(q)];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => n == null || n === '' ? 'สอบถามราคา' : new Intl.NumberFormat('th-TH', {style:'currency', currency:'THB', maximumFractionDigits:0}).format(Number(n));
const integer = n => new Intl.NumberFormat('th-TH', {maximumFractionDigits:0}).format(Number(n) || 0);
function capacityValue(value = '') {
  const text = String(value).replace(/,/g, '').toLowerCase();
  const match = text.match(/(\d+(?:\.\d+)?)\s*(mw|kwp|kw|kwh|mwh)/);
  if (!match) return 0;
  let amount = Number(match[1]);
  if (match[2] === 'mw' || match[2] === 'mwh') amount *= 1000;
  return amount;
}
function applyBasics() {
  $$('[data-company]').forEach(el => el.textContent = DATA.companyName || 'บริษัท โซลิส เอ็นเนอร์จี จำกัด');
  $$('[data-short-name]').forEach(el => el.textContent = DATA.shortName || 'SOLIS');
  $$('[data-english-name]').forEach(el => el.textContent = DATA.englishName || 'SOLIS ENERGY CO., LTD.');
  $$('[data-phone]').forEach(el => el.textContent = DATA.phone || '088 5555 848');
  $$('[data-phone-link]').forEach(el => el.href = 'tel:' + String(DATA.phoneLink || DATA.phone || '').replace(/[^\d+]/g, ''));
  $$('[data-address]').forEach(el => el.textContent = DATA.address || '');
  $$('[data-hero-title]').forEach(el => el.innerHTML = esc(DATA.heroTitle || 'ออกแบบพลังงานแสงอาทิตย์\nเพื่ออนาคตที่ยั่งยืน').replace(/\n/g, '<br>').replace('เพื่ออนาคตที่ยั่งยืน', '<em>เพื่ออนาคตที่ยั่งยืน</em>'));
  $$('[data-hero-description]').forEach(el => el.textContent = DATA.heroDescription || '');
  $$('[data-vision]').forEach(el => el.textContent = DATA.vision || '');
  $$('[data-mission]').forEach(el => el.textContent = DATA.mission || '');
  const map = $('#mapLink');
  if (map) map.href = DATA.social?.mapsUrl || '#contact';
  const social = DATA.social || {};
  const messenger = $('#messengerFloat');
  if (messenger) {
    messenger.href = social.messengerUrl || social.facebookUrl || '#contact';
    messenger.setAttribute('aria-label', social.messengerUrl ? 'ติดต่อผ่าน Messenger' : 'ติดต่อผ่าน Facebook');
    messenger.title = social.messengerUrl ? 'ติดต่อผ่าน Messenger' : 'ติดต่อผ่าน Facebook';
    messenger.textContent = social.messengerUrl ? '↗' : 'f';
  }
  document.title = `${DATA.companyName || 'บริษัท โซลิส เอ็นเนอร์จี จำกัด'} | ${DATA.englishName || 'SOLIS ENERGY'}`;
}
function renderServices() {
  const target = $('#servicesGrid');
  if (!target) return;
  target.innerHTML = (DATA.services || []).map(service => `<article class="service-card"><div class="service-image"><img src="${esc(service.image)}" alt="${esc(service.thai || service.title)}" loading="lazy"><span class="service-number">${esc(service.number || '')} / ${esc(service.title)}</span></div><div class="service-body"><span class="service-label">${esc(service.tag || 'PRODUCT & SERVICE')}</span><h3>${esc(service.title)}</h3><h4>${esc(service.thai)}</h4><p>${esc(service.description)}</p></div></article>`).join('');
}
function renderSolutions() {
  const target = $('#packagesGrid');
  if (!target) return;
  target.innerHTML = (DATA.packages || []).map(item => `<article class="solution-card"><span>${esc(item.sub || 'SOLAR SOLUTION')}</span><h3>${esc(item.name)}</h3><strong>${esc(item.sizes)}</strong><p>${esc(item.desc)}</p></article>`).join('');
}
function renderProjects() {
  const target = $('#projectsGrid');
  if (!target) return;
  const chosen = $('#projectFilter')?.value || 'all';
  let projects = [...(DATA.projects || [])].sort((a, b) => capacityValue(b.capacity) - capacityValue(a.capacity));
  projects = projects.filter(project => {
    if (chosen === 'all') return true;
    if (chosen === 'Hybrid') return /hybrid|battery|bess/i.test(`${project.type || ''} ${project.capacity || ''}`);
    if (chosen === 'ระบบกักเก็บพลังงาน') return /กักเก็บพลังงาน|bess/i.test(project.type || '');
    return (project.type || '').includes(chosen);
  });
  const count = $('#projectCount');
  if (count) count.textContent = projects.length;
  target.innerHTML = projects.map(project => `<button class="project-card project-open" type="button" data-project-index="${(DATA.projects || []).indexOf(project)}" aria-label="ดูรายละเอียด ${esc(project.name)}"><div class="project-img"><img src="${esc(project.image)}" alt="${esc(project.name)}" loading="lazy"><span class="project-type">${esc(project.type || 'PROJECT REFERENCE')}</span></div><div class="project-details"><span class="project-capacity">${esc(project.capacity || 'สอบถามรายละเอียด')}</span><h3>${esc(project.name)}</h3>${project.location ? `<p class="project-loc">${esc(project.location)}</p>` : ''}<span class="project-readmore">ดูภาพขนาดใหญ่และรายละเอียด ↗</span></div></button>`).join('');
  $$('.project-open', target).forEach(button => button.addEventListener('click', () => openProject(Number(button.dataset.projectIndex))));
}
function openProject(index) {
  const project = (DATA.projects || [])[index];
  const modal = $('#projectModal');
  if (!project || !modal) return;
  $('#projectModalContent').innerHTML = `<button type="button" class="modal-close" aria-label="ปิดรายละเอียด">×</button><button type="button" class="project-image-zoom" data-zoom-src="${esc(project.image)}" data-zoom-alt="${esc(project.name)}"><img class="project-modal-image" src="${esc(project.image)}" alt="${esc(project.name)}"><span>แตะภาพเพื่อขยาย</span></button><div class="project-modal-copy"><span class="project-capacity">${esc(project.capacity || '')}</span><p class="eyebrow">PROJECT REFERENCE</p><h2>${esc(project.name)}</h2>${project.location ? `<p>${esc(project.location)}</p>` : ''}<p><b>ประเภทโครงการ:</b> ${esc(project.type || 'ไม่ระบุ')}</p><p class="modal-disclaimer">ชื่อโครงการ ขนาด และภาพอ้างอิงจาก Company Profile ที่ได้รับ รายละเอียดที่เอกสารไม่ได้ระบุจะไม่สรุปเพิ่ม</p><a class="btn btn-cyan" href="#consultation" data-project-cta="${esc(project.name + ' — ' + project.capacity)}">สอบถามโครงการลักษณะนี้ ↗</a></div>`;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  $('.modal-close', modal)?.focus();
  $('.modal-close', modal)?.addEventListener('click', closeProject);
  $('[data-zoom-src]', modal)?.addEventListener('click', e => openLightbox(e.currentTarget.dataset.zoomSrc, e.currentTarget.dataset.zoomAlt));
  $('[data-project-cta]', modal)?.addEventListener('click', e => {
    const field = $('#message');
    if (field) field.value = 'สนใจสอบถามโครงการลักษณะ: ' + e.currentTarget.dataset.projectCta;
    closeProject();
  });
  modal.onclick = e => { if (e.target === modal) closeProject(); };
}
function closeProject() {
  const modal = $('#projectModal');
  if (modal) modal.hidden = true;
  document.body.classList.remove('modal-open');
}
function openLightbox(src, caption = '') {
  const lightbox = $('#imageLightbox');
  const image = $('#lightboxImage');
  if (!lightbox || !image || !src) return;
  image.src = src;
  image.alt = caption || 'ภาพขนาดใหญ่';
  const captionEl = $('#lightboxCaption');
  if (captionEl) captionEl.textContent = caption;
  lightbox.hidden = false;
  document.body.classList.add('modal-open');
  $('.image-lightbox-close', lightbox)?.focus();
}
function closeLightbox() {
  const lightbox = $('#imageLightbox');
  if (lightbox) lightbox.hidden = true;
  document.body.classList.toggle('modal-open', !!($('#projectModal') && !$('#projectModal').hidden));
}
function renderWorkflow() {
  const target = $('#workflowGrid');
  if (target) target.innerHTML = (DATA.workflow || []).map(item => `<article class="process-card"><span class="step">${esc(item.step)}</span><h3>${esc(item.title)}</h3><p>${esc(item.detail)}</p></article>`).join('');
  const payment = $('#paymentStages');
  if (payment) payment.innerHTML = (DATA.paymentStages || []).map(item => `<li>${esc(item)}</li>`).join('');
}
function renderWarranty() {
  const target = $('#warrantyGrid');
  if (target) target.innerHTML = (DATA.warranties || []).map(item => `<article class="warranty-card"><h3>${esc(item.title)}</h3><div class="warranty-duration">${esc(item.duration)}</div><p>${esc(item.detail)}</p></article>`).join('');
}
let packageView = 'cards';
function categoryLabel(category) {
  return ({sunwoda:'SOLIS + SUNWODA · ZERO BLACKOUT',hanburo:'SOLIS HYBRID + HANBURO',hybrid:'HYBRID + BATTERY',huawei:'HUAWEI ON-GRID',sigenergy:'SIGENERGY AI',boi:'FACTORY · BOI'})[category] || 'SOLAR PACKAGE';
}
function packagePhaseText(phase) {
  if (phase === '1') return '1 เฟส (220V)';
  if (phase === '3') return '3 เฟส (380V)';
  return 'เลือกตามหน้างาน';
}
function selectPackage(item) {
  const field = $('#packageInterest');
  if (field) field.value = `${item.name} / ${item.battery || ''} / ${money(item.price)}`;
  $('#consultation')?.scrollIntoView({behavior:'smooth', block:'start'});
  setTimeout(() => $('#customerName')?.focus({preventScroll:true}), 350);
}
function renderCatalog() {
  const target = $('#packagesCatalog');
  if (!target) return;
  const category = $('#packageCategory')?.value || 'all';
  const phase = $('#packagePhase')?.value || 'all';
  const allItems = DATA.packagesCatalog || [];
  const items = allItems.filter(item => (category === 'all' || item.category === category) && (phase === 'all' || item.phase === phase || item.phase === 'all'));
  if (packageView === 'promo') {
    const promotions = (DATA.packagePromotions || []).filter(item => category === 'all' || item.category === category);
    target.classList.add('promo-mode');
    const suppliedBoards = promotions.filter(item => !item.summary && item.image);
    const declaredSummary = promotions.find(item => item.summary);
    const summaryBoard = declaredSummary || (!suppliedBoards.length && items.length ? {title: category === 'boi' ? 'Factory Solar + BOI' : 'สรุปแพ็กเกจ', category, description:'ใบสรุปที่สร้างจากรายการแพ็กเกจในเว็บไซต์ เนื่องจากไม่มีภาพใบโปรเฉพาะชุดนี้'} : null);
    const summaryItems = summaryBoard ? items.filter(item => item.category === summaryBoard.category) : [];
    const summaryMarkup = summaryBoard && summaryItems.length ? `<section class="promo-summary-sheet"><div class="promo-summary-head"><span>SOLIS ENERGY · PACKAGE GUIDE</span><h3>${esc(summaryBoard.title)}</h3><p>${esc(summaryBoard.description)}</p></div><div class="promo-summary-items">${summaryItems.map(item => `<article><span>${esc(packagePhaseText(item.phase))}</span><h4>${esc(item.name)}</h4><p>${esc(item.battery)} · ${esc(item.panels)}</p><b>${money(item.price)}</b>${item.saving ? `<small>ประหยัดอ้างอิง ${money(item.saving)}/เดือน*</small>` : ''}</article>`).join('')}</div><p class="promo-summary-foot">ข้อมูลอ้างอิงจากรายละเอียดที่ได้รับ ไม่ใช่ใบเสนอราคา และต้องยืนยันอุปกรณ์/ราคาอีกครั้ง</p></section>` : '';
    const boardsMarkup = suppliedBoards.map(item => `<button type="button" class="promo-board" data-zoom-src="${esc(item.image)}" data-zoom-alt="${esc(item.title)}"><img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy"><span><b>${esc(item.title)}</b><small>${esc(item.description)}</small><em>แตะเพื่อขยายภาพ ↗</em></span></button>`).join('');
    target.innerHTML = `<p class="promo-view-note">ภาพใบโปรจะแสดงตามภาพอ้างอิงที่ได้รับ แตะภาพเพื่อขยายอ่านรายละเอียด หากชุดนั้นไม่มีใบโปรแยก เว็บไซต์จะแสดงใบสรุปจากรายการแพ็กเกจแทน ภาพ/ราคาต้องยืนยันกับบริษัทก่อนสั่งซื้อ${phase !== 'all' ? ' · ใบโปรต้นฉบับอาจมีหลายเฟส แต่ใบสรุปด้านล่างจะแสดงตามตัวกรองเฟสที่เลือก' : ''}</p>${boardsMarkup ? `<div class="promo-board-grid">${boardsMarkup}</div>` : ''}${summaryMarkup}${!boardsMarkup && !summaryMarkup ? '<p>ไม่มีข้อมูลสำหรับตัวกรองนี้</p>' : ''}`;
    $$('[data-zoom-src]', target).forEach(button => button.addEventListener('click', () => openLightbox(button.dataset.zoomSrc, button.dataset.zoomAlt)));
  } else if (!items.length) {
    target.classList.remove('promo-mode');
    target.innerHTML = '<p class="catalog-empty">ไม่พบแพ็กเกจตามตัวกรองนี้ ลองเลือกประเภทระบบหรือเฟสอื่น</p>';
  } else if (packageView === 'table') {
    target.classList.remove('promo-mode');
    target.innerHTML = `<div class="package-table-wrap"><table class="package-table"><thead><tr><th>แพ็กเกจ</th><th>ระบบไฟ</th><th>แบตเตอรี่</th><th>แผง</th><th>ราคาอ้างอิง</th><th>ประหยัด/เดือน*</th><th></th></tr></thead><tbody>${items.map(item => `<tr><td><b>${esc(item.name)}</b><small>${esc(item.details)}</small></td><td>${packagePhaseText(item.phase)}</td><td>${esc(item.battery)}</td><td>${esc(item.panels)}</td><td class="package-price">${money(item.price)}</td><td>${item.saving ? money(item.saving) : 'ประเมินตามบิลไฟ'}</td><td><button type="button" class="btn btn-cyan package-interest" data-package-id="${esc(item.id)}">สนใจ</button></td></tr>`).join('')}</tbody></table></div>`;
  } else {
    target.classList.remove('promo-mode');
    target.innerHTML = items.map(item => `<article class="package-card"><div class="package-image"><img src="${esc(item.image || 'assets/hero-rooftop.jpg')}" alt="${esc(item.name)}" loading="lazy"><span>${esc(packagePhaseText(item.phase))}</span></div><div class="package-body"><span class="package-kicker">${esc(categoryLabel(item.category))}</span><h3>${esc(item.name)}</h3><p>${esc(item.battery || 'แบตเตอรี่ตามแบบ')}</p><p>${esc(item.panels || 'จำนวนแผงตามแบบ')}</p><p class="package-desc">${esc(item.details || '')}</p><strong class="package-price">${money(item.price)}</strong>${item.saving ? `<p class="package-saving">ประหยัดโดยประมาณ ${money(item.saving)}/เดือน*</p>` : ''}<button type="button" class="btn btn-cyan package-interest" data-package-id="${esc(item.id)}">สนใจแพ็กเกจนี้ ↗</button></div></article>`).join('');
  }
  $$('.package-interest', target).forEach(button => button.addEventListener('click', () => {
    const item = allItems.find(p => p.id === button.dataset.packageId);
    if (item) selectPackage(item);
  }));
  const addons = $('#packageAddons');
  if (addons) addons.innerHTML = `<h3>อุปกรณ์เสริมและตัวเลือกเพิ่มเติม</h3><div class="addons-grid">${(DATA.packageAddons || []).map(item => `<article><b>${esc(item.name)}</b><span>${esc(item.detail)}</span><strong>${money(item.price)}</strong></article>`).join('')}</div>`;
}
function updateCalculator(value) {
  const raw = Number(value);
  const bill = Math.max(1000, Math.min(1000000, Number.isFinite(raw) ? raw : 1000));
  const assumptions = DATA.calculatorAssumptions || {};
  const kwhPerKwp = Number(assumptions.annualKwhPerKwp) || 1460;
  const savingRate = Number(assumptions.billSavingsRate) || .42;
  const installedCost = Number(assumptions.installedCostPerKwp) || 38000;
  const co2Factor = Number(assumptions.co2KgPerKwh) || .532;
  const kw = Math.min(500, Math.max(1, Math.round((bill / 2000) * 2) / 2));
  const monthlySaving = Math.round(bill * savingRate);
  const yearlySaving = monthlySaving * 12;
  const annualGeneration = Math.round(kw * kwhPerKwp);
  const payback = yearlySaving > 0 ? (kw * installedCost / yearlySaving).toFixed(1) : '—';
  const co2 = (annualGeneration * co2Factor / 1000).toFixed(1);
  const slider = $('#billRange');
  const numberInput = $('#billNumber');
  if (slider) slider.value = Math.min(Number(slider.max) || 100000, Math.max(Number(slider.min) || 1000, bill));
  if (numberInput) numberInput.value = bill;
  if ($('#billValue')) $('#billValue').textContent = money(bill);
  if ($('#calcKw')) $('#calcKw').textContent = `${kw.toLocaleString('th-TH', {maximumFractionDigits:1})} kWp`;
  if ($('#calcMonthly')) $('#calcMonthly').textContent = money(monthlySaving);
  if ($('#calcYearly')) $('#calcYearly').textContent = money(yearlySaving);
  if ($('#calcPayback')) $('#calcPayback').textContent = `${payback} ปี*`;
  if ($('#calcGeneration')) $('#calcGeneration').textContent = `${integer(annualGeneration)} kWh`;
  if ($('#calcCo2')) $('#calcCo2').textContent = `${co2} ตัน`;
  if ($('#calcAssumptions')) $('#calcAssumptions').textContent = assumptions.note || 'ผลลัพธ์เป็นตัวอย่างเพื่อวางแผนเบื้องต้น';
}
function googleFormEndpoint(formUrl) {
  if (!formUrl) return '';
  try {
    const url = new URL(formUrl);
    if (!/docs\.google\.com$/.test(url.hostname)) return '';
    url.search = '';
    url.hash = '';
    url.pathname = url.pathname.replace(/\/(viewform|edit|preview|formResponse)\/?$/, '');
    return url.pathname.endsWith('/formResponse') ? url.toString() : `${url.origin}${url.pathname}/formResponse`;
  } catch { return ''; }
}
function formPayload(form) {
  const payload = new FormData(form);
  const msg = [
    `ขอคำปรึกษา ${DATA.companyName || 'SOLIS ENERGY'}`,
    `ชื่อ: ${payload.get('customerName')}`,
    `เบอร์โทร: ${payload.get('customerPhone')}`,
    `ค่าไฟ/เดือน: ${payload.get('monthlyBill')}`,
    `สัดส่วนการใช้ไฟกลางวัน: ${payload.get('dayUse')}`,
    `ระบบไฟ: ${payload.get('phase')}`,
    `ความสนใจ: ${payload.get('systemInterest')}`,
    `แพ็กเกจ: ${payload.get('packageInterest') || '-'}`,
    `รายละเอียด: ${payload.get('message') || '-'}`
  ].join('\n');
  return {payload, msg};
}
function submitGoogleForm(form, payload) {
  const social = DATA.social || {};
  const entries = social.googleFormEntryIds || {};
  const requiredKeys = ['customerName','customerPhone','monthlyBill','dayUse','phase','systemInterest'];
  const optionalKeys = ['packageInterest','message'];
  const keys = [...requiredKeys, ...optionalKeys.filter(key => /^entry\.\d+$/.test(String(entries[key] || '')))];
  const endpoint = googleFormEndpoint(social.googleFormUrl || '');
  if (!endpoint || requiredKeys.some(key => !/^entry\.\d+$/.test(String(entries[key] || '')))) return false;
  let frame = $('#googleFormHiddenFrame');
  if (!frame) {
    frame = document.createElement('iframe');
    frame.name = 'googleFormHiddenFrame';
    frame.id = 'googleFormHiddenFrame';
    frame.title = 'การส่งข้อมูล Google Forms';
    frame.hidden = true;
    document.body.appendChild(frame);
  }
  const bridge = document.createElement('form');
  bridge.method = 'POST';
  bridge.action = endpoint;
  bridge.target = frame.name;
  bridge.hidden = true;
  keys.forEach(key => {
    if (key === 'packageInterest' && !payload.get(key)) return;
    if (key === 'message' && !payload.get(key)) return;
    const field = document.createElement('input');
    field.type = 'hidden';
    field.name = entries[key];
    field.value = String(payload.get(key) || '');
    bridge.appendChild(field);
  });
  document.body.appendChild(bridge);
  bridge.submit();
  setTimeout(() => bridge.remove(), 1500);
  return true;
}
function wireContactForm() {
  const form = $('#contactForm');
  if (!form) return;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const {payload, msg} = formPayload(form);
    const status = $('#formStatus');
    const sent = submitGoogleForm(form, payload);
    if (sent) {
      if (status) status.textContent = 'ส่งคำขอไปยัง Google Forms แล้ว แต่เว็บไซต์นี้ไม่สามารถยืนยันการบันทึกฝั่ง Google ได้โดยตรง โปรดตรวจสอบแท็บ Responses ของฟอร์ม';
      form.reset();
      return;
    }
    try {
      await navigator.clipboard.writeText(msg);
    } catch {}
    const formUrl = DATA.social?.googleFormUrl;
    if (formUrl) {
      if (status) status.textContent = 'แบบฟอร์มบนเว็บไซต์ยังส่งเข้าระบบโดยตรงไม่ได้ จึงเปิด Google Form ให้กรอกข้อมูลอีกครั้ง ข้อมูลที่กรอกในเว็บไซต์ยังไม่ถูกส่งอัตโนมัติ';
      window.open(formUrl, '_blank', 'noopener');
    } else if (status) {
      status.textContent = 'ยังไม่ได้ตั้งค่าลิงก์ Google Forms';
    }
  });
}
applyBasics();
renderServices();
renderSolutions();
renderProjects();
renderWorkflow();
renderWarranty();
renderCatalog();
$('#projectFilter')?.addEventListener('change', renderProjects);
$('#packageCategory')?.addEventListener('change', renderCatalog);
$('#packagePhase')?.addEventListener('change', renderCatalog);
$$('[data-package-view]').forEach(button => button.addEventListener('click', () => {
  packageView = button.dataset.packageView;
  $$('[data-package-view]').forEach(other => other.classList.toggle('active', other === button));
  renderCatalog();
}));
const menuToggle = $('.menu-toggle');
const nav = $('.nav-links');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
$$('.nav-links a').forEach(link => link.addEventListener('click', () => {
  nav?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));
if ($('#year')) $('#year').textContent = new Date().getFullYear();
$('#billRange')?.addEventListener('input', event => updateCalculator(event.target.value));
$('#billNumber')?.addEventListener('input', event => updateCalculator(event.target.value));
updateCalculator($('#billRange')?.value || 10000);
wireContactForm();
$('.image-lightbox-close')?.addEventListener('click', closeLightbox);
$('#imageLightbox')?.addEventListener('click', event => { if (event.target.id === 'imageLightbox') closeLightbox(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeProject(); closeLightbox(); }
});
