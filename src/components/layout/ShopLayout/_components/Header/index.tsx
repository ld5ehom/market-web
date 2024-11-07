import Image from 'next/image'
import { ReactNode } from 'react'
import Search from './_components/Search'

import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'

// Aside bar children
type Props = { children: ReactNode }

export default function Header({ children }: Props) {
    return (
        <div className="sticky top-0 z-10 bg-lightestBlue border-b border-b-uclaBlue">
            <Wrapper>
                <Container>
                    <div className="flex justify-between items-center py-8">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Image
                                src="/logo.jpg" // 로고 이미지 파일 경로
                                alt="Store Logo"
                                width={100} // 이미지 너비
                                height={100} // 이미지 높이
                            />
                            <Text
                                size="4xl"
                                style={{
                                    fontFamily: `'Black Han Sans', sans-serif`,
                                }}
                                className="ml-1" // 텍스트와 이미지 사이의 간격 조정
                            >
                                {/* Store Font */}
                            </Text>
                        </div>

                        {/* Search Bar */}
                        <Search />

                        {/* Right menu bar */}
                        <div className="flex gap-5">
                            <div className="flex items-center">
                                <span className="material-symbols-outlined">
                                    sell
                                </span>
                                <Text weight="light" size="sm" className="mx-1">
                                    Sell
                                </Text>
                            </div>

                            <div className="flex items-center">
                                <span className="material-symbols-outlined">
                                    storefront
                                </span>
                                <Text weight="light" size="sm" className="mx-1">
                                    My Store
                                </Text>
                            </div>

                            <div className="flex items-center">
                                <span className="material-symbols-outlined">
                                    chat_bubble
                                </span>
                                <Text weight="light" size="sm" className="mx-1">
                                    Chat
                                </Text>
                            </div>
                        </div>
                    </div>
                </Container>
            </Wrapper>
            {children}
        </div>
    )
}
