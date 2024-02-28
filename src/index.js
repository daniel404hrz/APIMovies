import app from "./server.js";
import  {sequelize}  from "./db.js";
const {
   DB_PORT,
  } = process.env;

async function main(){
    try {
        await sequelize.sync({force:false});
        console.log('Connection has been established successfully.')
        app.listen(3000)
        console.log('Server is listening on port ', DB_PORT)
    } catch (error) {
        console.log('Unable to connect to the database', error.message)
        
    }

}
main()