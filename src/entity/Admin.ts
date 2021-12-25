import { Type } from "class-transformer";
import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import Base from "./Base";

@Entity()
@Unique(["account"])
export class Admin extends Base {
  @IsNotEmpty({ message: "账户名不能为空" })
  @MinLength(3, { message: "账户名不能小于三位字符" })
  @MaxLength(10, {message: "账户名不能大于10个字符"})
  @Matches(/^[a-zA-Z0-9@]{3,10}$/, {message: "账户名只能是字母、数字、@等组合"})
  @Type(() => String)
  @PrimaryColumn()
  account: string;

  @IsNotEmpty({message: "密码不能为空"})
  @MinLength(4, {message: "密码长度不能小于4"})
  @MaxLength(16, {message: "密码长度不能大于16"})
  @Matches(/^[a-zA-Z0-9@]{3,10}$/, {message: "密码只能是字母、数字、@等组合"})
  @Type(() => String)
  @Column()
  password: string;

  public static transform(obj: object) {
    return super.baseTransform(this, obj);
  }
}