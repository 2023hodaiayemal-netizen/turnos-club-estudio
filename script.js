(function () {
  const STORAGE_KEY = 'orbita-de-ideas:turnos:v1';
  const RESOURCES = ['Sala Andrómeda', 'Sala Eclipse', 'Sala Nova'];
  function timeToMinutes(time) { const [hours, minutes] = String(time).split(':').map(Number); return hours * 60 + minutes; }
  function validateAppointment(item) {
    const required = ['nombre', 'fecha', 'inicio', 'fin', 'recurso', 'motivo'];
    if (required.some((key) => !String(item[key] ?? '').trim())) return { ok: false, message: 'Completá todos los campos.' };
    if (!/^\d{2}:\d{2}$/.test(item.inicio) || !/^\d{2}:\d{2}$/.test(item.fin)) return { ok: false, message: 'Ingresá horarios válidos.' };
    if (timeToMinutes(item.fin) <= timeToMinutes(item.inicio)) return { ok: false, message: 'El horario de fin debe ser posterior al inicio.' };
    if (!RESOURCES.includes(item.recurso)) return { ok: false, message: 'Elegí una sala válida.' };
    return { ok: true };
  }
  function hasConflict(candidate, appointments) {
    const start = timeToMinutes(candidate.inicio); const end = timeToMinutes(candidate.fin);
    return appointments.some((item) => item.fecha === candidate.fecha && item.recurso === candidate.recurso && start < timeToMinutes(item.fin) && end > timeToMinutes(item.inicio));
  }
  function sortAppointments(appointments) { return [...appointments].sort((a, b) => `${a.fecha}T${a.inicio}`.localeCompare(`${b.fecha}T${b.inicio}`)); }
  function normalizeAppointments(raw) {
    try { const parsed = JSON.parse(raw || '[]'); if (!Array.isArray(parsed)) return []; return parsed.filter((item) => item && typeof item.id === 'string' && validateAppointment(item).ok); } catch { return []; }
  }
  function id() { return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`; }

  function init() {
    let appointments = [];
    const message = document.querySelector('#mensaje'); const agenda = document.querySelector('#agenda'); const receipt = document.querySelector('#comprobante'); const receiptData = document.querySelector('#comprobante-datos');
    try { const raw = localStorage.getItem(STORAGE_KEY); appointments = normalizeAppointments(raw); if (raw && appointments.length === 0 && raw !== '[]') message.textContent = 'La agenda guardada no era válida; se inició una nueva.'; } catch { message.textContent = 'No se pudo leer el almacenamiento; podés reservar durante esta sesión.'; }
    function persist() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments)); return true; } catch { message.textContent = 'El turno queda visible, pero el navegador no permitió guardarlo.'; return false; } }
    function render() {
      agenda.replaceChildren(); const sorted = sortAppointments(appointments);
      if (!sorted.length) { const empty = document.createElement('p'); empty.textContent = 'Todavía no hay turnos reservados.'; agenda.append(empty); return; }
      sorted.forEach((item) => { const article = document.createElement('article'); article.className = 'turno'; const data = document.createElement('div'); const title = document.createElement('strong'); title.textContent = `${item.fecha} · ${item.inicio}–${item.fin}`; const details = document.createElement('p'); details.textContent = `${item.recurso} · ${item.nombre} · ${item.motivo}`; const cancel = document.createElement('button'); cancel.type = 'button'; cancel.textContent = 'Cancelar'; cancel.addEventListener('click', () => { appointments = appointments.filter((appointment) => appointment.id !== item.id); persist(); receipt.hidden = true; message.textContent = 'Turno cancelado; el horario volvió a quedar disponible.'; render(); }); data.append(title, details); article.append(data, cancel); agenda.append(article); });
    }
    function showReceipt(item) { receiptData.replaceChildren(); [['Nombre', item.nombre], ['Fecha', item.fecha], ['Horario', `${item.inicio}–${item.fin}`], ['Sala', item.recurso], ['Motivo', item.motivo], ['Código', item.id]].forEach(([label, value]) => { const p = document.createElement('p'); const strong = document.createElement('strong'); strong.textContent = `${label}: `; p.append(strong, value); receiptData.append(p); }); receipt.hidden = false; }
    document.querySelector('#form-turno').addEventListener('submit', (event) => { event.preventDefault(); receipt.hidden = true; message.textContent = ''; const item = { id: id(), nombre: document.querySelector('#nombre').value.trim(), fecha: document.querySelector('#fecha').value, inicio: document.querySelector('#inicio').value, fin: document.querySelector('#fin').value, recurso: document.querySelector('#recurso').value, motivo: document.querySelector('#motivo').value.trim() }; const validation = validateAppointment(item); if (!validation.ok) { message.textContent = validation.message; return; } if (hasConflict(item, appointments)) { message.textContent = `Horario ocupado en ${item.recurso}. Elegí otro intervalo o sala.`; return; } appointments.push(item); const saved = persist(); render(); showReceipt(item); message.textContent = saved ? 'Turno confirmado.' : message.textContent; event.currentTarget.reset(); });
    document.querySelector('#imprimir').addEventListener('click', () => window.print()); render();
  }
  if (typeof module !== 'undefined') module.exports = { hasConflict, timeToMinutes, validateAppointment, normalizeAppointments, sortAppointments };
  if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', init);
}());
