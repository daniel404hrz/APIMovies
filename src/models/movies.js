
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const Movie = sequelize.define('Movie', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rentalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  salePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  availability: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Inicialmente, ninguna película tiene likes
  },
});

export default Movie;