import { NextRequest } from 'next/server'

export const revalidate = 86400

export async function GET(request: NextRequest) {
    const url = request.nextUrl
    const username = url.searchParams.get('username')

    if (!username) {
        return new Response(JSON.stringify({ error: 'Username is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    try {
        const response = await fetch(
            `
            https://github-contributions-api.jogruber.de/v4/${username}
        `,
            {
                next: { revalidate: 86400 },
            }
        )
        const data = await response.json()

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
            },
        })
    } catch (error) {
        console.error('GitHub Calendar error:', error)
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}
