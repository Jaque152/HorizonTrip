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
  unit_price NUMERIC NOT NULL
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
('street-bites-centro-historico', 'Street Bites Centro Histórico', 'PLAN', 'Ciudad de México', 590.00, 'MXN', true, 'Explora la esencia de la comida callejera en el corazón de la ciudad mediante un recorrido por zonas icónicas.', 
'["Centro Histórico de la CDMX", "Tacuba, Bolívar y Regina", "Mercado de San Juan"]'::jsonb, 
'["Recorrido guiado", "3 a 4 degustaciones", "1 bebida tradicional", "Explicación cultural básica"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos adicionales", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/12665188/pexels-photo-12665188.jpeg"]'::jsonb),

('sabores-de-coyoacan', 'Sabores de Coyoacán', 'PLAN', 'Ciudad de México', 790.00, 'MXN', true, 'Un recorrido gastronómico en uno de los barrios más emblemáticos de la ciudad, combinando tradición e historia.', 
'["Centro de Coyoacán", "Jardín Centenario", "Mercado de Coyoacán"]'::jsonb, 
'["Recorrido guiado especializado", "3 a 4 degustaciones de antojitos tradicionales", "1 bebida local o tradicional", "Explicación histórica"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos adicionales", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg"]'::jsonb),

('experiencia-tradicional-xochimilco', 'Experiencia Tradicional Xochimilco', 'PLAN', 'Ciudad de México', 1650.00, 'MXN', true, 'Una experiencia única que combina gastronomía tradicional con un recorrido cultural en trajinera.', 
'["Canales de Xochimilco", "Embarcadero tradicional", "Zona de chinampas"]'::jsonb, 
'["Paseo privado o compartido en trajinera", "Degustación de comida típica", "Bebidas tradicionales", "Explicación de chinampas"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte hacia/desde los embarcaderos", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/13813958/pexels-photo-13813958.jpeg"]'::jsonb),

('chef-experience-privado', 'Chef Experience Privado', 'PLAN', 'Ciudad de México', 3500.00, 'MXN', true, 'Experiencia culinaria privada con enfoque personalizado, ideal para clientes que buscan exclusividad.', 
'["Locación privada o restaurante seleccionado en la CDMX"]'::jsonb, 
'["Servicio exclusivo de chef profesional", "Menú de degustación de alta cocina", "Maridaje seleccionado", "Explicación interactiva"]'::jsonb, 
'{"duracion_estimada": "3 a 4 horas", "no_incluye": ["transporte", "platillos adicionales", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/323682/pexels-photo-323682.jpeg"]'::jsonb),

-- BLOQUE 2: QUERÉTARO Y BAJÍO
('sabores-urbanos-centro-historico-queretaro', 'Sabores Urbanos Centro Histórico Querétaro', 'PLAN', 'Querétaro', 890.00, 'MXN', true, 'Explora la riqueza gastronómica de Querétaro a través de un recorrido por su Centro Histórico colonial.', 
'["Centro Histórico", "Plaza de Armas", "Andadores tradicionales"]'::jsonb, 
'["Recorrido guiado peatonal", "3 a 4 degustaciones urbanas", "1 bebida local", "Explicación histórica"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/2211432/pexels-photo-2211432.jpeg"]'::jsonb),

('sabores-de-barrio-queretaro', 'Sabores de Barrio Querétaro', 'PLAN', 'Querétaro', 890.00, 'MXN', true, 'Una experiencia enfocada en la gastronomía más auténtica de barrio, visitando mercados y calles locales.', 
'["Barrios tradicionales", "Mercados locales"]'::jsonb, 
'["Recorrido guiado especializado", "3 a 4 degustaciones auténticas", "1 bebida tradicional", "Contexto sociocultural"]'::jsonb, 
'{"duracion_estimada": "2 a 3 hours", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/8951203/pexels-photo-8951203.jpeg"]'::jsonb),

