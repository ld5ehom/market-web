import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ChangeEventHandler, FormEvent, useRef, useState } from 'react'
import ProductsLayout from '../ProductsLayout'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Image from 'next/image'
import MarkdownEditorSkeleton from '@/components/shared/MarkdownEditor/Skeleton'
import { uploadImage } from '@/repository/common/uploadImage'
import { createProduct } from '@/repository/products/createProduct'
import { updateProduct } from '@/repository/products/updateProduct'
import { City, cities, getDistricts } from '@/utils/address'
import supabase from '@/utils/supabase/browserSupabase'

type Props = {
    id: string
    imageUrls: string[]
    title: string
    isUsed: boolean
    isChangeable: boolean
    price: number
    city: City
    district: string
    description: string
    tags: string[]
}

const MarkdownEditor = dynamic(
    () => import('@/components/shared/MarkdownEditor'),
    {
        ssr: false,
        loading: () => <MarkdownEditorSkeleton />,
    },
)

export default function ProductForm({
    id: defaultId,
    imageUrls: defaultImageUrls,
    title: defaultTitle,
    isUsed: defaultIsUsed,
    isChangeable: defaultIsChangeable,
    price: defaultPrice,
    city: defaultCity,
    district: defaultDistrict,
    description: defaultDescription,
    tags: defaultTags,
}: Partial<Props>) {
    const formType = defaultId ? 'edit' : 'new'
    const router = useRouter()
    const tagInputRef = useRef<HTMLInputElement>(null)
    const [tags, setTags] = useState<string[]>(defaultTags || [])
    const [city, setCity] = useState<City | undefined>(defaultCity)
    const [description, setDescription] = useState<string>(
        defaultDescription || '',
    )
    const [imageUrls, setImageUrls] = useState<string[]>(defaultImageUrls || [])
    const [isLoading, setIsLoading] = useState(false)

    // Handles image uploads (이미지 업로드를 처리하는 함수)
    const handleUploadImage: ChangeEventHandler<HTMLInputElement> = async (
        e,
    ) => {
        if (e.target.files?.[0]) {
            const imageFile = e.target.files[0]
            const {
                data: { imageUrl },
            } = await uploadImage(supabase, imageFile)
            e.target.value = ''
            setImageUrls((prev) => [imageUrl, ...prev])
        }
    }

    // Adds a new tag to the tag list (태그 리스트에 새 태그 추가)
    const handleAddTag = () => {
        if (!tagInputRef.current) {
            return
        }

        const tagValue = tagInputRef.current.value.trim()

        tagInputRef.current.value = ''
        if (tags.length >= 5) {
            return
        }

        setTags((prevTags) => {
            if (!prevTags.find((tag) => tag === tagValue)) {
                return [...prevTags, tagValue]
            }
            return prevTags
        })
    }

    // Removes a tag from the tag list (태그 리스트에서 태그 제거)
    const handleRemoveTag = (tag: string) => {
        setTags((prevTags) => prevTags.filter((tagItem) => tagItem !== tag))
    }

    // Remove the selected image URL from the list of images
    const handleRemoveImage = (imageUrl: string) => {
        setImageUrls((prevImages) =>
            prevImages.filter((imageUrlItem) => imageUrlItem !== imageUrl),
        )
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault() // Prevent the default form submission behavior
            setIsLoading(true) // Set loading state to true

            const formData = new FormData(e.currentTarget) // Get the form data
            const tags = formData.getAll('tags') as string[] // Get all tags as an array
            const imageUrls = formData.getAll('imageUrls') as string[] // Get all image URLs as an array

            // Check if at least one image is selected
            if (imageUrls.length === 0) {
                alert('Please upload at least one product image.') // Alert if no images are selected
                setIsLoading(false) // Set loading state to false
                return
            }

            // Extract form values
            const id = formData.get('id') as string
            const title = formData.get('title') as string
            const price = parseInt(formData.get('price') as string)
            const city = formData.get('city') as string
            const district = formData.get('district') as string
            const address = `${city} ${district}` // Combine city and district into a full address
            const description = formData.get('description') as string
            const isChangeable = formData.get('isChangeable') === 'y' // Check if the product is changeable
            const isUsed = formData.get('isUsed') === 'y' // Check if the product is used

            // Call the API to create the product with the form data
            if (formType === 'new') {
                const { data } = await createProduct(supabase, {
                    title,
                    price,
                    address,
                    description,
                    isChangeable,
                    isUsed,
                    tags,
                    imageUrls,
                })
                router.push(`/products/${data.id}`)
            } else {
                const { data } = await updateProduct(supabase, {
                    id,
                    title,
                    price,
                    address,
                    description,
                    isChangeable,
                    isUsed,
                    tags,
                    imageUrls,
                })
                router.push(`/products/${data.id}`)
            }
        } catch (e) {
            if (formType === 'edit') {
                alert('Failed to edit the product.')
            } else {
                alert('Failed to register the product.')
            }
        } finally {
            setIsLoading(false) // Set loading state to false after operation
        }
    }

    return (
        <ProductsLayout currentTab={formType === 'edit' ? undefined : 'new'}>
            <form onSubmit={handleSubmit}>
                {defaultId && (
                    <input type="hidden" name="id" defaultValue={defaultId} />
                )}
                <Container>
                    {/* Section Header (섹션 헤더) */}
                    <div className="my-10 border-b-2 border-black py-7">
                        <Text size="2xl" className="mr-3">
                            {formType === 'edit'
                                ? 'Edit Product'
                                : 'Product Information'}
                        </Text>
                        <Text size="md" color="red">
                            * Required Information
                        </Text>
                    </div>

                    {/* Image Upload Section (이미지 업로드 섹션) */}
                    <div className="flex border-b border-grey-300 pb-7 pt-5">
                        <div className="w-40">
                            {/* Product Images */}
                            <Text size="lg">Images</Text>{' '}
                            <Text size="lg" color="grey" weight="light">
                                ({imageUrls.length}/3)
                            </Text>{' '}
                            <Text size="md" color="red">
                                *
                            </Text>
                        </div>

                        {/* Upload Image  */}
                        <div className="flex gap-2">
                            {imageUrls.map((imageUrl) => (
                                <div
                                    key={imageUrl}
                                    className="w-40 h-40 border relative"
                                >
                                    {/* Remove image button */}
                                    <button
                                        type="button"
                                        className="rounded-full bg-black opacity-50 absolute top-1 right-1 w-8 h-8 text-white z-10"
                                        onClick={() =>
                                            handleRemoveImage(imageUrl)
                                        } // When the button is clicked, remove the image
                                    >
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: '1rem' }}
                                        >
                                            close {/* Close icon */}
                                        </span>
                                    </button>
                                    <img
                                        src={imageUrl}
                                        className="w-full h-full"
                                    />{' '}
                                    {/* Display the image */}
                                    <input
                                        type="text"
                                        name="imageUrls"
                                        defaultValue={imageUrl}
                                        hidden // Hidden input for storing image URL
                                    />
                                </div>
                            ))}
                            {/* If there are fewer than 3 images, show the upload button */}
                            {imageUrls.length < 3 && (
                                <>
                                    <label htmlFor="image">
                                        <div className="w-40 h-40 border flex justify-center items-center cursor-pointer">
                                            Upload File {/* 파일 업로드 버튼 */}
                                        </div>
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        accept=".jpg, .jpeg, .png" // Allowed file types
                                        hidden
                                        disabled={imageUrls.length >= 3} // Disable if there are 3 or more images
                                        onChange={handleUploadImage} // Handle image upload
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Product Name Section (상품명 섹션) */}
                    <div className="flex border-b border-grey-300 pb-7 pt-5">
                        <div className="w-40">
                            <Text size="lg">Product Name</Text>{' '}
                            <Text size="md" color="red">
                                *
                            </Text>
                        </div>
                        <div className="flex-1">
                            <Input
                                type="text"
                                className="w-full px-3 py-2"
                                placeholder="Enter the product name"
                                name="title"
                                defaultValue={defaultTitle}
                                required
                            />
                        </div>
                    </div>

                    {/* Product Condition Section (상품 상태 섹션) */}
                    <div className="flex border-b border-grey-300 pb-7 pt-5">
                        <div className="w-40">
                            <Text size="lg">Condition</Text>{' '}
                            <Text size="md" color="red">
                                *
                            </Text>
                        </div>
                        <div className="flex-1">
                            <select
                                required
                                name="isUsed"
                                className="border py-1 px-2 w-32"
                                defaultValue={
                                    defaultIsUsed === undefined
                                        ? undefined
                                        : defaultIsUsed
                                          ? 'y'
                                          : 'n'
                                }
                            >
                                <option value="y">New</option>
                                <option value="n">Used</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Exchange Section (상품 교환) */}
                    <div className="flex border-b border-grey-300 pb-7 pt-5">
                        <div className="w-40">
                            <Text size="lg">Exchange</Text>{' '}
                            <Text size="md" color="red">
                                *
                            </Text>
                        </div>
                        <div className="flex-1">
                            <select
                                required
                                name="isChangeable"
                                className="border py-1 px-2 w-32"
                                defaultValue={
                                    defaultIsChangeable === undefined
                                        ? undefined
                                        : defaultIsChangeable
                                          ? 'y'
                                          : 'n'
                                }
                            >
                                <option value="y">Yes</option>
                                <option value="n">No</option>
                            </select>
                        </div>
                    </div>

                    {/* Price Section (가격 섹션) */}
                    <div className="flex border-b border-grey-300 pb-7 pt-5">
                        <div className="w-40">
                            <Text size="lg">Price</Text>
                            <Text size="md" color="red">
                                *
                            </Text>
                        </div>
                        <div className="flex-1">
                            <Input
                                type="number"
                                className="w-full px-3 py-2"
                                placeholder="Enter the price"
                                name="price"
                                defaultValue={defaultPrice}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex border-b border-grey-300 pb-7 pt-5">
                        <div className="w-40">
                            <Text size="lg"> Locate </Text>
                            <Text size="md" color="red">
                                *
                            </Text>
                        </div>
                        <div className="flex-1 flex gap-2">
                            <select
                                className="border py-1 px-2 w-32"
                                name="city"
                                required
                                defaultValue={defaultCity}
                                onChange={(e) => {
                                    if (e.currentTarget.value) {
                                        setCity(e.currentTarget.value as City)
                                    } else {
                                        setCity(undefined)
                                    }
                                }}
                            >
                                <option value=""></option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                            {!!city && (
                                <select
                                    className="border py-1 px-2 w-32"
                                    name="district"
                                    defaultValue={defaultDistrict}
                                >
                                    <option value=""> Select </option>
                                    {getDistricts(city).map((district) => (
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Tags Section (태그 섹션) */}
                    <div className="flex border-b border-grey-300 pb-7 pt-5">
                        <div className="w-40">
                            <Text size="lg">Product Tags</Text>{' '}
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                            <div className="flex gap-2 flex-wrap">
                                {tags.map((tag) => (
                                    <div
                                        key={tag}
                                        className="bg-purple-200 rounded-lg px-2 flex justify-center items-center"
                                    >
                                        {tag}
                                        <span
                                            className="material-symbols-outlined cursor-pointer"
                                            style={{ fontSize: '1.25rem' }}
                                            onClick={() => handleRemoveTag(tag)}
                                        >
                                            close
                                        </span>
                                        <input
                                            type="text"
                                            name="tags"
                                            defaultValue={tag}
                                            hidden
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Add tags */}
                            <div className="flex w-96">
                                <Input
                                    className="flex-1"
                                    name="tag"
                                    type="text"
                                    placeholder="Add tags (up to 5)"
                                    ref={tagInputRef}
                                    disabled={tags.length >= 5}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddTag()
                                            return false
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    disabled={tags.length >= 5}
                                    color="uclaBlue"
                                    onClick={() => {
                                        handleAddTag()
                                    }}
                                >
                                    Add
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Description Section (상품 설명 섹션) */}
                    <div className="flex  pb-7 pt-5">
                        <div className="w-40">
                            <Text size="lg">Description</Text>{' '}
                            <Text size="md" color="red">
                                *
                            </Text>
                        </div>
                        <div className="flex-1">
                            <MarkdownEditor
                                initialValue={description}
                                handleOnChage={(value) => {
                                    setDescription(value)
                                }}
                            />
                            {/* description */}
                            <input
                                type="text"
                                value={description}
                                name="description"
                                readOnly
                                required
                                className="opacity-0 h-1 w-1"
                            />
                        </div>
                    </div>
                </Container>

                {/* Submit Button (제출 버튼) */}
                <div className="sticky bottom-0 z-50 bg-lightestBlue py-4 border-t border-lightestBlue">
                    <Container>
                        <div className="flex justify-end">
                            {/* 수정하기 / 등록하기 */}
                            <Button
                                color="uclaBlue"
                                className="w-28 h-12"
                                isLoading={isLoading}
                            >
                                {formType === 'edit' ? 'Edit' : 'Submit'}{' '}
                            </Button>
                        </div>
                    </Container>
                </div>
            </form>
        </ProductsLayout>
    )
}
