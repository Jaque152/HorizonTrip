import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// Mismos tonos usados en checkout/route.ts
const primaryColor = '#0f4c3a'; // Verde Selva / Deep Jungle
const accentColor = '#14b8a6'; // Turquesa
const bgSoft = '#f7fafc';
const textDark = '#1a202c';
const textBase = '#4a5568';
const textMuted = '#718096';
const borderColor = '#e2e8f0';

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function emptyLabel(isEnglish: boolean, fallback?: string) {
  if (fallback) return escapeHtml(fallback);
  return isEnglish ? 'Not provided' : 'No proporcionado';
}

function getLogoHeader(subtitle: string) {
  return `
    <div style="background-color: ${primaryColor}; padding: 50px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; font-family: 'Times New Roman', Times, serif;">
        HORIZON<span style="font-style: italic; color: ${accentColor}; font-weight: 300;">TRIP.</span>
      </h1>
      <p style="color: ${accentColor}; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 4px; margin-top: 10px; font-family: Arial, sans-serif;">
        ${subtitle}
      </p>
    </div>
  `;
}

function getEmailShell(content: string, subtitle: string) {
  return `
    <div style="font-family: 'Times New Roman', Times, serif; max-width: 600px; margin: auto; color: ${textDark}; border: 1px solid ${borderColor}; overflow: hidden; background-color: #fcfcfc;">
      ${getLogoHeader(subtitle)}
      <div style="padding: 50px 40px; background-color: #ffffff;">
        ${content}
      </div>
    </div>
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      type,
      customerName,
      email,
      phone,
      message,
      destination,
      locale,
      budget,
      startDate,
      travelers,
    } = body;

    if (type !== 'CONTACT' && type !== 'QUOTE') {
      return NextResponse.json(
        { error: 'Tipo de correo no soportado' },
        { status: 400 }
      );
    }

    const currentLocale = String(locale || 'es').toLowerCase();
    const isEnglish = currentLocale.startsWith('en');

    const safeName = escapeHtml(customerName);
    const safeEmail = escapeHtml(email);
    const safePhone = phone ? escapeHtml(phone) : emptyLabel(isEnglish);
    const safeMessage = message
      ? escapeHtml(message)
      : isEnglish
        ? 'No additional message.'
        : 'Sin mensaje adicional.';

    const safeDestination = destination ? escapeHtml(destination) : emptyLabel(isEnglish);
    const safeBudget = budget ? escapeHtml(budget) : emptyLabel(isEnglish);
    const safeStartDate = startDate ? escapeHtml(startDate) : emptyLabel(isEnglish);
    const safeTravelers = travelers ? escapeHtml(travelers) : emptyLabel(isEnglish);

    let subjectClient = '';
    let htmlClient = '';
    let subjectInternal = '';
    let htmlInternal = '';

    const greeting = isEnglish
      ? `Hello ${safeName},`
      : `Hola ${safeName},`;

    // ==========================================
    // CONTACTO GENERAL
    // ==========================================
    if (type === 'CONTACT') {
      subjectClient = isEnglish
        ? '[HorizonTrip] We received your message'
        : '[HorizonTrip] Hemos recibido tu mensaje';

      subjectInternal = isEnglish
        ? `[NEW CONTACT MESSAGE] - ${safeName}`
        : `[NUEVO MENSAJE DE CONTACTO] - ${safeName}`;

      const subtitle = isEnglish ? 'Curated travel experiences' : 'Experiencias de viaje seleccionadas';

      htmlClient = getEmailShell(
        `
          <h2 style="color: ${primaryColor}; margin-top: 0; font-size: 22px; font-weight: normal;">
            ${greeting}
          </h2>

          <p style="font-size: 16px; line-height: 1.8; color: ${textBase}; font-family: Arial, sans-serif;">
            ${
              isEnglish
                ? 'We have successfully received your message. Our concierge team is reviewing your request and will contact you shortly.'
                : 'Hemos recibido tu mensaje con éxito. Nuestro equipo concierge está revisando tu solicitud y se pondrá en contacto contigo a la brevedad.'
            }
          </p>

          <div style="margin: 35px 0; padding: 28px; background-color: ${bgSoft}; border-left: 2px solid ${primaryColor}; font-family: Arial, sans-serif;">
            <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: ${primaryColor}; margin-top: 0; margin-bottom: 15px;">
              ${isEnglish ? 'Your message record' : 'Registro de tu mensaje'}
            </p>
            <p style="font-size: 14px; font-style: italic; color: ${textBase}; margin: 0; line-height: 1.7;">
              "${safeMessage}"
            </p>
          </div>

          <div style="text-align: center; margin-top: 40px; font-family: Arial, sans-serif;">
            <a href="https://horizontrip.com.mx/${isEnglish ? 'en' : 'es'}#experiencias" 
              style="display: inline-block; background-color: ${primaryColor}; color: #ffffff; padding: 16px 32px; border-radius: 9999px; text-decoration: none; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
              ${isEnglish ? 'Explore Experiences' : 'Explorar Experiencias'}
            </a>
          </div>
        `,
        subtitle
      );

      htmlInternal = getEmailShell(
        `
          <h2 style="color: ${primaryColor}; margin-top: 0; font-size: 22px; font-weight: normal;">
            ${isEnglish ? 'New Contact Message' : 'Nuevo Mensaje Web'}
          </h2>

          <p style="font-size: 15px; line-height: 1.8; color: ${textBase}; font-family: Arial, sans-serif;">
            ${
              isEnglish
                ? 'A new contact message was submitted from the HorizonTrip website.'
                : 'Se recibió un nuevo mensaje desde el sitio web de HorizonTrip.'
            }
          </p>

          <div style="padding: 28px; background-color: ${bgSoft}; border-left: 2px solid ${primaryColor}; font-family: Arial, sans-serif;">
            <p style="margin: 10px 0; font-size: 13px; color: ${textBase};"><strong>${isEnglish ? 'Name:' : 'Nombre:'}</strong> ${safeName}</p>
            <p style="margin: 10px 0; font-size: 13px; color: ${textBase};"><strong>Email:</strong> ${safeEmail}</p>
            <p style="margin: 10px 0; font-size: 13px; color: ${textBase};"><strong>${isEnglish ? 'Phone:' : 'Teléfono:'}</strong> ${safePhone}</p>
            <p style="margin: 10px 0; font-size: 13px; color: ${textBase};"><strong>${isEnglish ? 'Website language:' : 'Idioma del sitio:'}</strong> ${isEnglish ? 'English' : 'Español'}</p>
          </div>

          <div style="margin-top: 30px; padding: 24px; border: 1px solid ${borderColor}; font-family: Arial, sans-serif;">
            <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: ${primaryColor}; margin-top: 0;">
              ${isEnglish ? 'Message' : 'Mensaje'}
            </p>
            <p style="font-size: 14px; color: ${textBase}; line-height: 1.7; margin-bottom: 0;">
              ${safeMessage}
            </p>
          </div>
        `,
        isEnglish ? 'Internal notification' : 'Notificación interna'
      );
    }

    // ==========================================
    // COTIZACIONES
    // ==========================================
    if (type === 'QUOTE') {
      subjectClient = isEnglish
        ? `[HorizonTrip] We are designing your trip to ${safeDestination}`
        : `[HorizonTrip] Estamos configurando tu viaje a ${safeDestination}`;

      subjectInternal = isEnglish
        ? `[NEW QUOTE REQUEST] - ${safeDestination} - ${safeName}`
        : `[NUEVA COTIZACIÓN] - ${safeDestination} - ${safeName}`;

      const subtitle = isEnglish ? 'Tailor-made travel design' : 'Viajes a tu medida';

      htmlClient = getEmailShell(
        `
          <h2 style="color: ${primaryColor}; margin-top: 0; font-size: 22px; font-weight: normal;">
            ${greeting}
          </h2>

          <p style="font-size: 16px; line-height: 1.8; color: ${textBase}; font-family: Arial, sans-serif;">
            ${
              isEnglish
                ? `We have received your coordinates for <strong>${safeDestination}</strong>. Our travel design team is already reviewing your request and will contact you soon.`
                : `Hemos recibido tus coordenadas para <strong>${safeDestination}</strong>. Nuestro equipo de diseño de viajes ya está revisando tu solicitud y se pondrá en contacto contigo muy pronto.`
            }
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 35px 0; font-family: Arial, sans-serif;">
            <tbody>
              <tr style="border-bottom: 1px solid ${borderColor};">
                <td style="padding: 14px 0; font-size: 12px; font-weight: bold; color: ${textMuted}; text-transform: uppercase; letter-spacing: 1px;">
                  ${isEnglish ? 'Destination' : 'Destino'}
                </td>
                <td style="padding: 14px 0; font-size: 14px; color: ${primaryColor}; text-align: right; font-weight: bold;">
                  ${safeDestination}
                </td>
              </tr>
              <tr style="border-bottom: 1px solid ${borderColor};">
                <td style="padding: 14px 0; font-size: 12px; font-weight: bold; color: ${textMuted}; text-transform: uppercase; letter-spacing: 1px;">
                  ${isEnglish ? 'Start date' : 'Fecha de inicio'}
                </td>
                <td style="padding: 14px 0; font-size: 14px; color: ${textBase}; text-align: right;">
                  ${safeStartDate}
                </td>
              </tr>
              <tr style="border-bottom: 1px solid ${borderColor};">
                <td style="padding: 14px 0; font-size: 12px; font-weight: bold; color: ${textMuted}; text-transform: uppercase; letter-spacing: 1px;">
                  ${isEnglish ? 'Travelers' : 'Viajeros'}
                </td>
                <td style="padding: 14px 0; font-size: 14px; color: ${textBase}; text-align: right;">
                  ${safeTravelers}
                </td>
              </tr>
              <tr>
                <td style="padding: 14px 0; font-size: 12px; font-weight: bold; color: ${textMuted}; text-transform: uppercase; letter-spacing: 1px;">
                  ${isEnglish ? 'Budget' : 'Presupuesto'}
                </td>
                <td style="padding: 14px 0; font-size: 14px; color: ${textBase}; text-align: right;">
                  ${safeBudget}
                </td>
              </tr>
            </tbody>
          </table>

          ${
            message
              ? `
                <div style="background-color: ${bgSoft}; padding: 24px; border-left: 2px solid ${primaryColor}; font-family: Arial, sans-serif;">
                  <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: ${primaryColor}; margin-top: 0;">
                    ${isEnglish ? 'Special requests' : 'Requerimientos especiales'}
                  </p>
                  <p style="margin: 0; font-size: 14px; font-style: italic; color: ${textBase}; line-height: 1.7;">
                    "${safeMessage}"
                  </p>
                </div>
              `
              : ''
          }
        `,
        subtitle
      );

      htmlInternal = getEmailShell(
        `
          <h2 style="color: ${primaryColor}; margin-top: 0; font-size: 22px; font-weight: normal;">
            ${isEnglish ? 'New Quote Request' : 'Nueva Cotización'}
          </h2>

          <p style="font-size: 15px; line-height: 1.8; color: ${textBase}; font-family: Arial, sans-serif;">
            ${
              isEnglish
                ? 'A new custom trip quote request was submitted from the HorizonTrip website.'
                : 'Se recibió una nueva solicitud de cotización personalizada desde el sitio web de HorizonTrip.'
            }
          </p>

          <div style="padding: 28px; background-color: ${bgSoft}; border-left: 2px solid ${primaryColor}; font-family: Arial, sans-serif;">
            <p style="margin: 10px 0; font-size: 13px; color: ${textBase};"><strong>${isEnglish ? 'Client:' : 'Cliente:'}</strong> ${safeName}</p>
            <p style="margin: 10px 0; font-size: 13px; color: ${textBase};"><strong>${isEnglish ? 'Destination:' : 'Destino:'}</strong> ${safeDestination}</p>
            <p style="margin: 10px 0; font-size: 13px; color: ${textBase};"><strong>${isEnglish ? 'Start date:' : 'Fecha:'}</strong> ${safeStartDate}</p>
            <p style="margin: 10px 0; font-size: 13px; color: ${textBase};"><strong>${isEnglish ? 'Travelers:' : 'Viajeros:'}</strong> ${safeTravelers}</p>
            <p style="margin: 10px 0; font-size: 13px; color: ${textBase};"><strong>${isEnglish ? 'Budget:' : 'Presupuesto:'}</strong> ${safeBudget}</p>
            <p style="margin: 10px 0; font-size: 13px; color: ${textBase};"><strong>Email:</strong> ${safeEmail}</p>
            <p style="margin: 10px 0; font-size: 13px; color: ${textBase};"><strong>${isEnglish ? 'Phone:' : 'Teléfono:'}</strong> ${safePhone}</p>
            <p style="margin: 10px 0; font-size: 13px; color: ${textBase};"><strong>${isEnglish ? 'Website language:' : 'Idioma del sitio:'}</strong> ${isEnglish ? 'English' : 'Español'}</p>
          </div>

          <div style="margin-top: 30px; padding: 24px; border: 1px solid ${borderColor}; font-family: Arial, sans-serif;">
            <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: ${primaryColor}; margin-top: 0;">
              ${isEnglish ? 'Special requests' : 'Requerimientos especiales'}
            </p>
            <p style="font-size: 14px; color: ${textBase}; line-height: 1.7; margin-bottom: 0;">
              ${safeMessage}
            </p>
          </div>
        `,
        isEnglish ? 'Internal notification' : 'Notificación interna'
      );
    }

    // Enviar correo al cliente
    const { data, error } = await resend.emails.send({
      from: 'HorizonTrip Concierge <hola@horizontrip.com.mx>',
      to: [email],
      subject: subjectClient,
      html: htmlClient,
    });

    if (error) {
      console.error('Error de Resend al enviar al cliente:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    // Enviar correo interno
    const internalMail = await resend.emails.send({
      from: 'Sistema HorizonTrip <hola@horizontrip.com.mx>',
      to: ['hola@horizontrip.com.mx'],
      subject: subjectInternal,
      html: htmlInternal,
    });

    if (internalMail.error) {
      console.error('Error al enviar correo interno:', internalMail.error);
    }

    return NextResponse.json({ ok: true, data });

  } catch (error) {
    console.error('Error crítico en API Send:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}