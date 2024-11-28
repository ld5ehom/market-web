import { InferGetServerSidePropsType } from 'next'

import Banner from './_components/Banner'
import ProductList from './_components/ProductList'

import Container from '@/components/layout/Container'
import MarketLayout from '@/components/layout/MarketLayout'
import Wrapper from '@/components/layout/Wrapper'

import { getProducts } from '@/repository/products/getProducts'

// Fetches products on the server side before rendering the page
// 페이지를 렌더링하기 전에 서버 측에서 상품 데이터를 가져옵니다.
export const getServerSideProps = async () => {
    const { data } = await getProducts({ fromPage: 0, toPage: 2 })

    // Returns the fetched product data as props to be used in the component
    // 가져온 상품 데이터를 props로 반환하여 컴포넌트에서 사용합니다.
    return { props: { products: data } }
}

// main
export default function Home({
    products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <Wrapper>
            <Container>
                <Banner />
                <ProductList initialProducts={products} />
            </Container>
        </Wrapper>
    )
}
