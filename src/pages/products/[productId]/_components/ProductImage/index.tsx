import { Carousel } from 'react-responsive-carousel'
import Image from 'next/image'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader

type Props = {
    imageUrls: string[]
}

export default function ProductImage({ imageUrls = [] }: Props) {
    return (
        <Carousel infiniteLoop showThumbs={false} showStatus={false}>
            {imageUrls.map((url, index) => (
                <div key={index} className="relative w-96 h-96">
                    {' '}
                    {/* 부모 요소 크기 지정 */}
                    <Image
                        src={url}
                        alt={`Product image ${index + 1}`}
                        fill // 이미지가 부모 요소를 채우도록 설정
                        className="object-cover"
                    />
                </div>
            ))}
        </Carousel>
    )
}
