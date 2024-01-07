import React from "react";
import RegisterFormSection from "./form_section/RegisterFormSection";
import ImageCover from "./../common/coverImage/LoginRegisterCover";
import { useEffect, useState } from "react";

export default function Register() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));

    return () => {
      window.removeEventListener("resize", () =>
        setScreenWidth(window.innerWidth)
      );
    };
  }, [screenWidth]);  

  return (
    <>
      <RegisterFormSection />
      {screenWidth >= 768 ? <ImageCover /> : null}
    </>
  );
}
