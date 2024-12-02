import Link from 'next/link'
import { ReactNode } from 'react'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'

type Props = {
    children: ReactNode // ReactNode type for rendering child components (자식 컴포넌트를 렌더링하기 위한 ReactNode 타입)
    currentTab: 'new' | 'manage' | 'history' // Current active tab (현재 활성 탭)
}

// Provides a tabbed navigation layout for product pages,
// including "New Product", "Manage Products", and "Purchase/Sales History" tabs.
//  "상품 등록", "상품 관리", "구매/판매 내역" 탭을 포함한 상품 페이지를 위한 탭 레이아웃 제공
export default function ProductsLayout({ children, currentTab }: Props) {
    return (
        <Wrapper>
            {/* Header navigation with tab layout (탭 레이아웃이 포함된 헤더 네비게이션) */}
            <div className=" mt-4">
                <Container>
                    <div className="flex gap-7 items-center">
                        {/* "New Product" tab link (상품 등록 탭 링크) */}
                        <Text
                            size="md"
                            color={currentTab === 'new' ? 'uclaBlue' : 'grey'}
                        >
                            <Link href="/products/new">New Product</Link>
                        </Text>
                        |{/* "Manage Products" tab link (상품 관리 탭 링크) */}
                        <Text
                            size="md"
                            color={
                                currentTab === 'manage' ? 'uclaBlue' : 'grey'
                            }
                        >
                            <Link href="/products/manage">Manage Products</Link>
                        </Text>
                        |
                        {/* "Purchase/Sales History" tab link (구매/판매 내역 탭 링크) */}
                        <Text
                            size="md"
                            color={
                                currentTab === 'history' ? 'uclaBlue' : 'grey'
                            }
                        >
                            <Link href="/products/history">History</Link>
                        </Text>
                    </div>
                </Container>
            </div>
            {/* Render child components */}
            {children}
        </Wrapper>
    )
}
