import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import Product from '@/components/common/Product'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import { getProductsByKeyword } from '@/repository/products/getProductsByKeyword'
import { Product as TProduct } from '@/types'

// Fetch products on the server side before rendering the page
// 페이지 렌더링 전에 서버에서 제품 데이터를 가져옴
export const getServerSideProps: GetServerSideProps<{
    products: TProduct[] // Array of products to be displayed  (화면에 표시할 제품 배열)
    query: string // The search query string  (검색어 문자열)
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

    // Return the fetched products and query as props (가져온 제품과 검색어를 props로 반환)
    return { props: { products, query } }
}

// Main component for displaying search results (검색 결과를 표시하는 메인 컴포넌트)
export default function Search({
    products,
    query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
            </Container>
        </Wrapper>
    )
}
