import { useEffect, useState } from "react";

export default function useStatistics(dataPoint: number): Statistics[] {
  const [value, setValue] = useState<Statistics[]>([]);

  useEffect(() => {
    const ub = window.electron.subscribeStats((stats) => {
      setValue((p) => {
        const newData = [...p, stats];
        if (newData.length > dataPoint) {
          newData.shift();
        }
        return newData;
      });
    });
    return ub;
  }, [dataPoint]);

  return value;
}
