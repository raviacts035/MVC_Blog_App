import express, {Application} from 'express';
import routes from '../routes/index';


function configServer():Application{
    const app:Application =express();
    
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))

    app.use('/',routes);

    return app
}

export default configServer