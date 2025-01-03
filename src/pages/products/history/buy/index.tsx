import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import ProductsLayout from '../../_components/ProductsLayout'
import Tab from '../_components/Tab'
import BuyProductList from './_components/BuyProductList'
import Container from '@/components/layout/Container'
import { getMe } from '@/repository/me/getMe'
import { getShopBuyCount } from '@/repository/shops/getShopBuyCount'
import { getShopBuys } from '@/repository/shops/getShopBuys'
import { Product } from '@/types'
import { AuthError } from '@/utils/error'
import getServerSupabase from '@/utils/supabase/getServerSupabase'

// Server-side rendering function to fetch initial data (초기 데이터를 가져오는 서버사이드 렌더링 함수)
export const getServerSideProps: GetServerSideProps<{
    products: Product[] // List of purchased products (구매한 상품 목록)
    count: number // Total number of purchases (총 구매 개수)
    shopId: string // The ID of the shop (상점 ID)
}> = async (context) => {
    const supabase = getServerSupabase(context)

    try {
        // Fetches user data to get the shop ID (사용자 데이터를 가져와 상점 ID를 얻음)
        const {
            data: { shopId },
        } = await getMe(supabase)

        // If no shop ID is found, throw an authentication error (상점 ID가 없으면 인증 오류 발생)
        if (!shopId) {
            throw new AuthError()
        }

        // Fetch purchased products and total purchase count using Promise.all (Promise.all을 사용하여 구매 상품과 총 구매 개수를 동시에 가져옴)
        const [{ data: products }, { data: count }] = await Promise.all([
            getShopBuys(supabase, { shopId, fromPage: 0, toPage: 1 }), // Fetch the purchased products for the shop (상점의 구매한 상품을 가져옴)
            getShopBuyCount(supabase, shopId), // Fetch the total purchase count for the shop (상점의 총 구매 개수를 가져옴)
        ])

        // Return the fetched data as props (가져온 데이터를 props로 반환)
        return { props: { products, count, shopId } }
    } catch (e) {
        // Handle authentication errors by redirecting to the login page (인증 오류 발생 시 로그인 페이지로 리디렉션)
        if (e instanceof AuthError) {
            return {
                redirect: {
                    destination: `/login?next=${encodeURIComponent(context.resolvedUrl)}`, // Append the current URL to the login page (현재 URL을 로그인 페이지에 추가)
                    permanent: false, // Temporary redirect (임시 리디렉션)
                },
            }
        }

        // Rethrow other errors to be handled by Next.js (다른 오류는 Next.js가 처리하도록 다시 던짐)
        throw e
    }
}

export default function ProductsHistoryBuy({
    products: initialProducts,
    count,
    shopId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <ProductsLayout currentTab="history">
            <Container>
                {/* Tab Navigation (탭 네비게이션) */}
                <Tab currentTab="buy" />

                {/* Table Header for Purchase List (구매 목록의 테이블 헤더) */}
                <div className="flex text-center border-y border-lighterBlue py-2">
                    <div className="w-28">Image</div> {/* 사진 */}
                    <div className="flex-1">Product Name</div> {/* 상품명 */}
                    <div className="w-28">Price</div> {/* 가격 */}
                    <div className="w-44">Action</div> {/* 기능 */}
                </div>

                {/* Buy Product List Component (구매 상품 목록 컴포넌트) */}
                <BuyProductList
                    initialProducts={initialProducts}
                    count={count}
                    shopId={shopId}
                />
            </Container>
        </ProductsLayout>
    )
}