('ruta-gastronomica-tradicional-queretaro', 'Ruta Gastronómica Tradicional Querétaro', 'PLAN', 'Querétaro', 950.00, 'MXN', true, 'Recorrido diseñado para conocer los platillos más representativos del estado de Querétaro.', 
'["Zonas gastronómicas", "Establecimientos históricos"]'::jsonb, 
'["Recorrido guiado tradicional", "Degustaciones representativas", "1 bebida local", "Evolución de la cocina queretana"]'::jsonb, 
'{"duracion_estimada": "2 a 3 hours", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/1639556/pexels-photo-1639556.jpeg"]'::jsonb),

('sabores-nocturnos-queretaro', 'Sabores Nocturnos Querétaro', 'PLAN', 'Querétaro', 1150.00, 'MXN', true, 'Descubre la gastronomía local en un ambiente nocturno con propuestas culinarias contemporáneas.', 
'["Zonas de vida nocturna", "Puestos nocturnos seleccionados"]'::jsonb, 
'["Recorrido guiado nocturno", "3 a 4 degustaciones nocturnas", "1 bebida típica", "Escena culinaria nocturna"]'::jsonb, 
'{"duracion_estimada": "2 a 3 hours", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/4352244/pexels-photo-4352244.jpeg"]'::jsonb),

('sabores-premium-queretaro', 'Sabores Premium Querétaro', 'PLAN', 'Querétaro', 1350.00, 'MXN', true, 'Una experiencia completa que combina gastronomía tradicional con propuestas más elaboradas en el centro.', 
'["Centro de Querétaro", "Espacios gastronómicos seleccionados"]'::jsonb, 
'["Recorrido guiado premium", "Degustaciones elaboradas", "Bebidas seleccionadas", "Contexto culinario"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg"]'::jsonb),

-- BLOQUE 3: GUANAJUATO
('foodie-explorer-centro-historico-guanajuato', 'Foodie Explorer Centro Histórico', 'PLAN', 'Guanajuato', 1200.00, 'MXN', true, 'Sumérgete en la riqueza gastronómica de Guanajuato a través de un recorrido por sus calles emblemáticas.', 
'["Centro Histórico", "Calles y plazas emblemáticas"]'::jsonb, 
'["Recorrido guiado peatonal", "3 a 4 degustaciones", "1 bebida típica", "Historia y leyendas"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/4197491/pexels-photo-4197491.jpeg"]'::jsonb),

('sabores-y-callejones-guanajuato', 'Sabores y Callejones Guanajuato', 'PLAN', 'Guanajuato', 1200.00, 'MXN', true, 'Mezcla la gastronomía local con el encanto de los callejones representativos de la ciudad.', 
'["Callejones representativos", "Zonas históricas"]'::jsonb, 
'["Recorrido por callejones", "Degustación icónica", "1 bebida tradicional", "Narrativa cultural"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/11232464/pexels-photo-11232464.jpeg"]'::jsonb),

('foodie-cultural-experience-guanajuato', 'Foodie Cultural Experience', 'PLAN', 'Guanajuato', 1350.00, 'MXN', true, 'Enfocado en la historia y evolución de la gastronomía guanajuatense con contexto cultural.', 
'["Centro Histórico", "Puntos de valor gastronómico"]'::jsonb, 
'["Recorrido especializado", "Degustaciones tradicionales", "1 bebida tradicional", "Evolución culinaria"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/6605410/pexels-photo-6605410.jpeg"]'::jsonb),

('foodie-nocturno-guanajuato', 'Foodie Nocturno Guanajuato', 'PLAN', 'Guanajuato', 1450.00, 'MXN', true, 'Disfruta la gastronomía local en un ambiente nocturno recorriendo zonas con gran actividad cultural.', 
'["Zonas con actividad nocturna", "Plazas iluminadas"]'::jsonb, 
'["Recorrido nocturno", "Cena tradicional", "1 bebida típica", "Vida cultural nocturna"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/2531184/pexels-photo-2531184.jpeg"]'::jsonb),

