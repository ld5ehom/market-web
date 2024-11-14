import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react'
import Pagination from '@/components/common/Pagination'
import Product from '@/components/common/Product'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import { getProductsByKeyword } from '@/repository/products/getProductsByKeyword'
import { Product as TProduct } from '@/types'
import { getProductsByKeywordCount } from '@/repository/products/getProductsByKeywordCount'

// Fetch products on the server side before rendering the page
// 페이지 렌더링 전에 서버에서 제품 데이터를 가져옴
export const getServerSideProps: GetServerSideProps<{
    products: TProduct[] // Array of products to be displayed  (화면에 표시할 제품 배열)
    query: string // The search query string  (검색어 문자열)
    count: number // Pagination number
}> = async (context) => {
    const originalQuery = context.query.query as string | undefined

    // Throw an error if no search query is provided (검색어가 없을 경우 에러를 발생시킴)
    if (!originalQuery) {
        throw new Error('No search query provided')
    }

    // Decode the search query from the URL   (URL에서 검색어를 디코딩함)
    const query = decodeURIComponent(originalQuery)

    // Fetch products using the search query (검색어를 사용해 제품 데이터를 가져옴)
    const { data: products } = await getProductsByKeyword({
        query,
        fromPage: 0,
        toPage: 1,
    })

    // Fetch the total number of products matching the query
    // 쿼리에 해당하는 전체 상품 수를 가져옴
    const { data: count } = await getProductsByKeywordCount(query)

    // Return the fetched products and query as props (가져온 제품과 검색어를 props로 반환)
    return { props: { products, query, count } }
}

// Main component for displaying search results (검색 결과를 표시하는 메인 컴포넌트)
export default function Search({
    products: initialProducts,
    query,
    count,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [products, setProducts] = useState<TProduct[]>(initialProducts)

    // State to track the current page, starting from 1 for user-facing pagination
    // 사용자에게 보이는 페이지는 1부터 시작
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        ;(async () => {
            // Fetch products by keyword from the server
            // 서버에서 키워드로 제품을 가져옴
            const { data: products } = await getProductsByKeyword({
                query,
                // Adjust for server-side page offset, which starts from 0
                // 서버에서 처리되는 페이지는 0부터 시작
                fromPage: currentPage - 1,
                toPage: currentPage,
            })

            // Update the product list state (제품 목록 상태를 업데이트)
            setProducts(products)
        })()
    }, [currentPage, query]) // Re-run when the current page or query changes

    return (
        <Wrapper>
            <Container>
                <div className="my-7 text-center">
                    {/* Display the search query */}
                    <Text size="lg" color="uclaBlue">
                        {query}
                    </Text>
                    <Text size="lg"> Results</Text>
                </div>
                <div className="grid grid-cols-5 gap-4 my-3">
                    {products.length === 0 ? (
                        // If no products found, show a message  (검색 결과가 없을 경우 메시지를 표시)
                        <Text>No search results found.</Text>
                    ) : (
                        // If products are found, display them  (검색 결과가 있을 경우 제품을 표시)
                        products.map(
                            ({ id, title, price, createdAt, imageUrls }) => (
                                <div
                                    key={id}
                                    className="rounded-lg overflow-hidden border"
                                >
                                    <Product
                                        title={title}
                                        price={price}
                                        createdAt={createdAt}
                                        imageUrl={imageUrls[0]}
                                    />
                                </div>
                            ),
                        )
                    )}
                </div>

                {/* Pagination */}
                <div className="my-6 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        count={count}
                        handlePageChange={(pageNumber) => {
                            setCurrentPage(pageNumber)
                        }}
                    />
                </div>
            </Container>
        </Wrapper>
    )
}
