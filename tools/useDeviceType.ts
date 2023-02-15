import { useEffect, useState } from "react";
import * as Device from "expo-device";

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState(Device.DeviceType.UNKNOWN);

  useEffect(() => {
    getDeviceType();
  }, []);

  const getDeviceType = async () => {
    try {
      const deviceType = await Device.getDeviceTypeAsync();
      setDeviceType(deviceType);
    } catch (err: any) {
      setDeviceType(err.message);
    }
  };

  return deviceType;
};

export default useDeviceType;
