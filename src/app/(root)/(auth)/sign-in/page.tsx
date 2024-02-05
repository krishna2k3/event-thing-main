import * as React from "react";
import { FC } from "react";
import SignIn from "@/components/SignIn";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
        <Link href="/" className="self-start ml-4">
          <Button variant="outline">
            <ChevronLeft className="h-4 w-4" />
            Home
          </Button>
        </Link>
        <SignIn />
      </div>
    </div>
  );
};

export default page;
