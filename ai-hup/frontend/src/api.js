// غلاف بسيط حول fetch عشان كل صفحة ما تكرر نفس الكود: JSON headers،
// إرفاق التوكن، معالجة الأخطاء. مطابق لملف الأستاذ.
 
const BASE_URL = 'http://127.0.0.1:8000'
 
export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
 
  // هذا السطر هو اللي يخلي المسارات المحمية تشتغل - الباكند (HTTPBearer)
  // يقرا بالضبط هذا الـ Header.
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
 
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
 
  // fetch يرفض بس لو صار خطأ بالشبكة - رد بحالة 401 أو 403 يضل "ناجح"
  // بنظر fetch. نحول أي رد مو 2xx لخطأ نقدر نمسكه بـ try/catch.
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    // FastAPI يحط رسالة الخطأ بحقل اسمه "detail"
    throw new Error(data.detail || `Request failed (${response.status})`)
  }
 
  return response.json()
}