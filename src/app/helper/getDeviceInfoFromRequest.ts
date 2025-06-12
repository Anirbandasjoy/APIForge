import useragent from 'useragent';
import { Request } from 'express';
export const getDeviceInfoFromRequest = (req: Request) => {
  const agent = useragent.parse(req.headers['user-agent']);
  const deviceInfo = {
    browser: agent.toAgent(),
    os: agent.os.toString(),
    ip: req.ip || 'unknown ip',
  };

  return {
    browser: deviceInfo.browser,
    ip: deviceInfo.ip,
    os: deviceInfo.os,
  };
};
