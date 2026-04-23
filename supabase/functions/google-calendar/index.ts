import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { action, payload } = await req.json()

    if (action === 'getAuthUrl') {
      const clientId = Deno.env.get('GOOGLE_CLIENT_ID') || 'mock-client-id'
      const redirectUri = req.headers.get('origin')
        ? `${req.headers.get('origin')}/settings`
        : 'http://localhost:5173/settings'

      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/calendar.events&access_type=offline&prompt=consent`

      return new Response(JSON.stringify({ url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'exchangeCode') {
      await supabase.from('user_integrations').upsert({
        user_id: user.id,
        provider: 'google',
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
      })

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'createEvent') {
      const { data: integration } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google')
        .single()

      if (!integration)
        throw new Error(
          'Google Calendar is not conectado. Por favor, conecte nas configurações.',
        )

      const mockEventId = 'evt_' + Math.random().toString(36).substring(7)
      const mockMeetLink =
        'https://meet.google.com/' +
        Math.random().toString(36).substring(2, 5) +
        '-' +
        Math.random().toString(36).substring(2, 6) +
        '-' +
        Math.random().toString(36).substring(2, 5)

      return new Response(
        JSON.stringify({
          success: true,
          eventId: mockEventId,
          meetLink: mockMeetLink,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    if (action === 'syncEvents') {
      const { data: integration } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google')
        .single()

      if (!integration)
        throw new Error(
          'Google Calendar is not conectado. Por favor, conecte nas configurações.',
        )

      // Mock implementation to represent bi-directional sync behavior with Google Calendar API
      // Here it would fetch the events using access_token and update the 'activities' table
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Eventos sincronizados bidirecionalmente com sucesso (Mock)',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    throw new Error('Invalid action')
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
