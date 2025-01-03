import classNames from 'classnames'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { FormEvent, ReactNode, useState } from 'react'
import 'dayjs/locale/en'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import ShopProfileImage from '@/components/common/ShopProfileImage'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import { updateShopImageUrl } from '@/repository/shops/updateShopImageUrl'
import { updateShopIntroduce } from '@/repository/shops/updateShopIntroduce'
import { updateShopName } from '@/repository/shops/updateShopName'
import { Shop } from '@/types'
import supabase from '@/utils/supabase/browserSupabase'

// Initialize dayjs with relative time plugin
dayjs.extend(relativeTime).locale('en')

// Define types for tab navigation
type Tabs = 'products' | 'reviews' | 'likes' | 'following' | 'follower'

type Props = {
    isMyShop: boolean // Check my shop
    shop?: Shop // Shop information
    productCount: number // Total product count
    reviewCount: number // Total review count
    likeCount: number // Total like count
    followingCount: number // Total following count
    followerCount: number // Total follower count
    currentTab: Tabs // Current active tab
    children: ReactNode // Child components
}

// My shop edit
type EDIT_STUATUS = 'IDLE' | 'EDIT' | 'LOADING'

/**
 * Seller Layout Component
 * Provides the layout and structure for Seller pages with dynamic tabs and Seller details.
 */
