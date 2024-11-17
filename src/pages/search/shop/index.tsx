import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react'

import SearchShopItem from './_components/SearchShopItem'
import Pagination from '@/components/common/Pagination'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import { getShopsByKeyword } from '@/repository/shops/getShopsByKeyword'
import { getShopsByKeywordCount } from '@/repository/shops/getShopsByKeywordCount'
import { Shop } from '@/types'

// Fetch shop data from the server based on the search query
// 검색어를 기반으로 서버에서 상점 데이터를 가져옴
export const getServerSideProps: GetServerSideProps<{
    shops: Shop[] // List of shops to be displayed (표시할 상점 목록)
    query: string // The search query string (검색어 문자열)
    count: number // Total number of shops matching the query (쿼리에 해당하는 전체 상점 수)
}> = async (context) => {
    const originalQuery = context.query.query as string | undefined

    // Throw an error if no search query is provided (검색어가 없을 경우 에러를 발생시킴)
    if (!originalQuery) {
        throw new Error('No search query provided')
    }

    // Decode the search query from the URL   (URL에서 검색어를 디코딩함)
    const query = decodeURIComponent(originalQuery)

    // Fetch shops using the search query (검색어를 사용해 shop 데이터를 가져옴)
    const [{ data: shops }, { data: count }] = await Promise.all([
        getShopsByKeyword({
            query,
            fromPage: 0,
            toPage: 1,
        }),
        getShopsByKeywordCount(query),
    ])

    // Return props to the component (컴포넌트에 props 반환)
    return { props: { shops, query, count } }
}

// Main component to display the search results (검색 결과를 표시하는 메인 컴포넌트)
export default function SearchShop({
    shops: initialShops,
    query,
    count,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [shops, setShops] = useState<Shop[]>(initialShops)

    // State to manage the current page, starting from 1
    // 사용자에게 보이는 페이지는 1부터 시작
    const [currentPage, setCurrentPage] = useState(1)

    // Reset current page to 1 when initial shops change
    // 초기 상점 목록이 변경될 때 현재 페이지를 1로 설정
    useEffect(() => {
        setCurrentPage(1)
    }, [initialShops])

    useEffect(() => {
        // Fetch updated shop data when the current page or query changes
        // 현재 페이지나 검색어가 변경될 때 상점 데이터를 업데이트
        ;(async () => {
            const { data: shops } = await getShopsByKeyword({
                query,
                // Adjust page number for server-side handling, starting from 0
                // 서버에서 처리할 때 페이지 번호는 0부터 시작
                fromPage: currentPage - 1,
                toPage: currentPage,
            })
            setShops(shops)
        })()
    }, [currentPage, query])

    return (
        <Wrapper>
            <Container>
                <div className="my-7">
                    <Text size="lg">Search Results </Text>
                    <Text size="lg" color="uclaBlue" className="ml-1">
                        {count.toLocaleString()} results
                    </Text>
                </div>
                <div className="flex flex-col gap-3">
                    {shops.length === 0 ? (
                        <Text className="text-uclaBlue">
                            No search results found.
                        </Text>
                    ) : (
                        // Render the list of shops (상점 목록을 렌더링)
                        shops.map(({ id, name, imageUrl }) => (
                            <SearchShopItem
                                key={id}
                                id={id}
                                name={name}
                                profileImageUrl={imageUrl || undefined}
                            />
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="my-6 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        count={count}
                        handlePageChange={(pageIndex) =>
                            setCurrentPage(pageIndex)
                        }
                    />
                </div>
            </Container>
        </Wrapper>
    )
}
