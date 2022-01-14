import * as log4js from "log4js";
import * as path from "path";

log4js.configure({
  appenders: {
    route: {
      type: "file",
      maxLogSize: 1024 * 1024 * 10, // 10M
      keepFileExt: true, // 保持文件后缀为log
      filename: path.resolve(__dirname, "../public/log", "route.log"),
      layout: {
        type: "pattern",
        pattern: "[%d] [%p] [%h] [%m]"
      }
    },
    out: {
      type: "stdout",
    }
  },
  categories: {
    route: {
      appenders: ["route"],
      level: "all"
    },
    default: {
      appenders: ["out"],
      level: "error"
    }
  }
});

export const routeLogger = log4js.getLogger("route");