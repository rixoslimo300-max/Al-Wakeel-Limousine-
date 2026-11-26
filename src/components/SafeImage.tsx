import React, { useState } from 'react';
import { Car } from 'lucide-react';
import heroLimousineImg from '../assets/images/hero_soueast_s07_clean_1795717054020.jpg';
import sedanImg from '../assets/images/fleet_elantra_cn7_rep_1795707507931.jpg';
import suvImg from '../assets/images/fleet_soueast_s07_clean_1795717054551.jpg';
import vanImg from '../assets/images/fleet_xpander_2026_gray_1795707505790.jpg';

export type AssetVariant = 'hero' | 'sedan' | 'suv' | 'van';

const LOCAL_ASSET_MAP: Record<AssetVariant, string> = {
  hero: heroLimousineImg,
  sedan: sedanImg,
  suv: suvImg,
  van: vanImg,
};

interface SafeImageProps {
  src?: string;
  alt: string;
  variant?: AssetVariant;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  variant = 'sedan',
  className = '',
  loading = 'lazy',
}) => {
  const localAsset = LOCAL_ASSET_MAP[variant] || sedanImg;
  const [currentSrc, setCurrentSrc] = useState<string>(src || localAsset);
  const [failedCompletely, setFailedCompletely] = useState(false);

  const handleError = () => {
    if (currentSrc !== localAsset) {
      setCurrentSrc(localAsset);
    } else {
      setFailedCompletely(true);
    }
  };

  if (failedCompletely) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#17283D] via-[#101B2A] to-[#0D1623] text-[#C6A66B]/70 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Car className="w-8 h-8 mb-2 opacity-75" />
        <span className="font-label text-[#9A9A96] px-4 text-center line-clamp-1">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
    />
  );
};
