/* ===========================================================================
   Auditoría Cor Outsourcing — PWA
   Funciona offline, guarda en IndexedDB, exporta PDF con jsPDF
   =========================================================================== */

const CHECKLIST = [
  {
    n: 1,
    title: "Rentabilidad y Control de Costes",
    items: [
      { id: "rc_prod", t: "<strong>Productividad:</strong> Habitaciones camareras/os de pisos." },
      { id: "rc_prod_nomolestar", t: "<strong>Productividad:</strong> ¿Se recuperan los carteles de \"No Molestar\"?" },
      { id: "rc_prod_recuperar", t: "<strong>Productividad:</strong> ¿Acepta el personal recuperar habitaciones?" },
      { id: "rc_prod_subir_ratios", t: "<strong>Productividad:</strong> ¿Permite el hotel subir ratios para recuperar carteles de \"No Molestar\"?" },
      { id: "rc_prod_muchas_salidas", t: "<strong>Productividad:</strong> ¿Es un hotel con muchas salidas habitualmente?" },
      { id: "rc_dosi", t: "<strong>Dosificadores químicos:</strong> dosificación correcta." },
      { id: "rc_cons_uni", t: "<strong>Otros consumos:</strong> Uniformidad." },
      { id: "rc_cons_calz", t: "<strong>Otros consumos:</strong> Calzado." },
      { id: "rc_cons_darl", t: "<strong>Otros consumos:</strong> Darlim." },
      { id: "rc_cons_lyre", t: "<strong>Otros consumos:</strong> Lyreco." },
      { id: "rc_cons_deja", t: "<strong>Otros consumos:</strong> Dejavú." },
      { id: "rc_cons_rioz", t: "<strong>Otros consumos:</strong> Riozuri." },
      { id: "rc_cons_otro", t: "<strong>Otros consumos:</strong> Otros." },
      { id: "rc_maqu", t: "<strong>Uso maquinaria:</strong> cuidado de aspiradoras y carros." },
      { id: "rc_bm_bit", t: "<strong>Bajas médicas:</strong> Baja Incapacidad Temporal (BIT)." },
      { id: "rc_bm_bat", t: "<strong>Bajas médicas:</strong> Baja Accidente de Trabajo (BAT)." },
      { id: "rc_bm_bm", t: "<strong>Bajas médicas:</strong> Baja Maternal / Riesgo Embarazo (BM)." },
      { id: "rc_bm_lac", t: "<strong>Bajas médicas:</strong> Lactancia (LAC)." },
      { id: "rc_aus_pr", t: "<strong>Ausencias:</strong> Permiso Retribuido (PR)." },
      { id: "rc_aus_aus", t: "<strong>Ausencias:</strong> Ausencia Sin Justificar (AUS)." },
      { id: "rc_aus_ausj", t: "<strong>Ausencias:</strong> Ausencia Justificada, pero no retribuida (AUSJ)." },
      { id: "rc_liq_bv", t: "<strong>Liquidaciones:</strong> Baja Voluntaria (BV)." },
      { id: "rc_liq_nspp", t: "<strong>Liquidaciones:</strong> No Superado Período de Prueba (NSPP)." },
      { id: "rc_liq_dd", t: "<strong>Liquidaciones:</strong> Despido Disciplinario (DD)." },
      { id: "rc_liq_do", t: "<strong>Liquidaciones:</strong> Despido Objetivo (DO)." },
      { id: "rc_liq_di", t: "<strong>Liquidaciones:</strong> Despido Improcedente (DI)." },
      { id: "rc_liq_dp", t: "<strong>Liquidaciones:</strong> Despido Procedente (DP)." },
      { id: "rc_liq_d", t: "<strong>Liquidaciones:</strong> Discontinuidades (D)." },
      { id: "rc_form_realiza", t: "<strong>Formación:</strong> ¿Se realizan formaciones al personal nuevo?" },
      { id: "rc_form_dias", t: "<strong>Formación:</strong> ¿Cuántos días de formación se ofrecen? <em>(anotar la cantidad en observaciones)</em>" },
      { id: "rc_form_ratio_obligado", t: "<strong>Formación:</strong> ¿Los días de formación tienen ratio que cumplir?" },
      { id: "rc_form_ratio_exigido", t: "<strong>Formación:</strong> ¿Qué ratio/productividad se exige durante la formación? <em>(anotar la cifra en observaciones)</em>" }
    ]
  },
  {
    n: 2,
    title: "Gestión PRL",
    items: [
      { id: "prl_epis", t: "<strong>EPIs:</strong> que estén colocados en todos los offices." },
      { id: "prl_fichas", t: "<strong>Fichas técnicas y de seguridad:</strong> que estén colocadas en el lugar donde tengamos los dosificadores y almacén de químicos." },
      { id: "prl_cumpl", t: "<strong>PRL:</strong> que tengamos todas bien cumplimentadas." },
      { id: "prl_recon", t: "<strong>Reconocimientos médicos:</strong> control de asistencia al reconocimiento médico." }
    ]
  },
  {
    n: 3,
    title: "Gestión de Equipos",
    items: [
      { id: "eq_listados", t: "Recogida de listados y llaves maestras." },
      { id: "eq_partes", t: "Hacer partes de trabajo de camareras/os." },
      { id: "eq_briefing", t: "Briefing." },
      { id: "eq_org_manana", t: "Organización del trabajo del día siguiente." },
      { id: "eq_registro_jornada", t: "Revisión del registro de jornada (entrada)." },
      { id: "eq_zonas_tarde", t: "Revisión de zonas comunes (del turno de tarde/noche)." },
      { id: "eq_caddys_primera", t: "Comprobación de caddys y carros en las plantas (1ª hora)." },
      { id: "eq_rev_habs", t: "Revisión de habitaciones." },
      { id: "eq_zonas_manana", t: "Revisión de zonas comunes del turno de mañana." },
      { id: "eq_partes_20_30", t: "Recogida de partes de trabajo y llaves maestras (20, 25 y 30 horas), revisión de caddys y carros en las plantas." },
      { id: "eq_control_ocup", t: "Control de ocupación y comprobar con el cuadrante de días libres." },
      { id: "eq_rev_ultimas", t: "Revisión de las últimas habitaciones." },
      { id: "eq_partes_35_40", t: "Recogida de partes de trabajo y llaves maestras (35 y 40 horas), revisión de caddys y carros en las plantas." },
      { id: "eq_cierre_offices", t: "Cierre de offices." },
      { id: "eq_cierre_hotel", t: "Control diario y cierre con el hotel." }
    ]
  }
];

