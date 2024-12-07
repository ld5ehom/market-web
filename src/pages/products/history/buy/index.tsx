import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import ProductsLayout from '../../_components/ProductsLayout'
import Tab from '../_components/Tab'
import BuyProductList from './_components/BuyProductList'
import Container from '@/components/layout/Container'
import { getMe } from '@/repository/me/getMe'
import { getShopBuyCount } from '@/repository/shops/getShopBuyCount'
import { getShopBuys } from '@/repository/shops/getShopBuys'
import { Product } from '@/types'

// Server-side rendering function to fetch initial data (초기 데이터를 가져오는 서버사이드 렌더링 함수)
export const getServerSideProps: GetServerSideProps<{
    products: Product[]
    count: number
    shopId: string
}> = async (context) => {
    const {
        data: { shopId },
    } = await getMe() // Fetches user data to get the shop ID (사용자 데이터를 가져와 상점 ID를 얻음)

    if (!shopId) {
        throw new Error('Login required') // Throws an error if the user is not logged in (로그인하지 않은 경우 오류 발생)
    }

    // Fetches purchased products and the total count using Promise.all (Promise.all을 사용하여 구매 상품과 총 구매 개수를 가져옴)
    const [{ data: products }, { data: count }] = await Promise.all([
        getShopBuys({ shopId, fromPage: 0, toPage: 1 }),
        getShopBuyCount(shopId),
    ])
    return { props: { products, count, shopId } } // Passes data as props to the page (데이터를 props로 페이지에 전달)
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
