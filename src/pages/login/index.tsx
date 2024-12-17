import { GetServerSideProps } from 'next'
import LoginPannel from '@/components/shared/LoginPannel'
import { getMe } from '@/repository/me/getMe'

// Server-side rendering function to handle login redirection
// (로그인 리디렉션을 처리하는 서버사이드 렌더링 함수)
export const getServerSideProps: GetServerSideProps = async (context) => {
    // Fetch user information to check shop ID (사용자 정보를 가져와 상점 ID 확인)
    const {
        data: { shopId },
    } = await getMe()

    // If the user already has a shop ID, redirect to the destination or home page
    // (사용자가 이미 상점 ID를 가지고 있다면 리디렉션 처리)
    if (shopId) {
        const destination = context.query.next
            ? decodeURIComponent(context.query.next as string) // Decode the "next" query parameter if present (쿼리 파라미터 "next"가 있으면 디코딩)
            : '/' // Default to the home page if "next" is not provided (쿼리가 없으면 기본 홈 페이지로 설정)
        return {
            redirect: {
                destination, // Redirect to the intended destination (리디렉션 목적지)
                permanent: false, // Temporary redirect (임시 리디렉션)
            },
        }
    }

    // If no shop ID is found, render the login page (상점 ID가 없으면 로그인 페이지 렌더링)
    return { props: {} }
}

// Login page component
export default function Login() {
    return (
        <div
            className="flex justify-center items-center" // Center align the login panel (로그인 패널을 중앙 정렬)
            style={{ minHeight: 'inherit' }} // Set the minimum height to inherit from the parent (최소 높이를 부모 요소로부터 상속)
        >
            {/* Render the login panel component (로그인 패널 컴포넌트 렌더링) */}
            <LoginPannel />{' '}
        </div>
    )
}
