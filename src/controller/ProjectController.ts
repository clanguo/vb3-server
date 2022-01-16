import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Blog } from "../entity/Blog";
import Category from "../entity/Category";
import EventLog, { EventType, IEventLog } from "../entity/EventLog";
import { Tag } from "../entity/Tag";
import { ResponsePageData, ResponseResult, sendData, sendError, sendPageData } from "./Common";
import ConfigManager from "../config/configManager";
import Config from "../config/Config";
class ProjectController {
  private useEventLog = getRepository(EventLog);
  private useBlogs = getRepository(Blog);
  private useTags = getRepository(Tag);
  private useCategory = getRepository(Category);
  private configManager = ConfigManager.getConfigManager();

  public async addEventLog(obj: IEventLog): Promise<void> {
    const eventLog = EventLog.transform(obj);
    const errors = await eventLog.validateThis();
    if (errors.length) {
      // throw new Error(errors.join("; "));
      console.error("日志记录失败：" + errors.join("; "));
    } else {
      await this.useEventLog.save(eventLog);
    }

    ConfigManager.setConfig({
      lastUpdatedTime: Date.now()
    });
  }

  public async one(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<EventLog>> {
    const id = req.params.id;
    const eventLogIns = await this.useEventLog.findOne(id);
    if (eventLogIns) {
      return sendData(eventLogIns);
    } else {
      return sendError("找不到id为:" + id + "的数据");
    }
  }

  public async all(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<EventLog[]>> {
    const eventLogs = await this.useEventLog.find({ order: { timing: "DESC" } });
    return sendData(eventLogs);
  }

  public async project(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<any>> {
    const blogs = await this.useBlogs.count();
    const tags = await this.useTags.count();
    const categories = await this.useCategory.count();
    const config = this.configManager.getConfig() as any;
    return sendData({
      blog: blogs,
      tag: tags,
      categories,
      projectAddress: config.projectAddress,
      countWords: config.countWords,
      startTime: config.startTime,
      lastUpdatedTime: config.lastUpdatedTime
    });
  }

  public async archive(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<any>> {
    const blogs = await this.useEventLog.find({ type: EventType.addBlog });
    return sendData(blogs);
  }

  public async getSetting(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<object>> {
    const config = this.configManager.getConfig();
    return sendData(config);
  }
  
  public async setSetting(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<boolean>> {
    const config = Config.transform(req.body, { excludeExtraneousValues: true });
    const errors = await config.validateThis(true);
    if (errors.length) {
      return sendError(errors.join("; "));
    }

    this.configManager.setConfig(Config.toPlainObject(config));
    return sendData(true);
  }
}

export default ProjectController;