import { useEffect, useState } from 'react'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

import Text from '@/components/common/Text'
import LoginPannel from '@/components/shared/LoginPannel'
import Container from '@/components/layout/Container'

export default function Login() {
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (showModal) {
            disablePageScroll()
        } else {
            enablePageScroll()
        }
    }, [showModal])

    return (
        <>
            {/* 고정된 로그인 바 */}
            <div className="fixed top-0 left-0 w-full z-50 ">
                <Container className="flex justify-end items-center py-2">
                    <Text
                        size="sm"
                        color="darkestBlue"
                        onClick={() => setShowModal(true)}
                        className="cursor-pointer"
                    >
                        Sign in / register
                    </Text>
                </Container>
            </div>

            {showModal && (
                <div
                    className="fixed top-0 left-0 w-screen h-screen bg-gray-400/50 z-50 flex justify-center items-center"
                    onClick={() => setShowModal(false)}
                >
                    <LoginPannel />
                </div>
            )}
        </>
    )
}
