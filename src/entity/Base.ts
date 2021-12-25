import { ClassConstructor, plainToClass, plainToInstance, Type } from "class-transformer";
import { validate } from "class-validator";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export default class Base {
  @CreateDateColumn()
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Type(() => Date)
  updatedAt: Date;

  protected static baseTransform<T>(cls: ClassConstructor<T>, planObject: object): T {
    if (planObject instanceof cls) {
      return planObject;
    } else {
      return plainToInstance(cls, planObject);
    }
  }

  public async validateThis(skipMissingProperties = false): Promise<string[]> {
    const errors = await validate(this, { skipMissingProperties });
    return errors.flatMap(error => Object.values(error.constraints).map(e => `【${error.property}】${e}`));
  }
}