/* --------------------- Estado --------------------- */
const state = {
  id: null,
  data: null,  // se rellena en newAudit / load
  view: 'home',
  dirty: false,
  storageWarned: false  // para no spamear el aviso de cuota
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
    tx.onerror = () => {
      const err = tx.error;
      // Detectar cuota agotada y avisar a la usuaria de forma muy visible.
      if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
        showQuotaError();
      }
      reject(err);
    };
    tx.onabort = () => {
      const err = tx.error;
      if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
        showQuotaError();
      }
      reject(err);
    };
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

/* --------------------- Cuota de almacenamiento --------------------- */
// Pedir almacenamiento persistente (evita que iOS/Android purguen los datos
// si la app no se usa durante un tiempo).
async function requestPersistentStorage(){
  try {
    if (navigator.storage && navigator.storage.persist) {
      const already = await navigator.storage.persisted();
      if (!already) {
        await navigator.storage.persist();
      }
    }
  } catch(_) {}
}

// Estimación de uso para mostrar en el Histórico.
async function getStorageInfo(){
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const e = await navigator.storage.estimate();
      return {
        used: e.usage || 0,
        total: e.quota || 0,
        percent: e.quota ? (e.usage / e.quota * 100) : 0
      };
    }
  } catch(_) {}
  return null;
}

function formatBytes(n){
  if (n < 1024) return `${n} B`;
  if (n < 1024*1024) return `${(n/1024).toFixed(1)} KB`;
  return `${(n/1024/1024).toFixed(1)} MB`;
}

let quotaErrorShown = false;
function showQuotaError(){
  if (quotaErrorShown) return;
  quotaErrorShown = true;
  // Toast persistente (no se auto-oculta)
  const el = $('#toast');
  if (!el) return;
  el.textContent = '⚠ No hay espacio para guardar. Exporta un backup y borra auditorías antiguas.';
  el.style.background = '#d83b3b';
  el.classList.add('show');
  // Indicador en cabecera
  const statusEl = $('#autosave-status');
  if (statusEl) {
    statusEl.textContent = '⚠ Sin espacio';
    statusEl.style.color = '#FFD3CE';
    statusEl.style.opacity = '1';
  }
  // Permitir cerrarlo tocando
  el.onclick = () => {
    el.classList.remove('show');
    el.style.background = '';
    quotaErrorShown = false;
    el.onclick = null;
  };
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
  if (name === 'audit') {
    setTimeout(() => {
      $$('textarea.auto-grow').forEach(ta => autoGrowTextarea(ta));
    }, 50);
  }
}

/* --------------------- Toast --------------------- */
let toastTimer;
function toast(msg, isError){
  const el = $('#toast');
  el.textContent = msg;
  el.style.background = isError ? '#d83b3b' : '';
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
    el.style.background = '';
  }, 2200);
}

/* --------------------- Autoguardado con Debounce --------------------- */
let autosaveTimeout;
function triggerAutosave(immediate = false) {
  state.dirty = true;
  
  const statusEl = $('#autosave-status');
  if (statusEl && !quotaErrorShown) {
    statusEl.textContent = 'Guardando...';
    statusEl.style.opacity = '1';
  }

  clearTimeout(autosaveTimeout);
  
  const doSave = async () => {
    try {
      await saveAudit(true);
      if (statusEl && !quotaErrorShown) {
        statusEl.textContent = '✓ Borrador guardado';
        setTimeout(() => {
          statusEl.style.opacity = '0.5';
        }, 1200);
      }
    } catch (err) {
      // El error ya se mostró en dbPut si era de cuota; si era otro, lo mostramos aquí.
      if (!quotaErrorShown && statusEl) {
        statusEl.textContent = '⚠ Error al guardar';
        statusEl.style.color = '#FFD3CE';
      }
    }
  };
  
  if (immediate) {
    doSave();
  } else {
    autosaveTimeout = setTimeout(doSave, 1000);
  }
}

