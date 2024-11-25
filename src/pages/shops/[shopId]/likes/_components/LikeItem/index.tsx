import { useEffect, useState } from 'react'

import Product from '@/components/common/Product' // Reusable Product component
import Spinner from '@/components/common/Spinner' // Spinner for loading state
import { getProduct } from '@/repository/products/getProduct' // API to fetch product details
import { Product as TProduct } from '@/types' // Type definition for product

type Props = {
    productId: string // ID of the product to be displayed
}

export default function LikeItem({ productId }: Props) {
    // State to store the fetched product details
    const [product, setProduct] = useState<TProduct>()

    useEffect(() => {
        // Fetch the product details when the component mounts or productId changes
        // 컴포넌트가 마운트되거나 productId가 변경될 때 상품 상세 정보를 가져옴
        ;(async () => {
            const { data } = await getProduct(productId) // Fetch product data from API
            setProduct(data) // Update state with fetched product data
        })()
    }, [productId]) // Dependency array to trigger effect when productId changes

    if (!product) {
        // Render a spinner if the product data is not yet loaded
        // 상품 데이터가 아직 로드되지 않은 경우 로딩 스피너 렌더링
        return (
            <div className="border border-dashed flex justify-center items-center h-56">
                <Spinner />
            </div>
        )
    }

    // Render the product details using the reusable Product component
    // 재사용 가능한 Product 컴포넌트를 사용하여 상품 세부 정보를 렌더링
    return (
        <Product
            title={product.title} // Product title
            price={product.price} // Product price
            createdAt={product.createdAt} // Creation date of the product
            imageUrl={product.imageUrls[0]} // First image URL of the product
            isSoldOut={!!product.purchaseBy} // Boolean indicating if the product is sold out
        />
    )
}
