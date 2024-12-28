'use client'

import { useCryptoContext } from './CryptoContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowUpIcon, ArrowDownIcon, AlertTriangle } from 'lucide-react'
import { CryptoBanner } from './CryptoBanner'
import { PredictionTooltip } from './PredictionTooltip'
import { SearchBar } from './SearchBar'
import { Button } from '@/components/ui/button'

const ITEMS_PER_PAGE = 20

export default function Dashboard() {
  const { filteredData, loading, error, searchCrypto, isSearching, currentPage, setCurrentPage, totalPages } = useCryptoContext()
  const { currency, setCurrency, convertPrice } = useCurrency()

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-red-500 text-2xl text-center">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    </div>
  )

  const topCryptos = filteredData.slice(0, 4)
  const gradients = [
    'bg-gradient-to-r from-pink-500 to-purple-500',
    'bg-gradient-to-r from-blue-500 to-cyan-500',
    'bg-gradient-to-r from-orange-500 to-yellow-500',
    'bg-gradient-to-r from-indigo-500 to-purple-500'
  ]

  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-yellow-400">Crypto Glimpse</h1>
          <Select value={currency} onValueChange={(value: 'USD' | 'INR') => setCurrency(value)}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="INR">INR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-5xl font-bold text-white">Crypto Price Prediction</h2>
          <p className="text-xl text-gray-400">Glimpse Of Your Favourite Crypto Currency Price and Prediction</p>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={searchCrypto} isLoading={isSearching} />

        {/* Banners */}
        {filteredData.length > 0 ? (
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {topCryptos.map((crypto, index) => (
              <CryptoBanner
                key={crypto.id}
                name={crypto.name}
                symbol={crypto.symbol}
                price={crypto.current_price}
                change={crypto.price_change_percentage_24h}
                image={crypto.image}
                gradient={gradients[index % gradients.length]}
              />
            ))}
          </div>
        ) : (
          <div className="mb-8 text-center text-gray-400">No cryptocurrencies found</div>
        )}

        {/* Table */}
        <Card className="bg-gray-900 text-white">
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription className="text-gray-400">
              {filteredData.length === 0 
                ? "No cryptocurrencies found" 
                : "Track cryptocurrency prices and predictions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {paginatedData.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-400">Name</TableHead>
                      <TableHead className="text-gray-400">Price</TableHead>
                      <TableHead className="text-gray-400">24h Change</TableHead>
                      <TableHead className="text-gray-400">Market Cap</TableHead>
                      <TableHead className="text-gray-400">
                        <div className="flex items-center">
                          24h Prediction
                          <PredictionTooltip />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((coin) => (
                      <TableRow key={coin.id}>
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center">
                            <img src={coin.image} alt={coin.name} className="mr-2 h-6 w-6" />
                            {coin.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-white text-right">
                          {currency === 'INR' ? '₹' : '$'}
                          {convertPrice(coin.current_price).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className={`flex items-center justify-end ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {coin.price_change_percentage_24h > 0 ? <ArrowUpIcon className="mr-1 h-4 w-4" /> : <ArrowDownIcon className="mr-1 h-4 w-4" />}
                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                          </div>
                        </TableCell>
                        <TableCell className="text-white text-right">
                          {currency === 'INR' ? '₹' : '$'}
                          {(convertPrice(coin.market_cap) / 1000000).toFixed(2)}M
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={coin.prediction === 'bullish' ? 'default' : coin.prediction === 'bearish' ? 'destructive' : 'secondary'}>
                            {coin.prediction}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-4">No results found</div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center space-x-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-white flex items-center">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 bg-gray-800 p-4 rounded-lg text-white">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-yellow-400 mr-2 mt-1 flex-shrink-0" />
          <p className="text-sm">
            Predictions are for informational purposes only. Always consult a financial advisor before making investment decisions.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-400 text-sm">
        <p>© 2024 Crypto Glimpse | Powered by CoinGecko API</p>
      </footer>
    </div>
  )
}

