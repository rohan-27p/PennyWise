'use client'
import ExpenseTracker from '@/components/ExpenseTracker'
 // this is the main page
export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <ExpenseTracker />
    </main>
  )
}