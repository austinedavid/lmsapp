import React from "react";
import Container from "./Container";
import HeroLeft from "./hero/HeroLeft";
import HeroRight from "./hero/HeroRight";

const Hero = () => {
  return (
    <Container>
      <div className=" w-full lg:mb-20 max-sm:mt-16 sm:h-[500px] lg:h-[calc(100vh-75px)]  flex sm:flex-row   flex-col sm:items-center md:items-end gap-3">
        <HeroLeft />
        <HeroRight />
      </div>
    </Container>
  );
};

export default Hero;
