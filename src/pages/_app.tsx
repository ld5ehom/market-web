import type { AppProps } from 'next/app'
import Head from 'next/head'
import '@/styles/globals.css'
import MarketLayout from '@/components/layout/MarketLayout'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <MarketLayout>
            <Head>
                <title>Marketplace</title>
                <meta property="og:title" content="Marketplace" key="title" />
            </Head>
            <Component {...pageProps} />
        </MarketLayout>
    )
}
