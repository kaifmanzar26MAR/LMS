"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Link, LogOut } from "lucide-react";

function NavbarRoutes() {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");

  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isPlayerPage ? (
        <Button size="sm" variant="ghost" onClick={()=>router.push('/')}>
          <LogOut className="h-4 w-4 mr-2" />
          Exit
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => router.push("/teacher/courses")}
        >
          Teacher mode
        </Button>
      )}
      <UserButton afterSignOutUrl="/" />
      {/*need a replacement for afterSignOutUrl */}
    </div>
  );
}

export default NavbarRoutes;
