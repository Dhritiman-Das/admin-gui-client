import Image from "next/image";
import { H1, H4 } from "../ui/typography";
import SigninBtn from "./buttons/signinBtn";
import ContactSalesBtn from "./buttons/contactSalesBtn";
import { Button } from "../ui/button";
import { Play } from "lucide-react";
import { WatchVideo } from "./buttons/watchVideo";

export function Hero() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center container relative overflow-x-hidden my-10 md:my-0">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center w-full">
        <div className="flex flex-col hero-texts w-full md:min-w-[550px]">
          <H1>Welcome to EasyDB</H1>
          <H4 className="mt-4">
            Simplifying Database Access for Customer Support Teams
          </H4>
          <p>
            Unlock your database's potential with EasyDB. Effortlessly execute{" "}
            <br />
            queries, enhance security, and streamline customer support.
          </p>
          <div className="flex gap-4 mt-4">
            <SigninBtn />
            <ContactSalesBtn />
          </div>
          <div className="mt-1">
            <WatchVideo />
          </div>
        </div>
        <div className="p-2 bg-gradient-to-br from-red-400 to-blue-600 rounded-lg hero-img animate-gradient-x">
          <Image
            src="/landing-page/hero.svg"
            width={1300}
            height={200}
            alt="hero"
          />
        </div>
      </div>
    </div>
  );
}
