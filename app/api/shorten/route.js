import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Az önce oluşturduğumuz istemci
import { nanoid } from 'nanoid';

export async function POST(request) {
  try {
    const { long_url } = await request.json();

    // URL'nin geçerli olup olmadığını kontrol et
    if (!long_url || !isValidHttpUrl(long_url)) {
      return NextResponse.json({ error: 'Geçerli bir URL girilmedi.' }, { status: 400 });
    }

    // 1. Benzersiz bir short_code oluştur
    // nanoid(7) -> yaklaşık 7 karakterli rastgele bir kod üretir.
    const short_code = nanoid(7);

    // 2. Supabase'e yeni kaydı ekle
    const { data, error } = await supabase
      .from('urls')
      .insert([
        { long_url: long_url, short_code: short_code },
      ])
      .select()
      .single(); // .single() eklenen kaydı geri döndürür

    if (error) {
      console.error('Supabase Hatası:', error);
      // Çakışma hatası varsa, farklı bir kod ile tekrar dene (basit bir çözüm)
      if (error.code === '23505') { // unique constraint violation
         return NextResponse.json({ error: 'Kod oluşturulamadı, lütfen tekrar deneyin.' }, { status: 500 });
      }
      return NextResponse.json({ error: 'Veritabanına yazılırken bir hata oluştu.' }, { status: 500 });
    }

    // 3. Başarılı yanıtı oluştur ve geri döndür
    // Vercel'de çalışan projenin URL'sini alıyoruz
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const short_url = `${domain}/${data.short_code}`;

    return NextResponse.json({ short_url });

  } catch (error) {
    console.error('Genel Hata:', error);
    return NextResponse.json({ error: 'Beklenmedik bir hata oluştu.' }, { status: 500 });
  }
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}