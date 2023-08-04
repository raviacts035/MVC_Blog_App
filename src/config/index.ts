import dotenv from 'dotenv';

dotenv.config();


const config={
    PORT: process.env.PORT,
    mongodb_URL:process.env.mongodb_URL,
    JWT_secret:process.env.JWT_secret,
    JWT_Expiry:process.env.JWT_Expiry,
    Test_mongodb_URL:process.env.Test_mongodb_URL
    
}

export default config;