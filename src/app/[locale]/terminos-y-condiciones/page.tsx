import { LegalPage } from "@/components/LegalPage";

const sections = [
  {
    heading: "CLÁUSULA 1. IDENTIFICACIÓN DE LA EMPRESA RESPONSABLE",
    content: `Los servicios descritos en este instrumento son diseñados, gestionados y promovidos por:
Razón Social: GOWAYS, S.A. DE C.V.
Marca y Nombre Comercial: HORIZONTRIP
Domicilio Fiscal y de Notificaciones: Av. Río Mixcoac 44, San José Insurgentes, Benito Juárez, 03900 Ciudad de México, CDMX
Mesa de Soporte y Atención: hola@horizontrip.com`
  },
  {
    heading: "CLÁUSULA 2. OBJETO Y MATRIZ DE SERVICIOS",
    content: `HORIZONTRIP comercializa soluciones de viaje integrales orientadas al turismo nacional, que abarcan desde el desarrollo de itinerarios inteligentes, guías curadas, experiencias vivenciales (culturales, gastronómicas, de descanso, ecoturísticas y de inmersión comunitaria), hasta asesorías personalizadas para viajeros en lo individual, parejas o grupos organizados.
Diferenciación del alcance:
Servicios de Planeación Intelectual y Asesoría: Consisten estrictamente en la investigación, trazo de rutas, entrega de entregables digitales y estructuración estratégica del viaje.
Coordinación e Intermediación: En aquellos paquetes donde se articule hospedaje, movilidad terrestre, accesos, actividades guiadas o talleres, HORIZONTRIP opera en calidad de enlace y gestor logístico. La ejecución material, idoneidad de instalaciones y estándares directos corresponden a los proveedores finales independientes.`
  },
  {
    heading: "CLÁUSULA 3. REQUISITOS DE CAPACIDAD Y MARCO DE USO",
    content: `La contratación está reservada con carácter estricto a personas mayores de dieciocho años que ostenten capacidad jurídica para celebrar acuerdos vinculantes conforme a la legislación civil mexicana.
Quien contrate a favor de terceras personas (grupos de viaje, familiares o comitivas corporativas) declara bajo protesta de decir verdad que cuenta con la representación suficiente para obligar a la totalidad de los beneficiarios bajo estas mismas directrices.
Conductas no permitidas: Queda vedado el uso de la infraestructura digital de HORIZONTRIP para fines ilícitos, suplantación identitaria, inyección de códigos maliciosos, extracción sistematizada de datos (scraping) o reventa comercial de los itinerarios, planos o recomendaciones sin previa autorización notariada por parte de la empresa.`
  },
  {
    heading: "CLÁUSULA 4. FIDELIDAD DE LOS DATOS SUMINISTRADOS POR EL CLIENTE",
    content: `El diseño personalizado de presupuestos y agendas de viaje requiere que el usuario aporte información fidedigna: preferencias, marco temporal proyectado, volumen de integrantes, presupuestos estimados y requerimientos logísticos.
HORIZONTRIP queda formalmente liberada de cualquier responsabilidad por cotizaciones desfasadas, inviabilidad de rutas o entregas deficientes cuando la causa raíz consista en la entrega de datos erróneos, incompletos o fuera de los plazos solicitados.`
  },
  {
    heading: "CLÁUSULA 5. ALCANCE ORIENTATIVO DE LAS RECOMENDACIONES",
    content: `Las guías, rutas sugeridas y recomendaciones se estructuran sobre análisis previos, referencias calificadas y datos recabados en momentos específicos. No obstante, las dinámicas del sector turístico son inherentemente variables debido a fluctuaciones estacionales, condiciones atmosféricas, remodelaciones imprevistas, adecuaciones de tarifas por terceros o decisiones gubernamentales.
Por tanto, salvo aquellos componentes que cuenten con confirmación y boleto formalmente emitido a través de nuestra gestión, las propuestas deben conceptualizarse como una base estratégica de orientación y no como una garantía inamovible de operatividad o costo frente a terceros.`
  },
  {
    heading: "CLÁUSULA 6. PRESTACIONES A CARGO DE PROVEEDORES INDEPENDIENTES",
    content: `Los servicios físicos finales —tales como alojamiento, camionetas de transporte, guías locales, talleres comunitarios y recintos de esparcimiento— son provistos por entidades ajenas e independientes a GOWAYS, S.A. DE C.V.
Dichos proveedores conservan la titularidad operativa de sus licencias, pólizas de seguro, protocolos sanitarios y normativas internas. Salvo dolo o negligencia comprobable imputable de manera directa a HORIZONTRIP en sus labores de intermediación, la empresa no asume responsabilidad directa por cancelaciones sobrevenidas, suspensiones de actividades, averías mecánicas de transporte externo o accidentes derivados de la conducta de tales operadores.`
  },
  {
    heading: "CLÁUSULA 7. POLÍTICA DE TARIFAS, MONEDA Y COMPONENTES EXCLUIDOS",
    content: `Divisa e Impuestos: Las cantidades plasmadas en nuestro sitio o cotizaciones oficiales se cotizan en Pesos Mexicanos (MXN) e integran el Impuesto al Valor Agregado (IVA), de acuerdo con la normatividad tributaria vigente.
Exclusiones: Salvo precisión textual en contrario, las tarifas cubren de forma estricta los conceptos señalados en la propuesta formal. Quedan excluidos gastos personales, traslados foráneos no convenidos, pasajes aéreos, consumos libres en restaurantes, gratificaciones/propinas, seguros suplementarios de gastos médicos y cuotas locales o derechos ambientales cobrados directamente en sitio.
Vigencia de Presupuestos: Las cotizaciones emitidas poseen vigencia perentoria sujeta a la fluctuación de disponibilidades; cualquier modificación en el itinerario inicial faculta a HORIZONTRIP para formular un recálculo presupuestal.`
  },
  {
    heading: "CLÁUSULA 8. PASARELAS TRANSACCIONALES Y VALIDACIÓN DE COMPRA",
    content: `Los cobros en línea se canalizan por pasarelas de procesamiento seguras que utilizan cifrado de datos. Toda solicitud de servicio queda condicionada a la recepción efectiva de los fondos y a la validación de autenticidad bancaria.
HORIZONTRIP se reserva la potestad de pausar, anular o retener cualquier transacción sospechosa de suplantación, alteración en el valor ofertado por fallas del sistema o inconsistencias operativas evidentes, tramitándose en su caso la aclaración o el reintegro respectivo conforme al derecho aplicable.`
  },
  {
    heading: "CLÁUSULA 9. SUMINISTRO DE ENTREGABLES DIGITALES",
    content: `Los documentos derivados de la consultoría (guías dinámicas, manuales de ruta, mapas e itinerarios estructurados) serán transferidos al cliente mediante formatos electrónicos descargables, envíos de correo o mensajería digital autorizada.
El plazo computará de manera formal a partir del día hábil siguiente a aquel en que HORIZONTRIP haya recibido de forma completa el pago y la información/cuestionario logístico indispensable para su estructuración.`
  },
  {
    heading: "CLÁUSULA 10. POLÍTICA DE AJUSTES Y REESTRUCTURACIÓN DEL ITINERARIO",
    content: `En caso de que el cliente requiera cambios en las fechas base, reubicación de destinos, incremento de comitiva o replanteamiento temático del viaje tras haberse iniciado la ejecución técnica del entregable:
Ajustes Menores: Modificaciones de horarios o reacomodo de paradas sin variación de destino podrán ser atendidas conforme a la cortesía operativa estipulada en el paquete.
Ajustes Sustanciales: Cambios de plaza, rediseño total de logística o replanteamiento integral de la experiencia causarán honorarios complementarios o la cotización de un servicio independiente.`
  },
  {
    heading: "CLÁUSULA 11. DISPONIBILIDAD CONDICIONADA DE RESERVACIONES",
    content: `La mención de un hotel, experiencia, recorrido o vehículo en una propuesta no genera reserva de cupo ni congelamiento de costo hasta que se ejecute la instrucción de compra y se cuente con la confirmación expresa del operador. Costos derivados de tarifas dinámicas ajenas a HORIZONTRIP correrán por cuenta del contratante.`
  },
  {
    heading: "CLÁUSULA 12. RESPONSABILIDAD PERSONAL, PERMISOS Y DOCUMENTACIÓN",
    content: `Es responsabilidad única y directa de cada persona participante:
Contar con identificaciones oficiales vigentes (INE, pasaporte, credenciales aplicables).
Acreditar que su perfil físico, estado de salud y edad son adecuados para la exigencia de las dinámicas en las que decida participar.
Cumplir con los horarios pactados de inicio y partida; el abandono voluntario o el retraso en puntos de encuentro no dará derecho a reembolso ni reprogramación forzosa.`
  },
  {
    heading: "CLÁUSULA 13. RIESGOS INHERENTES, CONDICIONES MÉDICAS Y ACTIVIDADES AL AIRE LIBRE",
    content: `Determinadas experiencias turísticas involucran actividades en entornos silvestres (senderismo, descensos, exploración acuática, dinámicas termales o de temazcal). El cliente asume y comprende que dichas dinámicas acarrean factores de riesgo asociados a topografía irregular, variaciones climáticas, fauna y fatiga física.
Es deber ineludible del contratante notificar cualquier condición de salud preexistente (cardiopatías, embarazo, alergias graves o impedimentos motrices). HORIZONTRIP y los guías en sitio conservan la facultad de restringir el acceso a actividades que representen un peligro latente para la integridad del usuario o del colectivo.`
  },
  {
    heading: "CLÁUSULA 14. NORMAS DE CONVIVENCIA Y DERECHO DE EXCLUSIÓN",
    content: `El usuario y sus acompañantes deberán conducirse en todo momento con estricto respeto hacia los ecosistemas, centros ceremoniales, comunidades anfitrionas, guías y demás integrantes del viaje.
Cualquier conducta que constituya violencia física o verbal, hostigamiento, desacato a directrices de seguridad, consumo desmedido de sustancias o daños deliberados al patrimonio biocultural conllevará la rescisión inmediata del servicio y el desalojo de la actividad, sin derecho a indemnización ni compensación económica.`
  },
  {
    heading: "CLÁUSULA 15. CIRCUNSTANCIAS DE CASO FORTUITO O FUERZA MAYOR",
    content: `HORIZONTRIP no responderá contractualmente por cancelaciones, retrasos o reestructuraciones forzadas que provengan de eventos imprevisibles o inevitables, tales como fenómenos climáticos severos, desastres de la naturaleza, cierres carreteros, protestas sociales, contingencias epidemiológicas o mandatos de autoridades civiles o militares.
Frente a tales hechos, HORIZONTRIP desplegará sus mejores esfuerzos para auxiliar al viajero en la gestión de alternativas de fechas, notas de crédito o ajustes viables ante los operadores involucrados.`
  },
  {
    heading: "CLÁUSULA 16. DERECHOS DE PROPIEDAD INTELECTUAL",
    content: `El diseño editorial, metodologías de viaje, logotipos, redacciones descriptivas, esquemas gráficos y materiales digitales creados por GOWAYS, S.A. DE C.V. (HORIZONTRIP) constituyen propiedad intelectual protegida por las leyes mexicanas e internacionales en la materia.
La entrega del servicio otorga al cliente una licencia limitada, revocable y para uso personal no lucrativo. Queda expresamente prohibida la copia parcial o total, distribución comercial, impartición como guía propia o sublicenciamiento de nuestros materiales.`
  },
  {
    heading: "CLÁUSULA 17. BENEFICIOS PROMOCIONALES",
    content: `Cualquier código de descuento o campaña promocional estará normada por la vigencia y topes señalados en sus publicaciones específicas. Las promociones no son acumulables salvo pacto en contrario y pierden validez fuera de los plazos temporales estipulados.`
  },
  {
    heading: "CLÁUSULA 18. MEDIOS OFICIALES DE COMUNICACIÓN",
    content: `El usuario valida el uso de correos electrónicos, llamadas telefónicas y aplicaciones de mensajería instantánea proporcionadas en sus formularios como vías formales para el intercambio de información técnica, aclaración de requerimientos, transferencias de archivos y confirmaciones operativas.`
  },
  {
    heading: "CLÁUSULA 19. TECHO FINANCIERO DE RESPONSABILIDAD",
    content: `En la medida máxima permitida por la legislación protectora del consumidor en México, la responsabilidad total imputable a GOWAYS, S.A. DE C.V. ante cualquier controversia civil, mercantil o de consumo se topará estrictamente a la cantidad neta que el cliente haya sufragado de manera efectiva a HORIZONTRIP por el servicio específico cuestionado.
Queda excluida cualquier reclamación por lucro cesante, daño moral, pérdidas indirectas, frustración de expectativas subjetivas o gastos extras asumidos voluntariamente por el usuario.`
  },
  {
    heading: "CLÁUSULA 20. SUSPENSIÓN Y RESCISIÓN UNILATERAL DEL SERVICIO",
    content: `HORIZONTRIP se reserva el derecho de concluir o denegar la prestación de un servicio si se descubre que el usuario aportó documentación falsa, intentó maniobras fraudulentas, vulneró la seguridad de nuestros sistemas o incurrió en actitudes hostiles contra nuestro personal, sin perjuicio de las acciones legales que pudieren corresponder.`
  },
  {
    heading: "CLÁUSULA 21. SALVAGUARDA DE DATOS PERSONALES",
    content: `El tratamiento, flujo y archivo de la información recabada se rige bajo los principios de licitud y seguridad plasmados en nuestro Aviso de Privacidad Integral, el cual puede consultarse permanentemente en nuestras plataformas digitales.`
  },
  {
    heading: "CLÁUSULA 22. PRESERVACIÓN CONTRACTUAL (SEPARABILIDAD)",
    content: `La declaratoria judicial de nulidad, invalidez o ineficacia de alguna disposición de estos Términos no contaminará ni invalidará las restantes cláusulas, las cuales permanecerán operativas y vinculantes en sus términos originales.`
  },
  {
    heading: "CLÁUSULA 23. ACTUALIZACIÓN DEL INSTRUMENTO",
    content: `HORIZONTRIP mantiene la atribución de realizar enmiendas, adecuaciones y modernizaciones al texto del presente documento. Las renovaciones cobrarán vigencia inmediata al ser publicadas en nuestros canales electrónicos, considerándose plenamente conocidas para cualquier contratación formalizada con posterioridad a dicha publicación.`
  },
  {
    heading: "CLÁUSULA 24. LEGISLACIÓN APLICABLE Y TRIBUNALES COMPETENTES",
    content: `Para la interpretación, desahogo, mediación o litigio concerniente al cumplimiento de estos Términos y Condiciones, las partes pactan expresamente someterse al marco normativo federal de los Estados Unidos Mexicanos y a la jurisdicción de los Tribunales Judiciales correspondientes en la Ciudad de México, renunciando de forma expresa a cualquier fuero que pudiere corresponderles en atención a sus domicilios presentes o futuros.`
  }
];

export default function TerminosYCondiciones() {
  return <LegalPage title="TÉRMINOS Y CONDICIONES GENERALES DE CONTRATACIÓN Y USO" sections={sections} />;
}
