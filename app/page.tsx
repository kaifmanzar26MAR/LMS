import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <p className="text-3xl  text-sky-700 font-bold">
        Hello world!!
      </p>
      <Button variant="destructive">Hello</Button>
    </div>
  );
}
