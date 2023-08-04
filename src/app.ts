import http from 'http';
import config from './config/index';
import mongoose from 'mongoose';
import createServer from './helpers/configServer';


const app=createServer();
const server: http.Server=http.createServer(app);

// Connecting DB and Starting server
try{
    mongoose.connect(config.mongodb_URL)
    console.log('DataBase Connected!!')

    server.listen(config.PORT,():void=>{
        console.log(`Server has started on prot ${config.PORT}`)
    })
}catch(error){
    console.log("Unable to start server!!")
}



// export default app