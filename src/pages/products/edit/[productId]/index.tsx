import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import ProductForm from '../../_components/ProductForm'
import { getMe } from '@/repository/me/getMe'
import { getProduct } from '@/repository/products/getProduct'
import { Product } from '@/types'
import { City } from '@/utils/address'
import { AuthError } from '@/utils/error'
import getServerSupabase from '@/utils/supabase/getServerSupabase'

// Server-side rendering function to fetch product details (상품 정보를 가져오는 서버사이드 렌더링 함수)
export const getServerSideProps: GetServerSideProps<{
    product: Product // The product details to be passed as props (props로 전달될 상품 정보)
}> = async (context) => {
    const supabase = getServerSupabase(context)

    try {
        // Fetch user data to get the shop ID (사용자 데이터를 가져와 상점 ID를 확인)
        const {
            data: { shopId },
        } = await getMe(supabase)

        // If shop ID is missing, throw an authentication error (상점 ID가 없으면 인증 오류 발생)
        if (!shopId) {
            throw new AuthError()
        }

        // Retrieve the product ID from the query parameters (쿼리 파라미터에서 상품 ID를 가져옴)
        const productId = context.query.productId as string

        // Fetch the product details using the product ID (상품 ID를 사용해 상품 정보를 가져옴)
        const { data: product } = await getProduct(productId)

        // Return the product data as props (상품 데이터를 props로 반환)
        return { props: { product } }
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

export default function ProductEdit({
    product,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [city, district] = product.address.split(' ')

    return (
        <ProductForm
            id={product.id}
            imageUrls={product.imageUrls}
            title={product.title}
            isUsed={product.isUsed}
            isChangable={product.isChangable}
            price={product.price}
            city={city as City}
            district={district}
            description={product.description}
            tags={product.tags || undefined}
        />
    )
}
