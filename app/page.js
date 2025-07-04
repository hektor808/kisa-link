'use client';

import { useState } from 'react';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShortUrl('');
    setError('');
    setIsCopied(false);

    // Basit URL doğrulaması
    try {
      new URL(longUrl);
    } catch (err) {
      setError('Lütfen geçerli bir URL girin.');
      setIsLoading(false);
      return;
    }
    
    // API isteği (Bu API'yi bir sonraki modülde oluşturacağız)
    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ long_url: longUrl }),
    });

    const data = await res.json();

    if (res.ok) {
      setShortUrl(data.short_url);
    } else {
      setError(data.error || 'Bir hata oluştu.');
    }

    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // 2 saniye sonra "Kopyalandı" yazısını kaldır
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-lg p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Kısa<span className="text-blue-500">Link</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Hızlı, basit ve etkili URL kısaltma servisi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://uzun-linkinizi-buraya-yapistirin.com/"
              className="w-full px-5 py-3 text-lg text-gray-900 bg-white border border-gray-300 rounded-full focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition duration-300 ease-in-out"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-5 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition duration-300 ease-in-out flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kısaltılıyor...
              </>
            ) : (
              'Kısalt!'
            )}
          </button>
        </form>

        <div className="h-16 mt-4 text-center">
          {error && (
            <p className="text-red-400 bg-red-900/50 px-4 py-2 rounded-md">{error}</p>
          )}
          {shortUrl && (
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-full">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 truncate pl-2">
                {shortUrl}
              </a>
              <button onClick={handleCopy} className={`px-4 py-2 text-sm font-bold text-white rounded-full transition-colors duration-300 ${isCopied ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isCopied ? 'Kopyalandı!' : 'Kopyala'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}