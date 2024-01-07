import React, {useEffect, useState} from "react";

import AddJobForm from "./addJobForm/AddJobForm";
import AddJobSideImage from "./addJobSideImage/AddJobSideImage";

export default function AddJob() {
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
      <AddJobForm />
      {screenWidth >= 768 ? <AddJobSideImage /> : null}
    </>
  );
}
