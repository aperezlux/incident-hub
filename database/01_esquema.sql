CREATE TABLE IF NOT EXISTS incidentes (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('HARDWARE','SOFTWARE','RED','ACCESOS','OTROS')),
  prioridad VARCHAR(10) NOT NULL CHECK (prioridad IN ('BAJA','MEDIA','ALTA','CRITICA')),
  usuario VARCHAR(100) NOT NULL,
  tecnico VARCHAR(100),
  estado VARCHAR(15) NOT NULL DEFAULT 'NUEVO' CHECK (estado IN ('NUEVO','ASIGNADO','EN_PROCESO','RESUELTO','CERRADO')),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS comentarios (
  id SERIAL PRIMARY KEY,
  incidente_id INTEGER NOT NULL REFERENCES incidentes(id) ON DELETE CASCADE,
  autor VARCHAR(100) NOT NULL,
  texto TEXT NOT NULL,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_incidentes_estado ON incidentes(estado);
CREATE INDEX IF NOT EXISTS idx_incidentes_tecnico ON incidentes(tecnico);
CREATE INDEX IF NOT EXISTS idx_comentarios_incidente ON comentarios(incidente_id);
