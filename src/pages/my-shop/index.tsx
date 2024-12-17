import { GetServerSideProps } from 'next'
import { getMe } from '@/repository/me/getMe'
import { AuthError } from '@/utils/error'

// Server-side logic for fetching user shop and handling redirection
// (사용자 상점 정보를 가져오고 리디렉션을 처리하는 서버사이드 로직)
export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        // Fetch user information to retrieve the shop ID (사용자 정보를 가져와 상점 ID 확인)
        const {
            data: { shopId },
        } = await getMe()

        // If the user is not logged in or does not have a shop, throw an authentication error
        // (사용자가 로그인하지 않았거나 상점이 없는 경우 인증 오류 발생)
        if (!shopId) {
            throw new AuthError()
        }

        // Redirect the user to their shop page if shop ID exists
        // (상점 ID가 있으면 사용자를 해당 상점 페이지로 리디렉션)
        return {
            redirect: {
                destination: `/shops/${shopId}`, // The shop page URL (상점 페이지 URL)
                permanent: false, // Temporary redirect (임시 리디렉션)
            },
        }
    } catch (e) {
        // Handle authentication errors by redirecting to the login page
        // (인증 오류 발생 시 로그인 페이지로 리디렉션)
        if (e instanceof AuthError) {
            return {
                redirect: {
                    destination: `/login?next=${encodeURIComponent('/my-shop')}`, // Append the intended URL to the login page (로그인 페이지에 리디렉션 URL 추가)
                    permanent: false, // Temporary redirect (임시 리디렉션)
                },
            }
        }

        // Rethrow other errors to be handled by Next.js (다른 오류는 Next.js가 처리하도록 다시 던짐)
        throw e
    }
}

// Placeholder component for server-side redirect
// (서버사이드 리디렉션을 위한 플레이스홀더 컴포넌트)
export default function MyShops() {
    return null
}
