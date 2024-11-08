import { faker } from '@faker-js/faker'
import { Product } from '@/types'

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
