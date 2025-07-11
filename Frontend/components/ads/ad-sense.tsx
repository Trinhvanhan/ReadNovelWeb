// components/Adsense.tsx
import { useEffect } from 'react';

export default function Adsense() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <ins className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-xxxxxxx"
      data-ad-slot="yyyyyyy"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  );
}
