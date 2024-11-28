import type { AppProps } from 'next/app'

import '@/styles/globals.css'
import MarketLayout from '@/components/layout/MarketLayout'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <MarketLayout>
            <Component {...pageProps} />
        </MarketLayout>
    )
}
