import React from "react";

import Image from "next/image";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]">
          <Image
            src={"/assets/documents.png"}
            alt="Documents with reading character"
            fill
            className="Documents object-contain dark:hidden"
          />
          <Image
            src={"/assets/documents-dark.png"}
            alt="Documents with reading character"
            fill
            className="Documents object-contain hidden dark:block "
          />
        </div>
        <div className="relative h-[400px] w-[400px] hidden md:block ">
          <Image
            src={"/assets/reading.png"}
            alt="Person who read the book"
            fill
            className="object-contain dark:hidden"
          />
          <Image
            src={"/assets/reading-dark.png"}
            alt="Person who read the book"
            fill
            className="object-contain hidden dark:block"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
