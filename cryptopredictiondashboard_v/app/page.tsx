import { Suspense } from 'react'
import Dashboard from '@/components/Dashboard'
import { CryptoProvider } from '@/components/CryptoContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'

export default function Home() {
  return (
    <CurrencyProvider>
      <CryptoProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Dashboard />
        </Suspense>
      </CryptoProvider>
    </CurrencyProvider>
  )
}

