import { getCookieDomain } from '../lib/cookies'

export const GET = async (request: Request, _env: Env): Promise<Response> => {
  const cookieDomain = getCookieDomain(request)
  const setCookie = `token=; Path=/; ${cookieDomain}Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
      'Set-Cookie': setCookie,
    },
  })
}
