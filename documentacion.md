# Gestión de turnos — Órbita de Ideas

## Datos generales y sketch

- Estudiante: Hodaia Yemal
- Tecnologías: HTML, CSS, JavaScript y localStorage
- Repositorio: https://github.com/2023hodaiayemal-netizen/turnos-club-estudio
- Sketch previo: `evidencias/sketch-turnos.drawio` y `evidencias/sketch-turnos.png`

## Planeamiento

Se reservan Sala Andrómeda, Sala Eclipse o Sala Nova. Cada turno contiene id, nombre, fecha, inicio, fin, recurso y motivo. Los intervalos consecutivos se aceptan; las superposiciones se rechazan solo para la misma fecha y sala.

## Prompt inicial

```text
Implementá el sistema de turnos de Órbita de Ideas en index.html, style.css y script.js. Incluí nombre, fecha, inicio, fin, sala y motivo; agenda ordenada; cancelación; comprobante imprimible y persistencia con la clave orbita-de-ideas:turnos:v1. Las salas son Andrómeda, Eclipse y Nova. Convertí horas a minutos y rechazá un turno cuando coincidan fecha y sala y nuevoInicio < finExistente y nuevoFin > inicioExistente. Aceptá intervalos consecutivos y el mismo horario en otra sala. Si se rechaza una solicitud, ocultá cualquier comprobante anterior. Validá almacenamiento corrupto, campos vacíos y fin posterior al inicio. Usá los IDs del sketch y diseño responsive y accesible.
```

## Pruebas y versiones

Pendiente hasta implementar y verificar la aplicación.