/* --------------------- Auditoría: nuevo/cargar --------------------- */
function emptyData(){
  const today = new Date();
  const pad = n => String(n).padStart(2,'0');
  return {
    hotel:'',
    auditor:'María José Pozuelo',
    date: `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`,
    start: `${pad(today.getHours())}:${pad(today.getMinutes())}`,
    end: '',
    rooms: '',
    plan: '',
    signature: null,
    items: {}  // id -> { val:'si'|'no'|'na'|'', obs:'', photos:[dataURL,...] }
  };
}
function newAudit(){
  state.id = 'A-' + Date.now();
  state.data = emptyData();
  state.dirty = false;
  renderForm();
  goView('audit');
  triggerAutosave(true); // Guardar borrador inicial inmediatamente
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
  const hotelSelect = $('#f-hotel');
  const hotelOtro = $('#f-hotel-otro');
  const savedHotel = state.data.hotel || '';
  
  let found = false;
  for (let i = 0; i < hotelSelect.options.length; i++) {
    if (hotelSelect.options[i].value === savedHotel) {
      hotelSelect.value = savedHotel;
      found = true;
      break;
    }
  }
  
  if (!found && savedHotel !== '') {
    hotelSelect.value = 'OTRO';
    hotelOtro.value = savedHotel;
    hotelOtro.style.display = '';
  } else {
    if (savedHotel === '') {
      hotelSelect.value = '';
    }
    hotelOtro.value = '';
    hotelOtro.style.display = 'none';
  }
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
        <div class="obs"><textarea class="auto-grow" placeholder="Observaciones / acciones...">${escapeHtml(v.obs)}</textarea></div>
        <div class="photos">
          ${v.photos.map((src,i)=>`<div class="photo"><img src="${src}" data-pidx="${i}"><button type="button" data-rm="${i}">×</button></div>`).join('')}
          <label class="addphoto" title="Añadir foto">+<input type="file" accept="image/*" capture="environment"></label>
        </div>`;
      card.appendChild(wrap);

      // listeners
      wrap.querySelectorAll('input[type=radio]').forEach(r => {
        r.addEventListener('change', () => { 
          v.val = r.value; 
          updateStats(); 
          triggerAutosave(true); // Guardado inmediato al cambiar radio
        });
      });
      wrap.querySelector('textarea').addEventListener('input', e => { 
        v.obs = e.target.value; 
        autoGrowTextarea(e.target);
        triggerAutosave(); // Guardado debounced al escribir
      });
      wrap.querySelector('input[type=file]').addEventListener('change', async e => {
        const file = e.target.files[0]; if(!file) return;
        const dataUrl = await readAndResize(file, 1280, 0.72);
        v.photos.push(dataUrl);
        try {
          await saveAudit(true); // Guardado inmediato de foto
          // Re-render PARCIAL: solo el bloque de fotos de este ítem, no todo el formulario.
          // Así no se pierde el foco del textarea ni se redibuja la firma.
          rerenderPhotos(it.id);
        } catch(err) {
          // Si no cabe la foto, deshacer el push para no engañar a la usuaria.
          v.photos.pop();
          // showQuotaError ya se invocó dentro de dbPut.
        }
      });
      wrap.querySelectorAll('button[data-rm]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const idx = Number(btn.dataset.rm);
          v.photos.splice(idx,1);
          await saveAudit(true); // Guardado inmediato al borrar foto
          rerenderPhotos(it.id); // Re-render parcial, no todo el formulario.
        });
      });
      wrap.querySelectorAll('.photo img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
          openLightbox(img.src);
        });
      });
    });
    cont.appendChild(card);
  });

  // firma — restaurar si existía
  // Antes usábamos setTimeout(100) confiando en que el layout estaría pintado.
  // Eso falla a veces (sobre todo al cargar una auditoría guardada) porque el
  // canvas todavía tiene tamaño 0 y la firma se dibuja deformada.
  // Ahora esperamos al siguiente frame y verificamos que el contenedor tenga
  // ancho > 0 antes de inicializar; si no, esperamos otro frame.
  initSignatureWhenReady();
  
  // Los textareas se ajustan al frame siguiente igualmente.
  requestAnimationFrame(() => {
    $$('textarea.auto-grow').forEach(ta => autoGrowTextarea(ta));
  });
  
  updateStats();
}

// Inicializa la firma cuando el contenedor tenga tamaño. Si el navegador todavía
// no ha calculado el layout (rect.width === 0) reintenta en el siguiente frame.
// Damos un máximo de 30 frames (~500ms) para no quedarnos en bucle si algo va mal.
function initSignatureWhenReady(attempt = 0){
  const canvas = $('#sig');
  if (!canvas) return;
  const rect = canvas.parentElement.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    if (attempt < 30) {
      requestAnimationFrame(() => initSignatureWhenReady(attempt + 1));
    }
    return;
  }
  initSignature();
  if (state.data && state.data.signature) {
    drawSignatureFromData(state.data.signature);
  }
}

function autoGrowTextarea(el) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

/* --------------------- Re-render parcial de fotos -----------------------------------------
   Cuando se añade o borra una foto, regeneramos SOLO el bloque .photos de ese ítem en lugar
   de todo el formulario. Esto evita:
   - perder el foco/cursor del textarea en el que estaba escribiendo la usuaria
   - redibujar (y deformar) la firma del canvas
   - reinicializar todos los listeners
   - el "flash" visual de un re-render completo
   ------------------------------------------------------------------------------------------- */
function rerenderPhotos(itemId){
  const wrap = document.querySelector(`.item[data-id="${itemId}"]`);
  if (!wrap) return;
  const v = state.data.items[itemId];
  if (!v) return;
  const photosEl = wrap.querySelector('.photos');
  if (!photosEl) return;
  
  // Reconstruir el HTML del bloque de fotos
  photosEl.innerHTML = `
    ${v.photos.map((src,i)=>`<div class="photo"><img src="${src}" data-pidx="${i}"><button type="button" data-rm="${i}">×</button></div>`).join('')}
    <label class="addphoto" title="Añadir foto">+<input type="file" accept="image/*" capture="environment"></label>
  `;
  
  // Volver a enganchar listeners SOLO para este bloque (no tocamos textarea, radios ni firma).
  photosEl.querySelector('input[type=file]').addEventListener('change', async e => {
    const file = e.target.files[0]; if(!file) return;
    const dataUrl = await readAndResize(file, 1280, 0.72);
    v.photos.push(dataUrl);
    try {
      await saveAudit(true);
      rerenderPhotos(itemId);
    } catch(err) {
      v.photos.pop();
    }
  });
  photosEl.querySelectorAll('button[data-rm]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const idx = Number(btn.dataset.rm);
      v.photos.splice(idx,1);
      await saveAudit(true);
      rerenderPhotos(itemId);
    });
  });
  photosEl.querySelectorAll('.photo img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      openLightbox(img.src);
    });
  });
}

function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* --------------------- Foto: redimensionar para no saturar el almacenamiento --------------------- */
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
  const end   = () => { 
    if(!drawing) return; 
    drawing=false; 
    sigCanvas.parentElement.classList.add('has-sign'); 
    state.data.signature = sigCanvas.toDataURL('image/png'); 
    triggerAutosave(true); // Guardado inmediato al terminar de firmar
  };

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
  triggerAutosave(true); // Guardado inmediato al borrar la firma
}

/* --------------------- Lectura de la cabecera al guardar --------------------- */
function syncHeader(){
  const hotelSelect = $('#f-hotel');
  const hotelOtro = $('#f-hotel-otro');
  if (hotelSelect.value === 'OTRO') {
    state.data.hotel = hotelOtro.value;
  } else {
    state.data.hotel = hotelSelect.value || '';
  }
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
  try {
    await dbPut({ id: state.id, savedAt: Date.now(), data: state.data });
    state.dirty = false;
    if(!silent) toast('Auditoría guardada');
    refreshHistoryCount();
  } catch(err) {
    if(!silent) toast('No se pudo guardar', true);
    throw err;
  }
}

/* --------------------- Histórico --------------------- */
async function renderHistory(){
  const all = (await dbAll()).sort((a,b)=>b.savedAt - a.savedAt);
  const cont = $('#history-list');
  
  // Actualizar el indicador de almacenamiento
  await renderStorageIndicator();
  
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
      <div class="badge">Abrir</div>
      <button class="delete-btn" title="Borrar auditoría">🗑️</button>`;
    el.onclick = () => loadAudit(a.id);
    
    const delBtn = el.querySelector('.delete-btn');
    delBtn.onclick = async (e) => {
      e.stopPropagation();
      const hotelName = d.hotel || '(sin hotel)';
      const auditDate = d.date || '(sin fecha)';
      const ok = await confirmModal({
        title: 'Borrar auditoría',
        message: `¿Seguro que quieres borrar la auditoría de "${hotelName}" del ${auditDate}?\n\nEsta acción no se puede deshacer.`,
        okText: 'Borrar',
        danger: true
      });
      if(ok){
        await dbDel(a.id);
        toast('Auditoría eliminada');
        renderHistory();
        refreshHistoryCount();
      }
    };
    
    cont.appendChild(el);
  });
}

async function renderStorageIndicator(){
  const indicator = $('#storage-indicator');
  if (!indicator) return;
  const info = await getStorageInfo();
  if (!info || !info.total) {
    indicator.style.display = 'none';
    return;
  }
  indicator.style.display = '';
  const pct = info.percent;
  const color = pct > 85 ? '#d83b3b' : (pct > 65 ? '#D14B3D' : '#6b6f76');
  indicator.innerHTML = `
    <div style="font-size:11px;color:${color};display:flex;align-items:center;gap:6px;">
      <span>💾</span>
      <span>${formatBytes(info.used)} usados de ${formatBytes(info.total)} (${pct.toFixed(1)}%)</span>
    </div>
    <div style="height:3px;background:#eee;border-radius:99px;margin-top:4px;overflow:hidden;">
      <div style="height:100%;background:${color};width:${Math.min(100,pct)}%;"></div>
    </div>
  `;
}

