import { generateSecret } from '../../lib/crypto'
import { getCookieDomain } from '../../lib/cookies'
import { getCorsHeaders } from '../../lib/cors'
import { getPasskeyApi } from '../../lib/passkeys'
import { getDb } from '../../lib/db'

interface RequestBody {
  email: string
  credential: any
}

function isSecureRequest(request: Request): boolean {
  const proto = request.headers.get('x-forwarded-proto')
  return proto === 'https'
}

export const POST = async (request: Request, env: Env): Promise<Response> => {
  const cors = getCorsHeaders(request)
  const body = (await request.json()) as RequestBody
  const email = body.email.trim().toLowerCase()

  const passkey = getPasskeyApi(env)
  const user = await getDb(env)
    .selectFrom('users')
    .select('token')
    .where('email', '=', email)
    .executeTakeFirst()

  // login flow
  if (user) {
    const result = await passkey.login.finalize(body.credential)
    if (!result.token) {
      return new Response(JSON.stringify({ error: 'Login failed' }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const session = user.token
    const domain = getCookieDomain(request, env)
    const secure = isSecureRequest(request) ? 'Secure;' : ''
    const cookie = `token=${session}; Path=/; ${domain}${secure} SameSite=None; Max-Age=${24 * 60 * 60}`

    return new Response(JSON.stringify({ success: true, token: session }), {
      headers: { ...cors, 'Content-Type': 'application/json', 'Set-Cookie': cookie },
    })
  }

  // registration flow
  const data = await passkey.registration.finalize(body.credential)
  if (!data.token) {
    return new Response(JSON.stringify({ error: 'Registration failed' }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  const newToken = generateSecret()
  try {
    await getDb(env)
      .insertInto('users')
      .values({ email, token: newToken })
      .execute()
  } catch (err) {
    return new Response(JSON.stringify({ error: 'DB insert failed', details: String(err) }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  const domain = getCookieDomain(request, env)
  const secure = isSecureRequest(request) ? 'Secure;' : ''
  const cookie = `token=${newToken}; Path=/; ${domain}${secure} SameSite=None; Max-Age=${24 * 60 * 60}`

  return new Response(JSON.stringify({ success: true, token: newToken }), {
    headers: { ...cors, 'Content-Type': 'application/json', 'Set-Cookie': cookie },
  })
}
