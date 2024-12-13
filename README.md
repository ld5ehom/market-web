# Market Website (Frontend)

## Project Overview

-   Designed and implemented a responsive product catalog layout using TailwindCSS, featuring dynamic grid views and infinite scroll for seamless performance on large datasets.
-   Enhanced search functionality with features like recent searches, auto-complete using localStorage, and optimized API requests with Lodash Throttle for real-time responsiveness.
-   Developed and tested reusable components (Product, Search, Pagination) using Storybook, ensuring consistent design and functionality across the application.
-   Leveraged Server-Side Rendering (SSR) in Next.js to improve SEO, initial load times, and user experience for search results and product detail pages.
-   Implemented advanced features, including pagination for search results and a similar products recommendation system based on shared tags, boosting user engagement.
-   Utilized : TypeScript, Next.js, React, Supabase, tailwindCSS, Storybook, Cypress, ESLint, Prettier

---

## Reference Site

-   [Design System](https://primer.style/components)
-   [tailwindcss](https://tailwindcss.com/docs)
-   [storybook](https://storybook.js.org/)
-   [Google material Symbol](https://fonts.google.com/iconss)
-   [Day.js](https://day.js.org/docs/en/installation/installation)
-   [Scroll-lock](https://www.npmjs.com/package/scroll-lock)
-   [Faker.js](https://fakerjs.dev/guide/)
-   [Intersection Observer Docs](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
-   [React Intersection Observer](https://www.npmjs.com/package/react-intersection-observer)
-   [React Responsive Carousel](https://react-responsive-carousel.js.org/)
-   [Lodash](https://lodash.com/docs/#throttle)
-   [Toast UI](https://nhn.github.io/tui.editor/latest/)

---

## Milestones

-   M1 : App Basic Functionality Development
-   M2 : Advanced Features and Testing
-   M3 : Bug Fixes and Updates

---

## Task List

### Milestone 1 : App Basic Functionality Development

**Task 1. Common Layout**

-   **Issues** : [task-1-layout](https://github.com/ld5ehom/market-web/tree/task-1-layout)
-   **Details** :

    -   **Common Components** [06f0a07](https://github.com/ld5ehom/market-web/commit/06f0a07516407c89948ee87821ab0400d50abde5) :

        -   Components to be created: Text, Button, Input, Product components
        -   Installation needed:
            ```
            npm install next@14 --save
            ```
            ```
            npm install classnames
            ```
            ```
            npm storybook@latest init
            ```
            ```
            npm install dayjs --save
            ```
        -   Extensions:
            -   Tailwind CSS IntelliSense

    -   **Header Layout** [c681062](https://github.com/ld5ehom/market-web/commit/c68106225df491d02d25a7b849599c608581b5e4) :
        -   Header Layout Implementation Created the Header component and set up a basic layout including the logo, menu, and search bar.
        -   Added Search Bar Added the Search component within the Header to implement a search field. Used Tailwind CSS to style and adjust the width of the search bar.
    -   **Footer Layout** [d1ceec9](https://github.com/ld5ehom/market-web/commit/d1ceec9a45e517182dd0709adba1567c8d891715) :
        -   Footer UI Update using github desktop
    -   **Login/Signup Modal and Sidebar Implementation** [42234e3](https://github.com/ld5ehom/market-web/commit/42234e3cb411a12140f626490d3fcce5e06c5c43) :
        -   Login and Signup Modal: When the login or signup button is clicked, a modal window opens, displaying the respective screen within the modal.
        -   Used scroll-lock to prevent scrolling when the login/signup modal is open.
            ```
            npm install scroll-lock
            ```
            ```
            npm install --save-dev @types/scroll-lock
            ```
        -   Created a sidebar using SASS to display the Cart and Recently Viewed items list on the right side of the screen.
            ```
            npm install sass
            ```

**Task 2: Main Page**

-   **Issues** : [task-2-main](https://github.com/ld5ehom/market-web/tree/task-2-main)
-   **Details** :
    -   **Set up Mock Client to Implement Product Components on the Main Page** [f2efaf7](https://github.com/ld5ehom/market-web/commit/f2efaf72df928caa2b73c5638d6c7e48a8dcb0c0) :
        -   Used the Faker.js API to generate mock data.
            ```
            npm install @faker-js/faker --save-dev
            ```
        -   Defined product data types to facilitate parallel development of the frontend and backend.
        -   Displayed and arranged product information on the main page using mock data.
    -   **Main Page Carousel Banner and Product List Implementation** [3c9cebf](https://github.com/ld5ehom/market-web/commit/3c9cebff237641772eaab2cf7280fcd32eaf0664) :
        -   Implemented the product infinite scroll feature using the React Intersection Observer API to load recommended products as the user scrolls.
        -   Added an infinite scroll functionality that automatically loads more products as the user scrolls down the page.
            ```
            npm install react-intersection-observer
            ```
        -   Created a banner on the main page using react-responsive-carousel.
            ```
            npm install react-responsive-carousel --save
            ```
        -   Added getServerSideProps in the Product component for server-side rendering.

**Task 3: Search Page**

-   **Issues** : [task-3-search](https://github.com/ld5ehom/market-web/tree/task-3-search)
-   **Details** :

    -   **Recent Searches and Auto-Complete Implementation** [013c6c5](https://github.com/ld5ehom/market-web/commit/013c6c5bd01fc5799b6faf924acdab8f18aa79c1) :
        -   Utilized react-intersection-observer and state management to build features for recent searches and auto-complete.
        -   Managed search input focus and state using React hooks like useState, and ensured the search bar can be easily closed with a close button.
    -   **Recent Searches and Auto-Complete Update** [fb90d46](https://github.com/ld5ehom/market-web/commit/fb90d4619d9ecf1190d5fc07b931f23af1a68f1f) :
        -   utils/localstorage : This module provides utility functions for managing recent search keywords using localStorage, allowing efficient retrieval, addition, and clearing of keywords to enhance the search experience.
        -   getProductsByKeyword: This function generates and returns mock product data using faker and a provided search query. The data is paginated based on the specified range (fromPage to toPage), enhancing the search simulation experience.
        -   Search : Added functionality to the search form to prevent default form submission and to store the current search term in the list of recent keywords using addRecentKeyword.
        -   Recent : The Recent component now fetches and displays recent search terms from local storage using useState and useEffect. It includes a "Clear All Searches" button to let users manage their search history efficiently.
        -   AutoComplete : The AutoComplete component has been enhanced to dynamically fetch and display search suggestions based on user input using an API call. By incorporating useState and useEffect, the component now retrieves relevant product information with the getProductsByKeyword function, updating the autocomplete keywords in real time. Additionally, the title from the product data is used for display, and long text is trimmed with the truncate class for a clean and organized UI.
    -   **AutoComplete : Search Component Optimization Using Throttle** [ec4afb5](https://github.com/ld5ehom/market-web/commit/ec4afb57adc7d3ba991672af2b16fc704d1fa4d7) :
        -   Implemented throttle using the Lodash library to prevent sending API requests for every keystroke, reducing unnecessary server calls. Instead, API requests are made every 500 milliseconds, ensuring that incomplete words or typing pauses don't trigger excessive network requests, leading to a smoother and more efficient search experience.
            ```
            npm i lodash
            ```
    -   **Server-Side Rendering for Search Results** [3a1b79f](https://github.com/ld5ehom/market-web/commit/3a1b79faffef952f00767197e59ab4341c02bcde) :
        -   Utilized Next.js's getServerSideProps to implement server-side rendering for the search page, fetching product data based on the user query.
    -   **Pagination Component for Search Page** [1634cb6](https://github.com/ld5ehom/market-web/commit/1634cb600e86b16a8d11c0b08146657d794ca3ef) :
        -   Integrated a pagination feature at the bottom of the search results page, allowing users to navigate through multiple pages of search results efficiently.
    -   **Shop Search Feature Development** [10a5c2c](https://github.com/ld5ehom/market-web/commit/10a5c2c2a6b0b43fda3c4876b7b32e13788ba8d2) :
        -   Implemented the SearchShop component, which fetches and displays shops based on the search query. Utilized server-side rendering to retrieve shop data and the total count, presenting results in a structured format.
        -   Mock Shop Data Generator for Search Queries: Developed the getShopsByKeyword function using Faker.js to generate mock shop data based on a search query. This function simulates data fetching by returning a paginated list of shop results.
        -   Added pagination and improved the search results UI, ensuring efficient data handling and a better user experience.
        -   Shop Details Loading Enhancement: Introduced the SearchShopItem component to asynchronously fetch and display follower and product counts for each shop, enhancing the data presentation and user experience.
        -   getServerSideProps Optimization: Improved performance by using Promise.all to handle multiple asynchronous function calls concurrently, avoiding the inefficiencies caused by sequential await statements. This approach reduces the overall execution time and mitigates potential delays.

**Task 4: Product Details Page**

-   **Issues** : [task-4-product](https://github.com/ld5ehom/market-web/tree/task-4-product)
-   **Details** :

    -   **Product Detail Page Implementation** [7f17c96](https://github.com/ld5ehom/market-web/commit/7f17c96d28c7c259dc88731b1b9d54eb2a3238b0) :
        -   Navigation to Home Page: Implemented a clickable, styled element that redirects users to the home page, enhancing intuitive and efficient navigation.
        -   Product Detail Page: Built the ProductDetail component to fetch and display comprehensive product details, including the product's image, title, price, and creation time, utilizing Day.js for relative time formatting.
        -   Related Products Feature: Introduced a feature to show a list of similar products based on shared tags, displaying up to three related items with their title, price, creation date, and image, enhancing the shopping experience.
        -   Link Component: Added functionality using the Link component, enabling navigation to the product detail page when a product is clicked.
    -   **Seller Information Implementation** [3d16deb](https://github.com/ld5ehom/market-web/commit/3d16deb84ae362cdaa757165b13d8c1d2f4f253e) :
        -   Added a section to display detailed information about the seller, including the shop name, profile image, product count, and follower count.
        -   Seller Review Component: Displays a single review item, including the reviewer's shop profile image, name, the content of the review, and how long ago the review was created.
    -   **Side Bar Update : View Browsing History** [0be298a](https://github.com/ld5ehom/market-web/commit/0be298a490efd55e85863b4bc35b7df444a1a22c) :
        -   Resolved Rendering Issues in Related Products List
            -   Addressed rendering and styling issues in the related products list by relocating the className="w-48" styling from the Link component to an outer <div>. This adjustment ensured proper layout application and resolved the issue where related products were not displaying correctly.
        -   Implementation of Recently Viewed Products in Side Bar
            -   Implemented a "Recently Viewed Products" section in the side bar with real-time data fetched from local storage and efficient pagination for browsing.
            -   Optimized performance by using Promise.all for concurrent API requests and added a loading spinner to enhance the user experience during data fetching.
            -   Added hover functionality to display detailed product information, including the product title and price, along with an option to remove individual products from the recent items list.
        -   Real-Time Local Storage Update with dispatchEvent
            -   Utilized dispatchEvent to propagate changes in the RECENT_ITEM_IDS_KEY, enabling real-time data synchronization across components without relying on global state management tools. This approach ensures efficient state updates and improves user experience with up-to-date UI rendering.
        -   Search bar : Clear All Searches
            -   Added functionality to clear all recent search keywords stored in local storage with a single click, with a real-time update mechanism to immediately reflect the cleared state in the UI.
    -   **Cart Page Update** [7f11507](https://github.com/ld5ehom/market-web/commit/7f1150727bf890b30793163cd262f8658e8cf923) :
        -   Aside Cart : Displays the number of products added to the cart. Fetches the cart count from the server and shows a spinner during loading.
        -   Shop Cart Page Implementation
            -   Fetches and displays key shop data, including product count, reviews, likes, followers, and following counts, using server-side rendering (SSR). Implements a dynamic "Likes" section with efficient data loading and pagination, enhancing the user experience with a structured and responsive layout.
        -   Dynamic Cart Product Display Component
            -   Fetches and displays detailed information about a liked product using the provided productId. Incorporates a loading spinner to enhance user experience during data fetching and leverages a reusable Product component for consistent presentation and functionality.
    -   **Default Value for initialLikes Code Update** [64a7ea2](https://github.com/ld5ehom/market-web/commit/64a7ea2d7f67a94e3a6b5669fa861d2bdb2fec7b) :
        -   Ensured initialLikes defaults to an empty array (|| []) to handle potential undefined values safely.

**Task 5: Seller Page**

-   **Issues** : [task-5-seller](https://github.com/ld5ehom/market-web/tree/task-5-seller)
-   **Details** :
    -   **Seller Shop Product Page** [278b2c7](https://github.com/ld5ehom/market-web/commit/278b2c7285a86d37ed737ef28a2aeaadc003df20) :
        -   Implements a reusable layout component for seller shop pages, featuring a profile section and tab-based navigation (products, reviews, likes, following, followers). Integrates dynamic content rendering per tab and displays seller-specific details such as name, join date, product count, and introduction. Built with responsive design and efficient state management for seamless user interaction.
        -   Seller Shop Product List Component: Dynamically renders a paginated product list for a seller's shop. The component initializes with server-side data and fetches additional products via an API as users navigate through the list.
    -   **Seller Shop Review Page Implementation** [d511ebe](https://github.com/ld5ehom/market-web/commit/d511ebe9aab9ab28c024aaf456b127761b98e2e7) :
        -   Leverages server-side rendering (SSR) to preload shop reviews and detailed shop statistics, optimizing performance and ensuring a smooth user experience. Dynamically renders shop metrics, including product count, review count, likes, followers, and following, with efficient state and data management.
        -   Review List Component : Dynamically displays paginated reviews for a shop. Implements client-side state for current page navigation and integrates with an API for fetching additional review pages. Includes server-side rendering (SSR) for initial review data to enhance performance and user experience.
        -   Review Item Component : Dynamically displays individual reviews, including reviewer and product details.
    -   **Cart(Like) Page Update** [8ba42e5](https://github.com/ld5ehom/market-web/commit/8ba42e5776a0813bd206d4d274be198f548b79a9) :
        -   Allows users to view product details by clicking on items and adjust product quantities directly within the cart.
    -   **Follow Page Update** [a22f8f8](https://github.com/ld5ehom/market-web/commit/a22f8f89c92bf777cb81fb7b8375745512eeaba4) :
        -   Following Page: Implements a server-side rendered (SSR) page displaying a seller's following shops. Integrates a dynamic list of followed shops using FollowingList, while showcasing shop metrics such as product count, review count, likes, and followers.
        -   Follower Page: Implements a server-side rendered (SSR) page displaying a list of followers for a specific shop. It includes follower metrics, such as follower count, and integrates a dynamic, paginated list of followers using FollowerList.
        -   Edit Functionality for Own Shop: Implements features allowing shop owners to modify shop descriptions and names through input fields and action buttons, providing a seamless editing experience.

**Task 6: Product Management Page**

-   **Issues** : [task-6-manage](https://github.com/ld5ehom/market-web/tree/task-6-manage)
-   **Details** :

    -   **Product Management Page Layout** [737d862](https://github.com/ld5ehom/market-web/commit/737d8620c15b3ebd49510ce359dea80b864078a1)
        -   Products Layout Tab Component : Provides a tabbed navigation layout for product-related pages, including New Product, Manage Products, and Purchase/Sales History tabs.
        -   Products Manage Page Component : Provides a product management interface where shop owners can view, edit, and delete their products.
    -   **Product Creation and Editing Page Component** [d7d0fb3](https://github.com/ld5ehom/market-web/commit/d7d0fb314b9551f05c63a8b4384cfee57b8921e0)
        -   Provides an interface for users to create new products by uploading images, specifying product details (name, condition, exchange availability, and price), and selecting a trading location (city and district).
    -   **My History Page Components** [35d6118](https://github.com/ld5ehom/market-web/commit/35d61188247f5394b431a8a32d635a2c4609664d)
        -   Products History Sell Page Component: Implements server-side data fetching to retrieve sold products and their total count. Features a tab navigation for switching between history types. Uses a dynamic table structure to display product images, names, and prices in a paginated format.
        -   Products History Buy Page Component: Implements server-side data fetching to retrieve purchased products and their total count. Features a tab navigation for switching between history types. Includes a dynamic table structure to display product images, names, prices, and an action column for additional functionality, all in a paginated format.
    -   **Review Page Components with Markdown Editor**
        -   Review Button and Product Display Component: Dynamically displays purchased product information, including image, name, and price, while checking if a review has been posted. Features a button for writing reviews, which is disabled if a review already exists.
        -   Review Page Component: Retrieves product and review data during server-side rendering. Includes a textarea pre-filled with review content (if available) and a submit button that is disabled when a review already exists. Displays a user-friendly header prompting review submission.
        -   Markdown Editor and Viewer Component: Integrates the Toast UI Editor for a rich WYSIWYG and markdown editing experience with US English localization. It supports a customizable toolbar, keyboard shortcuts, and a content change callback. Additionally, includes a dynamic MarkdownViewer for rendering markdown content on the client side with ssr: false for optimized loading and performance, ensuring seamless integration between editing and viewing markdown.
        ```
        npm i @toast-ui/react-editor --legacy-peer-deps
        ```

---

### Milestone 2: Advanced Features and Testing

**Task 7: Chat Page**

**Task 8: Finalizing the Mock API Application**

**Task 9: Integrating with Supabase**

**Task 10: Deploying the Project**

---

### Milestone 3: Bug Fixes and Updates

---

## Start

```
npm install --legacy-peer-deps
```

```
npm run dev
```

-   **storybook start**:

```
npm run storybook
```

---

## Setup

-   **Homebrew (macOS terminal)**:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

-   **git (homebrew)**:

```
brew install git
```

-   **node.js (homebrew)**:

```
brew install node
```

-   **ESLint and Prettier**:

```
npm install eslint prettier -D
```

-   **react hook form**:

```
npm install react-hook-form --legacy-peer-deps
```

-   **storybook**:

```
npx storybook@latest init
npm install storybook@latest
```

-   **classnames**:

```
npm install classnames
```

-   **day.js**:

```
npm install dayjs --save
```

-   **Scroll-lock**:

```
npm install scroll-lock
npm install --save-dev @types/scroll-lock
```

-   **Mock Data Setup**:

```
npm install @faker-js/faker --save-dev
```

-   **Infinite Scroll and Carousel**:

```
npm install react-intersection-observer
npm install react-responsive-carousel --save
```
