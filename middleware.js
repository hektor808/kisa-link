import { NextResponse } from 'next/server';
import { supabase } from './lib/supabase'; // Modül 5'te oluşturduğumuz istemci

// Bu dizi, middleware'in çalışmaması gereken yolları belirtir.
// API yolları, statik dosyalar vb. bunun dışında tutulmalıdır.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function middleware(request) {
  // Gelen isteğin yolunu alıyoruz (örn: /2Bu5Okq)
  const pathname = request.nextUrl.pathname;

  // Ana sayfayı (/) görmezden gel
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Baştaki '/' karakterini kaldırarak short_code'u elde et
  const short_code = pathname.slice(1);

  // Veritabanından bu short_code'a karşılık gelen kaydı bul
  const { data, error } = await supabase
    .from('urls')
    .select('long_url')
    .eq('short_code', short_code)
    .single();
    
  // Eğer bir kayıt bulunduysa, kullanıcıyı o uzun linke yönlendir
  if (data && data.long_url) {
    console.log(`Yönlendiriliyor: ${short_code} -> ${data.long_url}`);
    return NextResponse.redirect(new URL(data.long_url));
  }
  
  // Eğer kayıt bulunamadıysa, isteğin normal şekilde devam etmesine izin ver
  // (Bu, Next.js'in 404 sayfasını göstermesini sağlar)
  return NextResponse.next();
}