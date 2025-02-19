const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");      //install and import multer
const jwt = require("jsonwebtoken");
const path = require("path");
// const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const bcrypt = require('bcryptjs'); // New

//configure dotenv
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());    //this express middleware function, will have acces to request object. This function goes into req object, it will collects the data we send, converts that into javascript object and gives it.
app.use(express.urlencoded());
app.use('/uploads', express.static('uploads')); //express.static
app.use(express.static(path.join(__dirname, "./client/build")));

let authorise = (req,res,next)=>{
    console.log("inside authorize middleware function");
    console.log(req.headers["authorization"]);
    next();
};

app.use(authorise);

//confiigure multer
const storage = multer.diskStorage({
    destination:  (req, file, cb)=> {
      cb(null, 'uploads')
    },
    filename: (req, file, cb)=> {
        console.log(file);
      cb(null, `${Date.now()}_${file.originalname}`)    //a file will be saved when account is created, an can be different even if it is a same named file.
    },
  });
  
  const upload = multer({ storage: storage });

  app.get("*",(req,res)=>{
    res.sendFile("./client/build/index.html");
  });


app.post("/signup",upload.single("profilePic") , async (req,res)=>{    //the data that comes from client to server is there in "req". To work on that we need express middle ware function. so we use app.use(express.json());

    console.log(req.body);
    console.log(req.file);

    let hashedPassword = await bcrypt.hash(req.body.password,10);

    try
    {let newUser = new User({        //creted object for the class User
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        email: req.body.email,
        password: hashedPassword,
        mobileNO: req.body.mobileNO,
        profilePic : req.file.path,
    });

    await User.insertMany([newUser]);
    console.log("successfully inserted");
    res.json({status:"success",msg:"User Created Successfully."});
}
catch(err){
    console.log("unable to insert data into db");
    res.json({status:"fail",msg:"Unable to create user."})
}
});

app.listen(8888,()=>{
    console.log(`Listening to port ${process.env.port}`);
});


app.post("/login",upload.none(),async (req,res)=>{
    console.log(req.body);

    let userArr = await User.find({email:req.body.email});

    if(userArr.length > 0){

        let isPasswordCorrect = await bcrypt.compare(req.body.password,userArr[0].password)

        if(isPasswordCorrect == true){
            let token = jwt.sign({email: req.body.email,password: req.body.password},"lakalakalaka")
            let dataToSend = {
                firstName : userArr[0].firstName,
                lastName : userArr[0].lastName,
                age : userArr[0].age,
                email : userArr[0].email,
                mobileNO : userArr[0].mobileNO,
                profilePic : userArr[0].profilePic,
                token: token,
            };

            res.json({
                status:"success",
                msg:"creadentials are correct",
                data :dataToSend,
            });
        }else{
            res.json({status:"failure",msg:"incorrect password"});
        }
    }else{
        res.json({status:"failure",msg:"user doesnt exist."});
    }

});

app.post("/validateToken",upload.none(),async (req,res)=>{
    console.log(req.body);

    let decryptedCredentials = jwt.verify(req.body.token,"lakalakalaka")
    console.log(decryptedCredentials);


    let userArr = await User.find().and({email:decryptedCredentials.email});

    if(userArr.length > 0){
        if(userArr[0].password == decryptedCredentials.password){
            let dataToSend = {
                firstName : userArr[0].firstName,
                lastName : userArr[0].lastName,
                age : userArr[0].age,
                email : userArr[0].email,
                mobileNO : userArr[0].mobileNO,
                profilePic : userArr[0].profilePic,
                token: token,
            };

            res.json({
                status:"success",
                msg:"creadentials are correct",
                data :dataToSend,
            });
        }else{
            res.json({status:"failure",msg:"incorrect password"});
        }
    }else{
        res.json({status:"failure",msg:"user doesnt exist."});
    }

});

app.patch("/updateProfile",upload.single("profilePic"),async (req, res)=>{

    try{

    console.log(req.body);

    if(req.body.firstName.trim().length>0){
        await User.updateMany(
            {email: req.body.email},
            {firstName: req.body.firstName},
        )
    }

    if(req.body.lastName.trim().length>0){
        await User.updateMany(
            {email: req.body.email},
            {lastName: req.body.lastName},
        )
    }   
    
    if(req.body.age > 0){
        await User.updateMany(
            {email: req.body.email},
            {age: req.body.age},
        )
    }

    if(req.body.password.length>0){
        await User.updateMany(
            {email: req.body.email},
            {password: req.body.password},
        )
    }

    if(req.body.mobileNO.trim().length>0){
        await User.updateMany(
            {email: req.body.email},
            {mobileNO: req.body.mobileNO},
        )
    }

    if(req.file){
        await User.updateMany(
            {email: req.body.email},
            {profilePic: req.file.path},
        )
    }
    console.log("Updated successfully");
    res.json({status:"success",msg:"Updated successfully"});
}catch(err){
    console.log("Unable to upadate");
    res.json({status:"fail",msg:"Unable to update"});
}


    // userSchema.updateMany({email:req.body.email},{firstName:req.body.firstName},{lastName:req.body.lastName})
    // res.json(["some dummy response"]);
})

app.delete("/deleteProfile",upload.none(),async (req,res)=>{

    try{
    console.log(req.body.email);
    let deleteObj = await User.deleteMany({email:req.body.email});
    if(deleteObj.deletedCount>0){
        res.json({status:"success",msg:"User deleted successfully"})
    }else{
        console.log({status:"success",msg:"Nothing is deleted"})
    }}
    catch(err){
        res.json({status:"failure",msg:"something is wrong"})
    }
});

let userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    age:Number,
    email:String,
    password:String,
    mobileNO:String,
    profilePic:String,
});

let User = new mongoose.model("users",userSchema,"users");


let connectToMDB = async ()=>{
    try{
        await mongoose.connect(process.env.mdburl);
        console.log("Successfully connected to mongoDB");
    }
    catch(err){
        console.log("Unable to connect to MDB",err);
    }
}

connectToMDB();