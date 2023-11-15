import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  UpdatedAt,
  ForeignKey,
  BeforeCreate,
} from 'sequelize-typescript';

import config from 'config';
import User from './user';

@Table({
  tableName: 'sessions',
  timestamps: false,
  underscored: true,
  modelName: 'Session',
})
export default class Session extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  user_id: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expires_at: Date;

  @BelongsTo(() => User)
  user: User;

  public hasExpired(): boolean {
    return new Date(this.expires_at) < new Date();
  }
}