async function refreshHistoryCount(){
  const all = await dbAll();
  $('#history-count').textContent = all.length ? `${all.length} auditoría${all.length===1?'':'s'} guardada${all.length===1?'':'s'}` : 'Sin auditorías guardadas';
}

/* --------------------- Copias de Seguridad --------------------- */
async function exportBackup() {
  try {
    const audits = await dbAll();
    if (audits.length === 0) {
      toast('No hay auditorías para exportar');
      return;
    }
    
    const backupData = {
      generator: 'Cor Outsourcing PWA Backup',
      exportedAt: Date.now(),
      audits: audits
    };
    
    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const today = new Date();
    const pad = n => String(n).padStart(2, '0');
    const dateStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_auditorias_cor_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast('Copia de seguridad exportada');
  } catch (err) {
    console.error(err);
    toast('Error al exportar copia de seguridad', true);
  }
}

async function importBackup(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  e.target.value = '';
  
  try {
    const reader = new FileReader();
    const fileContent = await new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result);
      reader.onerror = error => reject(error);
      reader.readAsText(file);
    });
    
    const backupData = JSON.parse(fileContent);
    
    if (!backupData || typeof backupData !== 'object' || !Array.isArray(backupData.audits)) {
      toast('Archivo de copia de seguridad no válido', true);
      return;
    }
    
    const auditsToImport = backupData.audits;
    if (auditsToImport.length === 0) {
      toast('El backup no contiene ninguna auditoría');
      return;
    }
    
    const ok = await confirmModal({
      title: 'Importar copia de seguridad',
      message: `Se van a importar ${auditsToImport.length} auditoría(s).\n\nLas auditorías con el mismo ID se sobrescribirán. ¿Continuar?`,
      okText: 'Importar'
    });
    if (!ok) {
      return;
    }
    
    let importedCount = 0;
    for (const audit of auditsToImport) {
      if (audit.id && audit.data) {
        try {
          await dbPut(audit);
          importedCount++;
        } catch(err) {
          // Si peta a mitad por cuota, paramos y avisamos.
          break;
        }
      }
    }
    
    toast(`¡Importadas ${importedCount} de ${auditsToImport.length} auditorías!`);
    await renderHistory();
    await refreshHistoryCount();
  } catch (err) {
    console.error(err);
    toast('Error al importar el archivo JSON', true);
  }
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

/* --------------------- Modal --------------------- */
function openModal(id){ $('#'+id).classList.add('show'); }
function closeModal(id){ $('#'+id).classList.remove('show'); }
window.closeModal = closeModal;

/* --------------------- Modal de confirmación (reemplaza confirm() del navegador) ---------
   Razones para no usar confirm() nativo:
   - En iOS PWA instalada rompe la sensación "app nativa"
   - El estilo del navegador no es consistente con el resto de la app
   - confirm() bloquea el hilo, los modales propios son async amigable
   
   Uso: const ok = await confirmModal({ title, message, okText, danger });
   ---------------------------------------------------------------------------------------- */
function confirmModal(opts){
  return new Promise(resolve => {
    const modal = $('#modal-confirm');
    const titleEl = $('#confirm-title');
    const msgEl = $('#confirm-message');
    const okBtn = $('#confirm-ok');
    const cancelBtn = $('#confirm-cancel');
    
    titleEl.textContent = opts.title || 'Confirmar';
    msgEl.textContent = opts.message || '';
    okBtn.textContent = opts.okText || 'Aceptar';
    cancelBtn.textContent = opts.cancelText || 'Cancelar';
    okBtn.classList.toggle('danger', !!opts.danger);
    
    // Reset de listeners anteriores (clonado de los nodos para limpiar handlers).
    const newOk = okBtn.cloneNode(true);
    const newCancel = cancelBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOk, okBtn);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
    
    const close = (result) => {
      modal.classList.remove('show');
      resolve(result);
    };
    
    newOk.addEventListener('click', () => close(true));
    newCancel.addEventListener('click', () => close(false));
    
    // Click fuera de la caja → cancelar
    modal.addEventListener('click', function onBg(e){
      if (e.target === modal) {
        modal.removeEventListener('click', onBg);
        close(false);
      }
    });
    
    modal.classList.add('show');
  });
}

/* --------------------- Overlay del PDF -----------------------------------------------------
   Pantalla bloqueante mientras se genera el PDF. Con auditorías que tienen muchas fotos la
   generación puede tardar varios segundos en móviles modestos, y sin feedback parece que la
   app se ha colgado.
   ------------------------------------------------------------------------------------------- */
function showPdfOverlay(subText){
  const ov = $('#pdf-overlay');
  if (!ov) return;
  const sub = $('#pdf-overlay-sub');
  if (sub && subText) sub.textContent = subText;
  ov.classList.add('show');
}
function hidePdfOverlay(){
  const ov = $('#pdf-overlay');
  if (!ov) return;
  ov.classList.remove('show');
}

/* --------------------- Generar PDF --------------------- */
async function generatePDF(){
  // Mostrar overlay desde YA, antes de cualquier procesamiento, para que
  // la usuaria vea respuesta inmediata al pulsar el botón.
  showPdfOverlay('Esto puede tardar unos segundos');
  
  try {
    await _generatePDFInner();
  } catch(err) {
    console.error('Error generando PDF:', err);
    toast('Error al generar PDF', true);
  } finally {
    // El overlay se cierra siempre, haya o no error. Le damos un pequeño retardo para
    // que la usuaria vea la transición y no parezca un flash.
    setTimeout(() => hidePdfOverlay(), 250);
  }
}

