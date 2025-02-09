## PennyWise

PennyWise is a Personal Budget and Expense Tracker designed to help users manage their finances effectively. It allows users to Create, Read, Update, and Delete (CRUD) expenses across multiple categories. The application provides a Pie Chart for visualizing the percentage of expenses in each category, helping users understand their spending habits. Additionally, it includes a Currency Converter that supports multiple global currencies, enabling users to track expenses in their preferred currency.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


## Expense Management (CRUD Operations):

Add new expenses with details like description, amount, category, currency, and date.

Edit or delete existing expenses.

View all expenses in a tabular format.

## Pie Chart Visualization:

Visualize expenses by category using a pie chart.

Each category is represented with a unique color for better clarity.

## Currency Converter:

Supports multiple currencies (e.g.,INR , USD, EUR, GBP, JPY).

Converts expenses to a user-selected base currency for consistent tracking.

## Line Chart for Trends:

Displays expense trends over time using a line chart.

Helps users identify spending patterns.

## Local Storage Integration:

Saves expenses to the browser's local storage for persistence across sessions.
