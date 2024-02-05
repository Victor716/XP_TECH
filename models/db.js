import { Sequelize } from 'sequelize';


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './xp_tech.db' // 所有表格都存储在这个数据库文件中
});


export default sequelize;
