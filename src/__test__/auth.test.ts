import { Application } from "express";
import createServer from "../helpers/configServer"
import supertest = require('supertest');
import mongoose from "mongoose";
import config from '../config/index';


const app:Application=createServer();

beforeAll(()=>{
    mongoose.connect(config.Test_mongodb_URL!,).then(()=>{
        console.info("DB connected!!")
    })
})

afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close(true)
});


// test credentials
const user_name:string="TestName1";
const new_email:string="ravi"+Math.floor(Math.random() * 1001)+"@gmail.com";
const login_test_email:string='ravi123@gmail.com';
const login_test_paswd:string="ravi123@";
const longest_test_name:string='TestNameTestNameTestNameTestNameTestNameTestName';
const longest_test_email:string="ravi123ravi123ravi123ravi123ravi123ravi123ravi123ravi123ravi123ravi123ravi123ravi123ravi123ravi123ravi123ravi123ravi123ravi123@gmail.com";
const longest_test_paswd:string="ravi123ravi123ravi123@";


describe("User",()=>{
    // User Register API section
    describe("Register Route",():void=>{
        describe("Sending all required new user Credentials",()=>{
            it("It Should respond with 200",async ()=>{
                const responce =await supertest(app).post("/auth/register")
                    .send({
                        "name":user_name,
                        "email":new_email,
                        "password":login_test_paswd
                      });
                      expect(responce.statusCode).toBe(200);
                      expect(responce.body?.success).toBe(true)
            })
        })
        describe("Request with email parameter omitted",()=>{
            it("Request should fail with 400",async ()=>{
                const responce=await supertest(app).post("/auth/register")
                .send({
                    "name":user_name,
                    "password":login_test_paswd
                  })
                expect(responce.statusCode).toBe(400);
                expect(responce.body?.success).toBe(false);
            })
        })
        describe("Sending NAME greater then 40 charecter",()=>{
            it("It should respond with 413, payload too large",async ()=>{
                const responce=await supertest(app).post("/auth/register")
                .send({
                    "name":longest_test_name,
                    "email":login_test_email,
                    "password":login_test_paswd
                  })
                expect(responce.statusCode).toBe(413);
                expect(responce.body?.success).toBe(false);
            })
        })
        describe("Sending email greater then 130 charecter",()=>{
            it("It should respond with 413, payload too large",async ()=>{
                const responce =await supertest(app).post("/auth/login")
                .send({
                    "name":user_name,
                    "email":longest_test_email,
                    "password":login_test_paswd
                  })
                  expect(responce.statusCode).toBe(413)
                  expect(responce.body?.success).toBe(false)
            })
        })

        describe("Sending PASSWORD greater then 16 charecter",()=>{
            it("Should respond with 413, payload too large",async ()=>{
                const responce =await supertest(app).post("/auth/login")
                .send({
                    "email":login_test_email,
                    "password":longest_test_paswd
                  })
                expect(responce.statusCode).toBe(413)
                expect(responce.body?.success).toBe(false)
            })
        })
        describe("Trying to Register already registered email",()=>{
            it("Should respond with USER already exist's, 409",async ()=>{
                const responce =await supertest(app).post("/auth/register")
                    .send({
                        "name":user_name,
                        "email":"ravi123@gmail.com",
                        "password":"ravi123@"
                      });
                      expect(responce.statusCode).toBe(409);
                      expect(responce.body?.success).toBe(false)
            })
        })
        
    })


    // User Login API section
    describe("Login Route",():void=>{
        describe("Sending Correct credentials",():void=>{
            it("should respond with 200",async ()=>{
                const responce =await supertest(app).post("/auth/login")
                .send({
                    "email":login_test_email,
                    "password":login_test_paswd
                  })
                expect(responce.statusCode).toBe(200)
                expect(responce.body?.success).toBe(true)
                expect(responce.body?.token).toBeDefined()
            })
            
        })
        describe("Not sending any credentials",():void=>{
            it(", It should respond with 400",async ()=>{
                const responce =await supertest(app).post("/auth/login");
                expect(responce.statusCode).toBe(400);
                expect(responce.body?.success).toBe(false)
            })
        })
        describe("Sending email greater then 130 charecter",()=>{
            it("It should respond with 413, payload too large",async ()=>{
                const responce =await supertest(app).post("/auth/login")
                .send({
                    "email":longest_test_email,
                    "password":login_test_paswd
                  })
                  expect(responce.statusCode).toBe(413)
                  expect(responce.body?.success).toBe(false)
            })
        })
        describe("Sending password greater then 16 charecter",()=>{
            it("It should respond with 413, payload too large",async ()=>{
                const responce =await supertest(app).post("/auth/login")
                .send({
                    "email":login_test_email,
                    "password":longest_test_paswd
                  })
                expect(responce.statusCode).toBe(413)
                expect(responce.body?.success).toBe(false)
            })
        })
        describe("Sending non-registered email",()=>{
            it("It should respond with 404, not found",async ()=>{
                const responce =await supertest(app).post("/auth/login")
                .send({
                    "email":"randomEmail@test.com",
                    "password":login_test_paswd
                  })
                expect(responce.statusCode).toBe(404);
                expect(responce.body?.success).toBe(false)
            })
        })
    })
})
