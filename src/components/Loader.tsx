import React from "react";
import { Skeleton, Stack } from "@mui/material";

type LoaderProps = {
  height?: number;
  times?: number;
  rounded?: boolean;
  width?: number | string;
  direction?: "row" | "column";
};

function Loader({
  height = 70,
  times = 2,
  rounded,
  width,
  direction,
}: LoaderProps) {
  return (
    <>
      <Stack gap={2} direction={direction}>
        {[...Array(times)].map((_, idx) =>
          rounded ? (
            <Skeleton
              key={idx}
              variant="rounded"
              width={width}
              height={height}
            />
          ) : (
            <Skeleton
              key={idx}
              variant="rounded"
              height={height}
              width={width}
            />
          )
        )}
      </Stack>
    </>
  );
}

export default Loader;
