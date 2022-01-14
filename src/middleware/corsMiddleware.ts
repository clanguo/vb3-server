import * as cors from "cors";
import ConfigManager from "../config/configManager";
import { CORSError } from "./errorMiddleware";

const configManager = ConfigManager.getConfigManager();

export default cors({
  origin: (origin, callback) => {
    const allowOrigin = configManager.getConfig("allowOrigin");
    if (typeof allowOrigin === "boolean") {
      if (allowOrigin) {
        callback(null, true);
      }
    } else {
      if (
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