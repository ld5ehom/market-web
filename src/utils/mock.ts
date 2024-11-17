import { faker } from '@faker-js/faker'
import { Product, Shop } from '@/types'

export function getMockProductData(defaultValue?: Partial<Product>) {
    const data: Product = {
        id: defaultValue?.id ?? faker.string.uuid(),
        title: defaultValue?.title ?? faker.commerce.productName(),
        price:
            defaultValue?.price ??
            Number(
                (faker.number.int({ min: 10, max: 1000 }) * 0.01).toFixed(2),
            ), // $ 00.00
        address: defaultValue?.address ?? faker.location.city(),
        description:
            defaultValue?.description ?? faker.lorem.sentences(10, '\n'),
        imageUrls:
            defaultValue?.imageUrls ??
            Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(
                () => faker.image.dataUri(),
            ),
        isChangable: defaultValue?.isChangable ?? faker.datatype.boolean(),
        isUsed: defaultValue?.isUsed ?? faker.datatype.boolean(),
        tags:
            (defaultValue?.tags ?? faker.datatype.boolean())
                ? Array.from({
                      length: faker.number.int({ min: 1, max: 5 }),
                  }).map(() => faker.lorem.word())
                : null,
        createdAt: defaultValue?.createdAt ?? faker.date.past().toString(),
        createdBy: defaultValue?.createdBy ?? faker.string.uuid(),
        purchaseBy:
            (defaultValue?.purchaseBy ?? faker.datatype.boolean())
                ? faker.string.uuid()
                : null,
    }
    return data
}

// Shop Mock data
export function getMockShopData(defaultValue?: Partial<Shop>) {
    const data: Shop = {
        id: defaultValue?.id ?? faker.string.uuid(),
        name: defaultValue?.name ?? faker.internet.displayName(),
        imageUrl: defaultValue?.imageUrl ?? faker.image.dataUri(),
        introduce: defaultValue?.introduce ?? faker.lorem.sentences(3, '\n'),
        createdAt: defaultValue?.createdAt ?? faker.date.past().toString(),
    }
    return data
}

// A utility function that returns a promise that resolves after a specified timeout
// 지정된 시간(ms) 후에 해결되는 프로미스를 반환하는 유틸리티 함수 (3/sec)
export const timeout = (ms = 3000) =>
    new Promise((resolve) => {
        // Use setTimeout to wait for the given number of milliseconds before resolving the promise
        // setTimeout을 사용하여 지정된 밀리초(ms)만큼 대기한 후 프로미스를 해결
        setTimeout(resolve, ms)
    })
