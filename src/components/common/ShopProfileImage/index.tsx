import classNames from 'classnames'

interface Props {
    // URL of the shop profile image
    // 상점 프로필 이미지 주소
    imageUrl?: string

    // Additional className for customization
    // 추가 ClassName 부여가 필요한 경우 사용할 Props
    className?: string
}

/**
 * Component for displaying a shop profile image.
 * If the imageUrl prop is not provided, it shows a default shop icon.
 * 상점 프로필 이미지 컴포넌트.
 * ImageUrl Props를 넘기지 않으면 기본 상점 아이콘을 화면에 보여준다.
 */
export default function ShopProfileImage({ imageUrl, className }: Props) {
    // When no image is provided
    // 이미지가 없는 경우
    if (!imageUrl) {
        return (
            <div
                className={classNames(
                    className,
                    'rounded-full bg-slate-200 w-14 h-14 flex justify-center items-center',
                )}
            >
                <span className="material-symbols-outlined text-slate-500">
                    storefront
                </span>
            </div>
        )
    }

    // When an image is provided
    // 이미지가 있는 경우
    return (
        <div
            className={classNames(
                className,
                'rounded-full w-14 h-14 bg-cover bg-center', // image bg center
            )}
            style={{ backgroundImage: `url(${imageUrl})` }}
        />
    )
}
