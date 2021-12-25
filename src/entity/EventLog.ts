import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Base from "./Base";

export enum EventType {
  addBlog = 0,
  removeBlog = 1,
  addTag = 2,
  removeTag = 3,
  startServer = 4
}

export interface IEventLog {
  timing: Date;

  target: string;

  targetId?: string;

  type: EventType;
}

@Entity()
export default class EventLog extends Base {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * 事件时间点
   */
  @IsNotEmpty({ message: "事件时间点不能为空" })
  @Type(() => Date)
  @Column()
  timing: Date;

  @IsNotEmpty({ message: "事件类型不能为空" })
  @Type(() => Number)
  @Column()
  type: EventType;

  @IsNotEmpty({message: "事件对象不能为空"})
  @Type(() => String)
  @Column()
  target: String;

  @Type(() => String)
  @Column()
  targetId: string = "";

  public static transform(obj: object): EventLog {
    return super.baseTransform(this, obj);
  }
}