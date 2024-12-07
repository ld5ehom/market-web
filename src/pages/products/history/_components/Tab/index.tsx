import Link from 'next/link'
import Text from '@/components/common/Text'

type Props = {
    currentTab: 'sell' | 'buy'
}

export default function Tab({ currentTab }: Props) {
    return (
        <div className="flex gap-2 my-5">
            {/* Sales History */}
            <Text
                size="lg"
                weight="bold"
                color={currentTab === 'sell' ? 'uclaBlue' : 'grey'}
            >
                <Link href="/products/history/sell">Sales History</Link>
            </Text>

            <Text size="lg">|</Text>

            {/* Purchase History */}
            <Text
                size="lg"
                weight="bold"
                color={currentTab === 'buy' ? 'uclaBlue' : 'grey'}
            >
                <Link href="/products/history/buy">Purchase History</Link>
            </Text>
        </div>
    )
}
