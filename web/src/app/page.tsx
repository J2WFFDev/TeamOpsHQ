import Link from 'next/link'

export default function Home() {
  // Authentication temporarily disabled for initial build. Show sign-in link.
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome to TeamOpsHQ</h1>
      <Link href="/signin" className="inline-block rounded bg-black text-white px-4 py-2">Sign in</Link>
    </div>
  )
}
