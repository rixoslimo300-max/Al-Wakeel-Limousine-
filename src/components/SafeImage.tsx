import React, { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import heroLimousineImg from '../assets/images/hero_soueast_s07.webp';
import sedanImg from '../assets/images/fleet_elantra_cn7.webp';
import suvImg from '../assets/images/fleet_soueast_s07.webp';
import sportageImg from '../assets/images/fleet_kia_sportage_2027.webp';
import carnivalImg from '../assets/images/fleet_kia_carnival_2027.webp';
import vanImg from '../assets/images/fleet_mitsubishi_xpander_2027.webp';
import hiaceImg from '../assets/images/fleet_toyota_hiace_m55.webp';

export type AssetVariant = 'hero' | 'sedan' | 'suv' | 'sportage' | 'carnival' | 'van' | 'hiace';

const LOCAL_ASSET_MAP: Record<AssetVariant, string> = {
  hero: heroLimousineImg,
  sedan: sedanImg,
  suv: suvImg,
  sportage: sportageImg,
  carnival: carnivalImg,
  van: vanImg,
  hiace: hiaceImg,
};

interface SafeImageProps {
  src?: string;
  alt: string;
  variant?: AssetVariant;
  unavailableTextAr?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  variant = 'sedan',
  unavailableTextAr,
  className = '',
  loading = 'lazy',
  width = 1000,
  height = 558,
}) => {
  const localAsset = LOCAL_ASSET_MAP[variant] || sedanImg;
  const [currentSrc, setCurrentSrc] = useState<string>(src || localAsset);
  const [failedCompletely, setFailedCompletely] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || localAsset);
    setFailedCompletely(false);
  }, [src, localAsset]);

  if (unavailableTextAr) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#17283D] via-[#101B2A] to-[#0D1623] text-[#C9A96B]/85 px-5 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Car className="w-8 h-8 opacity-75 shrink-0" />
        <span className="text-xs font-semibold text-[#DFC89B] leading-snug">{alt}</span>
        <span className="text-[11px] text-[#9A9A96] leading-relaxed max-w-xs">
          {unavailableTextAr}
        </span>
      </div>
    );
  }

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
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
    />
  );
};
