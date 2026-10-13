// اختياري: بيبعت إيميل لفريق الشركة كل ما رسالة جديدة توصل.
// 1) supabase functions deploy notify-contact
// 2) supabase secrets set RESEND_API_KEY=... MAIL_FROM="KIANKO <no-reply@your-domain.com>" COMPANY_EMAIL=info@kianko-company.com
// 3) Dashboard → Database → Webhooks → Create: table contact_messages, event INSERT,
//    type "Supabase Edge Functions" → notify-contact
Deno.serve(async (req) => {
  const payload = await req.json();
  if (payload.type !== 'INSERT' || payload.table !== 'contact_messages') {
    return new Response('ignored', { status: 200 });
  }
  const r = payload.record;

  const text = [
    `Name: ${r.name}`,
    `Phone: ${r.phone}`,
    `Email: ${r.email}`,
    `Preferred location: ${r.location_id ?? 'Any'}`,
    '',
    r.message,
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: Deno.env.get('MAIL_FROM'),
      to: [Deno.env.get('COMPANY_EMAIL')],
      reply_to: r.email,
      subject: `New inquiry from ${r.name}`,
      text,
    }),
  });

  return new Response(res.ok ? 'sent' : await res.text(), { status: res.ok ? 200 : 500 });
});
