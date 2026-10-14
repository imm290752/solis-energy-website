const DATA = window.SOLIS_SITE_DATA || {};
const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const noLineBreak = s => esc(s).replace(/\n/g, '<br>');
function applyBasics(){
  $$('[data-company]').forEach(el => el.textContent = DATA.companyName || 'บริษัท โซลิส เอ็นเนอร์จี จำกัด');
  $$('[data-short-name]').forEach(el => el.textContent = DATA.shortName || 'SOLIS');
  $$('[data-english-name]').forEach(el => el.textContent = DATA.englishName || 'SOLIS ENERGY CO., LTD.');
  $$('[data-phone]').forEach(el => el.textContent = DATA.phone || '088 5555 848');
  $$('[data-phone-link]').forEach(el => el.href = 'tel:' + String(DATA.phoneLink || DATA.phone || '').replace(/[^\d+]/g,''));
  $$('[data-address]').forEach(el => el.textContent = DATA.address || '');
  $$('[data-hero-title]').forEach(el => el.innerHTML = noLineBreak(DATA.heroTitle || 'ออกแบบพลังงานแสงอาทิตย์\nเพื่ออนาคตที่ยั่งยืน').replace(/เพื่ออนาคตที่ยั่งยืน/, '<em>เพื่ออนาคตที่ยั่งยืน</em>'));
  $$('[data-hero-description]').forEach(el => el.textContent = DATA.heroDescription || '');
  $$('[data-vision]').forEach(el => el.textContent = DATA.vision || '');
  $$('[data-mission]').forEach(el => el.textContent = DATA.mission || '');
  const mapQuery = encodeURIComponent(DATA.address || '333 หมู่ 3 ต.วังยาง อ.ศรีประจันต์ จ.สุพรรณบุรี');
  const map = $('#mapLink'); if (map) map.href = 'https://maps.google.com/?q=' + mapQuery;
  document.title = `${DATA.companyName || 'บริษัท โซลิส เอ็นเนอร์จี จำกัด'} | ${DATA.englishName || 'SOLIS ENERGY'}`;
}
function renderServices(){
  const target = $('#servicesGrid'); if (!target) return;
  target.innerHTML = (DATA.services || []).map(s => `<article class="service-card">
    <div class="service-image"><img src="${esc(s.image)}" alt="${esc(s.thai || s.title)}" loading="lazy"><span class="service-number">${esc(s.number || '')} / ${esc(s.title)}</span></div>
    <div class="service-body"><span class="service-label">${esc(s.tag || 'PRODUCT & SERVICE')}</span><h3>${esc(s.title)}</h3><h4>${esc(s.thai)}</h4><p>${esc(s.description)}</p></div>
  </article>`).join('');
}
function renderPackages(){
  const target = $('#packagesGrid'); if (!target) return;
  target.innerHTML = (DATA.packages || []).map(p => `<article class="solution-card"><span>${esc(p.sub || 'SOLAR SOLUTION')}</span><h3>${esc(p.name)}</h3><strong>${esc(p.sizes)}</strong><p>${esc(p.desc)}</p></article>`).join('');
}
function renderProjects(){
  const target = $('#projectsGrid'); if (!target) return;
  const chosen = $('#projectFilter')?.value || 'all';
  const list = (DATA.projects || []).filter(p => {
    if (chosen === 'all') return true;
    if (chosen === 'Hybrid') return /Hybrid|Battery/i.test(p.type || '') || /Hybrid|Battery/i.test(p.capacity || '');
    if (chosen === 'ระบบกักเก็บพลังงาน') return /กักเก็บพลังงาน|BESS/i.test(p.type || '');
    return (p.type || '').includes(chosen);
  });
  $('#projectCount').textContent = list.length;
  target.innerHTML = list.map(p => `<article class="project-card">
    <div class="project-img"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"><span class="project-type">${esc(p.type || 'PROJECT REFERENCE')}</span></div>
    <div class="project-details"><h3>${esc(p.name)}</h3>${p.location ? `<p class="project-loc">${esc(p.location)}</p>` : ''}<span class="capacity-pill">${esc(p.capacity || 'สอบถามรายละเอียด')}</span></div>
  </article>`).join('');
}
function renderWorkflow(){
  const target = $('#workflowGrid'); if (target) target.innerHTML = (DATA.workflow || []).map(s => `<article class="process-card"><span class="step">${esc(s.step)}</span><h3>${esc(s.title)}</h3><p>${esc(s.detail)}</p></article>`).join('');
  const pay = $('#paymentStages'); if (pay) pay.innerHTML = (DATA.paymentStages || []).map(s => `<li>${esc(s)}</li>`).join('');
}
function renderWarranty(){
  const target = $('#warrantyGrid'); if (!target) return;
  target.innerHTML = (DATA.warranties || []).map(w => `<article class="warranty-card"><h3>${esc(w.title)}</h3><div class="warranty-duration">${esc(w.duration)}</div><p>${esc(w.detail)}</p></article>`).join('');
}
applyBasics(); renderServices(); renderPackages(); renderProjects(); renderWorkflow(); renderWarranty();
$('#projectFilter')?.addEventListener('change', renderProjects);
const toggle = $('.menu-toggle'), nav = $('.nav-links');
toggle?.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
$$('.nav-links a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); toggle?.setAttribute('aria-expanded','false'); }));
$('#year').textContent = new Date().getFullYear();
$('#contactForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const f = new FormData(e.currentTarget);
  const msg = [
    `สนใจติดต่อ ${DATA.companyName || 'บริษัท โซลิส เอ็นเนอร์จี จำกัด'}`,
    `ชื่อผู้ติดต่อ: ${f.get('customerName')}`,
    `ช่องทางติดต่อกลับ: ${f.get('customerPhone')}`,
    `บริการที่สนใจ: ${f.get('projectType')}`,
    `รายละเอียด: ${f.get('message') || '-'}`,
  ].join('\n');
  const status = $('#formStatus');
  try { await navigator.clipboard.writeText(msg); status.textContent = 'คัดลอกข้อความสอบถามแล้ว กรุณาติดต่อบริษัททางโทรศัพท์และส่งข้อความนี้ผ่านช่องทางที่บริษัทแจ้งไว้'; }
  catch { status.textContent = msg + '\n\nคัดลอกข้อความด้านบนไปใช้ติดต่อบริษัทได้'; }
});
