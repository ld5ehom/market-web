import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import 'dayjs/locale/en'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ProductImage from './_components/ProductImage'
import ReviewItem from './_components/ReviewItem'
import Button from '@/components/common/Button'
import Product from '@/components/common/Product'
import Shop from '@/components/common/Shop'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import { getIsFollowedByShopId } from '@/repository/followers/getIsFollowedByShopId'
import { getIsLikedWithProductIdAndShopId } from '@/repository/likes/getIsLikedWithProductIdAndShopId'
import { getMe } from '@/repository/me/getMe'
import { getProduct } from '@/repository/products/getProduct'
import { getProductsByTag } from '@/repository/products/getProductsByTag'
import { getShop } from '@/repository/shops/getShop'
import { getShopFollowerCount } from '@/repository/shops/getShopFollowerCount'
import { getShopProductCount } from '@/repository/shops/getShopProductCount'
import { getShopProducts } from '@/repository/shops/getShopProducts'
import { getShopReviewCount } from '@/repository/shops/getShopReviewCount'
import { getShopReviews } from '@/repository/shops/getShopReviews'
import { Review, Product as TProduct, Shop as TShop } from '@/types'
import { addRecentItemId } from '@/utils/localstorage'

/**
 * Fetch product details, user information, and like status from the server
 * 서버에서 제품 정보, 사용자 정보, 찜 상태를 가져옴
 */
export const getServerSideProps: GetServerSideProps<{
    product: TProduct // Product data to be passed to the component (컴포넌트에 전달할 제품 데이터)
    shop: TShop
    productCount: number
    followerCount: number
    myShopId: string | null // User's shop ID or null if not logged in (사용자의 상점 ID 또는 로그인이 안 된 경우 null)
    isLiked: boolean // Whether the product is liked by the user (사용자가 제품을 찜했는지 여부)
    isFollowed: boolean
    suggest: TProduct[]
    shopProducts: TProduct[]
    reviews: Review[]
    reviewCount: number
}> = async (context) => {
    const productId = context.query.productId as string

    // Fetch product data from the repository (리포지토리에서 제품 데이터를 가져옴)
    const { data: product } = await getProduct(productId)
    const {
        data: { shopId: myShopId },
    } = await getMe()

    // Check if the product is liked by the user's shop (사용자의 상점이 제품을 찜했는지 확인)
    const [
        { data: isLiked },
        productsByTagsResult,
        { data: shop },
        { data: productCount },
        { data: followerCount },
        { data: isFollowed },
        { data: shopProducts },
        { data: reviews },
        { data: reviewCount },
    ] = await Promise.all([
        myShopId !== null
            ? await getIsLikedWithProductIdAndShopId({
                  productId,
                  shopId: myShopId,
              })
            : { data: false },
        Promise.all((product.tags || []).map((tag) => getProductsByTag(tag))),
        getShop(product.createdBy),
        getShopProductCount(product.createdBy),
        getShopFollowerCount(product.createdBy),
        myShopId !== null
            ? getIsFollowedByShopId({
                  followerId: myShopId,
                  followedId: product.createdBy,
              })
            : { data: false },
        getShopProducts({ shopId: product.createdBy, fromPage: 0, toPage: 1 }),
        getShopReviews({ shopId: product.createdBy, fromPage: 0, toPage: 1 }),
        getShopReviewCount(product.createdBy),
    ])

    /**
     * Extract the data from each result and flatten the array to get a list of suggested products
     * 각 결과에서 데이터를 추출하고 배열을 평탄화하여 추천 제품 목록을 생성
     */
    const suggest = productsByTagsResult.map(({ data }) => data).flat()

    // Return the fetched data as props (가져온 데이터를 props로 반환)
    return {
        props: {
            product,
            shop,
            productCount,
            followerCount,
            myShopId,
            isLiked,
            suggest,
            isFollowed,
            shopProducts,
            reviews,
            reviewCount,
        },
    }
}

// Extend dayjs with the relativeTime plugin and set locale to us
dayjs.extend(relativeTime).locale('en')

