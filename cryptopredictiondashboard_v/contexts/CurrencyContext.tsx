'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Currency = 'USD' | 'INR'

type CurrencyContextType = {
  currency: Currency
  setCurrency: (currency: Currency) => void
  convertPrice: (price: number) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const EXCHANGE_RATE_API = 'https://v6.exchangerate-api.com/v6/2956f6cabb4f0273510dc7bb/latest/USD'

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [exchangeRate, setExchangeRate] = useState<number>(1)

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(EXCHANGE_RATE_API)
        if (!response.ok) throw new Error('Failed to fetch exchange rate')
        const data = await response.json()
        setExchangeRate(data.conversion_rates.INR)
      } catch (error) {
        console.error('Error fetching exchange rate:', error)
        setExchangeRate(83.12) // Fallback rate if API fails
      }
    }

    fetchExchangeRate()
    // Update exchange rate every hour
    const interval = setInterval(fetchExchangeRate, 3600000)
    return () => clearInterval(interval)
  }, [])

  const convertPrice = (price: number) => {
    return currency === 'INR' ? price * exchangeRate : price
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

