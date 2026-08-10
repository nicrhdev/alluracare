// src/app/[locale]/shop/components/PriceRangeSlider.tsx

'use client';

import { useState, useEffect, useRef } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
  onChange: (min: number, max: number) => void;
  locale: string;
}

export default function PriceRangeSlider({
  min,
  max,
  currentMin,
  currentMax,
  onChange,
  locale,
}: PriceRangeSliderProps) {
  const isPersian = locale === 'fa';
  const [minVal, setMinVal] = useState(currentMin || min);
  const [maxVal, setMaxVal] = useState(currentMax || max);
  const rangeRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number) => {
    if (isPersian) {
      const tomanRate = 50000;
      const tomanPrice = price * tomanRate;
      return new Intl.NumberFormat('fa-IR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(tomanPrice) + ' تومان';
    }
    return '$' + price;
  };

  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(value);
    onChange(value, maxVal);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(value);
    onChange(minVal, value);
  };

  useEffect(() => {
    setMinVal(currentMin || min);
    setMaxVal(currentMax || max);
  }, [currentMin, currentMax, min, max]);

  return (
    <div className="space-y-4">
      {/* Range Slider */}
      <div className="relative pt-1">
        <div className="relative h-2 bg-brand-pale-rose rounded-full">
          {/* Track Fill */}
          <div
            className="absolute h-full bg-brand-primary rounded-full"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />
        </div>

        {/* Min Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
          className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-soft"
          style={{
            zIndex: 1,
          }}
        />

        {/* Max Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-soft"
          style={{
            zIndex: 2,
          }}
        />

        {/* Min/Max Labels */}
        <div className="flex justify-between mt-3">
          <div className="flex flex-col items-start">
            <span className="text-xs text-brand-text-secondary">
              {isPersian ? 'حداقل' : 'Min'}
            </span>
            <span className="text-sm font-semibold text-brand-text">
              {formatPrice(minVal)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-brand-text-secondary">
              {isPersian ? 'حداکثر' : 'Max'}
            </span>
            <span className="text-sm font-semibold text-brand-text">
              {formatPrice(maxVal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}