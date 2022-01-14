import { classToPlain, ClassTransformOptions, Expose, instanceToPlain, Type } from "class-transformer";
import { IsInt, isInt, IsNegative, IsNotEmpty } from "class-validator";
import Base from "../entity/Base";

export default class Config extends Base{

  /**
   * 前端项目地址，用于博客页面链接到项目地址
   */
  @IsNotEmpty({ message: "项目地址不能为空" })
  @Expose()
  public projectAddress: string;

  /**
   * 图片防盗
   */
   @Expose()
  public imgProtect: boolean;

  /**
   * 允许跨域请求的域名白名单
   * 如果为Boolean值，则true表示任何请求都可以跨域，false表示不接受任何跨域请求
   */
  @Expose()
  public allowOrigin: string[] | boolean

  /**
   * 网站开始运行的时间
   * 不建议被请求修改
   */
  public startTime: Date;

  /**
   * 网站内容最后一次更新的时间
   * 不建议被请求修改
   */
   @Expose()
  public lastUpdatedTime: Date;

  @IsNegative({ message: "网站总字数应该是正数" })
  @IsInt({ message: "网站总字数必须是一个整数" })
  @Expose()
  public countWords: number;

  public static transform(obj: object, options?: ClassTransformOptions): Config {
    return super.baseTransform(this, obj, options);
  }

  public static toPlainObject(config: Config): object {
    return instanceToPlain(config, { strategy: "excludeAll" });
  }
}