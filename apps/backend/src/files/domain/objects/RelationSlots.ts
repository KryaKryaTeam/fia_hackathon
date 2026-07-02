import { ApiError, FileErrors } from '@/error/ApiError';
import {
  ISlotConfig,
  RelationSlots,
  RelationSlotsConfig,
} from '@/types/RelationSlots';

export class RelationSlotFamily {
  private readonly _value: string;

  private constructor(value: string) {
    const arrayOfFamilies = Array.from(Object.keys(RelationSlots));

    if (!arrayOfFamilies.includes(value))
      ApiError.throw(FileErrors.UNKNOWN_FAMILY);

    this._value = value;
  }

  static fromRelationString(value: RelationString) {
    return new RelationSlotFamily(value.family);
  }

  get value() {
    return this._value;
  }
}

export class RelationSlotCode {
  private readonly _value: string;

  private constructor(value: string, family: RelationSlotFamily) {
    const slotKey = family.value as keyof typeof RelationSlots;
    const arrayOfCodes = Array.from(Object.keys(RelationSlots[slotKey]));

    if (!arrayOfCodes.includes(value))
      ApiError.throw(FileErrors.UNKNOWN_FAMILY);

    this._value = value;
  }

  static fromRelationString(value: RelationString) {
    return new RelationSlotCode(
      value.code,
      RelationSlotFamily.fromRelationString(value),
    );
  }

  get value() {
    return this._value;
  }
}

export class RelationSlotConfig {
  private readonly _value: ISlotConfig;

  private constructor(value: string) {
    const config = RelationSlotsConfig.get(value);

    if (!config) ApiError.throw(FileErrors.CONFIG_NOT_FOUND);

    this._value = config;
  }

  static fromRelationString(value: RelationString) {
    return new RelationSlotConfig(value.value);
  }

  get value() {
    return this._value;
  }
}

export class RelationString {
  private readonly _value: string;
  private _family: RelationSlotFamily;
  private _code: RelationSlotCode;
  private _config: RelationSlotConfig;

  private constructor(value: string) {
    this._value = value;
  }

  static define(value: string) {
    console.error(value);
    const splited = value.split(':');

    if (!splited[0]) ApiError.throw(FileErrors.INVALID_RELATION_FORMAT, value);
    if (!splited[1]) ApiError.throw(FileErrors.INVALID_RELATION_FORMAT, value);

    const obj = new RelationString(value);

    obj.validate();
    return obj;
  }

  private validate() {
    this._family = RelationSlotFamily.fromRelationString(this);
    this._code = RelationSlotCode.fromRelationString(this);
  }

  private get splited(): string[] {
    return this._value.split(':');
  }

  public get family(): string {
    if (this._family) return this._family.value;
    return this.splited[0];
  }

  public get code(): string {
    if (this._code) return this._code.value;
    return this.splited[1];
  }

  public get config(): ISlotConfig {
    if (this._config) return this._config.value;
    this._config = RelationSlotConfig.fromRelationString(this);
    return this._config.value;
  }

  public get value(): string {
    return this._value;
  }
}