('foodie-explorer-premium-guanajuato', 'Foodie Explorer Premium Guanajuato', 'PLAN', 'Guanajuato', 1650.00, 'MXN', true, 'Versión completa del recorrido con degustaciones elaboradas y atención personalizada.', 
'["Locaciones seleccionadas", "Propuestas exclusivas"]'::jsonb, 
'["Recorrido premium", "Degustaciones de alto nivel", "Bebidas premium", "Entornos exclusivos"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg"]'::jsonb),

-- BLOQUE 4: CARIBE MEXICANO
('tacos-experience-cancun', 'Tacos Experience Cancún', 'PLAN', 'Cancún', 1450.00, 'MXN', true, 'Descubre la escena gastronómica de Cancún a través de un recorrido especializado en tacos.', 
'["Zonas gastronómicas locales", "Taquerías seleccionadas"]'::jsonb, 
'["Recorrido en tacos", "Variedad de degustaciones", "1 a 2 bebidas locales", "Cultura del taco"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/9313233/pexels-photo-9313233.jpeg"]'::jsonb),

('tacos-playa-del-carmen', 'Tacos Playa del Carmen', 'PLAN', 'Playa del Carmen', 1550.00, 'MXN', true, 'Explora la mezcla de gastronomía local e internacional en Playa del Carmen con tacos de autor.', 
'["Zonas gastronómicas", "Taquerías de autor"]'::jsonb, 
'["Recorrido especializado", "Degustaciones de autor", "1 bebida local", "Fusión gastronómica"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg"]'::jsonb),

('tacos-drinks-experience-tulum', 'Tacos Drinks Experience Tulum', 'PLAN', 'Tulum', 1650.00, 'MXN', true, 'Vive una experiencia única combinando tacos de estilo artesanal en un ambiente bohemio.', 
'["Zonas exclusivas de Tulum"]'::jsonb, 
'["Recorrido bohemio", "Degustaciones artesanales", "Bebidas o coctelería", "Entorno de Tulum"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/4601135/pexels-photo-4601135.jpeg"]'::jsonb),

('tacos-premium-riviera-maya', 'Tacos Premium Riviera Maya', 'PLAN', 'Riviera Maya', 1950.00, 'MXN', true, 'Experiencia exclusiva que combina lo mejor de la gastronomía regional con propuestas gourmet.', 
'["Ruta selecta en Riviera Maya"]'::jsonb, 
'["Recorrido premium", "Degustaciones gourmet", "Maridaje básico", "Entornos exclusivos"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg"]'::jsonb),

('tacos-nocturno-cancun', 'Tacos Nocturno Cancún', 'PLAN', 'Cancún', 1750.00, 'MXN', true, 'Recorrido nocturno por la escena gastronómica de Cancún.', 
'["Zonas de vida nocturna"]'::jsonb, 
'["Recorrido nocturno", "Variedad de tacos", "1 bebida tradicional", "Dinamismo taquero"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["transporte", "consumos extra", "propinas"]}'::jsonb, 1,
'["https://images.pexels.com/photos/1055054/pexels-photo-1055054.jpeg"]'::jsonb),

-- BLOQUE 5: EXPERIENCIAS HIGH END (Categoría 2)
('explorer-riviera', 'Explorer Riviera', 'EXPERIENCIA', 'Riviera Maya', 5500.00, 'MXN', true, 'Paquete base con tour gastronómico, visita a Tulum, playa y coordinación de actividades.', 
'["Tulum", "Zonas de playa"]'::jsonb, 
'["Coordinación de actividades", "Tour gastronómico", "Visita guiada Tulum", "Acceso a playa"]'::jsonb, 
'{"duracion_estimada": "Día completo", "no_incluye": ["Consumos extra", "Propinas"]}'::jsonb, 2,
'["https://images.pexels.com/photos/2482312/pexels-photo-2482312.jpeg"]'::jsonb),

