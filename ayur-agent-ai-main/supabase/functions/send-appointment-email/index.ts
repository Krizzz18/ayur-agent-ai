import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "AyurAgent <appointments@ayuragent.app>";

interface AppointmentEmailRequest {
  to: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName?: string;
  type: "confirmation" | "reminder" | "cancellation";
  notes?: string;
}

const serveHandler = async (req: Request): Promise<Response> {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable not set");
    }

    const body: AppointmentEmailRequest = await req.json();
    const { to, patientName, appointmentDate, appointmentTime, doctorName, type, notes } = body;

    if (!to || !patientName || !appointmentDate || !appointmentTime) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let subject: string;
    let htmlContent: string;

    switch (type) {
      case "confirmation":
        subject = "✅ Your AyurAgent Appointment is Confirmed";
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B7355;">Appointment Confirmed</h2>
            <p>Dear ${patientName},</p>
            <p>Your Ayurvedic consultation has been confirmed. Here are the details:</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
              ${doctorName ? `<p><strong>Doctor:</strong> ${doctorName}</p>` : ""}
              ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
            </div>
            <p>Please arrive 10 minutes early. If you need to cancel or reschedule, please contact us at least 24 hours in advance.</p>
            <p style="margin-top: 30px;">With wellness,<br>The AyurAgent Team</p>
          </div>
        `;
        break;

      case "reminder":
        subject = "⏰ Reminder: Your AyurAgent Appointment Tomorrow";
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B7355;">Appointment Reminder</h2>
            <p>Dear ${patientName},</p>
            <p>This is a friendly reminder about your upcoming Ayurvedic consultation:</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
              ${doctorName ? `<p><strong>Doctor:</strong> ${doctorName}</p>` : ""}
            </div>
            <p>We look forward to seeing you!</p>
            <p style="margin-top: 30px;">With wellness,<br>The AyurAgent Team</p>
          </div>
        `;
        break;

      case "cancellation":
        subject = "❌ Your AyurAgent Appointment Has Been Cancelled";
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B7355;">Appointment Cancelled</h2>
            <p>Dear ${patientName},</p>
            <p>Your appointment has been cancelled as requested:</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
            </div>
            <p>If you would like to reschedule, please book a new appointment through our platform.</p>
            <p style="margin-top: 30px;">With wellness,<br>The AyurAgent Team</p>
          </div>
        `;
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid email type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    const data = await res.json();

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error sending appointment email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(serveHandler);
