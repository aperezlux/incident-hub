INSERT INTO incidentes (titulo, descripcion, categoria, prioridad, usuario, tecnico, estado) VALUES
 ('Sin acceso a correo corporativo','El usuario no puede iniciar sesión','ACCESOS','ALTA','maria.lopez','tecnico.ruiz','EN_PROCESO'),
 ('Impresora del piso 2 no responde','No imprime desde ayer','HARDWARE','MEDIA','jose.perez',NULL,'NUEVO'),
 ('Caída de red en sucursal norte','Sin conectividad en toda la sucursal','RED','CRITICA','ana.gomez','tecnico.diaz','ASIGNADO'),
 ('Error en sistema de facturación','Aparece error 500 al emitir factura','SOFTWARE','ALTA','luis.mora','tecnico.ruiz','RESUELTO'),
 ('Solicitud de licencia de Office','Nuevo ingreso requiere licencia','SOFTWARE','BAJA','sofia.cruz','tecnico.diaz','CERRADO');
INSERT INTO comentarios (incidente_id, autor, texto) VALUES
 (1,'tecnico.ruiz','Se restableció la contraseña, pendiente validar con el usuario.'),
 (3,'sistema','Estado: NUEVO → ASIGNADO');
