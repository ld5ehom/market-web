import { GetServerSideProps } from 'next'
import { getMe } from '@/repository/me/getMe'

// Server-side logic for fetching user shop and redirecting
// (사용자 상점 정보를 가져오고 리디렉션하는 서버사이드 로직)
export const getServerSideProps: GetServerSideProps = async (context) => {
    // Fetch user information (사용자 정보 가져오기)
    const {
        data: { shopId }, // Extract shopId from user data (사용자 데이터에서 shopId 추출)
    } = await getMe()

    // If the user is not logged in or has no shop, throw an error
    if (shopId === null) {
        throw new Error('Login is required.')
    }

    // Redirect to the user's shop page
    return {
        redirect: {
            destination: `/shops/${shopId}`, // Destination shop page (리디렉션 대상 상점 페이지)
            permanent: false, // Temporary redirect (임시 리디렉션)
        },
    }
}

// Placeholder component for server-side redirect
// (서버사이드 리디렉션을 위한 플레이스홀더 컴포넌트)
export default function MyShops() {
    return null
}