('adventure-flavors', 'Adventure & Flavors', 'EXPERIENCIA', 'Riviera Maya', 7800.00, 'MXN', true, 'Escapada con tour gastronómico premium, cenote y actividad acuática.', 
'["Cenote exclusivo", "Puntos de actividad acuática"]'::jsonb, 
'["Tour gastronómico premium", "Acceso a cenote", "Actividad acuática"]'::jsonb, 
'{"duracion_estimada": "Día completo", "no_incluye": ["Transporte externo", "Propinas"]}'::jsonb, 2,
'["https://images.pexels.com/photos/4099307/pexels-photo-4099307.jpeg"]'::jsonb),

('romantic-escape-riviera', 'Romantic Escape Riviera', 'EXPERIENCIA', 'Riviera Maya', 9500.00, 'MXN', true, 'Plan romántico con picnic o cena privada en playa, tour gastronómico y visita a Tulum.', 
'["Playa privada", "Tulum"]'::jsonb, 
'["Cena privada en playa", "Tour gastronómico", "Visita Tulum", "Atención exclusiva"]'::jsonb, 
'{"duracion_estimada": "Día completo", "no_incluye": ["Bebidas premium extra", "Propinas"]}'::jsonb, 2,
'["https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg"]'::jsonb),

('luxury-riviera-experience', 'Luxury Riviera Experience', 'EXPERIENCIA', 'Riviera Maya', 14500.00, 'MXN', true, 'Propuesta premium con cenote privado, cena exclusiva, beach club y transporte.', 
'["Cenote privado", "Beach Club", "Cena exclusiva"]'::jsonb, 
'["Acceso privado a cenote", "Reserva Beach Club", "Cena alta cocina", "Transporte privado"]'::jsonb, 
'{"duracion_estimada": "Día completo VIP", "no_incluye": ["Transporte externo", "Propinas"]}'::jsonb, 2,
'["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg"]'::jsonb),

('ultimate-riviera-todo-incluido-experiencial', 'Ultimate Riviera', 'EXPERIENCIA', 'Riviera Maya', 22000.00, 'MXN', true, 'Todo incluido experiencial con concierge y acceso a múltiples destinos del Caribe Mexicano.', 
'["Múltiples locaciones Caribe Mexicano"]'::jsonb, 
'["Concierge personalizado", "Itinerario a medida", "Accesos programados", "Todo incluido"]'::jsonb, 
'{"duracion_estimada": "Día completo extendida", "no_incluye": ["Propinas", "Actividades extra"]}'::jsonb, 2,
'["https://images.pexels.com/photos/1640413/pexels-photo-1640413.jpeg"]'::jsonb),

-- BLOQUE 6: RUTAS PERSONALIZADAS (Categoría 3)
('ruta-gourmet-local', 'Ruta Gourmet Local', 'PERSONALIZADA', 'Dentro de México por definir', 1750.00, 'MXN', true, 'Plan adaptable con degustaciones completas, restaurantes y street food.', 
'["Locaciones adaptables"]'::jsonb, 
'["Degustaciones completas", "Restaurantes", "Street food local", "Plan adaptable"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["Transporte", "Consumos extra", "Propinas"]}'::jsonb, 3,
'["https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg"]'::jsonb),

('tradicion-cultura', 'Tradición & Cultura', 'PERSONALIZADA', 'Dentro de México por definir', 1990.00, 'MXN', true, 'Experiencia con enfoque histórico, platillos tradicionales y visitas a mercados.', 
'["Mercados y cantinas tradicionales"]'::jsonb, 
'["Guía histórico", "Degustación tradicional", "Visita a mercados"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["Transporte", "Consumos extra", "Propinas"]}'::jsonb, 3,
'["https://images.pexels.com/photos/331107/pexels-photo-331107.jpeg"]'::jsonb),

('experiencia-premium-food-tour', 'Experiencia Premium Food Tour', 'PERSONALIZADA', 'Dentro de México por definir', 2450.00, 'MXN', true, 'Diseño premium con restaurantes seleccionados, bebidas premium y grupos pequeños.', 
'["Restaurantes alta gama"]'::jsonb, 
'["Grupos pequeños", "Degustaciones estándar premium", "Bebidas premium"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["Transporte", "Consumos extra", "Propinas"]}'::jsonb, 3,
'["https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"]'::jsonb),

