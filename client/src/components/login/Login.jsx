import React, { useEffect, useState } from "react";
import LoginFormSection from "./form_section/LoginFormSection";
import ImageCover from "./../common/coverImage/LoginRegisterCover";

export default function Login() {
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
      <LoginFormSection />
      {screenWidth >= 768 ? <ImageCover /> : null}
    </>
  );
}
