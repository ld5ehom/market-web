```
npm run build:mock
```

---

teo@MacBook-Air market-web % npm run build:mock

> market-web@0.1.0 build:mock
> USE_MOCK_DATA=true next build

▲ Next.js 14.2.17

-   Environments: .env

./src/pages/\_document.tsx
21:17 Warning: A font-display parameter is missing (adding `&display=optional` is recommended). See: https://nextjs.org/docs/messages/google-font-display @next/next/google-font-display

./src/pages/products/[productId]/\_components/ProductImage/index.tsx
13:17 Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element @next/next/no-img-element

./src/pages/products/\_components/ProductForm/index.tsx
227:37 Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element @next/next/no-img-element
227:37 Warning: img elements must have an alt prop, either with meaningful text, or an empty string for decorative images. jsx-a11y/alt-text

./src/pages/products/history/buy/\_components/BuyProductItem/index.tsx
33:17 Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element @next/next/no-img-element

./src/pages/products/manage/\_components/ProductList/index.tsx
89:37 Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element @next/next/no-img-element

info - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
✓ Linting and checking validity of types  
 Creating an optimized production build ...
✓ Compiled successfully
Collecting page data ..(node:29561) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:29563) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:29562) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:29558) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:29560) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:29559) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:29564) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
✓ Collecting page data  
 ✓ Generating static pages (27/27)
✓ Collecting build traces  
 ✓ Finalizing page optimization

Route (pages) Size First Load JS
┌ ƒ / 598 B 150 kB
├ /\_app 0 B 135 kB
├ ○ /\_components/Banner 495 B 144 kB
├ ○ /\_components/ProductList 199 B 140 kB
├ ○ /404 346 B 135 kB
├ ○ /500 356 B 135 kB
├ ƒ /login 342 B 135 kB
├ ○ /messages/\_components/ChatMessages 2.38 kB 158 kB
├ ○ /messages/\_components/ChatMessages/\_components/Messages 1.75 kB 158 kB
├ ○ /messages/\_components/ChatPreview 1.38 kB 136 kB
├ ƒ /messages/[[...chatRoomId]] 3.4 kB 159 kB
├ ƒ /my-shop 252 B 135 kB
├ ƒ /products 250 B 135 kB
├ ○ /products/\_components/ProductForm 207 B 141 kB
├ ○ /products/\_components/ProductsLayout 494 B 135 kB
├ ƒ /products/[productId] 3.8 kB 152 kB
├ ○ /products/[productId]/\_components/ProductImage 387 B 144 kB
├ ○ /products/[productId]/\_components/ReviewItem 1.11 kB 141 kB
├ ƒ /products/edit/[productId] 405 B 141 kB
├ ƒ /products/history 256 B 135 kB
├ ○ /products/history/\_components/Tab 452 B 135 kB
├ ƒ /products/history/buy 1.82 kB 136 kB
├ ○ /products/history/buy/\_components/BuyProductItem 840 B 135 kB
├ ○ /products/history/buy/\_components/BuyProductList 1.46 kB 136 kB
├ ƒ /products/history/sell 1.55 kB 136 kB
├ ○ /products/history/sell/\_components/SellProductList 1.19 kB 136 kB
├ ƒ /products/manage 5.13 kB 140 kB
├ ○ /products/manage/\_components/ProductList 4.83 kB 139 kB
├ ƒ /products/new 283 B 141 kB
├ ƒ /reviews/[productId] 895 B 138 kB
├ ƒ /search 4.8 kB 139 kB
├ ƒ /search/shop 1.8 kB 136 kB
├ ○ /search/shop/\_components/SearchShopItem 1.12 kB 136 kB
├ ○ /shops/\_components/ShopLayout 3.63 kB 140 kB
├ ƒ /shops/[shopId] 255 B 135 kB
├ ƒ /shops/[shopId]/follower 5.38 kB 142 kB
├ ○ /shops/[shopId]/follower/\_components/FollowerItem 1.49 kB 136 kB
├ ○ /shops/[shopId]/follower/\_components/FollowerList 1.98 kB 137 kB
├ ƒ /shops/[shopId]/following 5.39 kB 142 kB
├ ○ /shops/[shopId]/following/\_components/FollowingItem 1.5 kB 136 kB
├ ○ /shops/[shopId]/following/\_components/FollowingList 1.98 kB 137 kB
├ ƒ /shops/[shopId]/likes 5.11 kB 142 kB
├ ○ /shops/[shopId]/likes/\_components/LikeItem 4.35 kB 139 kB
├ ○ /shops/[shopId]/likes/\_components/LikeList 4.95 kB 140 kB
├ ƒ /shops/[shopId]/products 5.07 kB 142 kB
├ ○ /shops/[shopId]/products/\_components/ProductList 4.89 kB 139 kB
├ ƒ /shops/[shopId]/reviews 1.81 kB 143 kB
├ ○ /shops/[shopId]/reviews/\_components/ReviewItem 1.24 kB 141 kB
└ ○ /shops/[shopId]/reviews/\_components/ReviewList 1.79 kB 141 kB

-   First Load JS shared by all 139 kB
    ├ chunks/framework-840cff9d6bb95703.js 44.9 kB
    ├ chunks/main-e6f1e4284468c0f6.js 32.1 kB
    ├ chunks/pages/\_app-e2b12e3a81e6ce3c.js 55.3 kB
    └ other shared chunks (total) 6.38 kB

○ (Static) prerendered as static content
ƒ (Dynamic) server-rendered on demand
