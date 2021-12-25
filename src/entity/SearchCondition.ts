import { Type } from "class-transformer";
import { IsInt, IsPositive } from "class-validator";
import Base from "./Base";

export default class SearchCondition extends Base {
  @IsInt({ message: "limit必须是一个整数" })
  @IsPositive({ message: "limit必须是一个正数" })
  @Type(() => Number)
  limit: number = 10;

  @IsInt({ message: "page必须是一个整数" })
  @IsPositive({ message: "page必须是一个正数" })
  @Type(() => Number)
  page: number = 1;

  @Type(() => String)
  key: string = '';

  public static transform(obj: object): SearchCondition {
    return super.baseTransform(this, obj);
  }
}