async function _generatePDFInner(){
  syncHeader();
  await saveAudit(true);
  
  // Ceder al navegador un tick para que pinte el overlay antes de empezar el trabajo pesado.
  // Sin esto el navegador no llega a renderizar el overlay porque jsPDF bloquea el hilo.
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const W = 210, H = 297, M = 12;
  const COR = '#D14B3D', DARK = '#1f2024', MUTED = '#6b6f76', BORDER = '#cccccc';

  let y = 0;

  const ensure = (need) => {
    if(y + need > H - 18){ footer(); doc.addPage(); y = 14; header(); }
  };

  const header = () => {
    // Banda superior
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

  // Cabecera con datos
  doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(COR);
  doc.text('AUDITORÍA OPERATIVA Y RENTABILIDAD', M, y); y += 6;
  doc.setTextColor(DARK); doc.setFont('helvetica','normal'); doc.setFontSize(10);
  const lineH = 5.5;
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

  // Resumen
  let si=0,no=0,na=0,total=0;
  CHECKLIST.forEach(s => s.items.forEach(it => { total++; const v=state.data.items[it.id]?.val; if(v==='si')si++; else if(v==='no')no++; else if(v==='na')na++; }));
  const pct = (si+no) ? Math.round(si/(si+no)*100) : 0;
  doc.setFillColor('#FCEFEC'); doc.rect(M, y, W-2*M, 12, 'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(9.5); doc.setTextColor(COR);
  doc.text(`CONFORMIDAD: ${pct}%`, M+3, y+7.5);
  doc.setTextColor(DARK); doc.setFont('helvetica','normal');
  doc.text(`SÍ: ${si}    NO: ${no}    N/A: ${na}    Pendientes: ${total-si-no-na}    Total: ${total}`, W-M-3, y+7.5, { align:'right' });
  y += 16;

  // Secciones
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
      
      // Calcular la altura requerida para la fila
      let hRow = Math.max(6, split.length*4.4 + 1);
      if(v.obs){
        hRow += 4 + doc.splitTextToSize(v.obs, W-2*M-6).length*3.8;
      }
      
      const photoW = 45;
      const photoH = 34;
      const gap = 4;
      
      if(v.photos && v.photos.length > 0){
        const rowsCount = Math.ceil(v.photos.length / 3);
        hRow += 2 + rowsCount * (photoH + gap);
      }
      
      ensure(hRow + 2);

      // estado visual
      const stateColor = v.val==='si'? '#1f9d55' : v.val==='no'? '#d83b3b' : v.val==='na'? '#8a8f97' : '#dddddd';
      doc.setFillColor(stateColor); doc.circle(M+3, y+2.4, 1.8, 'F');
      doc.setFontSize(8); doc.setTextColor('#FFF'); doc.setFont('helvetica','bold');
      const lbl = v.val==='si'?'✓': v.val==='no'?'✗': v.val==='na'?'-':'';
      if(lbl) doc.text(lbl, M+3, y+3.4, { align:'center' });
      doc.setTextColor(DARK); doc.setFont('helvetica','normal'); doc.setFontSize(9.5);

      doc.text(split, M+7, y+2.5);
      // estado a la derecha
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
      
      // Fotos en línea
      if(v.photos && v.photos.length > 0){
        let row = 0;
        let col = 0;
        const startX = M + 7;
        
        v.photos.forEach((src) => {
          if(col >= 3){
            col = 0;
            row++;
          }
          const px = startX + col * (photoW + gap);
          const py = cursor + 2 + row * (photoH + gap);
          try {
            doc.addImage(src, 'JPEG', px, py, photoW, photoH);
          } catch(e) {
            console.error("Error al añadir foto en línea:", e);
          }
          col++;
        });
        
        const rowsCount = row + 1;
        cursor += 2 + rowsCount * (photoH + gap);
      }
      
      y = cursor + 2;
      doc.setDrawColor('#EEE'); doc.line(M, y, W-M, y); y += 1.5;
    }
    y += 2;
  }

  // Plan de acción
  ensure(25);
  doc.setFillColor(COR); doc.rect(M, y, W-2*M, 7, 'F');
  doc.setTextColor('#FFF'); doc.setFont('helvetica','bold'); doc.setFontSize(10);
  doc.text('PLAN DE ACCIÓN / PUNTOS DE MEJORA DETECTADOS', M+2, y+5);
  doc.setTextColor(DARK); y += 9;

  // Dibujar cuadro y texto dinámicamente
  doc.setFont('helvetica','normal'); doc.setFontSize(9.5);
  const planText = state.data.plan || '';
  const planLines = planText ? doc.splitTextToSize(planText, W-2*M-6) : []; // Margen de 3mm a cada lado
  
  const lineHeight = 4.8;
  const boxPaddingTop = 4;
  const boxPaddingBottom = 4;
  
  const requiredTextHeight = planLines.length * lineHeight;
  const totalRequiredHeight = Math.max(30, requiredTextHeight + boxPaddingTop + boxPaddingBottom);
  
  // ¿Cabe en la página actual?
  if (y + totalRequiredHeight <= H - 18) {
    // Cabe perfectamente en la página actual
    doc.setDrawColor(BORDER);
    doc.rect(M, y, W-2*M, totalRequiredHeight);
    if (planLines.length > 0) {
      doc.text(planLines, M+3, y + boxPaddingTop + 3);
    }
    y += totalRequiredHeight;
  } else {
    // No cabe en la página actual. Paginamos el texto y los cuadros.
    let currentLine = 0;
    let isFirstPageOfPlan = true;
    
    while (currentLine < planLines.length || isFirstPageOfPlan) {
      const remainingHeight = (H - 18) - y;
      
      // Si nos queda muy poco espacio en la página actual (menos de 15mm), pasamos a la siguiente
      if (remainingHeight < 15) {
        footer();
        doc.addPage();
        y = 14;
        header();
        continue;
      }
      
      // Calcular cuántas líneas caben en el espacio restante
      let maxLines = Math.floor((remainingHeight - boxPaddingTop - boxPaddingBottom) / lineHeight);
      if (maxLines < 1) maxLines = 1;
      
      const linesToShow = planLines.slice(currentLine, currentLine + maxLines);
      const actualLinesCount = linesToShow.length;
      
      // Altura del cuadro para esta página
      let boxHeight = (actualLinesCount * lineHeight) + boxPaddingTop + boxPaddingBottom;
      if (isFirstPageOfPlan && planLines.length === 0) {
        boxHeight = Math.max(30, boxHeight);
      }
      
      doc.setDrawColor(BORDER);
      doc.rect(M, y, W-2*M, boxHeight);
      
      if (actualLinesCount > 0) {
        doc.text(linesToShow, M+3, y + boxPaddingTop + 3);
      }
      
      y += boxHeight;
      currentLine += actualLinesCount;
      isFirstPageOfPlan = false;
      
      if (currentLine < planLines.length) {
        footer();
        doc.addPage();
        y = 14;
        header();
      }
    }
  }

  // Firma
  ensure(40);
  doc.setFont('helvetica','bold'); doc.setFontSize(10);
  doc.text('Auditora Operativa (Cor Outsourcing)', M, y+4);
  doc.setDrawColor(BORDER); doc.line(M, y+24, M+85, y+24);
  if(state.data.signature){
    try { doc.addImage(state.data.signature, 'PNG', M, y+6, 70, 18); } catch(e){}
  }
  doc.setFont('helvetica','normal'); doc.setFontSize(9.5);
  doc.text(state.data.auditor || 'María José Pozuelo', M, y+29);
  
  // pies de página en todas
  const pages = doc.internal.getNumberOfPages();
  for(let p=1;p<=pages;p++){ doc.setPage(p); footer(); }

  // Sanitizar el nombre del hotel para el archivo
  const hotelClean = (state.data.hotel || 'SinHotel').replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '_').trim();
  const fileName = `Auditoria_Cor_${hotelClean}_${state.data.date || 'sin-fecha'}.pdf`;
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
      const ok = await confirmModal({
        title: 'Cambios sin guardar',
        message: '¿Quieres guardar los cambios antes de salir?',
        okText: 'Guardar',
        cancelText: 'Salir sin guardar'
      });
      if(ok) await saveAudit();
    }
    goView('home');
  });
  $('#btn-save').addEventListener('click', () => saveAudit());
  $('#btn-summary').addEventListener('click', showSummary);
  $('#btn-pdf').addEventListener('click', generatePDF);
  $('#btn-pdf-modal').addEventListener('click', () => { closeModal('modal-summary'); generatePDF(); });
  $('#btn-clear-sig').addEventListener('click', clearSignature);

  // sync de cabecera en cada cambio con autoguardado debounced.
  // Un solo listener delegado en document; comprobamos si el target es de los campos vigilados.
  const watchedIds = new Set(['f-hotel','f-hotel-otro','f-auditor','f-date','f-start','f-end','f-rooms','f-plan']);
  document.addEventListener('input', e => {
    if (!watchedIds.has(e.target.id)) return;
    if (e.target.id === 'f-plan') {
      autoGrowTextarea(e.target);
    }
    triggerAutosave();
  });

  // Control del selector de hotel
  const hotelSelect = $('#f-hotel');
  const hotelOtro = $('#f-hotel-otro');
  if (hotelSelect && hotelOtro) {
    hotelSelect.addEventListener('change', () => {
      if (hotelSelect.value === 'OTRO') {
        hotelOtro.style.display = '';
        hotelOtro.focus();
      } else {
        hotelOtro.style.display = 'none';
        hotelOtro.value = '';
      }
      triggerAutosave(true); // Guardar borrador de inmediato al cambiar de hotel
    });
  }

  // antes de salir
  window.addEventListener('beforeunload', e => {
    if(state.dirty){ e.preventDefault(); e.returnValue=''; }
  });

  // Cerrar lightbox al hacer clic en él
  const lb = document.getElementById('modal-lightbox');
  if (lb) {
    lb.addEventListener('click', closeLightbox);
  }

  // Descargar foto desde el visor
  const dlBtn = document.getElementById('lightbox-download');
  if (dlBtn) {
    dlBtn.addEventListener('click', e => {
      e.stopPropagation(); // Evitar que se cierre el lightbox al hacer clic
      const img = document.getElementById('lightbox-img');
      if (!img || !img.src) return;
      
      const a = document.createElement('a');
      a.href = img.src;
      a.download = `cor_auditoria_foto_${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  // Copias de seguridad
  const btnExport = $('#btn-export-backup');
  const btnImport = $('#btn-import-backup');
  const inputImport = $('#input-import-file');
  
  if (btnExport) btnExport.addEventListener('click', exportBackup);
  if (btnImport && inputImport) {
    btnImport.addEventListener('click', () => inputImport.click());
    inputImport.addEventListener('change', importBackup);
  }

  // Botón "Cambiar PIN" en la vista de info
  const btnChangePin = $('#btn-change-pin');
  if (btnChangePin) {
    btnChangePin.addEventListener('click', async () => {
      const ok = await confirmModal({
        title: 'Cambiar PIN',
        message: 'Vas a cambiar el PIN. Tendrás que confirmar el actual y crear uno nuevo.',
        okText: 'Continuar'
      });
      if (ok) {
        startChangePinFlow();
      }
    });
  }
}


/* --------------------- Autenticación (PIN configurable con PBKDF2) ---------------------
   ----------------------------------------------------------------------------------------
   La primera vez que se abre la app, la usuaria crea su propio PIN.
   El hash se guarda en localStorage con una sal aleatoria de 16 bytes.
   Derivación con PBKDF2-SHA256 a 250 000 iteraciones — esto hace que un
   ataque por fuerza bruta sobre los 10 000 PINs posibles tarde varios
   minutos por intento incluso teniendo el JS público, en lugar de
   milisegundos como con un SHA-256 simple.
   ---------------------------------------------------------------------------------------- */
const AUTH = {
  STORE_KEY: 'cor_audit_pin_v2',          // { salt, hash, iter, createdAt } en localStorage
  SESSION_KEY: 'cor_audit_session_token', // sessionStorage (sesión de 12h)
  PBKDF2_ITERATIONS: 250000
};

// Convertir Uint8Array a hex y viceversa.
function bufToHex(buf){
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}
function hexToBuf(hex){
  const arr = new Uint8Array(hex.length/2);
  for (let i=0; i<arr.length; i++) arr[i] = parseInt(hex.substr(i*2,2),16);
  return arr;
}

// Derivar hash a partir de un PIN y una sal usando PBKDF2-SHA256.
async function derivePin(pin, saltHex, iterations){
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(pin),
    { name: 'PBKDF2' }, false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: hexToBuf(saltHex),
      iterations: iterations,
      hash: 'SHA-256'
    },
    key,
    256
  );
  return bufToHex(bits);
}

// ¿Hay un PIN guardado en este dispositivo?
function hasPinConfigured(){
  try {
    const raw = localStorage.getItem(AUTH.STORE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!(parsed && parsed.salt && parsed.hash);
  } catch(_) { return false; }
}

// Guardar un PIN nuevo. Genera sal aleatoria.
async function setupNewPin(pin){
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = bufToHex(saltBytes);
  const hash = await derivePin(pin, saltHex, AUTH.PBKDF2_ITERATIONS);
  localStorage.setItem(AUTH.STORE_KEY, JSON.stringify({
    salt: saltHex,
    hash: hash,
    iter: AUTH.PBKDF2_ITERATIONS,
    createdAt: Date.now()
  }));
}

// Comprobar si un PIN coincide con el guardado.
async function verifyPin(pin){
  try {
    const raw = localStorage.getItem(AUTH.STORE_KEY);
    if (!raw) return false;
    const stored = JSON.parse(raw);
    if (!stored.salt || !stored.hash) return false;
    const iter = stored.iter || AUTH.PBKDF2_ITERATIONS;
    const candidate = await derivePin(pin, stored.salt, iter);
    // Comparación de tiempo constante para evitar timing attacks.
    if (candidate.length !== stored.hash.length) return false;
    let diff = 0;
    for (let i=0; i<candidate.length; i++) {
      diff |= candidate.charCodeAt(i) ^ stored.hash.charCodeAt(i);
    }
    return diff === 0;
  } catch(_) {
    return false;
  }
}

// Borrar la configuración de PIN (para "olvidé el PIN" o cambiar PIN).
function clearPinConfig(){
  localStorage.removeItem(AUTH.STORE_KEY);
  sessionStorage.removeItem(AUTH.SESSION_KEY);
}

function isAuthed(){
  const token = sessionStorage.getItem(AUTH.SESSION_KEY);
  if (!token) return false;
  
  // Validar formato y expiración de 12 horas del token de sesión.
  // Nota: este token solo protege contra "se me olvidó cerrar sesión y pasaron 12h";
  // la verdadera barrera es el PIN PBKDF2.
  try {
    const parsed = JSON.parse(atob(token));
    if (parsed.expiry < Date.now()) {
      sessionStorage.removeItem(AUTH.SESSION_KEY);
      return false;
    }
    return true;
  } catch(e) {
    return false;
  }
}

function setAuthed(){
  const sessionData = {
    expiry: Date.now() + 12 * 60 * 60 * 1000, // 12 horas
    random: Math.random().toString(36).substring(2)
  };
  const token = btoa(JSON.stringify(sessionData));
  sessionStorage.setItem(AUTH.SESSION_KEY, token);
}

function logout(){
  sessionStorage.removeItem(AUTH.SESSION_KEY);
  showLock();
}

/* --------------------- PIN Pad: estado y flujo ---------------------
   El pad de PIN sirve para 3 flujos distintos:
   - 'unlock'    : usuaria ya tiene PIN, lo está introduciendo
   - 'setup'     : primer arranque o "olvidé PIN", está creando uno
                   (dos pasos: PIN nuevo + confirmación)
   - 'change'    : cambiar PIN existente
                   (tres pasos: PIN actual + PIN nuevo + confirmación)
   ------------------------------------------------------------------ */
const pinFlow = {
  mode: 'unlock',
  step: 'enter',          // 'enter' | 'confirm' | 'verify_current' | 'new' | 'confirm_new'
  firstAttempt: '',       // primera entrada (para luego confirmar)
  failedAttempts: 0
};

let enteredPin = "";

function updatePinDots() {
  const dots = document.querySelectorAll('#pin-display .pin-dot');
  dots.forEach((dot, idx) => {
    if (idx < enteredPin.length) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  });
}

function setLockTitle(title, subtitle){
  const tEl = document.getElementById('lock-title');
  const sEl = document.getElementById('lock-subtitle');
  if (tEl) tEl.textContent = title;
  if (sEl) sEl.textContent = subtitle;
}

function setLockError(msg){
  const err = document.getElementById('lock-error');
  if (err) err.textContent = msg || '\u00A0';
}

function showLockShake(){
  const lockSection = document.getElementById('view-lock');
  if (lockSection) {
    lockSection.classList.add('shake-anim');
    setTimeout(() => lockSection.classList.remove('shake-anim'), 300);
  }
}

// Reinicia el pad: limpia entrada y dots.
function resetPinInput(){
  enteredPin = '';
  updatePinDots();
}

// Entra en modo "introducir PIN para desbloquear".
function startUnlockFlow(){
  pinFlow.mode = 'unlock';
  pinFlow.step = 'enter';
  pinFlow.firstAttempt = '';
  pinFlow.failedAttempts = 0;
  resetPinInput();
  setLockTitle('Auditoría Cor Outsourcing', 'Introduce tu PIN de 4 dígitos');
  setLockError('');
  updateForgotPinVisibility();
}

// Entra en modo "crear PIN nuevo" (primer arranque o tras 'olvidé PIN').
function startSetupFlow(){
  pinFlow.mode = 'setup';
  pinFlow.step = 'enter';
  pinFlow.firstAttempt = '';
  pinFlow.failedAttempts = 0;
  resetPinInput();
  setLockTitle('Crea tu PIN', 'Elige un PIN de 4 dígitos. Lo necesitarás cada vez que abras la app.');
  setLockError('');
  updateForgotPinVisibility();
}

// Entra en modo "cambiar PIN" (desde la pantalla de info).
function startChangePinFlow(){
  pinFlow.mode = 'change';
  pinFlow.step = 'verify_current';
  pinFlow.firstAttempt = '';
  pinFlow.failedAttempts = 0;
  resetPinInput();
  setLockTitle('Cambiar PIN', 'Introduce tu PIN actual');
  setLockError('');
  showLock(false); // mostrar el lock sin resetear el modo
  updateForgotPinVisibility();
}

// Mostrar/ocultar el enlace "Olvidé mi PIN" según el flujo.
function updateForgotPinVisibility(){
  const link = document.getElementById('forgot-pin-link');
  if (!link) return;
  // Solo tiene sentido en modo 'unlock'.
  link.style.display = (pinFlow.mode === 'unlock') ? '' : 'none';
}

async function pressPinKey(val) {
  if (enteredPin.length >= 4) return;
  enteredPin += val;
  updatePinDots();
  
  if (enteredPin.length === 4) {
    await processPin();
  }
}

async function processPin(){
  const pin = enteredPin;

  if (pinFlow.mode === 'unlock') {
    const ok = await verifyPin(pin);
    if (ok) {
      setAuthed();
      setLockError('');
      hideLock();
      resetPinInput();
      pinFlow.failedAttempts = 0;
    } else {
      pinFlow.failedAttempts++;
      setLockError(pinFlow.failedAttempts >= 3
        ? 'PIN incorrecto. ¿Olvidaste tu PIN?'
        : 'PIN incorrecto');
      resetPinInput();
      showLockShake();
    }
    return;
  }

  if (pinFlow.mode === 'setup') {
    if (pinFlow.step === 'enter') {
      pinFlow.firstAttempt = pin;
      pinFlow.step = 'confirm';
      setLockTitle('Confirma tu PIN', 'Vuelve a introducirlo para confirmar');
      setLockError('');
      resetPinInput();
    } else if (pinFlow.step === 'confirm') {
      if (pin === pinFlow.firstAttempt) {
        await setupNewPin(pin);
        setAuthed();
        setLockError('');
        hideLock();
        resetPinInput();
        toast('PIN configurado correctamente');
      } else {
        setLockError('Los PINs no coinciden. Empieza de nuevo.');
        showLockShake();
        // Volver al paso 'enter' para que vuelva a teclear desde el principio.
        pinFlow.step = 'enter';
        pinFlow.firstAttempt = '';
        resetPinInput();
        setTimeout(() => {
          setLockTitle('Crea tu PIN', 'Elige un PIN de 4 dígitos. Lo necesitarás cada vez que abras la app.');
        }, 1500);
      }
    }
    return;
  }

  if (pinFlow.mode === 'change') {
    if (pinFlow.step === 'verify_current') {
      const ok = await verifyPin(pin);
      if (ok) {
        pinFlow.step = 'new';
        setLockTitle('Nuevo PIN', 'Elige tu nuevo PIN de 4 dígitos');
        setLockError('');
        resetPinInput();
      } else {
        setLockError('PIN actual incorrecto');
        showLockShake();
        resetPinInput();
      }
    } else if (pinFlow.step === 'new') {
      pinFlow.firstAttempt = pin;
      pinFlow.step = 'confirm_new';
      setLockTitle('Confirma el PIN', 'Repite el nuevo PIN');
      setLockError('');
      resetPinInput();
    } else if (pinFlow.step === 'confirm_new') {
      if (pin === pinFlow.firstAttempt) {
        await setupNewPin(pin);
        setAuthed();
        setLockError('');
        hideLock();
        resetPinInput();
        toast('PIN cambiado correctamente');
      } else {
        setLockError('Los PINs no coinciden');
        showLockShake();
        pinFlow.step = 'new';
        pinFlow.firstAttempt = '';
        resetPinInput();
        setTimeout(() => {
          setLockTitle('Nuevo PIN', 'Elige tu nuevo PIN de 4 dígitos');
        }, 1500);
      }
    }
  }
}

function clearPin() {
  resetPinInput();
  setLockError('');
}

function backspacePin() {
  if (enteredPin.length > 0) {
    enteredPin = enteredPin.slice(0, -1);
    updatePinDots();
    setLockError('');
  }
}

// "Olvidé mi PIN": confirma con la usuaria y borra la config (sin tocar IndexedDB).
async function handleForgotPin(){
  const ok = await confirmModal({
    title: '¿Olvidaste tu PIN?',
    message: 'Si continúas, podrás crear un PIN nuevo.\n\nTus auditorías guardadas NO se borrarán.',
    okText: 'Crear nuevo PIN'
  });
  if (ok) {
    clearPinConfig();
    startSetupFlow();
  }
}

/* --------------------- Lightbox de Fotos --------------------- */
function openLightbox(src) {
  const lb = document.getElementById('modal-lightbox');
  const img = document.getElementById('lightbox-img');
  if (!lb || !img) return;
  img.src = src;
  lb.style.display = 'flex';
  setTimeout(() => {
    lb.classList.add('show');
  }, 10);
}

function closeLightbox() {
  const lb = document.getElementById('modal-lightbox');
  if (!lb) return;
  lb.classList.remove('show');
  setTimeout(() => {
    lb.style.display = 'none';
  }, 200);
}

// resetMode: si es true, decide automáticamente entre setup o unlock según haya PIN.
// si es false, respeta el modo actual (lo usamos para "cambiar PIN").
function showLock(resetMode = true){
  document.getElementById('view-lock').style.display = 'flex';
  document.getElementById('app-header').style.display = 'none';
  document.getElementById('app-main').style.display = 'none';
  if (resetMode) {
    if (hasPinConfigured()) {
      startUnlockFlow();
    } else {
      startSetupFlow();
    }
  }
}

function hideLock(){
  document.getElementById('view-lock').style.display = 'none';
  document.getElementById('app-header').style.display = '';
  document.getElementById('app-main').style.display = '';
}

function bindLock(){
  const keyboard = document.getElementById('pin-keyboard');
  if (!keyboard) return;
  
  keyboard.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    
    const val = btn.dataset.val;
    const action = btn.dataset.action;
    
    if (val !== undefined) {
      pressPinKey(val);
    } else if (action === 'clear') {
      clearPin();
    } else if (action === 'backspace') {
      backspacePin();
    }
  });

  // Enlace "olvidé mi PIN"
  const forgotLink = document.getElementById('forgot-pin-link');
  if (forgotLink) {
    forgotLink.addEventListener('click', e => {
      e.preventDefault();
      handleForgotPin();
    });
  }

  // Admitir entrada física para facilitar pruebas y uso en PC.
  // Usamos un flag de estado en lugar de inspeccionar el DOM (más fiable).
  document.addEventListener('keydown', e => {
    const lockView = document.getElementById('view-lock');
    if (!lockView || lockView.style.display === 'none') return;
    if (e.key >= '0' && e.key <= '9') {
      pressPinKey(e.key);
    } else if (e.key === 'Backspace') {
      backspacePin();
    } else if (e.key === 'Escape' || e.key === 'Delete') {
      clearPin();
    }
  });
}

/* --------------------- Detección de versión nueva del Service Worker --------------------- */
function bindServiceWorkerUpdates(){
  if (!('serviceWorker' in navigator)) return;
  
  navigator.serviceWorker.addEventListener('message', e => {
    if (e.data && e.data.type === 'SW_UPDATED') {
      // Solo avisamos si ya había una versión antes (es decir, esto no es la primera carga).
      // Para distinguirlo, usamos sessionStorage.
      if (sessionStorage.getItem('sw_was_loaded')) {
        showUpdateAvailable();
      }
      sessionStorage.setItem('sw_was_loaded', '1');
    }
  });
  
  // Marcar que el SW ya estaba activo en esta sesión.
  if (navigator.serviceWorker.controller) {
    sessionStorage.setItem('sw_was_loaded', '1');
  }
}

function showUpdateAvailable(){
  // Banner discreto en la parte superior. Si ya existe, no duplicar.
  if (document.getElementById('update-banner')) return;
  const banner = document.createElement('div');
  banner.id = 'update-banner';
  banner.style.cssText = `
    position:fixed; top:0; left:0; right:0; z-index:200;
    background:#1f9d55; color:#fff; padding:10px 14px;
    display:flex; align-items:center; justify-content:space-between;
    font-size:13px; font-weight:600;
    box-shadow:0 2px 8px rgba(0,0,0,.2);
    padding-top: calc(10px + env(safe-area-inset-top));
  `;
  banner.innerHTML = `
    <span>✨ Hay una versión nueva disponible</span>
    <button style="background:#fff;color:#1f9d55;border:0;padding:6px 14px;border-radius:6px;font-weight:700;cursor:pointer;font-size:12px;">Recargar</button>
  `;
  banner.querySelector('button').onclick = () => {
    location.reload();
  };
  document.body.appendChild(banner);
}

document.addEventListener('DOMContentLoaded', async () => {
  // Pedir almacenamiento persistente cuanto antes.
  requestPersistentStorage();
  
  bindLock();
  bindUI();
  bindServiceWorkerUpdates();
  
  // Decidir si mostrar lock o desbloquear directamente.
  if(isAuthed() && hasPinConfigured()){
    hideLock();
  } else {
    showLock(true); // resetMode=true → decide entre setup/unlock
  }
  
  refreshHistoryCount();

  const lo = document.getElementById('btn-logout');
  if(lo) lo.addEventListener('click', async () => {
    const ok = await confirmModal({
      title: 'Cerrar sesión',
      message: 'Tendrás que volver a introducir el PIN la próxima vez.\n\nLas auditorías guardadas no se borran.',
      okText: 'Cerrar sesión'
    });
    if(ok){
      logout();
    }
  });
});
