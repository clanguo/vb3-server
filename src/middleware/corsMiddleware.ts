import * as cors from "cors";
import ConfigManager from "../config/configManager";
import { CORSError } from "./errorMiddleware";
import defaultConfig from "../config/defaultConfig";

const configManager = ConfigManager.getConfigManager();

export default cors({
  origin: (origin, callback) => {
    const allowOrigin = configManager.getConfig("allowOrigin");
    if (typeof allowOrigin === "boolean" && allowOrigin === true) {
      callback(null, true);
    } else {
      /**
       * 默认配置包含了本地服务器和部署服务器
       */
      if (
        defaultConfig.allowOrigin.includes(origin) ||
        allowOrigin !== false ||
        allowOrigin && (allowOrigin as string[]).includes(origin)
        || origin === undefined
      ) {
        callback(null, true);
      } else {
        callback(new CORSError(`域名:${origin}不在cors白名单内`));
      }
    }
  }
})