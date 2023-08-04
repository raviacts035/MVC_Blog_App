import { Application } from "express";
import createServer from "../helpers/configServer"
import supertest = require('supertest');
import mongoose from "mongoose";
import config from '../config/index';
import JWT from 'jsonwebtoken';


const app:Application=createServer();

// Previously registered user ID from DB
const active_user_ID="64ca53b7a47c63ec1d03d5dc";
var active_token:string;
var Blog_ID_toDel:string;
var non_existing_blogId:string='64c225cf245318b9a744b0f5';

const long_title:string="This is a long blog title This is a long blog titleThis is a long blog titleThis is a long blog titleThis is a long blog title";
const short_discription:string="This is a short discription, not acceptable";

const acceptable_title:string='This is an acceptable Test Blog Title';

const acceptable_discription:string=`The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. 
Note that together with this response, a user-friendly page explaining the problem should be sent. 
This response should be used for temporary conditions and the Retry-After HTTP header should, if possible, contain the estimated time before the recovery of the service. 
The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.`


beforeAll(async()=>{
    active_token=JWT.sign({_id:active_user_ID},config.JWT_secret!,{expiresIn:config.JWT_Expiry});
    // active_token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGMzNzRjM2IwNGExNDEwMWRjMTQyYjAiLCJpYXQiOjE2OTEwNjE3ODEsImV4cCI6MTY5MTE0ODE4MX0.N0Lulv7wlAanmJVXjE2VplLWDkFcThU390lGH3qYjGQ"

    await mongoose.connect(config.Test_mongodb_URL!,).then(()=>{
        console.info("DB connected!!");
    })
})

afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close(true)
});

// Omitting title, disc
// title length range
// discription length range
//  

describe("Blog CRUD routes",()=>{
    describe("API - Create blog",()=>{
        describe('Omitting required parameters title & discription',():void=>{
            it("Should respond with 406, all fields required",async ()=>{
                const responce= await supertest(app).post("/blog")
                .set('Authorization', `Bearer ${active_token}`)

                expect(responce.statusCode).toBe(406)
                expect(responce?.body.success).toBe(false)
            })
        })
        describe("Title length greter then 120 char",():void=>{
            it("Should repond with 406, not acceptable",async ()=>{
                const responce=await supertest(app).post("/blog")
                .set('Authorization', `Bearer ${active_token}`)
                .send({
                    "title":long_title,
                    "discription":acceptable_discription,
                })
                expect(responce.statusCode).toBe(406)
                expect(responce.body?.success).toBe(false)
            })
        })
        describe("Discription length less then 100 char",():void=>{
            it("Should repond with 406, not acceptable",async ()=>{
                const responce=await supertest(app).post("/blog")
                .set('Authorization', `Bearer ${active_token}`)
                .send({
                    "title":acceptable_title,
                    "discription":short_discription,
                })
                expect(responce.statusCode).toBe(406)
                expect(responce.body?.success).toBe(false)
            })
        })
        describe("Sending acceptable parameters for success responce",():void=>{
            it('Should respond with 200 status and Blog object',async()=>{
                const responce=await supertest(app).post("/blog")
                .set('Authorization', `Bearer ${active_token}`)
                .send({
                    "title":acceptable_title,
                    "discription":acceptable_discription,
                })

                Blog_ID_toDel=responce.body?.newBlog?._id;
                console.log(Blog_ID_toDel);
                expect(responce.statusCode).toBe(200)
                expect(responce.body?.success).toBe(true)
            })
        })
    })


    // Update Blog Route
    describe("Update API - Update Blog",()=>{
        describe('Omitting required parameters title & discription',():void=>{
            it("Should respond with 406, at least one fields required",async ()=>{
                const responce= await supertest(app).put("/blog/64cba37d683f7bde8d29a4b3")
                .set('Authorization', `Bearer ${active_token}`)

                expect(responce.statusCode).toBe(406)
                expect(responce?.body.success).toBe(false)
            })
        })
        describe("Title length greter then 120 char",():void=>{
            it("Should repond with 406, not acceptable",async ()=>{
                const responce=await supertest(app).put("/blog/64cba37d683f7bde8d29a4b3")
                .set('Authorization', `Bearer ${active_token}`)
                .send({
                    "title":long_title,
                    "discription":acceptable_discription,
                })
                expect(responce.statusCode).toBe(406)
                expect(responce.body?.success).toBe(false)
            })
        })

        describe("Discription length less then 100 char",():void=>{
            it("Should repond with 406, not acceptable",async ()=>{
                const responce=await supertest(app).put("/blog/64cba37d683f7bde8d29a4b3")
                .set('Authorization', `Bearer ${active_token}`)
                .send({
                    "title":acceptable_title,
                    "discription":short_discription,
                })
                expect(responce.statusCode).toBe(406)
                expect(responce.body?.success).toBe(false)
            })
        })
        describe("Sending acceptable parameters for success responce",():void=>{
            it('Should respond with 200 status and Blog object',async()=>{
                const responce=await supertest(app).put("/blog/64cba37d683f7bde8d29a4b3")
                .set('Authorization', `Bearer ${active_token}`)
                .send({
                    "title":acceptable_title,
                    "discription":acceptable_discription,
                })
                expect(responce.statusCode).toBe(200)
                expect(responce.body?.success).toBe(true)
            })
        })
    })

    // GET Blogs Route
    describe("Get Blogs API",()=>{
        describe("Fetching GET API for array of Blogs",()=>{
            it("Should return an Array of Blogs",async ()=>{
                const responce=await supertest(app).get("/blog")
                .set('Authorization', `Bearer ${active_token}`)

                expect(responce.statusCode).toBe(200);
                expect(responce.body?.AllBlogs).toBeDefined();
            })
        })
    })


    // Delete Blog Route
    describe("Delete Blog Route",()=>{
        describe("Requeting to delete non-existing Blog ID",()=>{
            it("Should return 404, Blog doesn't exist",async ()=>{
                const responce=await supertest(app).delete(`/blog/${non_existing_blogId}`)
                .set("Authorization", `Bearer ${active_token}`)

                expect(responce.statusCode).toBe(404);
                expect(responce.body?.success).toBe(false);
            })
        })

        describe("Requeting existing Blog ID",()=>{
            it("Should return 200, Success ",async ()=>{
                await Blog_ID_toDel;
                const responce=await supertest(app).delete(`/blog/${Blog_ID_toDel}`)
                .set("Authorization", `Bearer ${active_token}`)

                expect(responce.statusCode).toBe(200);
                expect(responce.body?.success).toBe(true);
            })
        })
    })
})
