const $ = (s) => document.querySelector(s);
const auth = $('#auth');
const app = $('#app');
const authMsg = $('#authMsg');
const form = $('#contractForm');
const evaluationBox = $('#evaluation');
const finalizeBtn = $('#finalize');
const pdfLink = $('#pdfLink');

async function api(url, options = {}) {
  const res = await fetch(url, { credentials: 'same-origin', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : null;
  if (!res.ok) throw Object.assign(new Error(data?.error || `HTTP_${res.status}`), { status: res.status, data });
  return data;
}

function setLoggedIn(user) {
  auth.classList.add('hidden'); app.classList.remove('hidden'); $('#logout').classList.remove('hidden');
  $('#userLine').textContent = `${user.name} · ${user.email}`;
  loadContracts();
}

function setLoggedOut() {
  auth.classList.remove('hidden'); app.classList.add('hidden'); $('#logout').classList.add('hidden');
}

$('#registerForm').addEventListener('submit', async (e) => {
  e.preventDefault(); authMsg.textContent = 'Creando cuenta…';
  const fd = new FormData(e.currentTarget);
  try { await api('/api/register', { method: 'POST', body: JSON.stringify(Object.fromEntries(fd)) }); authMsg.textContent = 'Cuenta creada. Ya puedes iniciar sesión.'; e.currentTarget.reset(); }
  catch (err) { authMsg.textContent = err.message === 'PASSWORD_TOO_SHORT' ? 'La contraseña debe tener al menos 10 caracteres.' : `No se pudo crear la cuenta: ${err.message}`; }
});

$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); authMsg.textContent = 'Ingresando…';
  const fd = new FormData(e.currentTarget);
  try { const data = await api('/api/login', { method: 'POST', body: JSON.stringify(Object.fromEntries(fd)) }); authMsg.textContent = ''; setLoggedIn(data.user); }
  catch { authMsg.textContent = 'Correo o contraseña incorrectos.'; }
});

$('#logout').addEventListener('click', async () => { try { await api('/api/logout', { method: 'POST', body: '{}' }); } finally { setLoggedOut(); } });
$('#newContract').addEventListener('click', () => { form.reset(); form.elements.id.value = ''; form.elements['legalYear'].value = '2026'; form.elements['schedule.weeklyHours'].value = '48'; form.elements['schedule.plannedOvertimeHours'].value = '0'; form.elements['benefits.aguinaldoDays'].value = '15'; form.elements['benefits.vacationDays'].value = '12'; form.elements['benefits.vacationPremiumPercent'].value = '25'; form.elements['telework.percent'].value = '0'; form.elements['imss.provided'].checked = true; renderEvaluation(null); form.scrollIntoView({ behavior: 'smooth' }); });

function value(name) { return form.elements[name]?.value ?? ''; }
function number(name) { const v = value(name); return v === '' ? null : Number(v); }
function checked(name) { return Boolean(form.elements[name]?.checked); }

function payloadFromForm() {
  return {
    ...(value('id') ? { id: value('id') } : {}),
    legalYear: Number(value('legalYear') || 2026),
    employer: { name: value('employer.name'), address: value('employer.address') },
    worker: { name: value('worker.name'), address: value('worker.address'), birthDate: value('worker.birthDate'), nationality: value('worker.nationality'), sex: value('worker.sex'), civilStatus: value('worker.civilStatus'), curp: value('worker.curp'), rfc: value('worker.rfc') },
    job: { title: value('job.title'), workplace: value('job.workplace') },
    relation: { type: value('relation.type'), startDate: value('relation.startDate'), temporaryCause: value('relation.temporaryCause'), workDescription: value('relation.workDescription'), seasonDescription: value('relation.seasonDescription') },
    schedule: { weeklyHours: number('schedule.weeklyHours'), plannedOvertimeHours: number('schedule.plannedOvertimeHours') || 0 },
    salary: { daily: number('salary.daily'), zone: value('salary.zone'), professionalMinimumDaily: number('salary.professionalMinimumDaily') || 0, paymentFrequency: value('salary.paymentFrequency'), paymentMethod: value('salary.paymentMethod') },
    benefits: { aguinaldoDays: number('benefits.aguinaldoDays'), vacationDays: number('benefits.vacationDays'), vacationPremiumPercent: number('benefits.vacationPremiumPercent') },
    telework: { percent: number('telework.percent') || 0, equipmentDefined: checked('telework.equipmentDefined'), costsDefined: checked('telework.costsDefined'), disconnectDefined: checked('telework.disconnectDefined') },
    imss: { provided: checked('imss.provided') },
    clauses: { confidentiality: checked('clauses.confidentiality'), postEmploymentNonCompete: checked('clauses.postEmploymentNonCompete') },
    specialWork: checked('specialWork'),
  };
}

