import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

async function refreshAccessTokenIfNeeded(integration: any, supabase: any) {
  if (
    !integration.expires_at ||
    new Date(integration.expires_at) < new Date(Date.now() + 60000)
  ) {
    const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: Deno.env.get('GOOGLE_CLIENT_ID') || '',
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') || '',
        refresh_token: integration.refresh_token,
        grant_type: 'refresh_token',
      }),
    })
    const refreshData = await refreshRes.json()
    if (refreshData.error)
      throw new Error(
        `Falha ao renovar token: ${refreshData.error_description || refreshData.error}`,
      )

    integration.access_token = refreshData.access_token
    integration.expires_at = new Date(
      Date.now() + refreshData.expires_in * 1000,
    ).toISOString()

    await supabase
      .from('user_integrations')
      .update({
        access_token: integration.access_token,
        expires_at: integration.expires_at,
      })
      .eq('id', integration.id)
  }
  return integration
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Cabeçalho de autorização ausente')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')

    const { action, payload } = await req.json()

    if (action === 'getAuthUrl') {
      const clientId = Deno.env.get('GOOGLE_CLIENT_ID')
      if (!clientId)
        throw new Error('GOOGLE_CLIENT_ID não configurado no Supabase Secrets.')

      const redirectUri = req.headers.get('origin')
        ? `${req.headers.get('origin')}/settings`
        : 'http://localhost:5173/settings'

      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/calendar.events&access_type=offline&prompt=consent`

      return new Response(JSON.stringify({ url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'exchangeCode') {
      const clientId = Deno.env.get('GOOGLE_CLIENT_ID')
      const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')
      if (!clientId || !clientSecret)
        throw new Error(
          'Credenciais do Google não configuradas no Supabase Secrets.',
        )

      const redirectUri = req.headers.get('origin')
        ? `${req.headers.get('origin')}/settings`
        : 'http://localhost:5173/settings'

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: payload.code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      })
      const tokens = await tokenResponse.json()

      if (tokens.error)
        throw new Error(tokens.error_description || tokens.error)

      const { data: existing } = await supabase
        .from('user_integrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('provider', 'google')
        .maybeSingle()

      if (existing) {
        await supabase
          .from('user_integrations')
          .update({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: new Date(
              Date.now() + tokens.expires_in * 1000,
            ).toISOString(),
          })
          .eq('id', existing.id)
      } else {
        await supabase.from('user_integrations').insert({
          user_id: user.id,
          provider: 'google',
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: new Date(
            Date.now() + tokens.expires_in * 1000,
          ).toISOString(),
        })
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'createEvent') {
      let { data: integration } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google')
        .single()

      if (!integration)
        throw new Error(
          'Google Agenda não conectado. Por favor, conecte nas configurações.',
        )

      integration = await refreshAccessTokenIfNeeded(integration, supabase)

      const eventDate = new Date(payload.date)
      const event = {
        summary: payload.title,
        start: { dateTime: eventDate.toISOString() },
        end: {
          dateTime: new Date(
            eventDate.getTime() + 60 * 60 * 1000,
          ).toISOString(),
        },
        conferenceData: {
          createRequest: {
            requestId: crypto.randomUUID(),
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      }

      const res = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${integration.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        },
      )

      const data = await res.json()
      if (data.error) throw new Error(data.error.message)

      return new Response(
        JSON.stringify({
          success: true,
          eventId: data.id,
          meetLink: data.hangoutLink,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    if (action === 'syncEvents') {
      let { data: integration } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google')
        .single()

      if (!integration)
        throw new Error(
          'Google Agenda não conectado. Por favor, conecte nas configurações.',
        )

      integration = await refreshAccessTokenIfNeeded(integration, supabase)

      const timeMin = new Date().toISOString()
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&singleEvents=true&maxResults=100`,
        {
          headers: {
            Authorization: `Bearer ${integration.access_token}`,
          },
        },
      )

      const data = await res.json()
      if (data.error) throw new Error(data.error.message)

      const { data: activities } = await supabase
        .from('activities')
        .select('id, google_event_id')
        .not('google_event_id', 'is', null)
        .eq('completed', false)

      if (activities && activities.length > 0) {
        const cancelledEventIds = activities
          .filter((act) => {
            const gEvent = data.items?.find(
              (item: any) => item.id === act.google_event_id,
            )
            return gEvent && gEvent.status === 'cancelled'
          })
          .map((act) => act.id)

        if (cancelledEventIds.length > 0) {
          await supabase
            .from('activities')
            .update({ completed: true, result: 'Cancelado (Google)' })
            .in('id', cancelledEventIds)
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Eventos sincronizados com sucesso',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    throw new Error('Ação inválida')
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
