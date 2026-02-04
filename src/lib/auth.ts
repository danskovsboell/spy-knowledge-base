const CORRECT_PASSWORD = 'Spy2010!'
const COOKIE_KEY = 'spy-kb-auth'

export function checkPassword(password: string): boolean {
  return password === CORRECT_PASSWORD
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(COOKIE_KEY) === 'true'
}

export function setAuthenticated(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(COOKIE_KEY, 'true')
}

export function clearAuthenticated(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(COOKIE_KEY)
}
