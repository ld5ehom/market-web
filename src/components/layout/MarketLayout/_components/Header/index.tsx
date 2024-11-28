import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { ReactNode } from 'react'
import Search from './_components/Search'

import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'

// Aside bar children
type Props = { children: ReactNode }

export default function Header({ children }: Props) {
    const router = useRouter()

    return (
        <div className="sticky top-0 z-10 bg-lightestBlue border-b border-b-lighterBlue">
            <Wrapper>
                <Container>
                    <div className="flex justify-between items-center py-8">
                        {/* Logo */}
                        <div className="flex justify-center items-center">
                            <Link
                                href="/"
                                prefetch={false}
                                className="flex items-center gap-2"
                            >
                                <Image
                                    src="/logo.png" // UCLA store logo image path
                                    alt="Store Logo"
                                    className="mb-2"
                                    width={50} // Image width
                                    height={50} // Image height
                                />
                                <Text
                                    size="xl"
                                    style={{
                                        fontFamily: `'Black Han Sans', sans-serif`,
                                    }}
                                >
                                    Marketplace
                                </Text>
                            </Link>
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
