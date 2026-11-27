import { useEffect, useRef } from "react";
import type { CSSProperties, PropsWithChildren, TouchEvent } from "react";
import { Box } from "@mui/material";

interface SwipeableViewsProps extends PropsWithChildren {
  index: number;
  interval?: number;
  onChangeIndex: (index: number) => void;
  slideStyle?: CSSProperties;
}

const SwipeableViews = ({
  children,
  index,
  interval,
  onChangeIndex,
  slideStyle,
}: SwipeableViewsProps) => {
  const startX = useRef<number | null>(null);
  const slides = Array.isArray(children) ? children : [children];

  useEffect(() => {
    if (!interval || slides.length < 2) return undefined;

    const timer = window.setInterval(() => {
      onChangeIndex((index + 1) % slides.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [index, interval, onChangeIndex, slides.length]);

  const handleTouchEnd = (event: TouchEvent) => {
    if (startX.current === null) return;

    const delta = event.changedTouches[0].clientX - startX.current;
    startX.current = null;

    if (Math.abs(delta) < 40) return;
    onChangeIndex(
      delta < 0
        ? Math.min(index + 1, slides.length - 1)
        : Math.max(index - 1, 0)
    );
  };

  return (
    <Box
      onTouchStart={(event) => {
        startX.current = event.touches[0].clientX;
      }}
      onTouchEnd={handleTouchEnd}
      sx={{ overflow: "hidden", width: "100%" }}
    >
      <Box
        sx={{
          display: "flex",
          transform: `translateX(-${index * 100}%)`,
          transition: "transform 300ms ease",
          width: "100%",
        }}
      >
        {slides.map((slide, slideIndex) => (
          <Box
            key={slideIndex}
            sx={{ flex: "0 0 100%", minWidth: 0 }}
            style={slideStyle}
          >
            {slide}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SwipeableViews;
