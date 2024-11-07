# Store Website (Frontend)

## Project Overview

-   Utilized : TypeScript, Next.js, React, Supabase, tailwindCSS, Storybook, Cypress, ESLint, Prettier

---

## Milestones

-   M1 : App Basic Functionality Development
-   M2 : Advanced Features and Testing

---

## Reference Site

-   [Design System](https://primer.style/components)
-   [tailwindcss](https://tailwindcss.com/docs)
-   [storybook](https://storybook.js.org/)
-   [Google material Symbol](https://fonts.google.com/iconss)
-   [Day.js](https://day.js.org/docs/en/installation/installation)
-   [Scroll-lock](https://www.npmjs.com/package/scroll-lock)

## Task List

### M1: App Basic Functionality Development

**Task 1. Common Layout**

-   **Issues** : [task-1-layout](https://github.com/ld5ehom/store-web/tree/task-1-layout)
-   **Details** :
    -   **Common Components** [06f0a07](https://github.com/ld5ehom/store-web/commit/06f0a07516407c89948ee87821ab0400d50abde5) :
        -   Components to be created: Text, Button, Input, Product components
        -   Installation needed:
            -   npm install next@14 --save
            -   npm install classnames
            -   npx storybook@latest init
            -   npm install dayjs --save
        -   Extensions:
            -   Tailwind CSS IntelliSense
    -   **Header Layout** [c681062](https://github.com/ld5ehom/store-web/commit/c68106225df491d02d25a7b849599c608581b5e4) :
        -   Header Layout Implementation Created the Header component and set up a basic layout including the logo, menu, and search bar.
        -   Added Search Bar Added the Search component within the Header to implement a search field. Used Tailwind CSS to style and adjust the width of the search bar.
    -   **Footer Layout** [d1ceec9](https://github.com/ld5ehom/store-web/commit/d1ceec9a45e517182dd0709adba1567c8d891715) :
        -   Footer UI Update using github desktop
    -   **Login/Signup Modal and Sidebar Implementation**
        -   Login and Signup Modal: When the login or signup button is clicked, a modal window opens, displaying the respective screen within the modal.
        -   Used scroll-lock to prevent scrolling when the login/signup modal is open.
            -   npm install scroll-lock
            -   npm install --save-dev @types/scroll-lock
        -   Created a sidebar using SASS to display the Cart and Recently Viewed items list on the right side of the screen.
            -   npm install sass

**Task 2: Mock Client**

**Task 3: Main Page**

**Task 4: Product Search Page**

**Task 5: Product Details Page**

**Task 6: Shopping Cart Page**

**Task 7: Implementing the Product Management Page**

---

### Milestone 2: Advanced Features and Testing

**Task 8: Chat Page**

**Task 9: Finalizing the Mock API Application**

**Task 10: Integrating with Supabase**

**Task 11: Deploying the Project**

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

---

## Start

```
npx create-next-app
```

```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a `src/` directory? … Yes
✔ Would you like to use App Router? (recommended) … No
✔ Would you like to customize the import alias (@/* by default)? … No
Creating a new Next.js app in /Users/teo/Desktop/store-web.
```

```
npm run dev
```

-   **storybook start**:

```
npm run storybook
```
