import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import ProductsLayout from '../_components/ProductsLayout'
import ProductList from './_components/ProductList'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import { getMe } from '@/repository/me/getMe'
import { getShopProductCount } from '@/repository/shops/getShopProductCount'
import { getShopProducts } from '@/repository/shops/getShopProducts'
import { Product } from '@/types'
import { AuthError } from '@/utils/error'

// Provides a product management interface where shop owners can view, edit,and delete their products.
// ( 상점 주인이 상품을 확인, 수정 및 삭제할 수 있는 관리 인터페이스 제공.)
export const getServerSideProps: GetServerSideProps<{
    products: Product[] // List of products (상품 리스트)
    count: number // Total product count (전체 상품 수)
    shopId: string // Shop ID (상점 ID)
}> = async (context) => {
    // Extract shopId from user data (사용자 데이터에서 shopId 추출)
    try {
        const {
            data: { shopId },
        } = await getMe()

        // Login is required.
        if (!shopId) {
            throw new AuthError()
        }

        const [{ data: products }, { data: count }] = await Promise.all([
            getShopProducts({ shopId, fromPage: 0, toPage: 1 }), // Fetch initial products (초기 상품 리스트 가져오기)
            getShopProductCount(shopId), // Fetch total product count (전체 상품 수 가져오기)
        ])

        return {
            props: {
                shopId,
                products,
                count,
            },
        }
    } catch (e) {
        if (e instanceof AuthError) {
            return {
                redirect: {
                    destination: `/login?next=${encodeURIComponent(context.resolvedUrl)}`,
                    permanent: false,
                },
            }
        }
        throw e
    }
}

// Page component for product management (상품 관리를 위한 페이지 컴포넌트)
export default function ProductsManage({
    products: initialProducts,
    count,
    shopId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <ProductsLayout currentTab="manage">
            <Container>
                <div className="my-10">
                    {/* Header row for product table (상품 테이블 헤더 행) */}
                    <div className="flex text-center border-y border-uclaBlue py-2">
                        <Text className="w-28">Photo </Text>
                        <Text className="w-28">Status </Text>
                        <Text className="flex-1">Name </Text>
                        <Text className="w-28">Price </Text>
                        <Text className="w-32">Registered</Text>
                        <Text className="w-32">Actions </Text>
                    </div>

                    {/* Product list rendering (상품 리스트 렌더링) */}
                    <ProductList
                        initialProducts={initialProducts} // Initial product data (초기 상품 데이터)
                        count={count} // Total product count (전체 상품 수)
                        shopId={shopId} // Shop ID (상점 ID)
                    />
                </div>
            </Container>
        </ProductsLayout>
    )
}
