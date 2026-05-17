/* ===========================================================================
   Auditoría Cor Outsourcing — PWA
   Funciona offline, guarda en IndexedDB, exporta PDF con jsPDF
   =========================================================================== */

const CHECKLIST = [
  {
    n: 1,
    title: "Rentabilidad y Control de Costes",
    items: [
      { id:"r1", t:"<strong>Productividad:</strong> los ratios de habitaciones por camarera/o se ajustan al cuadrante y objetivos." },
      { id:"r2", t:"<strong>Gestión de tiempos:</strong> se minimizan los tiempos muertos en offices o traslados entre plantas." },
      { id:"r3", t:"<strong>Consumo de químicos:</strong> dosificación correcta de productos, evitando derroches." },
      { id:"r4", t:"<strong>Uso de maquinaria:</strong> cuidado preventivo de aspiradoras y carros para evitar roturas." },
      { id:"r5", t:"<strong>Control de IT (bajas médicas):</strong> seguimiento del impacto en cobertura del servicio y costes." }
    ]
  },
  {
    n: 2,
    title: "Gestión del Equipo y PRL",
    items: [
      { id:"p1", t:"<strong>Uniformidad:</strong> todo el personal viste el uniforme Cor Outsourcing completo y en buen estado." },
      { id:"p2", t:"<strong>EPIs:</strong> uso correcto de guantes y calzado de seguridad según protocolo." },
      { id:"p3", t:"<strong>Seguridad:</strong> los carros no bloquean pasillos, vías de evacuación ni puertas cortafuegos." },
      { id:"p4", t:"<strong>Químicos:</strong> envases correctamente etiquetados (prohibido envases no homologados)." },
      { id:"p5", t:"<strong>FDS:</strong> Fichas de Datos de Seguridad disponibles en el office." },
      { id:"p6", t:"<strong>Control de presencia:</strong> registros de jornada y firmas de turnos al día." }
    ]
  },
  {
    n: 3,
    title: "Calidad de Limpieza — Habitaciones",
    items: [
      { id:"h1", t:"<strong>Camas:</strong> sábanas sin manchas, arrugas o pelos. Tensión correcta del embozo." },
      { id:"h2", t:"<strong>Polvo general:</strong> repaso correcto en cabeceros, rodapiés, marcos e interior de armarios." },
      { id:"h3", t:"<strong>Cristales y espejos:</strong> sin marcas, huellas ni pelusas." },
      { id:"h4", t:"<strong>Desinfección de contacto:</strong> mandos TV, teléfonos, pomos e interruptores limpios." },
      { id:"h5", t:"<strong>Baño — sanitarios:</strong> inodoro y bidé con desinfección total. Sin olores." },
      { id:"h6", t:"<strong>Baño — ducha/bañera:</strong> grifería brillante, sin cal, moho ni pelos. Mamparas secas." },
      { id:"h7", t:"<strong>Lencería de baño:</strong> toallas dobladas a estándar. Amenities reposicionados." },
      { id:"h8", t:"<strong>Suelos:</strong> aspirado profundo (esquinas y bajo la cama) o fregado sin marcas." },
      { id:"h9", t:"<strong>Terrazas/Balcones:</strong> suelo barrido, mobiliario limpio y barandillas repasadas." }
    ]
  },
  {
    n: 4,
    title: "Zonas Comunes y Públicas",
    items: [
      { id:"z1", t:"<strong>Lobby y recepción:</strong> suelos limpios, mobiliario aspirado, papeleras vacías." },
      { id:"z2", t:"<strong>Aseos públicos:</strong> sin olores, sanitarios limpios, reposición de papel y jabón. Hoja de firmas al día." },
      { id:"z3", t:"<strong>Ascensores:</strong> espejos impecables, botoneras desinfectadas, carriles sin suciedad." },
      { id:"z4", t:"<strong>Pasillos:</strong> moquetas aspiradas, paredes sin rozaduras, bandejas Room Service retiradas." }
    ]
  },
  {
    n: 5,
    title: "Cumplimiento SLA y Relación con el Hotel",
    items: [
      { id:"s1", t:"<strong>Reporte de averías:</strong> el personal notifica rápidamente las incidencias al hotel." },
      { id:"s2", t:"<strong>Gestión de estados:</strong> actualización en tiempo real de habitaciones en el PMS." },
      { id:"s3", t:"<strong>Lost & Found:</strong> estricto cumplimiento del protocolo (etiquetado y entrega inmediata)." }
    ]
  }
];

