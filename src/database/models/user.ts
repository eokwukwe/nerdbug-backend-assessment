import {
  BeforeCreate,
  Column,
  CreatedAt,
  DataType,
  IsEmail,
  Length,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { createHash } from '../../utils/bcrypt';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
  modelName: 'User',
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  last_name: string;

  @IsEmail
  @Length({ max: 255 })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Length({ min: 8 })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM('user', 'admin'),
    defaultValue: 'user',
  })
  role: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BeforeCreate
  static hashPassword(instance: User) {
    instance.password = createHash(instance.password);
  }

  toJSON() {
    // get the object of this instance
    let attributes = Object.assign({}, this.get());

    // delete the password field
    delete attributes.password;

    return attributes;
  }
}

export default User;
