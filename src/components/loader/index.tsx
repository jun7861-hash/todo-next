import React from "react";
import { LoadingOverlay } from "@mantine/core";

const Loader = ({ isLoading }: { isLoading: boolean }) => {
  return <LoadingOverlay visible={isLoading} overlayBlur={2} />;
};

export default Loader;
