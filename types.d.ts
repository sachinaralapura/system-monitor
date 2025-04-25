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


type Views = {
  CPU: boolean;
  RAM: boolean;
  STORAGE: boolean;
  STORAGESTATIC?: boolean
}

type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
  changeEvent: Views
};

type Unsubscription = () => void;

interface Window {
  electron: {

    subscribeStats: (callback: (statistics: Statistics) => void) => Unsubscription;

    getStaticData: () => Promise<StaticData>;

    subscribeChangeView: (callback: (view: Views) => void) => Unsubscription;

  };
}