('sabores-nocturnos', 'Sabores Nocturnos', 'PERSONALIZADA', 'Dentro de México por definir', 2650.00, 'MXN', true, 'Recorrido gastronómico nocturno adaptable al destino con vida cultural local.', 
'["Zonas nocturnas"]'::jsonb, 
'["Recorrido nocturno", "Tacos y antojitos", "Bebidas locales", "Cultura nocturna"]'::jsonb, 
'{"duracion_estimada": "2 a 3 horas", "no_incluye": ["Transporte", "Consumos extra", "Propinas"]}'::jsonb, 3,
'["https://images.pexels.com/photos/1055058/pexels-photo-1055058.jpeg"]'::jsonb),

('luxury-culinary-experience', 'Luxury Culinary Experience', 'PERSONALIZADA', 'Dentro de México por definir', 3200.00, 'MXN', true, 'Experiencia culinaria de alto nivel con maridaje y servicio personalizado.', 
'["Establecimientos exclusivos"]'::jsonb, 
'["Servicio alto nivel", "Menú exclusivo", "Maridaje seleccionado"]'::jsonb, 
'{"duracion_estimada": "3 a 4 horas", "no_incluye": ["Transporte", "Consumos extra", "Propinas"]}'::jsonb, 3,
'["https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg"]'::jsonb),

('master-food-experience-privado', 'Master Food Experience (Privado)', 'PERSONALIZADA', 'Dentro de México por definir', 3900.00, 'MXN', true, 'Tour privado con chef o guía especializado y posibilidad de interacción gastronómica extendida.', 
'["Itinerario premium privado"]'::jsonb, 
'["Servicio 100% privado", "Acompañamiento chef/guía", "Talleres culinarios", "Degustación premium"]'::jsonb, 
'{"duracion_estimada": "3 a 4 horas", "no_incluye": ["Transporte", "Consumos extra", "Propinas"]}'::jsonb, 3,
'["https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg"]'::jsonb);



-- =====================================================================================
-- INSERTAR DETALLES MUNDIAL (FIFA)
-- =====================================================================================
INSERT INTO public.fifa_experiences_horizon (title, subtitle, description, items, image_url, order_index) VALUES

('Estadios y Museos', 'Recorridos Históricos', 'Visitas guiadas a los templos del fútbol y acceso a zonas restringidas.', 
'["Visitas guiadas a estadios FIFA y campos históricos", "Acceso a vestidores y zonas VIP (fotos y experiencias interactivas)", "Recorridos por museos de fútbol y exhibiciones temáticas"]'::jsonb, 
'https://images.pexels.com/photos/12327672/pexels-photo-12327672.jpeg', 1),

('Fan Experiences', 'Interacción Total', 'Zonas de realidad virtual y encuentros con leyendas del deporte.', 
'["Clínicas de fútbol y retos de habilidades", "Realidad virtual de partidos históricos", "Meet & greet con leyendas"]'::jsonb, 
'https://images.pexels.com/photos/33660694/pexels-photo-33660694.jpeg', 2),

('Viewing Parties', 'Eventos en Vivo', 'Proyección de partidos en pantallas gigantes con ambiente temático.', 
'["Pantallas gigantes", "Trivia y juegos recreativos", "Catering temático y snacks"]'::jsonb, 
'https://images.pexels.com/photos/26832707/pexels-photo-26832707.jpeg', 3),

('Cultura y Ciudad', 'Recorridos Urbanos', 'Explora el lado futbolero de las sedes mundialistas.', 
'["Street football tours", "Bares deportivos icónicos", "Arte urbano y murales de fútbol"]'::jsonb, 
'https://images.pexels.com/photos/13201287/pexels-photo-13201287.jpeg', 4),

('Experiencias educativas', 'Historia del fútbol y estrategias de juego', 'Descubre más acerca del fútbol y domina la cancha.', 
'["Talleres tácticos", "Trivia con premios", "Historia de los mundiales"]'::jsonb, 
'https://images.pexels.com/photos/8455345/pexels-photo-8455345.jpeg', 5);