/* --------------------- Estado --------------------- */
const state = {
  id: null,
  data: null,
  view: 'home',
  dirty: false
};

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

/* --------------------- IndexedDB --------------------- */
const DB_NAME = 'cor_audits';
const STORE = 'audits';
let dbPromise;
function openDB(){
  if(dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if(!db.objectStoreNames.contains(STORE)){
        db.createObjectStore(STORE, { keyPath:'id' });
      }
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = e => reject(e.target.error);
  });
  return dbPromise;
}
async function dbPut(audit){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(audit);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function dbGet(id){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const r = tx.objectStore(STORE).get(id);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
async function dbAll(){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const r = tx.objectStore(STORE).getAll();
    r.onsuccess = () => resolve(r.result || []);
    r.onerror = () => reject(r.error);
  });
}
async function dbDel(id){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/* --------------------- Navegación --------------------- */
function goView(name){
  state.view = name;
  $$('.view').forEach(v => v.classList.remove('active'));
  $('#view-'+name).classList.add('active');
  const titles = {
    home:   { title:'Auditoría Operativa', sub:'Cor Outsourcing', back:false },
    audit:  { title:'Checklist auditoría', sub:'Cor Outsourcing', back:true },
    history:{ title:'Histórico', sub:'Auditorías guardadas', back:true },
    info:   { title:'Cómo usar', sub:'Guía rápida', back:true }
  };
  const t = titles[name];
  $('#hdr-title').textContent = t.title;
  $('#hdr-sub').textContent   = t.sub;
  $('#btn-back').style.display = t.back ? '' : 'none';
  window.scrollTo({ top:0, behavior:'instant' });
}

/* --------------------- Toast --------------------- */
let toastTimer;
function toast(msg){
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

/* --------------------- Auditoría: nuevo/cargar --------------------- */
function emptyData(){
  const today = new Date();
  const pad = n => String(n).padStart(2,'0');
  return {
    hotel:'Hotel Puerta de Bilbao',
    auditor:'María José Pozuelo',
    date: `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`,
    start: `${pad(today.getHours())}:${pad(today.getMinutes())}`,
    end: '',
    rooms: '',
    plan: '',
    signature: null,
    items: {}
  };
}
function newAudit(){
  state.id = 'A-' + Date.now();
  state.data = emptyData();
  state.dirty = false;
  renderForm();
  goView('audit');
}
async function loadAudit(id){
  const a = await dbGet(id);
  if(!a){ toast('No se encontró la auditoría'); return; }
  state.id = a.id;
  state.data = a.data;
  state.dirty = false;
  renderForm();
  goView('audit');
}

/* --------------------- Render del formulario --------------------- */
function renderForm(){
  $('#f-hotel').value = state.data.hotel || '';
  $('#f-auditor').value = state.data.auditor || '';
  $('#f-date').value = state.data.date || '';
  $('#f-start').value = state.data.start || '';
  $('#f-end').value = state.data.end || '';
  $('#f-rooms').value = state.data.rooms || '';
  $('#f-plan').value = state.data.plan || '';

  const cont = $('#checklist-container');
  cont.innerHTML = '';
  CHECKLIST.forEach(section => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h2><span class="num">${section.n}</span>${section.title}</h2>`;
    section.items.forEach(it => {
      if(!state.data.items[it.id]) state.data.items[it.id] = { val:'', obs:'', photos:[] };
      const v = state.data.items[it.id];
      const wrap = document.createElement('div');
      wrap.className = 'item';
      wrap.dataset.id = it.id;
      wrap.innerHTML = `
        <div class="item-title">${it.t}</div>
        <div class="radios">
          <label class="si"><input type="radio" name="${it.id}" value="si" ${v.val==='si'?'checked':''}>✓ SÍ</label>
          <label class="no"><input type="radio" name="${it.id}" value="no" ${v.val==='no'?'checked':''}>✗ NO</label>
          <label class="na"><input type="radio" name="${it.id}" value="na" ${v.val==='na'?'checked':''}>N/A</label>
        </div>
        <div class="obs"><textarea placeholder="Observaciones / acciones...">${escapeHtml(v.obs)}</textarea></div>
        <div class="photos">
          ${v.photos.map((_,i)=>`<div class="photo"><img data-pidx="${i}"><button type="button" data-rm="${i}">×</button></div>`).join('')}
          <label class="addphoto" title="Añadir foto">+<input type="file" accept="image/*" capture="environment"></label>
        </div>`;
      cont.appendChild(wrap);

      v.photos.forEach((src, i) => {
        const img = wrap.querySelector(`img[data-pidx="${i}"]`);
        if(img) img.src = src;
      });

      wrap.querySelectorAll('input[type=radio]').forEach(r => {
        r.addEventListener('change', () => { v.val = r.value; state.dirty=true; updateStats(); });
      });
      wrap.querySelector('textarea').addEventListener('input', e => { v.obs = e.target.value; state.dirty=true; });
      wrap.querySelector('input[type=file]').addEventListener('change', async e => {
        const file = e.target.files[0]; if(!file) return;
        const dataUrl = await readAndResize(file, 1280, 0.72);
        v.photos.push(dataUrl);
        state.dirty = true;
        renderForm();
      });
      wrap.querySelectorAll('button[data-rm]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.rm);
          v.photos.splice(idx,1);
          state.dirty = true;
          renderForm();
        });
      });
    });
    cont.appendChild(card);
  });

  setTimeout(()=>{ initSignature(); if(state.data.signature){ drawSignatureFromData(state.data.signature); } }, 50);
  updateStats();
}

function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* --------------------- Foto: redimensionar --------------------- */
function readAndResize(file, maxDim, quality){
  return new Promise(resolve => {
    const r = new FileReader();
    r.onload = e => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if(width > height && width > maxDim){ height = height * maxDim/width; width = maxDim; }
        else if(height > maxDim){ width = width * maxDim/height; height = maxDim; }
        const cv = document.createElement('canvas');
        cv.width = width; cv.height = height;
        cv.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(cv.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    r.readAsDataURL(file);
  });
}

/* --------------------- Estadísticas --------------------- */
function updateStats(){
  let si=0,no=0,na=0,total=0;
  CHECKLIST.forEach(s => s.items.forEach(it => {
    total++;
    const v = state.data.items[it.id]?.val;
    if(v==='si') si++;
    else if(v==='no') no++;
    else if(v==='na') na++;
  }));
  $('#stat-si').textContent = si;
  $('#stat-no').textContent = no;
  $('#stat-na').textContent = na;
  $('#stat-pend').textContent = total - si - no - na;
  const done = si+no+na;
  $('#prog-bar').style.width = (done/total*100) + '%';
}

/* --------------------- Firma --------------------- */
let sigCtx, sigCanvas, drawing = false;
function initSignature(){
  sigCanvas = $('#sig');
  if(!sigCanvas) return;
  const rect = sigCanvas.parentElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  sigCanvas.width = rect.width * dpr;
  sigCanvas.height = rect.height * dpr;
  sigCanvas.style.width = rect.width + 'px';
  sigCanvas.style.height = rect.height + 'px';
  sigCtx = sigCanvas.getContext('2d');
  sigCtx.scale(dpr, dpr);
  sigCtx.lineCap='round'; sigCtx.lineJoin='round';
  sigCtx.strokeStyle = '#1f2024';
  sigCtx.lineWidth = 2.2;

  const pos = e => {
    const r = sigCanvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  };
  const start = e => { drawing=true; const {x,y}=pos(e); sigCtx.beginPath(); sigCtx.moveTo(x,y); e.preventDefault(); };
  const move  = e => { if(!drawing) return; const {x,y}=pos(e); sigCtx.lineTo(x,y); sigCtx.stroke(); e.preventDefault(); };
  const end   = () => { if(!drawing) return; drawing=false; sigCanvas.parentElement.classList.add('has-sign'); state.data.signature = sigCanvas.toDataURL('image/png'); state.dirty=true; };

  sigCanvas.onmousedown=start; sigCanvas.onmousemove=move; window.onmouseup=end;
  sigCanvas.ontouchstart=start; sigCanvas.ontouchmove=move; sigCanvas.ontouchend=end;
}
function drawSignatureFromData(dataUrl){
  if(!sigCtx || !sigCanvas) return;
  const img = new Image();
  img.onload = () => {
    const rect = sigCanvas.getBoundingClientRect();
    sigCtx.drawImage(img, 0, 0, rect.width, rect.height);
    sigCanvas.parentElement.classList.add('has-sign');
  };
  img.src = dataUrl;
}
function clearSignature(){
  if(!sigCtx) return;
  sigCtx.clearRect(0,0,sigCanvas.width,sigCanvas.height);
  sigCanvas.parentElement.classList.remove('has-sign');
  state.data.signature = null;
  state.dirty = true;
}

/* --------------------- Cabecera --------------------- */
function syncHeader(){
  state.data.hotel   = $('#f-hotel').value;
  state.data.auditor = $('#f-auditor').value;
  state.data.date    = $('#f-date').value;
  state.data.start   = $('#f-start').value;
  state.data.end     = $('#f-end').value;
  state.data.rooms   = $('#f-rooms').value;
  state.data.plan    = $('#f-plan').value;
}

/* --------------------- Guardar --------------------- */
async function saveAudit(silent){
  syncHeader();
  await dbPut({ id: state.id, savedAt: Date.now(), data: state.data });
  state.dirty = false;
  if(!silent) toast('Auditoría guardada');
  refreshHistoryCount();
}

/* --------------------- Histórico --------------------- */
async function renderHistory(){
  const all = (await dbAll()).sort((a,b)=>b.savedAt - a.savedAt);
  const cont = $('#history-list');
  if(!all.length){
    cont.innerHTML = `<div class="empty"><div class="ic">⌛</div>Aún no has guardado ninguna auditoría.</div>`;
    return;
  }
  cont.innerHTML = '';
  all.forEach(a => {
    const d = a.data;
    let si=0,no=0,na=0,total=0;
    CHECKLIST.forEach(s => s.items.forEach(it => { total++; const v=d.items[it.id]?.val; if(v==='si')si++; else if(v==='no')no++; else if(v==='na')na++; }));
    const el = document.createElement('div');
    el.className = 'history-item';
    el.innerHTML = `
      <div style="flex:1;min-width:0">
        <div class="date">${d.date || '(sin fecha)'} · ${d.hotel}</div>
        <div class="meta">${d.auditor} · ✓ ${si} ✗ ${no} N/A ${na} · ${si+no+na}/${total} completados</div>
      </div>
      <div class="badge">Abrir</div>`;
    el.onclick = () => loadAudit(a.id);
    cont.appendChild(el);
  });
}
async function refreshHistoryCount(){
  const all = await dbAll();
  $('#history-count').textContent = all.length ? `${all.length} auditoría${all.length===1?'':'s'} guardada${all.length===1?'':'s'}` : 'Sin auditorías guardadas';
}

/* --------------------- Resumen --------------------- */
function showSummary(){
  syncHeader();
  let si=0,no=0,na=0,total=0;
  const incidencias = [];
  CHECKLIST.forEach(s => s.items.forEach(it => {
    total++;
    const v = state.data.items[it.id];
    if(v?.val==='si') si++;
    else if(v?.val==='no'){ no++; incidencias.push({sec:s.title, item:it.t.replace(/<[^>]+>/g,''), obs:v.obs}); }
    else if(v?.val==='na') na++;
  }));
  const pct = total ? Math.round(si/(si+no)*100) : 0;
  const sc = $('#summary-content');
  sc.innerHTML = `
    <div class="summary-row"><span>Hotel</span><span class="v">${escapeHtml(state.data.hotel)}</span></div>
    <div class="summary-row"><span>Auditora</span><span class="v">${escapeHtml(state.data.auditor)}</span></div>
    <div class="summary-row"><span>Fecha</span><span class="v">${escapeHtml(state.data.date)}</span></div>
    <div class="summary-row"><span>Conformidad</span><span class="v">${pct}%</span></div>
    <div class="summary-row"><span>Cumple (SÍ)</span><span class="v" style="color:var(--ok)">${si}</span></div>
    <div class="summary-row"><span>No conformidades</span><span class="v" style="color:var(--no)">${no}</span></div>
    <div class="summary-row"><span>N/A</span><span class="v">${na}</span></div>
    <div class="summary-row"><span>Pendientes</span><span class="v">${total - si - no - na}</span></div>
    ${incidencias.length ? `<div style="margin-top:14px"><b style="color:var(--cor-dark)">Incidencias detectadas (${incidencias.length}):</b><ul style="margin:8px 0 0;padding-left:20px;font-size:13.5px">${incidencias.map(i=>`<li><b>${escapeHtml(i.item)}</b>${i.obs?'<br><span style="color:var(--muted)">'+escapeHtml(i.obs)+'</span>':''}</li>`).join('')}</ul></div>` : ''}
  `;
  openModal('modal-summary');
}

function openModal(id){ $('#'+id).classList.add('show'); }
function closeModal(id){ $('#'+id).classList.remove('show'); }
window.closeModal = closeModal;

/* --------------------- Generar PDF --------------------- */
async function generatePDF(){
  syncHeader();
  await saveAudit(true);
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const W = 210, H = 297, M = 12;
  const COR = '#D14B3D', DARK = '#1f2024', MUTED = '#6b6f76', BORDER = '#cccccc';

  let y = 0;

  const ensure = (need) => {
    if(y + need > H - 18){ footer(); doc.addPage(); y = 14; header(); }
  };

  const header = () => {
    doc.setFillColor(COR); doc.rect(0,0,W,16,'F');
    doc.setTextColor('#FFF'); doc.setFont('helvetica','bold'); doc.setFontSize(13);
    doc.text('COR OUTSOURCING — Auditoría Operativa', M, 10);
    doc.setFontSize(9); doc.setFont('helvetica','normal');
    doc.text(state.data.hotel || '', W-M, 10, { align:'right' });
    doc.setTextColor(DARK);
    y = 22;
  };
  const footer = () => {
    const page = doc.internal.getNumberOfPages();
    doc.setFontSize(8); doc.setTextColor(MUTED);
    doc.text(`Página ${page}`, W-M, H-7, { align:'right' });
    doc.text('Cor Outsourcing · uso interno', M, H-7);
    doc.setTextColor(DARK);
  };

  header();

  doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(COR);
  doc.text('AUDITORÍA OPERATIVA Y RENTABILIDAD', M, y); y += 6;
  doc.setTextColor(DARK); doc.setFont('helvetica','normal'); doc.setFontSize(10);
  const col = (W - 2*M) / 2;
  doc.setDrawColor(BORDER); doc.setLineWidth(0.2);
  doc.rect(M, y, W-2*M, 22);
  doc.setFont('helvetica','bold'); doc.text('Hotel:', M+2, y+5);
  doc.setFont('helvetica','normal'); doc.text(state.data.hotel || '-', M+18, y+5);
  doc.setFont('helvetica','bold'); doc.text('Auditora:', M+col+2, y+5);
  doc.setFont('helvetica','normal'); doc.text(state.data.auditor || '-', M+col+22, y+5);
  doc.setFont('helvetica','bold'); doc.text('Fecha:', M+2, y+11);
  doc.setFont('helvetica','normal'); doc.text(state.data.date || '-', M+18, y+11);
  doc.setFont('helvetica','bold'); doc.text('Hora:', M+col+2, y+11);
  doc.setFont('helvetica','normal'); doc.text(`${state.data.start || '--:--'} / ${state.data.end || '--:--'}`, M+col+18, y+11);
  doc.setFont('helvetica','bold'); doc.text('Habitaciones revisadas:', M+2, y+17);
  doc.setFont('helvetica','normal'); doc.text(state.data.rooms || '-', M+50, y+17);
  y += 26;

  let si=0,no=0,na=0,total=0;
  CHECKLIST.forEach(s => s.items.forEach(it => { total++; const v=state.data.items[it.id]?.val; if(v==='si')si++; else if(v==='no')no++; else if(v==='na')na++; }));
  const pct = (si+no) ? Math.round(si/(si+no)*100) : 0;
  doc.setFillColor('#FCEFEC'); doc.rect(M, y, W-2*M, 12, 'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(9.5); doc.setTextColor(COR);
  doc.text(`CONFORMIDAD: ${pct}%`, M+3, y+7.5);
  doc.setTextColor(DARK); doc.setFont('helvetica','normal');
  doc.text(`SÍ: ${si}    NO: ${no}    N/A: ${na}    Pendientes: ${total-si-no-na}    Total: ${total}`, W-M-3, y+7.5, { align:'right' });
  y += 16;

  for(const sec of CHECKLIST){
    ensure(14);
    doc.setFillColor(COR); doc.rect(M, y, W-2*M, 7, 'F');
    doc.setTextColor('#FFF'); doc.setFont('helvetica','bold'); doc.setFontSize(10);
    doc.text(`${sec.n}. ${sec.title.toUpperCase()}`, M+2, y+5);
    doc.setTextColor(DARK); y += 9;

    for(const it of sec.items){
      const v = state.data.items[it.id] || { val:'', obs:'', photos:[] };
      const txt = it.t.replace(/<[^>]+>/g,'');
      doc.setFont('helvetica','normal'); doc.setFontSize(9.5);
      const split = doc.splitTextToSize(txt, W - 2*M - 22);
      const hRow = Math.max(6, split.length*4.4 + 1) + (v.obs ? 4 + doc.splitTextToSize(v.obs, W-2*M-6).length*3.8 : 0);
      ensure(hRow + 2);

      const stateColor = v.val==='si'? '#1f9d55' : v.val==='no'? '#d83b3b' : v.val==='na'? '#8a8f97' : '#dddddd';
      doc.setFillColor(stateColor); doc.circle(M+3, y+2.4, 1.8, 'F');
      doc.setFontSize(8); doc.setTextColor('#FFF'); doc.setFont('helvetica','bold');
      const lbl = v.val==='si'?'✓': v.val==='no'?'✗': v.val==='na'?'-':'';
      if(lbl) doc.text(lbl, M+3, y+3.4, { align:'center' });
      doc.setTextColor(DARK); doc.setFont('helvetica','normal'); doc.setFontSize(9.5);

      doc.text(split, M+7, y+2.5);
      doc.setFont('helvetica','bold'); doc.setFontSize(8.5);
      doc.setTextColor(stateColor==='#dddddd'?MUTED:stateColor);
      doc.text(v.val ? v.val.toUpperCase() : '—', W-M-2, y+2.5, { align:'right' });
      doc.setTextColor(DARK); doc.setFont('helvetica','normal'); doc.setFontSize(9.5);

      let cursor = y + split.length*4.4 + 0.5;
      if(v.obs){
        doc.setFont('helvetica','italic'); doc.setFontSize(8.8); doc.setTextColor(MUTED);
        const obsSplit = doc.splitTextToSize('“'+v.obs+'”', W-2*M-10);
        doc.text(obsSplit, M+7, cursor+3.2);
        cursor += obsSplit.length*3.8 + 1.5;
        doc.setTextColor(DARK); doc.setFont('helvetica','normal'); doc.setFontSize(9.5);
      }
      y = cursor + 2;
      doc.setDrawColor('#EEE'); doc.line(M, y, W-M, y); y += 1.5;
    }
    y += 2;
  }

  ensure(60);
  doc.setFillColor(COR); doc.rect(M, y, W-2*M, 7, 'F');
  doc.setTextColor('#FFF'); doc.setFont('helvetica','bold'); doc.setFontSize(10);
  doc.text('PLAN DE ACCIÓN / PUNTOS DE MEJORA DETECTADOS', M+2, y+5);
  doc.setTextColor(DARK); y += 9;
  doc.setDrawColor(BORDER); doc.rect(M, y, W-2*M, 70);
  if(state.data.plan){
    doc.setFont('helvetica','normal'); doc.setFontSize(9.5);
    const plan = doc.splitTextToSize(state.data.plan, W-2*M-4);
    doc.text(plan, M+2, y+5);
  }
  y += 74;

  ensure(40);
  doc.setFont('helvetica','bold'); doc.setFontSize(10);
  doc.text('Auditora Operativa (Cor Outsourcing)', M, y+4);
  doc.setDrawColor(BORDER); doc.line(M, y+24, M+85, y+24);
  if(state.data.signature){
    try { doc.addImage(state.data.signature, 'PNG', M, y+6, 70, 18); } catch(e){}
  }
  doc.setFont('helvetica','normal'); doc.setFontSize(9.5);
  doc.text(state.data.auditor || 'María José Pozuelo', M, y+29);

  const fotos = [];
  CHECKLIST.forEach(sec => sec.items.forEach(it => {
    const v = state.data.items[it.id];
    if(v && v.photos && v.photos.length){
      v.photos.forEach((src,idx) => fotos.push({ sec:sec.title, item:it.t.replace(/<[^>]+>/g,''), src, idx }));
    }
  }));
  if(fotos.length){
    doc.addPage(); y = 14; header();
    doc.setFillColor(COR); doc.rect(M, y, W-2*M, 7, 'F');
    doc.setTextColor('#FFF'); doc.setFont('helvetica','bold'); doc.setFontSize(10);
    doc.text('ANEXO FOTOGRÁFICO', M+2, y+5);
    doc.setTextColor(DARK); y += 11;

    const photoW = (W - 2*M - 8) / 2;
    const photoH = photoW * 0.75;
    let col = 0;
    for(const f of fotos){
      if(y + photoH + 14 > H - 18){ footer(); doc.addPage(); y = 14; header(); col = 0; }
      const x = M + col * (photoW + 8);
      try { doc.addImage(f.src, 'JPEG', x, y, photoW, photoH); } catch(e){}
      doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(COR);
      doc.text(f.sec, x, y + photoH + 3.5);
      doc.setFont('helvetica','normal'); doc.setTextColor(DARK);
      const split = doc.splitTextToSize(f.item, photoW);
      doc.text(split, x, y + photoH + 7);
      col++;
      if(col >= 2){ col = 0; y += photoH + 14 + (split.length-1)*3.5; }
    }
  }

  const pages = doc.internal.getNumberOfPages();
  for(let p=1;p<=pages;p++){ doc.setPage(p); footer(); }

  const fileName = `Auditoria_CorOutsourcing_${state.data.date || 'sin-fecha'}.pdf`;
  doc.save(fileName);
  toast('PDF generado');
}

/* --------------------- Bindings UI --------------------- */
function bindUI(){
  $$('.menu-card').forEach(c => c.addEventListener('click', () => {
    const dest = c.dataset.go;
    if(dest==='audit') newAudit();
    else if(dest==='history'){ renderHistory(); goView('history'); }
    else if(dest==='info'){ goView('info'); }
  }));
  $('#btn-back').addEventListener('click', async () => {
    if(state.view==='audit' && state.dirty){
      if(confirm('¿Guardar cambios antes de salir?')) await saveAudit();
    }
    goView('home');
  });
  $('#btn-save').addEventListener('click', () => saveAudit());
  $('#btn-summary').addEventListener('click', showSummary);
  $('#btn-pdf').addEventListener('click', generatePDF);
  $('#btn-pdf-modal').addEventListener('click', () => { closeModal('modal-summary'); generatePDF(); });
  $('#btn-clear-sig').addEventListener('click', clearSignature);

  ['f-hotel','f-auditor','f-date','f-start','f-end','f-rooms','f-plan'].forEach(id => {
    document.addEventListener('input', e => {
      if(e.target.id === id) state.dirty = true;
    });
  });

  window.addEventListener('beforeunload', e => {
    if(state.dirty){ e.preventDefault(); e.returnValue=''; }
  });
}

/* --------------------- Autenticación (PIN) --------------------- */
const AUTH = {
  SALT: 'cor-audit-2026-bilbao',
  HASH: '02f49db75af3173497b2ef11910a2aa949dab6ab83884da3f6f680bf8726c62f',
  KEY:  'cor-audit-auth-v1'
};

async function sha256(text){
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
}
async function tryAuth(pwd){
  const h = await sha256(AUTH.SALT + pwd);
  return h === AUTH.HASH;
}
function isAuthed(){ return localStorage.getItem(AUTH.KEY) === AUTH.HASH; }
function setAuthed(){ localStorage.setItem(AUTH.KEY, AUTH.HASH); }
function logout(){ localStorage.removeItem(AUTH.KEY); showLock(); }

function showLock(){
  document.getElementById('view-lock').style.display = 'flex';
  document.getElementById('app-header').style.display = 'none';
  document.getElementById('app-main').style.display = 'none';
  setTimeout(() => document.getElementById('lock-input')?.focus(), 100);
}
function hideLock(){
  document.getElementById('view-lock').style.display = 'none';
  document.getElementById('app-header').style.display = '';
  document.getElementById('app-main').style.display = '';
}
function bindLock(){
  const form = document.getElementById('lock-form');
  const input = document.getElementById('lock-input');
  const err = document.getElementById('lock-error');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const val = input.value.trim();
    if(!val) return;
    const ok = await tryAuth(val);
    if(ok){
      setAuthed();
      err.innerHTML = '&nbsp;';
      hideLock();
      input.value = '';
    } else {
      err.textContent = 'Contraseña incorrecta';
      input.value = '';
      input.focus();
      input.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(0)' }
      ], { duration: 280, easing: 'ease-out' });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindLock();
  if(isAuthed()){ hideLock(); } else { showLock(); }
  bindUI();
  refreshHistoryCount();

  const lo = document.getElementById('btn-logout');
  if(lo) lo.addEventListener('click', () => {
    if(confirm('¿Cerrar sesión? Tendrás que volver a introducir la contraseña la próxima vez. Las auditorías guardadas no se borran.')){
      logout();
    }
  });
});
