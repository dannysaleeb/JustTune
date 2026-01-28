import { useState, useEffect } from "react";

export default function useLayoutMode() {
  const [mode, setMode] = useState(
    window.innerWidth < 1100 ? "mobile" : "desktop"
  );

  useEffect(() => {
    const onResize = () => {
      setMode(window.innerWidth < 1100 ? "mobile" : "desktop");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return mode;
}
