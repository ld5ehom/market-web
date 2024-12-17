import { useEffect, useState } from 'react'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import Spinner from '@/components/common/Spinner'
import Text from '@/components/common/Text'
import LoginPannel from '@/components/shared/LoginPannel'
import Container from '@/components/layout/Container'
import { getMe } from '@/repository/me/getMe'

export default function Login() {
    const [showModal, setShowModal] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>()

    useEffect(() => {
        if (showModal) {
            disablePageScroll()
        } else {
            enablePageScroll()
        }
    }, [showModal])

    // Login API
    useEffect(() => {
        ;(async () => {
            const {
                data: { shopId },
            } = await getMe()
            setIsLoggedIn(!!shopId)
        })()
    }, [])
    const handleLogOut = () => {
        alert('Log Out')
    }

    return (
        <>
            {/* 고정된 로그인 바 */}
            <div className="fixed top-0 left-0 w-full z-50 ">
                <Container className="flex justify-end items-center py-2">
                    {/* Sign in / register */}
                    {isLoggedIn === undefined ? (
                        <Text size="sm" color="darkestBlue">
                            <Spinner size="xs" />
                        </Text>
                    ) : isLoggedIn === false ? (
                        <Text
                            size="sm"
                            color="grey"
                            onClick={() => setShowModal(true)}
                            className="cursor-pointer"
                        >
                            Sign in / register
                        </Text>
                    ) : (
                        <Text
                            size="sm"
                            color="darkestBlue"
                            onClick={handleLogOut}
                            className="cursor-pointer"
                        >
                            Log Out
                        </Text>
                    )}
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
