'use client'

import { signIn, signOut, useSession } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not Signed in<br />
      <button className="btn bg-red-500" onClick={() => signIn()}>Sign in</button>
    </>
  );
}
