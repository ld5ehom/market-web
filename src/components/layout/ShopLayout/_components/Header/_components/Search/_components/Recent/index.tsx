import Text from '@/components/common/Text'

// Props type for the Recent component
// Recent 컴포넌트의 Props 타입 정의
type Props = {
    handleClose: () => void // Function to handle closing the component
    // 컴포넌트를 닫는 함수를 정의
}

export default function Recent({ handleClose }: Props) {
    // Array to store recent search terms
    // 최근 검색어를 저장하는 배열
    const recents: string[] = []

    return (
        <div className="flex flex-col h-full">
            <div className="p-2 overflow-hidden flex-1">
                {/* Section for the 'Recent Searches' header */}
                {/* '최근 검색어' 제목 섹션 */}
                <div className="border-b border-uclaBlue pb-1 mb-2">
                    <Text size="sm" color="uclaBlue" weight="bold">
                        Recent Searches
                    </Text>
                </div>

                {recents.length === 0 ? (
                    // If there are no recent searches, display a message
                    // 최근 검색어가 없을 경우 메시지를 표시
                    <div className="h-full flex justify-center items-center">
                        <Text color="grey" size="sm">
                            No recent searches
                        </Text>
                    </div>
                ) : (
                    // If there are recent searches, display them in a scrollable container
                    // 최근 검색어가 있을 경우 스크롤 가능한 컨테이너에 표시
                    <div className="h-full overflow-scroll pb-8">
                        {recents.map((recent, idx) => (
                            <Text size="sm" key={idx} className="block my-1">
                                {recent}
                            </Text>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer section with 'Clear All' and 'Close' buttons */}
            {/* '전체 삭제' 및 '닫기' 버튼이 있는 하단 섹션 */}
            <div className="bg-gray-100 flex justify-between items-center h-8 px-2">
                <Text size="sm"> Clear All Searches </Text>
                <Text
                    size="sm"
                    onClick={handleClose}
                    className="cursor-pointer"
                >
                    Close
                </Text>
            </div>
        </div>
    )
}
