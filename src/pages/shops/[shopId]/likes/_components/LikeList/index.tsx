import { useEffect, useState } from 'react'
import LikeItem from '../LikeItem'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import Link from 'next/link'
import { getShopLikes } from '@/repository/likes/getShopLikes'
import { Like } from '@/types'

type Props = {
    initialLikes: Like[]
    count: number
    shopId: string
}

export default function LikeList({ initialLikes, count, shopId }: Props) {
    const [likes, setLikes] = useState(
        (initialLikes || []).map((item) => ({ ...item, quantity: 1 })),
    )
    const [totalPrice, setTotalPrice] = useState<number>(0)

    useEffect(() => {
        const priceSum = likes.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        )
        setTotalPrice(priceSum)
    }, [likes])

    const handleQuantityChange = (id: string, delta: number) => {
        setLikes((prevLikes) =>
            prevLikes.map((item) => {
                if (item.id === id) {
                    const updatedQuantity = Math.max(1, item.quantity + delta)
                    return { ...item, quantity: updatedQuantity }
                }
                return item
            }),
        )
    }

    const handlePurchase = () => {
        alert('Purchase completed!')
    }

    return (
        <div>
            {likes.length === 0 ? (
                <Text color="uclaBlue"> Cart is empty. </Text>
            ) : (
                <>
                    {/* Grid layout for displaying liked products */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {likes.map(({ id, productId, price, quantity }) => (
                            <div
                                key={id}
                                className="max-w-[190px] w-full mx-auto p-4 hover:shadow-md transition-shadow"
                            >
                                {/* Link wraps the entire content to preserve layout */}
                                <Link href={`/products/${productId}`} passHref>
                                    <div className="block">
                                        <LikeItem productId={productId} />
                                    </div>
                                </Link>

                                {/* Count */}
                                <div className="flex justify-between items-center mt-2">
                                    <Button
                                        className="p-2 bg-uclaBlue text-sm"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleQuantityChange(id, -1)
                                        }}
                                    >
                                        -
                                    </Button>
                                    <Text size="md">{quantity}</Text>
                                    <Button
                                        className="p-2 bg-uclaBlue text-sm"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleQuantityChange(id, 1)
                                        }}
                                    >
                                        +
                                    </Button>
                                </div>

                                {/* Product price */}
                                <Text size="md" className="py-5 text-right">
                                    Price : ${(price * quantity).toFixed(2)}
                                </Text>
                            </div>
                        ))}
                    </div>

                    {/* Total Price and Purchase Button */}
                    <div className="mt-6 flex flex-col items-end">
                        <Text
                            size="lg"
                            color="darkestBlue"
                            className="mb-2 mr-4"
                        >
                            Total Price :{' '}
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            }).format(totalPrice)}
                        </Text>
                        <Button
                            onClick={handlePurchase}
                            color="uclaBlue"
                            className="rounded-full"
                        >
                            Proceed to checkout
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}
