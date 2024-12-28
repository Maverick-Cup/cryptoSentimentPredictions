'use client'

import { useCurrency } from '@/contexts/CurrencyContext'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'

interface CryptoBannerProps {
  name: string
  symbol: string
  price: number
  change: number
  image: string
  gradient: string
}

export function CryptoBanner({ name, symbol, price, change, image, gradient, ...props }: CryptoBannerProps) {
  const { currency, convertPrice } = useCurrency()
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertPrice(price))

  return (
    <div className={`rounded-lg p-4 text-white ${gradient}`}>
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center space-x-3">
          <img src={image} alt={name} className="h-10 w-10" />
          <div className="flex flex-col">
            <span className="text-sm font-bold">{symbol.toUpperCase()}</span>
            <span className="text-xs text-gray-200">{name}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-lg font-bold truncate">{formattedPrice}</div>
          <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? (
              <ArrowUpIcon className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 mr-1" />
            )}
            {Math.abs(change).toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  )
}