export default function ShopLayout({
    isMyShop,
    shop,
    productCount,
    reviewCount,
    likeCount,
    followingCount,
    followerCount,
    currentTab,
    children,
}: Props) {
    // Supabase
    const [shopName, setShopName] = useState(shop?.name || '')
    const [shopIntroduce, setShopIntroduce] = useState(shop?.introduce || '')
    const [shopImageUrl, setShopImageUrl] = useState(shop?.imageUrl || '')

    // Shop edit
    const [shopNameStatus, setShopNameState] = useState<EDIT_STUATUS>('IDLE')
    const [shopIntroduceStatus, setShopIntroduceState] =
        useState<EDIT_STUATUS>('IDLE')

    // Supabase update my store(shop) name
    const handleSubmitShopName = async (e: FormEvent<HTMLFormElement>) => {
        if (!shop) {
            return
        }

        try {
            e.preventDefault()

            setShopNameState('LOADING')

            const formData = new FormData(e.currentTarget)
            const name = formData.get('name') as string

            await updateShopName(supabase, { shopId: shop.id, name })
            setShopName(name)
        } catch (e) {
            alert('Failed to update the shop name.')
        } finally {
            setShopNameState('IDLE')
        }
    }

    // Supabase update my store introduce
    const handleSubmitShopIntroduce = async (e: FormEvent<HTMLFormElement>) => {
        if (!shop) {
            return
        }

        try {
            e.preventDefault()

            setShopIntroduceState('LOADING')

            const formData = new FormData(e.currentTarget)
            const introduce = formData.get('introduce') as string

            await updateShopIntroduce(supabase, { shopId: shop.id, introduce })
            setShopIntroduce(introduce)
        } catch (e) {
            alert('Failed to update the shop introduce.')
        } finally {
            setShopIntroduceState('IDLE')
        }
    }

    // Supabase update shop profile image
    const handleSubmitShopProfileImage = async (
        e: FormEvent<HTMLFormElement>,
    ) => {
        if (!shop) {
            return
        }

        try {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const imageFile = formData.get('image') as File
            const {
                data: { imageUrl },
            } = await updateShopImageUrl(supabase, {
                shopId: shop.id,
                imageFile,
            })
            setShopImageUrl(imageUrl)
        } catch (e) {
            alert('Failed to update the profile image.')
        }
    }

    if (!shop) {
        return
    }

    return (
        <Wrapper>
            <Container>
                <div className="my-10">
                    {/* Seller Details Section */}
                    <div className="border border-lightestBlue flex h-64">
                        {/* Seller Profile Image */}
                        <div className="bg-lightestBlue h-full w-60 flex flex-col justify-center items-center gap-2">
                            {/* Display shop profile image for others, or editable profile image for shop owner */}
                            {!isMyShop ? (
                                <ShopProfileImage
                                    imageUrl={shopImageUrl || undefined}
                                />
                            ) : (
                                <>
                                    {/* Form for uploading a new profile image */}
                                    <form
                                        onChange={handleSubmitShopProfileImage}
                                    >
                                        <label
                                            htmlFor="image"
                                            className="cursor-pointer"
                                        >
                                            <ShopProfileImage
                                                imageUrl={
                                                    shopImageUrl || undefined
                                                }
                                            />
                                        </label>
                                        <input
                                            type="file" // File input for profile image
                                            name="image"
                                            id="image"
                                            hidden // Hidden input field
                                            accept=".jpg, .jpeg, .png" // Accept only specific image formats
                                        />
                                    </form>

                                    {/* TODO : Link to manage the shop */}
                                    <Link href="/products">
                                        <div className="border border-black text-black px-3 py-2 my-2">
                                            Manage Image
                                        </div>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Seller Information */}
                        <div className="flex flex-col flex-1 gap-2 py-3">
                            {/* Shop name  */}
                            <div className="pl-4 flex items-center">
                                {/* Conditional rendering based on shop ownership and shopNameStatus */}
                                {isMyShop ? (
                                    shopNameStatus === 'IDLE' ? (
                                        <>
                                            {/* Display shop name with edit button */}
                                            <Text size="lg">{shopName}</Text>
                                            <Button
                                                size="sm" // Small button size
                                                className="ml-6" // Margin-left for spacing
                                                outline // Outline style for the button
                                                onClick={() =>
                                                    setShopNameState('EDIT')
                                                } // Trigger edit state
                                            >
                                                Edit Name
                                            </Button>
                                        </>
                                    ) : (
                                        <form onSubmit={handleSubmitShopName}>
                                            {/* Input field for editing shop name */}
                                            <Input
                                                name="name"
                                                className="text-xs w-60" // Small text size and fixed width
                                                placeholder="Enter a new name (at least 2 characters)"
                                                disabled={
                                                    shopNameStatus === 'LOADING'
                                                } // Disable input while loading
                                                required // Make the field required
                                                autoComplete="off" // Turn off autocomplete
                                                minLength={2} // Minimum length validation
                                            />

                                            {/* Submit button for saving the new shop name */}
                                            <Button
                                                type="submit"
                                                className="text-sm w-20" // Small text and fixed width
                                                isLoading={
                                                    shopNameStatus === 'LOADING'
                                                } // Show loading state
                                            >
                                                Confirm
                                            </Button>
                                        </form>
                                    )
                                ) : (
                                    // Display shop name for non-owners
                                    <Text size="lg">{shopName}</Text>
                                )}
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
                            <div className="flex flex-col flex-1 px-4 overflow-hidden bg-white">
                                {isMyShop ? (
                                    shopIntroduceStatus === 'IDLE' ? (
                                        <>
                                            {/* Display shop description with edit button (소개글과 수정 버튼 표시) */}
                                            <Text
                                                size="sm"
                                                className="block overflow-scroll h-full bg-white"
                                            >
                                                {shopIntroduce}
                                            </Text>
                                            <Button
                                                size="sm"
                                                outline
                                                className="w-40"
                                                onClick={() =>
                                                    setShopIntroduceState(
                                                        'EDIT',
                                                    )
                                                }
                                            >
                                                Edit Description
                                            </Button>
                                        </>
                                    ) : (
                                        <form
                                            onSubmit={handleSubmitShopIntroduce}
                                            className="flex h-full flex-1"
                                        >
                                            {/* Editable textarea for shop description (소개글을 입력할 수 있는 텍스트 에리어) */}
                                            <textarea
                                                name="introduce"
                                                className="flex-1 p-1 mb-2 text-sm border outline-none disabled:opacity-50"
                                                placeholder="Enter shop description"
                                                disabled={
                                                    shopIntroduceStatus ===
                                                    'LOADING'
                                                }
                                            >
                                                {shopIntroduce}
                                            </textarea>
                                            <Button
                                                type="submit"
                                                size="xs"
                                                outline
                                                className="w-20"
                                                isLoading={
                                                    shopIntroduceStatus ===
                                                    'LOADING'
                                                }
                                            >
                                                Confirm
                                            </Button>
                                        </form>
                                    )
                                ) : (
                                    // Display shop description for non-owners (소유자가 아닌 경우 소개글 표시)
                                    <Text
                                        size="sm"
                                        className="block overflow-auto h-full bg-white" // scroll bar -> ovwerflow-scroll
                                    >
                                        {shopIntroduce}
                                    </Text>
                                )}
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

                    {/* Likes (Cart) Tab */}
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
