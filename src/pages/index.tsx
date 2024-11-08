import { useEffect, useState } from 'react'

import ProductList from './_components/ProductList'
import Container from '@/components/layout/Container'
import ShopLayout from '@/components/layout/ShopLayout'
import Wrapper from '@/components/layout/Wrapper'

export default function Home() {
    return (
        <ShopLayout>
            <Wrapper>
                <Container>
                    <ProductList />
                </Container>
            </Wrapper>
        </ShopLayout>
    )
}
