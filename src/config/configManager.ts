import * as path from "path";
import * as fs from "fs";
import Config from "./Config";

export default class ConfigManager {
  private siteConfig: Config;
  private static configPath = path.resolve(__dirname, "./siteinfo.json");
  private writePromise: Promise<void> = Promise.resolve();

  private constructor() {
    try {
      const siteConfig = fs.readFileSync(ConfigManager.configPath, { encoding: "utf8" });
      this.siteConfig = Config.transform(JSON.parse(siteConfig));
    } catch (error) {
      console.error(error);
    }
  }

  private static INSTANCE: ConfigManager | undefined;

  public static getConfigManager(): ConfigManager {
    if (this.INSTANCE === undefined) {
      return this.INSTANCE = new ConfigManager();
    }

    return this.INSTANCE;
  }

  public setConfig(config: object): void {
    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (config[key] !== undefined) {
          this.siteConfig[key] = config[key];
        }
      }
    }

    this.writePromise.then(() => {
      fs.writeFileSync(ConfigManager.configPath, JSON.stringify(this.siteConfig), { flag: "w+" });
    }, e => {
      console.error("文件写入失败\n", config, e);
    });
  }

  public getConfig(): object;
  public getConfig(key: string): boolean | string | any[];
  public getConfig(key: string = ""): object | boolean | string | any[] {
    if (key !== "") {
      return this.siteConfig[key];
    } else {
      // 深克隆
      return JSON.parse(JSON.stringify(this.siteConfig));
    }
  }

  public static setConfig(config: object): void {
    ConfigManager.getConfigManager().setConfig(config);
  }

  public static getConfig(): object {
    return ConfigManager.getConfigManager().getConfig();
  }
}