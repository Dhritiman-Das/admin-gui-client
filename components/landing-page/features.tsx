import React from "react";
import { H1 } from "../ui/typography";
import { WobbleCard } from "../ui/wobble-card";
import Image from "next/image";

export default function Features() {
  return (
    <div className="min-h-screen container mb-10">
      <div className="flex justify-center">
        <H1>Features</H1>
      </div>
      <div className="bento mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
            className=""
          >
            <div className="max-w-xs">
              <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Developer-Friendly Query Creation
              </h2>
              <p className="mt-4 text-left  text-base/6 text-neutral-200">
                Developers can easily write queries and set customizable
                variables within EasyDB. This simplifies the query-writing
                process and maintains consistency across your database
                operations.
              </p>
            </div>
            <Image
              src="/landing-page/user-query.svg"
              width={500}
              height={500}
              alt="linear demo image"
              className="absolute -right-4 lg:-right-[20%] grayscale filter -bottom-20 lg:-bottom-16 object-contain rounded-2xl"
            />
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 min-h-[300px]">
            <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Comprehensive Query Tracking
            </h2>
            <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
              EasyDB tracks every query executed by customer support, providing
              valuable insights into user interactions. This ensures
              accountability within your organization and enables you to monitor
              query performance and user behavior through detailed tracking and
              reporting features.
            </p>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[600px] lg:min-h-[600px] xl:min-h-[300px]">
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Seamless Customer Support Access
              </h2>
              <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                Customer support teams can effortlessly execute queries by
                filling in predefined values in EasyDB. This eliminates the need
                for technical expertise or manual query construction, enabling
                quick and efficient access to the necessary information.
              </p>
            </div>
            <Image
              src="/landing-page/run-query.svg"
              width={500}
              height={500}
              alt="linear demo image"
              className="absolute -right-4 lg:-right-[2%] grayscale filter -bottom-8 lg:-bottom-12 object-contain rounded-2xl"
            />
          </WobbleCard>
        </div>
      </div>
    </div>
  );
}
