'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  if (session) {
  return (
    <>
      Not signed in {session.user.email}<br />
      <button className="bg-blue-500 py-1 border-2 px-3 rounded-2xl " onClick={() => signIn()}>Sign in</button>
    </>
  )
}return (
  <></> 
)
}