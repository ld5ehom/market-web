import { useEffect, useState } from 'react'

import Text from '@/components/common/Text'
import { getProductsByKeyword } from '@/repository/products/getProductsByKeyword'

// Props type for the AutoComplete component
// AutoComplete 컴포넌트의 Props 타입 정의
type Props = {
    query: string // The search query entered by the user
    // 사용자가 입력한 검색어
    handleClose: () => void // Function to handle closing the component
    // 컴포넌트를 닫는 함수를 정의
}

export default function AutoComplete({ query, handleClose }: Props) {
    // State to store autocomplete keywords
    // 자동 완성 키워드를 저장하는 상태
    const [keywords, setKeywords] = useState<string[]>([])

    // Effect to fetch keywords based on the query
    // 검색어에 따라 키워드를 가져오는 효과
    useEffect(() => {
        ;(async () => {
            if (!query) {
                // Clear keywords if the query is empty
                // 검색어가 비어 있으면 키워드를 초기화
                setKeywords([])
                return
            }
            const { data } = await getProductsByKeyword({
                query, // The search query  검색어
                fromPage: 0, // Start page for fetching data   데이터를 가져오는 시작 페이지
                toPage: 2, // End page for fetching data   데이터를 가져오는 종료 페이지
            })
            // Update keywords with product titles
            // 상품 제목으로 키워드를 업데이트
            setKeywords(data.map(({ title }) => title))
        })()
    }, [query])

    return (
        <div className="flex flex-col h-full">
            <div className="p-2 overflow-hidden flex-1">
                {/* Header section for store search */}
                <div className="border-b border-grey-300 pb-1 mb-2 flex items-center">
                    <span className="material-symbols-outlined shrink-0">
                        storefront
                    </span>

                    <Text size="sm" className="ml-1 shrink-0">
                        Store Search {'>'}
                    </Text>

                    <Text
                        size="sm"
                        color="darkestBlue"
                        className="mx-1 truncate"
                    >
                        {query} {/* Display the search query */}
                    </Text>

                    <Text size="sm" color="lighterBlue" className="shrink-0">
                        Search by store
                    </Text>
                </div>

                {keywords.length === 0 ? (
                    // If there are no autocomplete keywords, show a message
                    // 자동 완성 키워드가 없을 경우 메시지를 표시
                    <div className="h-full flex justify-center items-center">
                        <Text color="lighterBlue" size="sm">
                            No recommended keywords
                        </Text>
                    </div>
                ) : (
                    // If there are autocomplete keywords, display them in a scrollable container
                    // 자동 완성 키워드가 있을 경우 스크롤 가능한 컨테이너에 표시
                    <div className="h-full overflow-scroll pb-8">
                        {keywords.map((recent, idx) => (
                            <Text
                                size="sm"
                                key={idx}
                                className="block my-1 truncate"
                            >
                                {recent}
                            </Text>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer section with a close button */}
            <div className="bg-gray-100 flex justify-end items-center h-8 px-2">
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
