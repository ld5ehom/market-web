import classNames from 'classnames'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { ReactNode } from 'react'
import 'dayjs/locale/en'
import ShopProfileImage from '@/components/common/ShopProfileImage'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import { Shop } from '@/types'

// Initialize dayjs with relative time plugin
dayjs.extend(relativeTime).locale('en')

// Define types for tab navigation
type Tabs = 'products' | 'reviews' | 'likes' | 'following' | 'follower'

type Props = {
    shop: Shop // Shop information
    productCount: number // Total product count
    reviewCount: number // Total review count
    likeCount: number // Total like count
    followingCount: number // Total following count
    followerCount: number // Total follower count
    currentTab: Tabs // Current active tab
    children: ReactNode // Child components
}

/**
 * Seller Layout Component
 * Provides the layout and structure for Seller pages with dynamic tabs and Seller details.
 */
export default function ShopLayout({
    shop,
    productCount,
    reviewCount,
    likeCount,
    followingCount,
    followerCount,
    currentTab,
    children,
}: Props) {
    return (
        <Wrapper>
            <Container>
                <div className="my-10">
                    {/* Seller Details Section */}
                    <div className="border border-lightestBlue flex h-64">
                        {/* Seller Profile Image */}
                        <div className="bg-lightestBlue h-full w-60 flex flex-col justify-center items-center">
                            <ShopProfileImage
                                imageUrl={shop.imageUrl || undefined}
                            />
                        </div>

                        {/* Seller Information */}
                        <div className="flex flex-col flex-1 gap-2 py-3">
                            {/* Shop name  */}
                            <div className="pl-4">
                                <Text size="lg">{shop.name}</Text>
                            </div>

                            {/* Seller Registration and Product Count */}
                            <div className="pl-4 flex gap-12 border-y border-lightestBlue py-2">
                                {/* Joined */}
                                <div className="flex gap-2">
                                    <Text size="sm" color="uclaBlue">
                                        Joined
                                    </Text>
                                    <Text size="sm">
                                        {dayjs(shop.createdAt).fromNow()}
                                    </Text>
                                </div>

                                {/* Products */}
                                <div className="flex gap-2">
                                    <Text size="sm" color="uclaBlue">
                                        Products
                                    </Text>
                                    <Text size="sm">
                                        {productCount.toLocaleString()}
                                    </Text>
                                </div>
                            </div>

                            {/* Shop Introduction */}
                            <div className="flex-1 px-5 py-1 overflow-hidden bg-white">
                                <Text
                                    size="sm"
                                    className="block h-full overflow-auto break-words"
                                >
                                    {shop.introduce}
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex w-full h-12 mt-6">
                    {/* Product Tab */}
                    <Link
                        href={`/shops/${shop.id}/products`}
                        className={classNames(
                            'flex-1 border flex justify-center items-center cursor-pointer',
                            currentTab === 'products'
                                ? 'border-uclaBlue border-b-0'
                                : 'bg-gray-200 text-gray-400 border-lightestBlue',
                        )}
                    >
                        Products{' '}
                        <Text className="ml-2">
                            {productCount.toLocaleString()}
                        </Text>
                    </Link>

                    {/* Review Tab */}
                    <Link
                        href={`/shops/${shop.id}/reviews`}
                        className={classNames(
                            'flex-1 border flex justify-center items-center cursor-pointer',
                            currentTab === 'reviews'
                                ? 'border-uclaBlue border-b-0'
                                : 'bg-gray-200 text-gray-500 border-lightestBlue',
                        )}
                    >
                        Reviews
                        <Text className="ml-2">
                            {reviewCount.toLocaleString()}
                        </Text>
                    </Link>

                    {/* Likes Tab */}
                    <Link
                        href={`/shops/${shop.id}/likes`}
                        className={classNames(
                            'flex-1 border flex justify-center items-center cursor-pointer',
                            currentTab === 'likes'
                                ? 'border-uclaBlue border-b-0'
                                : 'bg-gray-200 text-gray-500 border-lightestBlue',
                        )}
                    >
                        Likes{' '}
                        <Text className="ml-2">
                            {likeCount.toLocaleString()}
                        </Text>
                    </Link>

                    {/* Following Tab */}
                    <Link
                        href={`/shops/${shop.id}/following`}
                        className={classNames(
                            'flex-1 border flex justify-center items-center cursor-pointer',
                            currentTab === 'following'
                                ? 'border-uclaBlue border-b-0'
                                : 'bg-gray-200 text-gray-500 border-lightestBlue',
                        )}
                    >
                        Following
                        <Text className="ml-2">
                            {followingCount.toLocaleString()}
                        </Text>
                    </Link>

                    {/* Follower Tab */}
                    <Link
                        href={`/shops/${shop.id}/follower`}
                        className={classNames(
                            'flex-1 border flex justify-center items-center cursor-pointer',
                            currentTab === 'follower'
                                ? 'border-uclaBlue border-b-0'
                                : 'bg-gray-200 text-gray-500 border-lightestBlue',
                        )}
                    >
                        Followers
                        <Text className="ml-2">
                            {followerCount.toLocaleString()}
                        </Text>
                    </Link>
                </div>

                {/* Content Section */}
                <div>{children}</div>
            </Container>
        </Wrapper>
    )
}
