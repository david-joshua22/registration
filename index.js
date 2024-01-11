import express  from "express";
import {dirname} from "path";
import  {fileURLToPath}  from "url";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import { error } from "console";

const Schema = mongoose.Schema;

const regdata = new Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required: true
    }
})

mongoose.connect('mongodb://127.0.0.1:27017/mydb').then((result)=>console.log("Connected")).catch((err)=>{
    console.log(err);
});

const conn = mongoose.model('registration',regdata);

const __dirname = dirname(fileURLToPath(import.meta.url)); 

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.post("/submit",async (req,res)=>{
        var uname = req.body.pname;
        var useremail=req.body.email;
        var passwor=req.body.password;

        const existing = await conn.findOne({email:useremail});
        if(!existing){
            const rdata = new conn({
                name:uname,
                email: useremail,
                password: passwor
            });
            await rdata.save().then((result)=>{
                console.log(result)
            })
            res.redirect("/main");
        }
        else{
            console.log(existing);
            res.redirect("/error");
        }
});
app.get("/main",async(req,res)=>{
    conn.find({}).sort({_id:-1}).limit(1).select("-_id -__v")
    .exec().then((data)=>{
        res.render('main.ejs',{record:data});
    });
});
app.get("/error",(req,res)=>{
    res.render("error.ejs");
});
app.listen(5500,()=>{
    console.log("Server is running on port 5500");
}) 