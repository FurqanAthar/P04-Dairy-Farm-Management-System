import { SunspotLoader } from "react-awesome-loaders";
export const SunspotLoaderComponent = () => {
  return (
    <>
      <SunspotLoader
        gradientColors={["#6366F1", "#E0E7FF"]}
        shadowColor={"#3730A3"}
        desktopSize={"128px"}
        mobileSize={"100px"}
      />
    </>
  );
};
