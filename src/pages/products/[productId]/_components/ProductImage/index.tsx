import { Carousel } from 'react-responsive-carousel'

import 'react-responsive-carousel/lib/styles/carousel.min.css'

type Props = {
    imageUrls: string[]
}

export default function ProductImage({ imageUrls }: Props) {
    // imageUrls가 배열인지 확인하고, 배열이 아니면 빈 배열로 처리
    if (!Array.isArray(imageUrls)) {
        return <div>Invalid image data</div> // 배열이 아닐 경우 메시지 표시
    }

    return (
        <Carousel infiniteLoop showThumbs={false} showStatus={false}>
            {imageUrls.map((url) => (
                <img key={url} src={url} alt="" className="w-96 h-96" />
            ))}
        </Carousel>
    )
}
