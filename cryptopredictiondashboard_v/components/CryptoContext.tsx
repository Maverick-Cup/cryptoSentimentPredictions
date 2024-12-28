'use client'

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'
import debounce from 'lodash/debounce'

type CryptoData = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  prediction: 'bullish' | 'bearish' | 'neutral'
}

type CryptoContextType = {
  cryptoData: CryptoData[]
  loading: boolean
  error: string | null
  searchCrypto: (query: string) => void
  filteredData: CryptoData[]
  isSearching: boolean
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPages: number
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined)

const COINGECKO_API_URL = process.env.NEXT_PUBLIC_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3'
const ITEMS_PER_PAGE = 20

function getPrediction(): 'bullish' | 'bearish' | 'neutral' {
  const random = Math.random()
  if (random < 0.33) return 'bullish'
  if (random < 0.66) return 'bearish'
  return 'neutral'
}

export const CryptoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [filteredData, setFilteredData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchInitialData = async () => {
    try {
      const response = await fetch(`${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false`)
      if (!response.ok) throw new Error('Failed to fetch initial data')
      
      const data: any[] = await response.json()
      const processedData = data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        current_price: Number(coin.current_price.toFixed(2)),
        price_change_percentage_24h: coin.price_change_percentage_24h,
        market_cap: coin.market_cap,
        prediction: getPrediction(),
      }))

      setCryptoData(processedData)
      setFilteredData(processedData)
      setTotalPages(Math.ceil(processedData.length / ITEMS_PER_PAGE))
    } catch (err) {
      console.error('Error fetching initial data:', err)
      setError('An error occurred while fetching initial data. Please try again later.')
      setCryptoData([])
      setFilteredData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInitialData()
    const interval = setInterval(fetchInitialData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      setIsSearching(true)
      try {
        if (!query.trim()) {
          setFilteredData(cryptoData)
          setTotalPages(Math.ceil(cryptoData.length / ITEMS_PER_PAGE))
          return
        }

        const lowercaseQuery = query.toLowerCase()
        const searchResults = cryptoData.filter(coin => 
          coin.name.toLowerCase().includes(lowercaseQuery) || 
          coin.symbol.toLowerCase().includes(lowercaseQuery)
        )

        setFilteredData(searchResults)
        setTotalPages(Math.ceil(searchResults.length / ITEMS_PER_PAGE))
        setCurrentPage(1) // Reset to first page when searching
      } catch (err) {
        console.error('Search failed:', err)
        setError('Search failed. Please try again later.')
        setFilteredData([])
      } finally {
        setIsSearching(false)
      }
    }, 300),
    [cryptoData]
  )

  const searchCrypto = (query: string) => {
    debouncedSearch(query)
  }

  return (
    <CryptoContext.Provider value={{ 
      cryptoData, 
      loading, 
      error, 
      searchCrypto, 
      filteredData,
      isSearching,
      currentPage,
      setCurrentPage,
      totalPages
    }}>
      {children}
    </CryptoContext.Provider>
  )
}

export const useCryptoContext = () => {
  const context = useContext(CryptoContext)
  if (context === undefined) {
    throw new Error('useCryptoContext must be used within a CryptoProvider')
  }
  return context
}

