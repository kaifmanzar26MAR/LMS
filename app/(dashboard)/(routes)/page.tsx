import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
export default function Home() {
  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <p>hello</p>
    </div>
  );
}
