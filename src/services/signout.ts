import { HttpService } from '@/utils/http.service'

export async function signout() {
  const resp = await HttpService.post('/merchant/auth/signout', {})
  return resp
}