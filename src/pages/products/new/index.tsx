import { GetServerSideProps } from 'next'
import ProductForm from '../_components/ProductForm'
import { getMe } from '@/repository/me/getMe'
import { AuthError } from '@/utils/error'

// Define server-side logic to handle authentication and authorization (서버 측에서 인증 및 권한 처리를 수행)
export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
    try {
        // Fetch the current user's data to check shop ID (현재 사용자의 데이터를 가져와 상점 ID 확인)
        const {
            data: { shopId },
        } = await getMe()

        // If shop ID is missing, throw an AuthError to trigger a redirect (상점 ID가 없으면 AuthError를 발생시켜 리디렉션 처리)
        if (!shopId) {
            throw new AuthError()
        }

        // If shop ID exists, return empty props for the page (상점 ID가 존재하면 빈 props 반환)
        return {
            props: {},
        }
    } catch (e) {
        // Handle authentication errors by redirecting to the login page (인증 오류 발생 시 로그인 페이지로 리디렉션 처리)
        if (e instanceof AuthError) {
            return {
                redirect: {
                    destination: `/login?next=${encodeURIComponent(context.resolvedUrl)}`, // Append the current URL to the login page as a query parameter (현재 URL을 쿼리 파라미터로 로그인 페이지에 추가)
                    permanent: false, // Mark the redirect as temporary (임시 리디렉션으로 설정)
                },
            }
        }
        // Rethrow any other errors to let Next.js handle them (다른 오류는 Next.js가 처리하도록 다시 던짐)
        throw e
    }
}

// Render the ProductForm component for creating a new product (새로운 상품을 생성하기 위한 ProductForm 컴포넌트 렌더링)
export default function ProductNew() {
    return <ProductForm />
}