// Main component for the Product Detail page (상품 상세 페이지의 메인 컴포넌트)
export default function ProductDetail({
    product,
    shop,
    productCount,
    followerCount,
    myShopId,
    suggest,
    shopProducts,
    reviews,
    reviewCount,
    isLiked: initialIsLiked,
    isFollowed: initialIsFollowed,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter() // Next.js 라우터 사용
    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [isFollowed, setIsFollowed] = useState(initialIsFollowed)

    const { productId } = router.query // URL에서 productId 가져오기

    // URL의 productId가 변경될 때 데이터를 다시 가져오는 로직 추가
    /*
    useEffect(() => {
        if (productId) {
            // productId가 있을 때만 데이터를 다시 가져옴
            console.log('URL이 변경되었습니다. 새로운 데이터를 가져옵니다.')
            // 여기에 데이터를 가져오는 API 호출 로직을 추가합니다
            // 예를 들어: fetchProductData(productId); 와 같은 API 호출
        }
    }, [productId])*/

    // Function to check if the user is authenticated before performing an action
    // 사용자가 인증되었는지 확인한 후 작업을 수행하는 함수
    const checkAuth = (func: Function) => () => {
        if (!myShopId) {
            alert('You need to login.')
            return
        }
        func()
    }

    // Handle like action (찜하기 동작 처리)
    const handleToggleLike = checkAuth(() => {
        setIsLiked((prev) => !prev)
        // TODO : Send request to the server (서버에 요청을 보냄)
    })

    // Handle chat action (채팅하기 동작 처리)
    const handleChat = checkAuth(() => {
        alert('Start Chat')
    })

    // Handle purchase action (구매하기 동작 처리)
    const handlePruchase = checkAuth(() => {
        alert('Purchase Now')
    })

    const handleToggleFollow = checkAuth(() => {
        setIsFollowed((prev) => !prev)
        // TODO : Send request to the server (서버에 요청을 보냄)
    })

    // Recent View history
    useEffect(() => {
        addRecentItemId(product.id)
    }, [product.id])

    return (
        <Wrapper>
            <Container>
                <div className="flex gap-6 my-6">
                    {/* Product image section */}
                    <div className="w-96 h-96 shrink-0">
                        <ProductImage imageUrls={product.imageUrls} />
                    </div>
                    <div
                        className="flex flex-col justify-between flex-1"
                        style={{ minWidth: 0 }}
                    >
                        <div>
                            {/* Product title */}
                            <div className="truncate">
                                <Text size="4xl" weight="bold">
                                    {product.title}
                                </Text>
                            </div>

                            {/* Product price */}
                            <div className="my-6">
                                <Text size="2xl"> $ </Text>
                                <Text size="3xl">
                                    {product.price.toLocaleString()}
                                </Text>
                            </div>

                            {/* Product creation date */}
                            <div className="border-t border-lightestBlue py-4 flex gap-1 items-center">
                                <Text color="uclaBlue" className="flex">
                                    <span
                                        className="material-symbols-outlined"
                                        style={{
                                            fontSize: '1.25rem',
                                        }}
                                    >
                                        schedule
                                    </span>
                                </Text>
                                <Text color="uclaBlue">
                                    {dayjs(product.createdAt).fromNow()}
                                </Text>
                            </div>
                        </div>

                        {/* Action buttons  (getIsLikedWithProductIdAndShopId) */}
                        <div className="flex gap-2">
                            {/* Add to Cart */}
                            <Button
                                fullWidth
                                color="uclaBlue"
                                className="flex justify-center items-center gap-1 rounded-full"
                                onClick={() => handleToggleLike()}
                            >
                                <span
                                    style={{ fontSize: '1.25rem' }}
                                    className="material-symbols-outlined"
                                >
                                    shopping_cart
                                </span>
                                <Text color="white">
                                    {isLiked ? 'Delete' : 'Add to Cart'}
                                </Text>{' '}
                            </Button>

                            {/* Chat */}
                            <Button
                                fullWidth
                                color="darkestGold"
                                className="flex justify-center items-center gap-1 rounded-full"
                                onClick={() => handleChat()}
                            >
                                <span
                                    style={{ fontSize: '1rem' }}
                                    className="material-symbols-outlined"
                                >
                                    chat_bubble
                                </span>
                                <Text color="white"> Chat </Text>{' '}
                            </Button>

                            {/* Buy Now */}
                            <Button
                                fullWidth
                                disabled={!!product.purchaseBy}
                                color="uclaBlue"
                                className="flex justify-center items-center gap-1 rounded-full"
                                onClick={() => handlePruchase()}
                            >
                                <Text color="white">
                                    {!!product.purchaseBy
                                        ? 'Sold Out'
                                        : 'Buy Now'}{' '}
                                </Text>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Product description and details (제품 설명 및 상세 정보) */}
                <div className="flex border-t border-lighterBlue pt-5">
                    <div className="w-4/6 pr-2">
                        {/* Product Information */}
                        <div className="border-b border-lighterBlue pb-3">
                            <Text size="xl">Product Information</Text>{' '}
                        </div>

                        {/* Description */}
                        <div className="mt-5 mb-10">{product.description}</div>

                        <div className="border-y border-lighterBlue justify-center py-4 flex gap-2 ">
                            {/* Used or New Product */}
                            <div className="rounded-full bg-lightestBlue px-3 py-1 text-sm ">
                                {product.isUsed
                                    ? 'Used Product'
                                    : 'New Product'}{' '}
                            </div>

                            {/* Exchangeable */}
                            <div className="rounded-full bg-lightestBlue px-3 py-1 text-sm">
                                {product.isChangable
                                    ? 'Exchangeable'
                                    : 'Not Exchangeable'}{' '}
                            </div>
                        </div>

                        {/* Location and Tag */}
                        <div className="flex py-4 border-b mb-10 border-lighterBlue">
                            {/* Location */}
                            <div className="flex-1 flex flex-col items-center gap-2">
                                <Text size="lg" color="darkerBlue">
                                    Location
                                </Text>
                                <Text color="uclaBlue">
                                    {' '}
                                    {product.address}{' '}
                                </Text>{' '}
                            </div>

                            {/* Tags */}
                            <div className="flex-1 flex flex-col items-center gap-2">
                                <Text size="lg" color="darkerBlue">
                                    Tags
                                </Text>
                                <div className="flex gap-2 flex-wrap justify-center">
                                    {product.tags === null ? (
                                        <Text color="uclaBlue">
                                            {' '}
                                            No product tags available.{' '}
                                        </Text>
                                    ) : (
                                        product.tags.map((tag) => (
                                            <div
                                                key={tag}
                                                className="bg-lightestBlue rounded-xl px-2 text-sm"
                                            >
                                                {tag}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Similar Tag Products */}
                        {suggest.length === 0 ? null : (
                            <div>
                                {/* Title */}
                                <div>
                                    <Text size="xl">
                                        {' '}
                                        Products related to this item
                                    </Text>
                                </div>

                                {/* related products List */}
                                <div className="my-5 flex gap-3 flex-wrap">
                                    {suggest
                                        .slice(0, 3)
                                        .map(
                                            ({
                                                id,
                                                title,
                                                price,
                                                createdAt,
                                                imageUrls,
                                            }) => (
                                                <div key={id} className="w-48">
                                                    <Link
                                                        href={`/products/${id}`}
                                                    >
                                                        <Product
                                                            title={title}
                                                            price={price}
                                                            createdAt={
                                                                createdAt
                                                            }
                                                            imageUrl={
                                                                imageUrls[0]
                                                            }
                                                        />
                                                    </Link>
                                                </div>
                                            ),
                                        )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Buttom-Right Seller Review Information */}
                    <div className="w-2/6 border-l border-lighterBlue pl-2">
                        <div className="border-b border-lighterBlue pb-3 text-center">
                            <Text size="xl"> Seller Information </Text>
                        </div>
                        <div className="p-10">
                            <Shop
                                name={shop.name}
                                profileImageUrl={shop.imageUrl || undefined}
                                productCount={productCount}
                                followerCount={followerCount}
                                type="row"
                                handleClickTitle={() =>
                                    router.push(`/shops/${shop.id}`)
                                }
                                handleClickProfileImage={() =>
                                    router.push(`/shops/${shop.id}`)
                                }
                                handleClickProductCount={() =>
                                    router.push(`/shops/${shop.id}/products`)
                                }
                                handleClickFollowerCount={() =>
                                    router.push(`/shops/${shop.id}/follower`)
                                }
                            />
                        </div>
                        {/* Follow Button */}
                        <Button
                            className="rounded-full"
                            color="uclaBlue"
                            fullWidth
                            onClick={handleToggleFollow}
                        >
                            <Text
                                color="white"
                                className="flex justify-center items-center gap-4"
                            >
                                <span className="material-symbols-outlined">
                                    {isFollowed
                                        ? 'person_remove'
                                        : 'person_add'}
                                </span>
                                {isFollowed ? 'Unfollow' : 'Follow'}
                            </Text>
                        </Button>

                        {/* Seller items */}
                        <div className="grid grid-cols-2 gap-2 mt-5">
                            {shopProducts
                                .slice(0, 2)
                                .map(({ id, imageUrls, price }) => (
                                    <Link
                                        key={id}
                                        href={`/products/${id}`}
                                        className="relative aspect-square"
                                    >
                                        <Image
                                            src={imageUrls[0]}
                                            alt=""
                                            layout="fill"
                                            style={{ objectFit: 'cover' }} // objectFit을 style 속성으로 설정
                                            className="object-cover"
                                        />
                                        <div className="absolute bottom-0 w-full bg-lighterBlue opacity-60 text-center py-1">
                                            <Text color="black" size="md">
                                                {new Intl.NumberFormat(
                                                    'en-US',
                                                    {
                                                        style: 'currency',
                                                        currency: 'USD',
                                                        minimumFractionDigits: 2,
                                                    },
                                                ).format(price)}
                                            </Text>
                                        </div>
                                    </Link>
                                ))}
                        </div>

                        {/* Product Review */}
                        {shopProducts.length > 2 && (
                            <Link
                                href="/" // TODO
                                className="block border-b border-lighterBlue text-center py-3"
                            >
                                <Text size="md" color="uclaBlue">
                                    {shopProducts.length - 2} items
                                </Text>{' '}
                                <Text size="sm" color="black">
                                    See more products {'>>'}
                                </Text>
                            </Link>
                        )}
                        <div>
                            {/* Reviews title */}
                            <div className="my-4 border-b border-lighterBlue pb-4 text-center">
                                <Text color="red" size="lg">
                                    {reviewCount}
                                </Text>{' '}
                                <Text size="md">Reviews</Text>
                            </div>

                            {/* Reviews */}
                            <div>
                                {reviews
                                    .slice(0, 2)
                                    .map(
                                        ({
                                            id,
                                            contents,
                                            createdBy,
                                            createdAt,
                                        }) => (
                                            <ReviewItem
                                                key={id}
                                                contents={contents}
                                                createdBy={createdBy}
                                                createdAt={createdAt}
                                            />
                                        ),
                                    )}
                            </div>

                            {/* See more reviews */}
                            <div>
                                <Link
                                    href={`/shops/${shop.id}/reviews`}
                                    className="block border-y border-lighterBlue text-center py-2"
                                >
                                    <Text color="uclaBlue" size="sm">
                                        See more reviews {'>'}
                                    </Text>
                                </Link>
                            </div>

                            {/* Button */}
                            <div className="flex gap-1 my-7">
                                <Button
                                    fullWidth
                                    color="orange"
                                    className="flex justify-center items-center gap-1 rounded-full"
                                    onClick={() => handleChat()}
                                >
                                    <span
                                        style={{ fontSize: '1rem' }}
                                        className="material-symbols-outlined"
                                    >
                                        chat_bubble
                                    </span>
                                    <Text color="white">Chat</Text>
                                </Button>
                                <Button
                                    fullWidth
                                    color="red"
                                    className="flex justify-center items-center gap-1 rounded-full"
                                    disabled={!!product.purchaseBy}
                                    onClick={() => handlePruchase()}
                                >
                                    <Text color="white">
                                        {!!product.purchaseBy
                                            ? 'Sold Out'
                                            : 'Buy Now'}
                                    </Text>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Wrapper>
    )
}
