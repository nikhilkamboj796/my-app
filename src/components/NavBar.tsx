"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-black p-4 text-white flex justify-between items-center">
      <div>
        <Link href="/" className="px-3">
          Home
        </Link>
        {session ? (
          <Link href="/protected" className="px-3">
            Protected
          </Link>
        ) : null}
      </div>
      <div>
        {!session ? (
          <>
            <Link href="/login" className="px-3">
              Login
            </Link>
            <Link href="/signup" className="px-3">
              Signup
            </Link>
          </>
        ) : (
          <button
            onClick={() => signOut()}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
