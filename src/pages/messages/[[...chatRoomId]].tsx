import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { Virtuoso } from 'react-virtuoso'
import ChatMessages from './_components/ChatMessages'
import ChatPreview from './_components/ChatPreview'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import { getChatRooms } from '@/repository/chatRooms/getChatRooms'
import { getMe } from '@/repository/me/getMe'
import { ChatRoom } from '@/types'

// Fetches chat room data and shop ID during server-side rendering (서버사이드 렌더링 중 채팅방 데이터와 상점 ID를 가져옴)
export const getServerSideProps: GetServerSideProps<{
    chatRooms: ChatRoom[]
    shopId: string
}> = async (context) => {
    const {
        data: { shopId },
    } = await getMe() // Fetch user data to get the shop ID (사용자 데이터를 가져와 상점 ID를 얻음)

    // Throws an error if the user is not logged in (로그인하지 않은 경우 오류 발생)
    if (!shopId) {
        throw new Error('Login required')
    }

    // Fetch chat rooms for the shop (상점의 채팅방 데이터를 가져옴)
    const { data: chatRooms } = await getChatRooms(shopId)

    return {
        props: { chatRooms, shopId }, // Passes chat rooms and shop ID as props (채팅방과 상점 ID를 props로 전달)
    }
}

export default function Messages({
    chatRooms,
    shopId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const currentChatRoomId = router.query.chatRoomId?.[0]
    const currentChatRoom = chatRooms.find(({ id }) => id === currentChatRoomId)

    return (
        <Wrapper className="bg-lightestBlue">
            <Container>
                {/* Main chat layout with sidebar and chat panel (사이드바와 채팅 패널을 포함한 주요 채팅 레이아웃) */}
                <div className="flex bg-white border-x border-lighterBlue">
                    {/* Sidebar displaying list of chat rooms (채팅방 목록을 표시하는 사이드바) */}
                    <div
                        className="w-1/2 h-full flex overflow-scroll"
                        style={{
                            minHeight: 'calc(100vh - 28px - 108px - 65px)', // Ensures consistent sidebar height (일관된 사이드바 높이 설정)
                            maxHeight: 'calc(100vh - 28px - 108px - 65px)',
                        }}
                    >
                        {/* Displays a message if no chat rooms exist (채팅방이 없는 경우 메시지를 표시) */}
                        {chatRooms.length === 0 ? (
                            <div className="flex justify-center items-center flex-1">
                                <Text color="lighterBlue" size="2xl">
                                    No chat rooms available{' '}
                                </Text>
                            </div>
                        ) : (
                            <div className="flex flex-col flex-1">
                                {/* Renders a list of chat room previews (채팅방 미리보기를 렌더링) */}
                                <Virtuoso
                                    initialTopMostItemIndex={Math.max(
                                        chatRooms.findIndex(
                                            ({ id }) =>
                                                id === currentChatRoomId,
                                        ),
                                        0,
                                    )}
                                    data={chatRooms}
                                    itemContent={(
                                        _,
                                        { id, fromShopId, toShopId },
                                    ) => (
                                        <ChatPreview
                                            key={id}
                                            chatRoomId={id}
                                            shopId={
                                                fromShopId === shopId
                                                    ? toShopId
                                                    : fromShopId
                                            }
                                            isActive={currentChatRoomId === id}
                                        />
                                    )}
                                />
                            </div>
                        )}
                    </div>

                    {/* Chat panel for displaying selected chat content (선택한 채팅 내용을 표시하는 채팅 패널) */}
                    <div
                        className="w-1/2 border-l border-grey px-2"
                        style={{
                            minHeight: 'calc(100vh - 28px - 108px - 65px)', // Set the minimum height by subtracting specific element heights from the viewport height
                            maxHeight: 'calc(100vh - 28px - 108px - 65px)', // Set the maximum height using the same calculation
                        }}
                    >
                        {/* Display a message when no chat room is selected */}
                        {!currentChatRoom ? (
                            <div className="flex justify-center items-center h-full">
                                <Text color="grey">Please select a chat</Text>{' '}
                            </div>
                        ) : (
                            <ChatMessages
                                chatRoomId={currentChatRoom.id}
                                myShopId={shopId}
                                counterShopId={
                                    currentChatRoom.fromShopId === shopId
                                        ? currentChatRoom.toShopId
                                        : currentChatRoom.fromShopId
                                }
                            />
                        )}
                    </div>
                </div>
            </Container>
        </Wrapper>
    )
}
