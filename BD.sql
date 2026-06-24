-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================================
-- 1. LIMPIEZA PREVIA 
-- =====================================================================================
DROP TABLE IF EXISTS public.booking_items_horizon CASCADE;
DROP TABLE IF EXISTS public.cart_items_horizon CASCADE;
DROP TABLE IF EXISTS public.bookings_horizon CASCADE;
DROP TABLE IF EXISTS public.activity_packages_horizon CASCADE;
DROP TABLE IF EXISTS public.activities_horizon CASCADE;
DROP TABLE IF EXISTS public.categories_horizon CASCADE;
DROP TABLE IF EXISTS public.customers_horizon CASCADE;
DROP TABLE IF EXISTS public.contact_messages_horizon CASCADE;
DROP TABLE IF EXISTS public.custom_quotes_horizon CASCADE;
DROP TABLE IF EXISTS public.fifa_experiences_horizon CASCADE;

-- =====================================================================================
-- 2. CREACIÓN DE TABLAS REDEFINIDAS
-- =====================================================================================

CREATE TABLE public.categories_horizon (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE
);

-- Nueva estructura basada en tu JSON de Rutas y Experiencias
CREATE TABLE public.activities_horizon (
  id SERIAL PRIMARY KEY,
  slug VARCHAR NOT NULL UNIQUE, -- Mapeado del 'id' del JSON
  title VARCHAR NOT NULL,
  plan_type VARCHAR NOT NULL, -- Ej: PLAN, EXPERIENCIA, PERSONALIZADA
  destination VARCHAR NOT NULL,
  price NUMERIC NOT NULL,
  currency VARCHAR DEFAULT 'MXN',
  tax_included BOOLEAN DEFAULT true,
  description TEXT,
  suggested_route JSONB DEFAULT '[]'::jsonb, -- Array de rutas
  included JSONB DEFAULT '[]'::jsonb, -- Array de que_incluye
  logistics JSONB DEFAULT '{}'::jsonb, -- Objeto logistica_y_disponibilidad
  category_id INTEGER REFERENCES public.categories_horizon(id),
  images JSONB DEFAULT '[]'::jsonb, -- Para el UI del Frontend
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.customers_horizon (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  phone VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.custom_quotes_horizon (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  phone VARCHAR,
  destination VARCHAR,
  pax_qty INTEGER,
  budget VARCHAR,
  special_requests TEXT,
  start_date DATE,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.contact_messages_horizon (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR,
  phone VARCHAR,
  email VARCHAR,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.cart_items_horizon (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR NOT NULL,
  activity_id INTEGER REFERENCES public.activities_horizon(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  pax_qty INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bookings_horizon (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers_horizon(id),
  session_id VARCHAR, 
  total_amount NUMERIC NOT NULL,
  payment_status VARCHAR DEFAULT 'pending',
  transaction_id VARCHAR,
  payment_provider VARCHAR,
  payment_date TIMESTAMPTZ,
  pais VARCHAR,
  direccion TEXT,
  localidad VARCHAR,
  estado VARCHAR,
  codigo_postal VARCHAR,
  order_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.booking_items_horizon (
  id SERIAL PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings_horizon(id),
  activity_id INTEGER REFERENCES public.activities_horizon(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  pax_qty INTEGER DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  custom_destination VARCHAR
);

CREATE TABLE public.fifa_experiences_horizon (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  subtitle VARCHAR,
  description TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  order_index INTEGER DEFAULT 0
);

-- =====================================================================================
-- 3. POLÍTICAS DE SEGURIDAD RLS
-- =====================================================================================
ALTER TABLE public.categories_horizon ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities_horizon ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fifa_experiences_horizon ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers_horizon ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings_horizon ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items_horizon ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_quotes_horizon ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública catálogos" ON public.categories_horizon FOR SELECT USING (true);
CREATE POLICY "Lectura pública actividades" ON public.activities_horizon FOR SELECT USING (true);
CREATE POLICY "Lectura pública fifa" ON public.fifa_experiences_horizon FOR SELECT USING (true);
CREATE POLICY "Acceso total a clientes en checkout" ON public.customers_horizon FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a reservas en checkout" ON public.bookings_horizon FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a items de reserva" ON public.booking_items_horizon FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir inserción anónima cotizaciones" ON public.custom_quotes_horizon FOR INSERT WITH CHECK (true);

-- =====================================================================================
-- 4. INSERTAR CATEGORÍAS BASE
-- =====================================================================================
INSERT INTO public.categories_horizon (name, slug) VALUES 
('Planes', 'plan'),
('Experiencias', 'experiencia'),
('Rutas Personalizadas', 'personalizada');

-- =====================================================================================
-- 5. MIGRACIÓN DEL CONTENIDO JSON
-- =====================================================================================

INSERT INTO public.activities_horizon (slug, title, plan_type, destination, price, currency, tax_included, description, suggested_route, included, logistics, category_id, images) VALUES

-- BLOQUE 1: CIUDAD DE MÉXICO Y CENTRO
('street-bites-centro-historico', 'Street Bites Centro Histórico', 'PLAN', 'Ciudad de México', 590.00, 'MXN', true, 'Explora la esencia de la comida callejera en el corazón de la ciudad mediante un recorrido por zonas icónicas del Centro Histórico, donde se concentran algunos de los sabores más tradicionales de México.', 
'["Centro Histórico de la CDMX", "Tacuba, Bolívar y Regina", "Mercado de San Juan"]'::jsonb, 
'["Recorrido guiado", "3 a 4 degustaciones", "1 bebida tradicional", "Explicación cultural básica"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos adicionales", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/12665188/pexels-photo-12665188.jpeg"]'::jsonb),

('sabores-de-coyoacan', 'Sabores de Coyoacán', 'PLAN', 'Ciudad de México', 790.00, 'MXN', true, 'Un recorrido gastronómico en uno de los barrios más emblemáticos de la ciudad, combinando tradición, historia y antojitos mexicanos en un ambiente cultural único.', 
'["Centro de Coyoacán", "Jardín Centenario", "Mercado de Coyoacán"]'::jsonb, 
'[" 4 a 5 degustaciones típicas", "Bebida tradicional o café", "Guía local", "Experiencia cultural"]'::jsonb, 
'{"duracion_estimada": " 3 a 4 horas", "no_incluye": ["transporte", "consumos adicionales", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg"]'::jsonb),

('roma-condesa', 'Roma-Condesa Food Walk', 'PLAN', 'Ciudad de México', 1150.00, 'MXN', true, 'Descubre la fusión entre gastronomía tradicional y contemporánea en una de las zonas más trendy de la ciudad, ideal para amantes de la comida gourmet accesible.', 
'["Colonia Roma", "Condesa", "Paradas en spots gastronómicos seleccionados"]'::jsonb, 
'[" 5 a 6 degustaciones", "Bebidas seleccionadas", "Guía especializado", "Explicación gastronómica"]'::jsonb, 
'{"duracion_estimada": "4 horas", "no_incluye": ["transporte", "bebidas premium", "propinas"]}'::jsonb, 1,
'["https://images.unsplash.com/photo-1698854632975-7e7d37ecac69?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb),

('polanco-gourmet', 'Polanco Gourmet Experience', 'PLAN', 'Ciudad de México', 2250.00, 'MXN', true, 'Experiencia gastronómica de nivel alto en una de las zonas más exclusivas de la ciudad, combinando restaurantes reconocidos y propuestas culinarias contemporáneas.', 
'["Polanco", "Restaurantes seleccionados", "Zonas gourmet"]'::jsonb, 
'[" 6 a 8 degustaciones", "Vino o mixología básica", "Guía experto", "Reservaciones incluidas"]'::jsonb, 
'{"duracion_estimada": "5 horas", "no_incluye": ["transporte", "consumos premium", "adicionales", "propinas"]}'::jsonb, 1,
'["https://images.unsplash.com/photo-1567024052466-f9166c92537a?q=80&w=1038&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb),

-- CORRECCIÓN DEL SLUG DUPLICADO: Se cambió de 'sabores-nocturnos' a 'sabores-nocturnos-cdmx'
('sabores-nocturnos-cdmx', 'Sabores Nocturnos CDMX', 'PLAN', 'Ciudad de México', 1850.00, 'MXN', true, 'Recorrido nocturno por la escena gastronómica de la ciudad, combinando tacos, antojitos y bebidas en un ambiente vibrante y auténtico.', 
'["Zona rosa", "Colonia Juárez", "Taquerías y spots nocturnos"]'::jsonb, 
'[" 4 a 6 degustaciones", "Bebidas seleccionadas", "Guía", "Explicación nocturna"]'::jsonb, 
'{"duracion_estimada": "4 horas", "no_incluye": ["transporte", "bebidas premium", "propinas"]}'::jsonb, 1,
'["https://plus.unsplash.com/premium_photo-1661780097425-171c59ab2b09?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dGFxdWVyaWFzfGVufDB8fDB8fHww"]'::jsonb),

('experiencia-tradicional-xochimilco', 'Experiencia Tradicional Xochimilco', 'PLAN', 'Ciudad de México', 1650.00, 'MXN', true, 'Una experiencia única que combina gastronomía tradicional con un recorrido cultural en trajinera, ideal para quienes buscan algo diferente y representativo de México..', 
'["Xochimilco", "Embarcaderos tradicionales", "Recorrido en trajinera"]'::jsonb, 
'["Paseo en trajinera compartida", "Alimentos típicos", "Bebidas tradicionales", "Coordinación del recorrido"]'::jsonb, 
'{"duracion_estimada": "4 a 5 horas", "no_incluye": ["transporte al embarcadero", "consumos adicionales","propinas"]}'::jsonb, 1,
'["https://images.unsplash.com/photo-1564762332974-5bf63a654c9d?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb),

('chef-experience-privado', 'Chef Experience Privado', 'PLAN', 'Ciudad de México', 3500.00, 'MXN', true, 'Experiencia culinaria privada con enfoque personalizado, ideal para clientes que buscan exclusividad y atención dedicada.', 
'["Polanco, Roma o domicilio privado", "Ubicación personalizada dentro de la ciudad"]'::jsonb, 
'["Chef o guía especializado", "Menú de degustación completo", "Bebidas incluidas", "Experiencia privada"]'::jsonb, 
'{"duracion_estimada": "5 a 6 horas", "no_incluye": ["transporte", "Transporte opcional con costo adicional"]}'::jsonb, 1,
'["https://images.pexels.com/photos/323682/pexels-photo-323682.jpeg"]'::jsonb),

-- BLOQUE 2: QUERÉTARO Y BAJÍO
('sabores-urbanos-centro-historico-queretaro', 'Sabores Urbanos Centro Histórico Querétaro', 'PLAN', 'Querétaro', 890.00, 'MXN', true, 'Explora la riqueza gastronómica de Querétaro a través de un recorrido por su Centro Histórico, combinando tradición, cultura y sabores locales en un entorno colonial.', 
'["Centro Histórico", "Mercado La Cruz", "Plazas principales y andadores"]'::jsonb, 
'["4 a 6 degustaciones", "1 bebida tradicional", "Explicación cultural y gastronómica", "Coordinación del tour"]'::jsonb, 
'{"duracion_estimada": "3 a 4 horas", "no_incluye": ["transporte", "compras personales", "propinas"]}'::jsonb, 1,
'["https://images.unsplash.com/photo-1636300958042-64356873ffcc?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cXVlcmV0YXJvfGVufDB8fDB8fHww"]'::jsonb),

('sabores-de-barrio-queretaro', 'Sabores de Barrio Querétaro', 'PLAN', 'Querétaro', 890.00, 'MXN', true, 'Una experiencia enfocada en la gastronomía más auténtica de barrio, donde se descubren sabores tradicionales en mercados y calles locales.', 
'["Barrio de la Cruz", "Mercado La Cruz", "Calles con oferta local"]'::jsonb, 
'["4 a 6 degustaciones", "Bebida tradicional", "Guía local", "Experiencia cultural"]'::jsonb, 
'{"duracion_estimada": "3 a 4 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNvbWlkYSUyMG1leGljYW5hfGVufDB8fDB8fHww"]'::jsonb),

('ruta-gastronomica-tradicional-queretaro', 'Ruta Gastronómica Tradicional Querétaro', 'PLAN', 'Querétaro', 950.00, 'MXN', true, 'Recorrido diseñado para conocer los platillos más representativos del estado, combinando historia, tradición y cocina local.', 
'["Centro Histórico de Querétaro", "Mercados y fondas tradicionales", "Plazas y corredores turísticos"]'::jsonb, 
'["5 a 6 degustaciones", "Bebida tradicional", "Guía cultural", "Explicación histórica"]'::jsonb, 
'{"duracion_estimada": "4 horas", "no_incluye": ["transporte", "bebidas premium", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/1639556/pexels-photo-1639556.jpeg"]'::jsonb),

('sabores-nocturnos-queretaro', 'Sabores Nocturnos Querétaro', 'PLAN', 'Querétaro', 1150.00, 'MXN', true, 'Descubre la gastronomía local en un ambiente nocturno, recorriendo zonas con vida social activa y propuestas culinarias tradicionales y contemporáneas.', 
'["Centro Histórico de Querétaro", "Corredores nocturnos", "Restaurantes y antojitos locales"]'::jsonb, 
'["4 a 6 degustaciones", "Bebida incluida", "Guía local", "Experiencia nocturna"]'::jsonb, 
'{"duracion_estimada": "3 a 4 hours", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/32550364/pexels-photo-32550364.png"]'::jsonb),

('sabores-premium-queretaro', 'Sabores Premium Querétaro', 'PLAN', 'Querétaro', 1350.00, 'MXN', true, 'Una experiencia completa que combina gastronomía tradicional con propuestas más elaboradas en el centro.', 
'["Centro de Querétaro", "Espacios gastronómicos seleccionados"]'::jsonb, 
'["Recorrido guiado premium", "Degustaciones elaboradas", "Bebidas seleccionadas", "Contexto culinario"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg"]'::jsonb),

-- BLOQUE 3: GUANAJUATO
('foodie-explorer-centro-historico-guanajuato', 'Foodie Explorer Centro Histórico Guanajuato', 'PLAN', 'Guanajuato', 1200.00, 'MXN', true, 'Sumérgete en la riqueza gastronómica de Guanajuato a través de un recorrido por sus calles más emblemáticas, combinando historia, cultura y una amplia variedad de sabores tradicionales.', 
'["Centro Histórico", "Mercado Hidalgo", "Teatro Juárez y callejones"]'::jsonb, 
'["5 a 7 degustaciones", "Bebida tradicional", "Explicación cultural", "Grupo reducido"]'::jsonb, 
'{"duracion_estimada": "4 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/28594596/pexels-photo-28594596.jpeg"]'::jsonb),

('sabores-y-callejones-guanajuato', 'Sabores y Callejones Guanajuato', 'PLAN', 'Guanajuato', 1200.00, 'MXN', true, 'Una experiencia que mezcla la gastronomía local con el encanto de los callejones más representativos de la ciudad, ideal para quienes buscan una vivencia cultural completa.', 
'["Callejón del Beso", "Centro Histórico", "Mercados y puestos tradicionales"]'::jsonb, 
'["5 a 6 degustaciones", "Bebida típica", "Guía local", "Experiencia cultural"]'::jsonb, 
'{"duracion_estimada": "4 horas", "no_incluye": ["transporte", "consumos adicionales", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/32646477/pexels-photo-32646477.jpeg"]'::jsonb),

('foodie-cultural-experience-guanajuato', 'Foodie Cultural Experience', 'PLAN', 'Guanajuato', 1350.00, 'MXN', true, 'Enfocado en la historia y evolución de la gastronomía guanajuatense con contexto cultural.', 
'["Centro Histórico", "Puntos de valor gastronómico"]'::jsonb, 
'["Recorrido especializado", "Degustaciones tradicionales", "1 bebida tradicional", "Evolución culinaria"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/28594596/pexels-photo-28594596.jpeg"]'::jsonb),

('foodie-nocturno-guanajuato', 'Foodie Nocturno Guanajuato', 'PLAN', 'Guanajuato', 1450.00, 'MXN', true, 'Disfruta la gastronomía local en un ambiente nocturno recorriendo zonas con gran actividad cultural y culinaria.', 
'["Centro Histórico de Guanajuato", "Plazas, callejones y restaurantes nocturnos"]'::jsonb, 
'["5 a 6 degustaciones", "Bebida incluida", "Guía", "Experiencia nocturna"]'::jsonb, 
'{"duracion_estimada": "4 horas", "no_incluye": ["transporte", "bebidas premium", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/16229310/pexels-photo-16229310.jpeg"]'::jsonb),

('foodie-explorer-premium-guanajuato', 'Foodie Explorer Premium Guanajuato', 'PLAN', 'Guanajuato', 1650.00, 'MXN', true, 'Una versión más completa del recorrido gastronómico, con degustaciones más elaboradas y atención personalizada en locaciones seleccionadas.', 
'["Centro Histórico de Guanajuato", "Restaurantes y spots gastronómicos destacados"]'::jsonb, 
'["6 a 7 degustaciones premium", "Bebidas seleccionadas", "Guía especializado", "Grupo reducido"]'::jsonb, 
'{"duracion_estimada": "4 a 5 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/30495530/pexels-photo-30495530.jpeg"]'::jsonb),

-- BLOQUE 4: CARIBE MEXICANO
('tacos-experience-cancun', 'Tacos Experience Cancún', 'PLAN', 'Cancún', 1450.00, 'MXN', true, 'Descubre la escena gastronómica de Cancún a través de un recorrido especializado en tacos, combinando sabores tradicionales y propuestas contemporáneas.', 
'["Centro de Cancún", "Parque de las Palapas", "Taquerías y spots seleccionados"]'::jsonb, 
'["3 a 5 locaciones gastronómicas", "Degustación de tacos gourmet y tradicionales", "Guía experto", "Experiencia cultural"]'::jsonb, 
'{"duracion_estimada": "3 a 5 horas", "no_incluye": ["transporte", "bebidas adicionales", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/9258707/pexels-photo-9258707.jpeg"]'::jsonb),

('tacos-playa-del-carmen', 'Tacos Playa del Carmen', 'PLAN', 'Playa del Carmen', 1550.00, 'MXN', true, 'Explora la mezcla de gastronomía local e internacional en Playa del Carmen, con un enfoque en tacos de autor.', 
'["Quinta Avenida","Zonas gastronómicas", "Taquerías contemporáneas y locales"]'::jsonb, 
'["3 a 5 paradas gastronómicas", "Degustaciones de tacos", "Guía especializado"]'::jsonb, 
'{"duracion_estimada": "3 a 5 horas", "no_incluye": ["transporte", "bebidas premium", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg"]'::jsonb),

('tacos-drinks-experience-tulum', 'Tacos Drinks Experience Tulum', 'PLAN', 'Tulum', 1650.00, 'MXN', true, 'Vive una experiencia gastronómica única en Tulum, combinando tacos de estilo artesanal en un ambiente bohemio y sofisticado.', 
'["Tulum Centro", "Zona gastronómica", "Restaurantes y taquerías seleccionadas" ]'::jsonb, 
'["3 a 5 paradas", "Degustación de tacos gourmet", "Guía experto"]'::jsonb, 
'{"duracion_estimada": "3 a 5 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/16407624/pexels-photo-16407624.jpeg"]'::jsonb),

('tacos-premium-riviera-maya', 'Tacos Premium Riviera Maya', 'PLAN', 'Riviera Maya', 1950.00, 'MXN', true, 'Una experiencia más exclusiva que combina lo mejor de la gastronomía regional con propuestas gourmet en diferentes puntos de la Riviera Maya.', 
'["Riviera Maya", "Restaurantes y spots seleccionados", "Zonas gastronómicas destacadas" ]'::jsonb, 
'[" 4 a 6 degustaciones", "Guía especializado", "Atención personalizada"]'::jsonb, 
'{"duracion_estimada": "4 a 5 horas", "no_incluye": ["transporte opcional con costo adicional"]}'::jsonb, 1,
'["https://images.pexels.com/photos/16821506/pexels-photo-16821506.jpeg"]'::jsonb),

('tacos-nocturno-cancun', 'Tacos Nocturno Cancún', 'PLAN', 'Cancún', 1750.00, 'MXN', true, 'Recorrido nocturno por la escena gastronómica de Cancún.', 
'["Zona Hotelera de Cancún", "Centro y zonas nocturnas", "Taquerías y bares locales"]'::jsonb, 
'["3 a 5 paradas", "Degustación de tacos", "Bebidas", "Guía"]'::jsonb, 
'{"duracion_estimada": "4 horas", "no_incluye": ["transporte", "bebidas premium", "propinas"]}'::jsonb, 1,
'["https://www.pexels.com/es-es/foto/letrero-de-neon-rojo-que-brilla-al-aire-libre-por-la-noche-23319080/"]'::jsonb),

-- BLOQUE 5: EXPERIENCIAS HIGH END (Categoría 2)
('explorer-riviera', 'Explorer Riviera', 'EXPERIENCIA', 'Riviera Maya', 5500.00, 'MXN', true, 'Paquete base con tour gastronómico, visita a Tulum, playa y coordinación de actividades.', 
'["Cancún o Playa del Carmen", "Tulum", "Tiempo libre en playa"]'::jsonb, 
'["Tour gastronómico tipo tacos", "Visita a Tulum", "Coordinación de actividades", "Guía en experiencias seleccionadas"]'::jsonb, 
'{"duracion_estimada": "Día completo", "no_incluye": ["Vuelos", "Hospedaje", "Transporte"]}'::jsonb, 2,
'["https://www.pexels.com/es-es/foto/playa-tulum-con-palmeras-y-aguas-turquesas-31688473/"]'::jsonb),

('adventure-flavors', 'Adventure & Flavors', 'EXPERIENCIA', 'Riviera Maya', 7800.00, 'MXN', true, 'Escapada con tour gastronómico premium, cenote y actividad acuática.', 
'["Playa del Carmen", "Cenote con entrada incluida", "Actividad acuática"]'::jsonb, 
'["Tour gastronómico premium", "Excursión a cenote", "Snorkel o similar", "Coordinación completa"]'::jsonb, 
'{"duracion_estimada": "Día completo", "no_incluye": ["Vuelos", "Bebidas premium", "Propinas"]}'::jsonb, 2,
'["https://images.unsplash.com/photo-1719941463960-f3310fe64e46?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb),

('romantic-escape-riviera', 'Romantic Escape Riviera', 'EXPERIENCIA', 'Riviera Maya', 9500.00, 'MXN', true, 'Plan romántico con picnic o cena privada en playa, tour gastronómico y visita a Tulum.', 
'["Riviera Maya", "Tulum", "Locación romántica en playa"]'::jsonb, 
'["Experiencia romántica", "Ambientación especial", "Tour gastronómico", "Coordinación personalizada"]'::jsonb, 
'{"duracion_estimada": "Día completo", "no_incluye": ["Hospedaje", "Fotografía profesional", "Transporte privado"]}'::jsonb, 2,
'["https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg"]'::jsonb),

('luxury-riviera-experience', 'Luxury Riviera Experience', 'EXPERIENCIA', 'Riviera Maya', 14500.00, 'MXN', true, 'Propuesta premium con cenote privado, cena exclusiva, beach club y transporte.', 
'["Riviera Maya", "Cenote privado", "Beach Club y locaciones exclusivas"]'::jsonb, 
'["Tour gastronómico premium", "Experiencia privada en cenote", "Cena o experiencia exclusiva", "Transporte privado"]'::jsonb, 
'{"duracion_estimada": "Día completo VIP", "no_incluye": ["Vuelos", "Servicios no especificados","Propinas"]}'::jsonb, 2,
'["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg"]'::jsonb),

('ultimate-riviera-todo-incluido-experiencial', 'Ultimate Riviera  (Todo Incluido Experiencial)', 'EXPERIENCIA', 'Riviera Maya', 22000.00, 'MXN', true, 'Todo incluido experiencial con concierge y acceso a múltiples destinos del Caribe Mexicano.', 
'["Cancún", "Playa del Carmen", "Tulum"]'::jsonb, 
'["Tours gastronómicos principales", "Experiencia romántica premium", "Transporte privado completo", "Concierge personalizado"]'::jsonb, 
'{"duracion_estimada": "Día completo extendida", "no_incluye": ["Vuelos internacionales", "Servicios de lujo adicionales no solicitados"]}'::jsonb, 2,
'["https://www.pexels.com/es-es/foto/casa-de-madera-marron-en-la-playa-3822155/"]'::jsonb),

-- BLOQUE 6: RUTAS PERSONALIZADAS (Categoría 3)
('ruta-gourmet-local', 'Ruta Gourmet Local', 'PERSONALIZADA', 'Dentro de México por definir', 1750.00, 'MXN', true, 'Plan adaptable con degustaciones completas, restaurantes y street food.', 
'["Locaciones adaptables"]'::jsonb, 
'["5 horas aproximadas", "6 a 8 degustaciones", "Experiencia cultural", "Destino elegido por el cliente"]'::jsonb, 
'{"duracion_estimada": "5 horas", "no_incluye": ["El cliente debe indicar el destino deseado, la fecha y el número de personas al reservar."]}'::jsonb, 3,
'["https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg"]'::jsonb),

('tradicion-cultura', 'Tradición & Cultura', 'PERSONALIZADA', 'Dentro de México por definir', 1990.00, 'MXN', true, 'Experiencia con enfoque histórico, platillos tradicionales y visitas a mercados.', 
'["Platillos tradicionales y visitas a mercados o cantinas"]'::jsonb, 
'["Enfoque histórico", "Guía especializado", "Destino elegido por el cliente"]'::jsonb, 
'{"duracion_estimada": "5 horas", "no_incluye": ["El cliente debe indicar el destino deseado, la fecha y el número de personas al reservar."]}'::jsonb, 3,
'["https://images.pexels.com/photos/331107/pexels-photo-331107.jpeg"]'::jsonb),

('experiencia-premium-food-tour', 'Experiencia Premium Food Tour', 'PERSONALIZADA', 'Dentro de México por definir', 2450.00, 'MXN', true, 'Diseño premium con restaurantes seleccionados, bebidas premium y grupos pequeños.', 
'["Restaurantes seleccionados"]'::jsonb, 
'["Degustación gourmet", "Bebidas premium", "Atención personalizada"]'::jsonb, 
'{"duracion_estimada": "5 a 6 horas", "no_incluye": ["El cliente debe indicar el destino deseado, la fecha y el número de personas al reservar."]}'::jsonb, 3,
'["https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"]'::jsonb),

('sabores-nocturnos', 'Sabores Nocturnos', 'PERSONALIZADA', 'Dentro de México por definir', 2650.00, 'MXN', true, 'Recorrido gastronómico nocturno adaptable al destino con vida cultural local.', 
'["Restaurantes seleccionados"]'::jsonb, 
'["Ambiente nocturno", "Tacos y bebidas", "Guía experto"]'::jsonb, 
'{"duracion_estimada": "4 horas", "no_incluye": ["El cliente debe indicar el destino deseado, la fecha y el número de personas al reservar."]}'::jsonb, 3,
'["https://images.pexels.com/photos/1055058/pexels-photo-1055058.jpeg"]'::jsonb),

('luxury-culinary-experience', 'Luxury Culinary Experience', 'PERSONALIZADA', 'Dentro de México por definir', 3200.00, 'MXN', true, 'Experiencia culinaria de alto nivel con maridaje y servicio personalizado.', 
'["Establecimientos exclusivos"]'::jsonb, 
'["Maridaje con vino o mixología", "Restaurantes premium", "Servicio personalizado"]'::jsonb, 
'{"duracion_estimada": "6 horas", "no_incluye": ["El cliente debe indicar el destino deseado, la fecha y el número de personas al reservar."]}'::jsonb, 3,
'["https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg"]'::jsonb),

('master-food-experience-privado', 'Master Food Experience (Privado)', 'PERSONALIZADA', 'Dentro de México por definir', 3900.00, 'MXN', true, 'Tour privado con chef o guía especializado y posibilidad de interacción gastronómica extendida.', 
'["Itinerario premium privado"]'::jsonb, 
'["Tour privado personalizado", "Degustación extendida", "Transporte opcional"]'::jsonb, 
'{"duracion_estimada": "6 a 8 horas", "no_incluye": ["Transporte", "Consumos extra", "Propinas"]}'::jsonb, 3,
'["https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg"]'::jsonb);

-- =====================================================================================
-- INSERTAR DETALLES MUNDIAL (FIFA)
-- =====================================================================================
INSERT INTO public.fifa_experiences_horizon (title, subtitle, description, items, image_url, order_index) VALUES

('Estadios y Museos', 'Recorridos Históricos', 'Visitas guiadas a los templos del fútbol y acceso a zonas restringidas.', 
'["Visitas guiadas a estadios FIFA y campos históricos", "Acceso a vestidores y zonas VIP (fotos y experiencias interactivas)", "Recorridos por museos de fútbol y exhibiciones temáticas"]'::jsonb, 
'https://images.pexels.com/photos/36356584/pexels-photo-36356584.jpeg', 1),

('Fan Experiences', 'Interacción Total', 'Zonas de realidad virtual y encuentros con leyendas del deporte.', 
'["Clínicas de fútbol y retos de habilidades", "Realidad virtual de partidos históricos", "Meet & greet con leyendas"]'::jsonb, 
'https://images.pexels.com/photos/31160049/pexels-photo-31160049.jpeg', 2),

('Viewing Parties', 'Eventos en Vivo', 'Proyección de partidos en pantallas gigantes con ambiente temático.', 
'["Pantallas gigantes", "Trivia y juegos recreativos", "Catering temático y snacks"]'::jsonb, 
'https://images.pexels.com/photos/38109922/pexels-photo-38109922.jpeg', 3),

('Cultura y Ciudad', 'Recorridos Urbanos', 'Explora el lado futbolero de las sedes mundialistas.', 
'["Street football tours", "Bares deportivos icónicos", "Arte urbano y murales de fútbol"]'::jsonb, 
'https://images.pexels.com/photos/31220288/pexels-photo-31220288.jpeg', 4),

('Experiencias educativas', 'Historia del fútbol y estrategias de juego', 'Descubre más acerca del fútbol y domina la cancha.', 
'["Talleres tácticos", "Trivia con premios", "Historia de los mundiales"]'::jsonb, 
'https://images.pexels.com/photos/36104262/pexels-photo-36104262.jpeg', 5);