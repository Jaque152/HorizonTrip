import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { CartItem } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- CREDENCIALES ETOMIN ---
const ETOMIN_EMAIL = process.env.ETOMIN_EMAIL!;
const ETOMIN_PASSWORD = process.env.ETOMIN_PASSWORD!;
const ETOMIN_BASE_URL = 'https://pagos.etomin.com/api/v1';

const resend = new Resend(process.env.RESEND_API_KEY);
const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

const getEtominHeaders = (extraHeaders = {}) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Origin': 'https://horizontrip.com.mx', 
  ...extraHeaders
});

async function safeEtominFetch(url: string, options: RequestInit, stepName: string) {
  const res = await fetch(url, options);
  const text = await res.text(); 
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error(`Respuesta cruda de Etomin en [${stepName}]:`, text);
    throw new Error(`Falla en ${stepName}. Etomin respondió: ${text.slice(0, 50)}...`);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { locale, contactInfo, billingInfo, orderNotes, cart, cardInfo, formattedTotal, manualFolioData} = body;

    const tempReferenceId = `REF-${Date.now()}`;

    // 1. SIGNIN EN ETOMIN
    const signinData = await safeEtominFetch(`${ETOMIN_BASE_URL}/signin`, {
      method: 'POST',
      headers: getEtominHeaders(),
      body: JSON.stringify({ email: ETOMIN_EMAIL, password: ETOMIN_PASSWORD })
    }, 'Login Etomin');
    
    if (!signinData.authToken) {
      throw new Error("Credenciales de Etomin incorrectas o bloqueadas.");
    }
    const authToken = signinData.authToken;

    // 2. TOKENIZACIÓN DE TARJETA ETOMIN
    const cardPayload = {
      cardData: {
        cardNumber: cardInfo.number,
        cardholderName: cardInfo.name,
        expirationMonth: cardInfo.expiry.split('/')[0],
        expirationYear: cardInfo.expiry.split('/')[1],
      }
    };

    const tokenData = await safeEtominFetch(`${ETOMIN_BASE_URL}/card/tokenizer`, {
      method: 'POST',
      headers: getEtominHeaders({ 'Authorization': `Bearer ${authToken}` }),
      body: JSON.stringify(cardPayload)
    }, 'Tokenización de Tarjeta');

    if (!tokenData.cardNumberToken) {
      throw new Error("Tarjeta rechazada por Etomin (Datos inválidos o encriptación fallida).");
    }
    const cardToken = tokenData.cardNumberToken;

    // 3. PREPARAR ITEMS PARA LA VENTA
    const etominItems = manualFolioData 
      ? [{ title: `Pago Cotización: ${manualFolioData.folio}`, amount: manualFolioData.amount, quantity: 1, id: manualFolioData.folio }]
      : cart.items.map((item: CartItem) => ({
          title: item.experience.title,
          amount: item.pricePerPerson,
          quantity: item.people,
          id: item.activityId.toString(),
    }));

    const finalAmountToCharge = manualFolioData ? manualFolioData.amount : cart.total;

    // 4. PROCESAR LA VENTA
    const salePayload = {
      amount: Number(finalAmountToCharge.toFixed(2)),
      currency: 484, // MXN
      reference: tempReferenceId,
      customerInformation: {
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName || 'Sin apellido',
        middleName: '',
        email: contactInfo.email,
        phone1: contactInfo.phone,
        city: billingInfo.localidad || 'Ciudad de México',
        address1: billingInfo.direccion || 'Sin Especificar',
        postalCode: billingInfo.codigo_postal || '00000',
        state: billingInfo.estado || 'CDMX',
        country: 'MX',
        ip: '127.0.0.1' 
      },
      cardData: {
        cardNumberToken: cardToken,
        cvv: cardInfo.cvv
      },
      items: etominItems,
      redirectUrl: 'https://horizontrip.com.mx' 
    };

    const saleData = await safeEtominFetch(`${ETOMIN_BASE_URL}/sale`, {
      method: 'POST',
      headers: getEtominHeaders({ 'Authorization': `Bearer ${authToken}` }),
      body: JSON.stringify(salePayload)
    }, 'Procesar Venta');
    
    if (saleData.status !== 'APPROVED' && saleData.status !== 'PENDING') {
      console.error("❌ DETALLE DEL RECHAZO ETOMIN:", saleData); 
      throw new Error(`Pago declinado: ${saleData.message || saleData.responseCode || 'Tarjeta rechazada por el banco'}`);
    }

    // 5. GUARDAR EN SUPABASE
    const { data: customer, error: custError } = await supabase
      .from('customers_horizon')
      .upsert({ 
        first_name: contactInfo.firstName, 
        last_name: contactInfo.lastName, 
        email: contactInfo.email, 
        phone: contactInfo.phone 
      }, { onConflict: 'email' })
      .select().single();

    if (custError) throw new Error("Error guardando cliente en la base de datos.");

    const { data: booking, error: bookError } = await supabase
      .from('bookings_horizon')
      .insert({
        customer_id: customer.id,
        session_id: manualFolioData ? manualFolioData.folio : null,
        total_amount: finalAmountToCharge,
        payment_status: 'paid',
        transaction_id: saleData.transactionId || saleData.authorizationNumber || tempReferenceId,
        payment_provider: 'etomin', 
        payment_date: new Date().toISOString(),
        pais: billingInfo.pais,
        direccion: billingInfo.direccion,
        localidad: billingInfo.localidad,
        estado: billingInfo.estado,
        codigo_postal: billingInfo.codigo_postal,
        order_notes: orderNotes || null 
      })
      .select().single();

    if (bookError) throw new Error("Error guardando reserva en la base de datos.");

    if (cart.items.length > 0) {
      const validBookingItems = cart.items
        .filter((item: CartItem) => item.activityId > 0) 
        .map((item: CartItem) => ({
          booking_id: booking.id,
          activity_id: item.activityId,
          scheduled_date: item.date,
          pax_qty: item.people,
          unit_price: item.pricePerPerson
        }));
      if (validBookingItems.length > 0) {
        const { error: itemsError } = await supabase.from('booking_items_horizon').insert(validBookingItems);
        if (itemsError) throw new Error("Error guardando items de reserva en la BD.");
      }   
    }
   
    // 6. CORREOS ELECTRÓNICOS 
    const primaryColor = '#0f4c3a'; // Verde Selva / Deep Jungle
    const accentColor = '#14b8a6'; // Turquesa

    const isEnglish = locale === 'en';
    const subjectClient = isEnglish 
      ? `Booking Confirmation - Thank you for traveling with HorizonTrip` 
      : `Confirmación de Reserva - Gracias por viajar con HorizonTrip`;

    const greeting = isEnglish ? `Hello ${contactInfo.firstName},` : `Estimado/a ${contactInfo.firstName},`;
    const confirmationText = isEnglish ? "Your dossier has been confirmed and your payment was successfully processed." : "Tu dossier ha sido confirmado y el pago se procesó exitosamente.";
    const totalLabel = isEnglish ? "TOTAL INVESTMENT:" : "VALOR DE INVERSIÓN:";
    const quoteLabel = isEnglish ? "Custom Route Payment" : "Diseño de Ruta a la Medida";
    const folioLabel = isEnglish ? "Folio" : "Folio";
    const qtyLabel = isEnglish ? "Pax." : "Pax.";
    const priceLabel = isEnglish ? "Price" : "Precio";
    const experienceLabel = isEnglish ? "Experience" : "Experiencia";
    const detailsLabel = isEnglish ? "Contact & Billing Details" : "Detalles de Contacto y Facturación";
    const phoneLabel = isEnglish ? "Phone:" : "Teléfono:";
    const addressLabel = isEnglish ? "Address:" : "Dirección:";
    const notesLabel = isEnglish ? "Concierge Notes:" : "Indicaciones al Concierge:";
    
    const htmlClient = `
        <div style="font-family: 'Times New Roman', Times, serif; max-width: 600px; margin: auto; color: #1a202c; border: 1px solid #e2e8f0; border-radius: 0px; overflow: hidden; background-color: #fcfcfc;">
          <div style="background-color: ${primaryColor}; padding: 50px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase;">HORIZON<span style="font-style: italic; color: ${accentColor}; font-weight: 300;">TRIP.</span></h1>
          </div>
          <div style="padding: 50px 40px; background-color: #ffffff;">
            <h2 style="color: ${primaryColor}; margin-top: 0; font-size: 22px; font-weight: normal;">${greeting}</h2>
            <p style="font-size: 16px; line-height: 1.8; color: #4a5568; font-family: Arial, sans-serif;">${confirmationText}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; margin-top: 40px; font-family: Arial, sans-serif;">
              <thead>
                <tr style="border-bottom: 1px solid #cbd5e0; text-align: left;">
                  <th style="padding: 12px 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #a0aec0;">${experienceLabel}</th>
                  <th style="padding: 12px 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #a0aec0; text-align: center;">${qtyLabel}</th>
                  <th style="padding: 12px 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #a0aec0; text-align: right;">${priceLabel}</th>
                </tr>
              </thead>
              <tbody>
                ${!manualFolioData ? cart.items.map((item: CartItem) => `
                  <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 24px 0;">
                      <p style="margin: 0; font-weight: bold; font-size: 16px; color: ${primaryColor};">${item.experience.title}</p>
                      <p style="margin: 8px 0 0; font-size: 13px; color: #718096; text-transform: uppercase; letter-spacing: 1px;">🗓 ${item.date} <br>✨ ${item.experience.plan_type}</p>
                    </td>
                    <td style="padding: 24px 0; text-align: center; vertical-align: top; font-weight: normal; color: #4a5568;">${item.people}</td>
                    <td style="padding: 24px 0; text-align: right; font-weight: bold; font-size: 15px; color: ${primaryColor}; vertical-align: top;">${formatPrice(item.totalPrice)}</td>
                  </tr>
                `).join('') : `
                   <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 24px 0;">
                      <p style="margin: 0; font-weight: bold; font-size: 16px; color: ${primaryColor};">${quoteLabel}</p>
                      <p style="margin: 8px 0 0; font-size: 13px; color: #718096; text-transform: uppercase; letter-spacing: 1px;">${folioLabel}: ${manualFolioData.folio}</p>
                    </td>
                    <td style="padding: 24px 0; text-align: center; vertical-align: top; font-weight: normal;">1</td>
                    <td style="padding: 24px 0; text-align: right; font-weight: bold; font-size: 15px; color: ${primaryColor}; vertical-align: top;">${formatPrice(manualFolioData.amount)}</td>
                  </tr>
                `}
              </tbody>
            </table>

            <div style="padding: 20px 0; border-bottom: 1px solid #cbd5e0; margin-bottom: 40px; text-align: right; font-family: Arial, sans-serif;">
              <span style="font-size: 12px; font-weight: bold; color: #a0aec0; text-transform: uppercase; letter-spacing: 2px;">${totalLabel} </span>
              <span style="font-size: 32px; font-weight: normal; color: ${primaryColor}; display: block; margin-top: 8px; font-family: 'Times New Roman', Times, serif;">${formattedTotal}</span>
            </div>

            <div style="padding: 30px; background-color: #f7fafc; border-left: 2px solid ${primaryColor}; font-family: Arial, sans-serif;">
              <h3 style="margin: 0 0 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: ${primaryColor};">${detailsLabel}</h3>
              <p style="margin: 10px 0; font-size: 13px; color: #4a5568;"><strong>Email:</strong> ${contactInfo.email}</p>
              <p style="margin: 10px 0; font-size: 13px; color: #4a5568;"><strong>${phoneLabel}</strong> ${contactInfo.phone}</p>
              <p style="margin: 10px 0; font-size: 13px; color: #4a5568;"><strong>${addressLabel}</strong> ${billingInfo.direccion}, ${billingInfo.localidad}, ${billingInfo.estado}, ${billingInfo.codigo_postal}, ${billingInfo.pais}</p>
              ${orderNotes ? `<p style="margin: 15px 0 0; font-size: 13px; color: #4a5568; border-top: 1px solid #e2e8f0; padding-top: 15px;"><strong>${notesLabel}</strong> ${orderNotes}</p>` : ''}
            </div>

          </div>
        </div>
    `;

    await resend.emails.send({
      from: 'HorizonTrip Concierge <hola@horizontrip.com.mx>', 
      to: [contactInfo.email], 
      subject: subjectClient,
      html: htmlClient,
    });

    // --- NOTIFICACIÓN INTERNA PARA EL EQUIPO ---
    const subjectInternal = `[NUEVO DOSSIER] - ${formattedTotal} - ${contactInfo.firstName} ${contactInfo.lastName}`;
    
    const htmlInternal = `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #0f4c3a;">¡Nuevo Dossier Confirmado! (Vía Etomin)</h2>
        <p>Se ha procesado un pago exitoso a través de la plataforma HorizonTrip.</p>
        <hr/>
        <p><strong>Valor de Inversión:</strong> ${formattedTotal}</p>
        <p><strong>ID Transacción (Etomin):</strong> ${saleData.transactionId || saleData.authorizationNumber}</p>
        <hr/>
        <h3>Datos del Viajero:</h3>
        <p><strong>Nombre:</strong> ${contactInfo.firstName} ${contactInfo.lastName}</p>
        <p><strong>Email:</strong> ${contactInfo.email}</p>
        <p><strong>Teléfono:</strong> ${contactInfo.phone}</p>
        <p><strong>Dirección:</strong> ${billingInfo.direccion}, ${billingInfo.localidad}, ${billingInfo.estado}, ${billingInfo.codigo_postal}</p>
        <p><strong>Indicaciones:</strong> ${orderNotes || 'Ninguna'}</p>
        <hr/>
        <h3>Ruta Seleccionada:</h3>
        <ul>
          ${!manualFolioData ? cart.items.map((item: CartItem) => `
            <li>${item.experience.title} (x${item.people}) - ${formatPrice(item.totalPrice)}</li>
          `).join('') : `<li>Diseño de Ruta a la Medida - Folio: ${manualFolioData.folio}</li>`}
        </ul>
      </div>
    `;

    await resend.emails.send({
      from: 'Sistema HorizonTrip <hola@horizontrip.com.mx>',
      to: ['hola@horizontrip.com.mx'],
      subject: subjectInternal,
      html: htmlInternal,
    });

    return NextResponse.json({ 
      success: true, 
      bookingId: booking.id,
    });

  } catch (error: unknown) {
    console.error("Error capturado en Backend:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
  }
}