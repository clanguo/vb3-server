import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import Base from "./Base";
import { Blog } from "./Blog";

@Entity()
export default class Category extends Base {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  @IsNotEmpty({ message: "分类名不能为空" })
  @Type(() => String)
  name: string;

  @JoinColumn()
  @OneToMany((type) => Blog, (blogs) => blogs.category)
  blogs: Blog[];

  public static transform(planObject: object): Category {
    return super.baseTransform(this, planObject);
  }
}