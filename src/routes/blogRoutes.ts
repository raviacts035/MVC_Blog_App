import { Router } from "express";
import { CreateBlog, DeleteBlog, UpdateBlog, GetAllBlog} from '../controllers/blogController';
import { isLoggedIn } from "../middleware/isLoggedIn";

const BlogRoutes=Router();

BlogRoutes.get('/',isLoggedIn, GetAllBlog);
BlogRoutes.post('/',isLoggedIn, CreateBlog);
BlogRoutes.delete('/:id',isLoggedIn, DeleteBlog);
BlogRoutes.put('/:id',isLoggedIn, UpdateBlog);

export default BlogRoutes