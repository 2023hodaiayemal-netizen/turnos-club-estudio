const test = require('node:test');
const assert = require('node:assert/strict');
const { hasConflict, timeToMinutes, validateAppointment, normalizeAppointments, sortAppointments } = require('../script.js');

const existing = { id: 'base', nombre: 'Ana', fecha: '2026-11-25', inicio: '16:00', fin: '17:00', recurso: 'Sala Andrómeda', motivo: 'Matemática' };

test('detecta superposiciones y permite intervalos consecutivos', () => {
  assert.equal(hasConflict({ ...existing, inicio: '15:00', fin: '16:00' }, [existing]), false);
  assert.equal(hasConflict({ ...existing, inicio: '17:00', fin: '18:00' }, [existing]), false);
  assert.equal(hasConflict({ ...existing, inicio: '16:00', fin: '17:00' }, [existing]), true);
  assert.equal(hasConflict({ ...existing, inicio: '16:30', fin: '17:30' }, [existing]), true);
  assert.equal(hasConflict({ ...existing, inicio: '16:15', fin: '16:45' }, [existing]), true);
  assert.equal(hasConflict({ ...existing, inicio: '15:30', fin: '17:30' }, [existing]), true);
});

test('separa recursos y fechas', () => {
  assert.equal(hasConflict({ ...existing, recurso: 'Sala Eclipse' }, [existing]), false);
  assert.equal(hasConflict({ ...existing, fecha: '2026-11-26' }, [existing]), false);
  assert.equal(timeToMinutes('16:30'), 990);
});

test('valida campos, orden temporal, almacenamiento y orden cronológico', () => {
  assert.equal(validateAppointment({ ...existing, nombre: '' }).ok, false);
  assert.equal(validateAppointment({ ...existing, inicio: '17:00', fin: '17:00' }).ok, false);
  assert.equal(validateAppointment({ ...existing, inicio: '25:00', fin: '26:00' }).ok, false);
  assert.deepEqual(normalizeAppointments('roto'), []);
  const later = { ...existing, id: 'later', fecha: '2026-11-26', inicio: '10:00', fin: '11:00' };
  assert.deepEqual(sortAppointments([later, existing]).map((item) => item.id), ['base', 'later']);
});
