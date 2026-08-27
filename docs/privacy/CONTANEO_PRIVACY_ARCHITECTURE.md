# Arquitectura de privacidad de Contaneo — módulos V1

## Objetivo

Unificar Contrato MX y futuros productos bajo Contaneo sin duplicar responsables, canales ARCO ni políticas incompatibles, y sin publicar datos personales del propietario que no sean jurídicamente necesarios.

## Modelo propuesto

- **Contaneo** funciona como marca/plataforma paraguas.
- **Contrato MX** se presenta como un módulo de Contaneo en `contrato.contaneo.com`.
- El responsable jurídico debe ser una persona física o moral real que opere Contaneo; la marca por sí sola no sustituye la identidad del responsable.
- Se usa un aviso integral común de Contaneo y, cuando sea necesario, se agregan secciones específicas por módulo.
- Un único canal ARCO puede atender todos los módulos, por ejemplo `privacidad@contaneo.com`, siempre que exista y sea monitoreado realmente.

## Datos que no deben inventarse

Antes de lanzamiento público deben resolverse y verificarse:

1. `RESPONSABLE_LEGAL` — nombre o razón social real.
2. `DOMICILIO_NOTIFICACIONES` — domicilio real designado para oír y recibir notificaciones.
3. `CANAL_ARCO` — correo/formulario real y atendido.
4. `TRANSFERENCIAS` — proveedores/destinatarios y finalidades reales, o una declaración veraz cuando no existan transferencias que requieran información adicional.
5. Procedimiento ARCO — recepción, autenticación razonable, respuesta, limitación y revocación cuando aplique.

No usar dirección residencial del propietario por comodidad si existe un domicilio empresarial/comercial legítimo que pueda cumplir la función. No inventar domicilios virtuales, sociedades o correos inexistentes.

## Responsable vs. encargado

Contaneo puede actuar como **responsable** para los tratamientos que determine directamente: alta de cuenta, autenticación, seguridad, soporte, prevención de abuso, administración del servicio y facturación futura.

Cuando una empresa cliente captura información de trabajadores para documentar su propia relación laboral, pueden existir tratamientos en los que el cliente determine las finalidades y Contaneo opere como **encargado**. Esa asignación debe documentarse en los términos/contrato de servicio y no utilizarse para eludir obligaciones del responsable real.

## Contrato MX — categorías y finalidades

Categorías previstas:

- identificación y contacto del titular de cuenta;
- identificación y contacto del patrón y trabajador;
- datos laborales necesarios para preparar el contrato;
- respuestas al cuestionario jurídico;
- snapshots, contratos finalizados y metadatos de integridad.

Finalidades previstas:

- crear y administrar cuentas;
- preparar, evaluar y generar contratos;
- guardar borradores y snapshots/versiones;
- descargar documentos finalizados;
- seguridad, prevención de abuso, soporte y continuidad operativa.

No agregar finalidades comerciales, marketing, perfilado o transferencias sin documentarlas de forma específica.

## Gate de lanzamiento público

La aplicación debe permanecer cerrada al público mientras cualquiera de estos puntos siga pendiente:

- identidad real del responsable;
- domicilio para notificaciones;
- canal ARCO operativo;
- transferencias/proveedores revisados;
- aviso integral sin placeholders;
- términos que expliquen roles responsable/encargado cuando corresponda;
- backup/restore operativo comprobado.

El healthcheck técnico puede permanecer público sin habilitar formularios de captura de datos.

## Implementación técnica actual

- Servicio Node aislado en `127.0.0.1:3080`.
- `contrato.contaneo.com` con TLS y nginx.
- `/health` accesible externamente.
- aplicación completa bloqueada con HTTP 503 hasta cerrar los gates anteriores.

## Siguiente decisión del propietario

Definir qué persona física o moral opera Contaneo y qué domicilio empresarial/comercial real se utilizará para notificaciones. Hasta entonces, no sustituir los placeholders ni retirar el 503 de lanzamiento.
