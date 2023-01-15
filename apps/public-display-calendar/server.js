import 'https://deno.land/std@0.165.0/dotenv/load.ts'
import { serve } from 'https://deno.land/std@0.165.0/http/server.ts'
import { serveDir } from 'https://deno.land/std@0.165.0/http/file_server.ts'

import { DateTime } from 'npm:luxon@3.2.1'

import parseICS from './ics.js'

const ICS_URL = Deno.env.get('ICS_URL')

serve(async function(request) {
    const url = new URL(request.url)
    const pathname = url.pathname

    if (pathname.startsWith('/api/calendar')) {
        const response = await fetch(ICS_URL)
        const ics = await response.text()

        const before = DateTime.now().minus({ days: 7 }).startOf('day').toJSDate()
        const after = DateTime.now().plus({ days: 30 }).startOf('day').toJSDate()

        const json = parseICS({ics, before, after})

        return Response.json(json)
    }

    else {
        return serveDir(request, {
            fsRoot: 'public',
        })
    }
})
