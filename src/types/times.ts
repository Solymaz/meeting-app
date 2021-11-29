export type TTimeFormat = {
  hours: number;
  minutes: number;
};

export type TTime = {
  time: {
    startTime: TTimeFormat;
    endTime: TTimeFormat;
  };
};
