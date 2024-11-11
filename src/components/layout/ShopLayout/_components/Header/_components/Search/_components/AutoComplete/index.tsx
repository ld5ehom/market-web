import Text from '@/components/common/Text'

// Props type for the AutoComplete component
// AutoComplete 컴포넌트의 Props 타입 정의
type Props = {
    query: string // The search query entered by the user
    // 사용자가 입력한 검색어
    handleClose: () => void // Function to handle closing the component
    // 컴포넌트를 닫는 함수를 정의
}

export default function AutoComplete({ query, handleClose }: Props) {
    // Array to store autocomplete keywords
    // 자동 완성 키워드를 저장하는 배열
    const keywords: string[] = []

    return (
        <div className="flex flex-col h-full">
            <div className="p-2 overflow-hidden flex-1">
                {/* Header section for store search */}
                {/* 상점 검색 헤더 섹션 */}
                <div className="border-b border-grey-300 pb-1 mb-2 flex items-center">
                    <span className="material-symbols-outlined">
                        storefront
                    </span>
                    <Text size="sm" className="ml-1">
                        Store Search {'>'}
                        {/* 상점 검색 */}
                    </Text>
                    <Text size="sm" color="red" className="mx-1">
                        {query} {/* Display the search query */}
                        {/* 검색어 표시 */}
                    </Text>
                    <Text size="sm" color="grey">
                        Search by store name
                        {/* 상점명으로 검색 */}
                    </Text>
                </div>

                {keywords.length === 0 ? (
                    // If there are no autocomplete keywords, show a message
                    // 자동 완성 키워드가 없을 경우 메시지를 표시
                    <div className="h-full flex justify-center items-center">
                        <Text color="grey" size="sm">
                            No recommended keywords
                            {/* 추천 검색어가 없습니다 */}
                        </Text>
                    </div>
                ) : (
                    // If there are autocomplete keywords, display them in a scrollable container
                    // 자동 완성 키워드가 있을 경우 스크롤 가능한 컨테이너에 표시
                    <div className="h-full overflow-scroll pb-8">
                        {keywords.map((recent, idx) => (
                            <Text size="sm" key={idx} className="block my-1">
                                {recent}
                            </Text>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer section with a close button */}
            {/* 닫기 버튼이 있는 하단 섹션 */}
            <div className="bg-gray-100 flex justify-end items-center h-8 px-2">
                <Text
                    size="sm"
                    onClick={handleClose}
                    className="cursor-pointer"
                >
                    Close
                    {/* 닫기 */}
                </Text>
            </div>
        </div>
    )
}
