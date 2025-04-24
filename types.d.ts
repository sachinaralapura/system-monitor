// define global types
type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageData: number;
};

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
};

type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
};

type Unsubscription = () => void;

interface Window {
  electron: {
    subscribeStats: (
      callback: (statistics: Statistics) => void
    ) => Unsubscription;
    getStaticData: () => Promise<StaticData>;
  };
}