function setField(name, val) {
  const el = form.elements[name]; if (!el) return;
  if (el.type === 'checkbox') el.checked = Boolean(val); else el.value = val ?? '';
}

function fillContract(c) {
  const p = c.payload || {};
  setField('id', c.id); setField('legalYear', p.legalYear || 2026);
  for (const [prefix, obj] of Object.entries({ employer:p.employer, worker:p.worker, job:p.job, relation:p.relation, schedule:p.schedule, salary:p.salary, benefits:p.benefits, telework:p.telework, imss:p.imss, clauses:p.clauses })) {
    for (const [key, val] of Object.entries(obj || {})) setField(`${prefix}.${key}`, val);
  }
  setField('specialWork', p.specialWork); renderEvaluation(c.evaluation, c);
  form.scrollIntoView({ behavior: 'smooth' });
}

function renderEvaluation(ev, contract = null) {
  evaluationBox.className = `status ${ev?.status || 'BORRADOR_INCOMPLETO'}`;
  evaluationBox.textContent = '';
  const title = document.createElement('strong'); title.textContent = ev ? `Estado: ${ev.status}` : 'Guarda para evaluar el contrato.'; evaluationBox.append(title);
  if (ev) {
    const groups = [['Faltantes', ev.incomplete], ['Bloqueos', ev.blockers], ['Revisión especial', ev.reviews], ['Avisos', ev.warnings]];
    for (const [label, items] of groups) if (items?.length) {
      const h = document.createElement('div'); h.textContent = label; h.style.fontWeight = '700'; h.style.marginTop = '8px'; evaluationBox.append(h);
      const ul = document.createElement('ul'); ul.className = 'issues'; for (const item of items) { const li = document.createElement('li'); li.textContent = item.message; ul.append(li); } evaluationBox.append(ul);
    }
  }
  finalizeBtn.disabled = !ev?.finalizable || Boolean(contract?.finalizedAt);
  if (contract?.finalizedAt) { pdfLink.href = `/api/contracts/${contract.id}/pdf`; pdfLink.classList.remove('hidden'); pdfLink.textContent = 'Descargar PDF final'; }
  else { pdfLink.classList.add('hidden'); pdfLink.removeAttribute('href'); }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  try { const data = await api('/api/contracts', { method: 'POST', body: JSON.stringify(payloadFromForm()) }); setField('id', data.contract.id); renderEvaluation(data.contract.evaluation, data.contract); await loadContracts(); }
  catch (err) { alert(`No se pudo guardar: ${err.message}`); }
});

finalizeBtn.addEventListener('click', async () => {
  const id = value('id'); if (!id) return;
  if (!confirm('Al finalizar se crea un snapshot inmutable. ¿Continuar?')) return;
  try { const data = await api(`/api/contracts/${id}/finalize`, { method: 'POST', body: '{}' }); renderEvaluation(data.contract.evaluation, data.contract); pdfLink.href = data.pdfUrl; pdfLink.classList.remove('hidden'); await loadContracts(); }
  catch (err) { const ev = err.data?.evaluation; if (ev) renderEvaluation(ev); else alert(`No se pudo finalizar: ${err.message}`); }
});

async function loadContracts() {
  const box = $('#contracts'); box.textContent = 'Cargando…';
  try {
    const { contracts } = await api('/api/contracts'); box.textContent = '';
    if (!contracts.length) { box.textContent = 'Todavía no hay contratos.'; return; }
    for (const c of contracts) {
      const row = document.createElement('div'); row.className = 'contract-row';
      const info = document.createElement('div'); const strong = document.createElement('strong'); strong.textContent = c.workerName || 'Sin nombre'; const meta = document.createElement('div'); meta.className = 'muted'; meta.textContent = `${c.relationType || 'Sin tipo'} · ${c.status || 'Sin evaluar'}${c.finalizedAt ? ' · FINALIZADO' : ''}`; info.append(strong, meta);
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'secondary'; btn.textContent = 'Abrir'; btn.addEventListener('click', async () => { const data = await api(`/api/contracts/${c.id}`); fillContract(data.contract); });
      row.append(info, btn); box.append(row);
    }
  } catch { box.textContent = 'No se pudieron cargar los contratos.'; }
}

(async function init(){ try { const data = await api('/api/me'); setLoggedIn(data.user); } catch { setLoggedOut(); } })();
