require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  }));
app.use(passport.initialize());
app.use(passport.session());
mongoose.set('strictQuery', true);
mongoose.connect(process.env.API_KEY, {useNewUrlParser: true});



const taskSchema =new mongoose.Schema ({
    admin:String,
    user:String,
    type:String,
    username:String,
    name:String,
    date:String,
    time:String,
    progress:{
        type:Number,
        default:0,
        max:100
    }
});

const userSchema =new mongoose.Schema ({
    status:String,
    name:String,
    admin:String,
    username:String,
    password:String,
});

userSchema.plugin(passportLocalMongoose, {
    username: "email"});
    

let dt=new Date();
    let d=(dt.getDate()).toString().padStart(2,0);
    let m= (dt.getMonth()+01).toString().padStart(2,0);
    let y=dt.getFullYear().toString();
    let x=y+"-"+m+"-"+d;
const Item=mongoose.model("item",taskSchema);

const User=mongoose.model("User",userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post("/login",function(req,res){
   
   const user=new User({
    username:req.body.username,
    password:req.body.password
    
   });
   User.findOne({username:req.body.username},function(err,founduser){
    const status=founduser.status;
    
   if(status=="users"){
    req.login(user,function(err){
    if(err){
        res.redirect('/');
    }
    else{
        passport.authenticate('local')(req,res,function(){
            res.redirect('/user');
            
        })
    }
   });

  }else{
    
    res.send('<p>NO Users Found</p> <p><a href="/">click to go to homepage</a></p>');
    
  }
 });
});
app.post("/loginadmin",function(req,res){
     const user=new User({
     username:req.body.username,
     password:req.body.password
     
    });
    User.findOne({username:req.body.username},function(err,founduser){
        const status=founduser.status;
        if(status=="Admin"){
      req.login(user,function(err){
     if(err){
         res.redirect('/loginadmin');
         
     }
     else{
         passport.authenticate('local')(req,res,function(){
             res.redirect('/admin');
             
         })
     }
    })
}
else{
    res.send('<p>NO Adminitrator Found </p> <p><a href="/loginadmin">click to go to homepage</a></p>');
    
}
})
 })
app.get('/loginadmin',function(req,res){
    res.render('admin');
})

app.post("/due",function(req,res){
    const liid=req.body.dueid;
    const pro=req.body.prog;
    Item.findOneAndUpdate({_id:liid}, { progress: pro },function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/user');
        }
    })
})
app.post("/admindue",function(req,res){
    const liid=req.body.dueid;
    const pro=req.body.prog;
    Item.findOneAndUpdate({_id:liid}, { progress: pro },function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/admin');
        }
    })
})
app.get("/",function(req,res){
   res.render('login');

})
app.get("/user",function(request,response){
   if(request.isAuthenticated()){
    
    Item.find({date:x,user:request.user.username,progress:{$ne:100}},function(err,founditems){ 
        response.render('index',{newlistitems:founditems});
        
     })
   }
   else{
    response.redirect('/');
   }
        

})
app.get("/admin",function(request,response){
    if(request.isAuthenticated()){
     User.find({admin:request.user.id},function(err,foundusers){
     Item.find({date:x,admin:request.user.id,progress:{$ne:100}},function(err,founditems){ 
         response.render('adminindex',{newlistitems:founditems,myid:request.user.id,allusers:foundusers});
         
      })
    })
    }
    else{
     response.redirect('/');
    }
         
 
 })
 app.get("/adminall",function(request,response){
    if(request.isAuthenticated()){
     User.find({admin:request.user.id},function(err,foundusers){
     Item.find({admin:request.user.id},function(err,founditems){ 
         response.render('adminall',{allitems:founditems,myid:request.user.id,allusers:foundusers});
         
      })
    })
    }
    else{
     response.redirect('/');
    }
         
 
 })

app.post("/signup",function(req,res){
   const user_id=req.body.username;
    const pass=req.body.password;
    const id=req.body.admin;
    const name=req.body.name;
    
    User.register({username:user_id,admin:id,name:name,status:"users"},pass, function(err, user){
        if (err) {
          console.log(err);
          res.redirect("/");
        } else {
          passport.authenticate("local")(req, res, function(){
            res.redirect('/user');
        
          });
        }
      });
   
})
app.post("/adminsignup",function(req,res){
    const user_id=req.body.username;
     const pass=req.body.password;
     
     
     User.register({username:user_id,admin:user_id,status:"Admin"},pass, function(err, user){
         if (err) {
           console.log(err);
           res.redirect("/");
         } else {
           passport.authenticate("local")(req, res, function(){
             res.redirect('/admin');
         
           });
         }
       });
    
 })


app.get("/all",function(request,response){ 
    if(request.isAuthenticated){  
        
        const ui=request.user.username;
        Item.find({user:ui},function(err,aitems){ 
                                     
            response.render('all',{allitems:aitems});
        })
    }
    else{
        response.redirect("/");
      }
})

app.get("/cmplt",function(request,response){ 
    if(request.isAuthenticated){
    Item.find({user:request.user.username,progress:100},function(err,items){ 
                                 
        response.render('cmplt',{completeditems:items});
    })
  }
  else{
    response.redirect("/");
  }
})
app.get("/impl",function(request,response){ 
    if(request.isAuthenticated){
    Item.find({user:request.user.username,type:"important",progress:{$ne:100}},function(err,items){ 
                                 
        response.render('imp',{importentitems:items});
    })
  }
  else{
    response.redirect("/");
  }
})
app.get("/adminimpl",function(request,response){ 
    if(request.isAuthenticated){
    Item.find({admin:request.user.id,type:"important",progress:{$ne:100}},function(err,items){ 
                                 
        response.render('adminimp',{importentitems:items});
    })
  }
  else{
    response.redirect("/");
  }
})
app.get("/admincmplt",function(request,response){ 
    if(request.isAuthenticated){
    Item.find({admin:request.user.id,progress:100},function(err,items){ 
                                 
        response.render('admincmplt',{completeditems:items});
    })
  }
  else{
    response.redirect("/");
  }
})
app.post("/",function(req,res){
    const itemname=req.body.newtask;
    let dt=new Date();
    let de=req.body.time;
    
    let d=(dt.getDate()).toString().padStart(2,0);
    let m= (dt.getMonth()+01).toString().padStart(2,0);
    let y=dt.getFullYear().toString();
    let x=y+"-"+m+"-"+d;
    const ui=req.user.username;
    const ad=req.user.admin;
    User.findOne({username:ui},function(err,fondname){
    const item=new Item({
        admin:ad,
        user:ui,
        type:'unimportant',
        username:fondname.name,
        name:itemname,
        date:x,
        progress:0,
        time:de
    })
    item.save();
})
    
    res.redirect("/user");
    
})
app.post("/admin",function(req,res){
    const itemname=req.body.newtask;
    let dt=new Date();
    let de=req.body.time;
    
    let d=(dt.getDate()).toString().padStart(2,0);
    let m= (dt.getMonth()+01).toString().padStart(2,0);
    let y=dt.getFullYear().toString();
    let x=y+"-"+m+"-"+d;
    const ui=req.body.username;
    const ad=req.user.id;
    
    if(typeof(ui)=='object'){
    
        ui.forEach(element => {
        
    
            User.findOne({username:element},function(err,fondname){
                       
                const item=new Item({
                admin:ad,
                user:element,
                type:'unimportant',
                username:fondname.name,
                name:itemname,
                date:x,
                progress:0,
                time:de
            })
            item.save();
            });
        });
        }
       
    else{
        User.findOne({username:ui},function(err,fondname){
               
            const item=new Item({
            admin:ad,
            user:ui,
            type:'unimportant',
            username:fondname.name,
            name:itemname,
            date:x,
            progress:0,
            time:de
        })
        item.save();
        });
    
    }
    res.redirect("/admin");
    
})
app.post("/adminall",function(req,res){
    const itemname=req.body.newtask;
    const time3=req.body.time;
    
    let de=req.body.date;
    
    const ui=req.body.username;
    const ad=req.user.id;
    
    if(typeof(ui)==Object){
    ui.forEach(element => {
        
    
    User.findOne({username:element},function(err,fondname){
               
        const item=new Item({
        admin:ad,
        user:element,
        type:'unimportant',
        username:fondname.name,
        name:itemname,
        date:de,
        progress:0,
        time:time3
    })
    item.save();
    });
});
    }
    else{
        User.findOne({username:ui},function(err,fondname){
               
            const item=new Item({
            admin:ad,
            user:ui,
            type:'unimportant',
            username:fondname.name,
            name:itemname,
            date:de,
            progress:0,
            time:time3
        })
        item.save();
        });
    }
    
    res.redirect("/adminall");
    
})
app.post("/all",function(req,res){
    const itemname=req.body.newtask;
    const time3=req.body.time;
    
    let de=req.body.date;
    const ui=req.user.username;
    const ad=req.user.admin;
    User.findOne({username:ui},function(err,fondname){
    const item=new Item({
        admin:ad,
        user:ui,
        type:'unimportant',
        username:fondname.name,
        name:itemname,
        progress:0,
        date:de,
        time:time3

    })
    item.save();
})
    
    res.redirect("/all");
    
});
function deleteitem(req){
    const delitem=req.body.delete;
    
    Item.findByIdAndRemove(delitem,function(err){
        if(err){
            console.log(err)
        }
        else{
            
        }
       
    })

}
function impitem(req){
    const impi=req.body.imp;
    Item.findOneAndUpdate({_id:impi}, { type: "important" },function(err){
        if(err){
            console.log(err);
        }
        else{
            
        }
    })
}
function unimpitem(req){
    const impi=req.body.imp;
    Item.findOneAndUpdate({_id:impi}, { type: "unimportant" },function(err){
        if(err){
            console.log(err);
        }
        else{
            
        }
    })
}
app.post("/imp",function(req,res){impitem(req);
      res.redirect('/user');
});
app.post("/alimp",function(req,res){impitem(req);res.redirect('/all');});
app.post("/adminimp",function(req,res){impitem(req);res.redirect('/admin');});
app.post("/adminalimp",function(req,res){impitem(req);res.redirect('/adminall');});
app.post("/unimp",function(req,res){unimpitem(req);
    res.redirect('/user');
});
app.post("/alunimp",function(req,res){unimpitem(req);res.redirect('/all');});
app.post("/adminunimp",function(req,res){unimpitem(req);res.redirect('/admin');});
app.post("/adminalunimp",function(req,res){unimpitem(req);res.redirect('/adminall');});

app.post("/admindelete",function(req,res){
   deleteitem(req);
  res.redirect("/admin");

})
app.post("/delete",function(req,res){
  deleteitem(req);
  res.redirect("/user");

})
app.post("/cmpldelete",function(req,res){
    deleteitem(req);
  res.redirect("/cmplt");

})
app.post("/admincmpltdelete",function(req,res){
   deleteitem(req);
  res.redirect("/admincmplt");

})

app.post("/aldelete",function(req,res){
   deleteitem(req);
  res.redirect("/all");

})
app.post("/adminaldelete",function(req,res){
    deleteitem(req);
  res.redirect("/adminall");

})
app.post("/delimp",function(req,res){
    unimpitem(req);
  res.redirect("/impl");

})
app.post("/admindelimp",function(req,res){
    unimpitem(req);
  res.redirect("/adminimpl");

})
app.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
  app.post('/cmpl',function(req,res){
    const cmpl=req.body.cmp;
    Item.findOneAndUpdate({_id:cmpl}, { progress:100,date:x },function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/user');
        }
    })
  })
  app.post('/alcmpl',function(req,res){
    const cmpl=req.body.cmp;
    Item.findOneAndUpdate({_id:cmpl}, { progress:100,date:x },function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/all');
        }
    })
  })
  app.post('/adminalcmpl',function(req,res){
    const cmpl=req.body.cmp;
    Item.findOneAndUpdate({_id:cmpl}, { progress:100,date:x },function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/adminall');
        }
    })
  })
  app.post('/admincmpl',function(req,res){
    const cmpl=req.body.cmp;
    Item.findOneAndUpdate({_id:cmpl}, { progress:100,date:x },function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/admin');
        }
    })
  })
  app.post('/cmplimp',function(req,res){
    const cmpl=req.body.cmp;
    Item.findOneAndUpdate({_id:cmpl}, { progress:100,date:x },function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/impl');
        }
    })
  })
  app.post('/admincmplimp',function(req,res){
    const cmpl=req.body.cmp;
    Item.findOneAndUpdate({_id:cmpl}, { progress:100,date:x },function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/adminimpl');
        }
    })
  })


app.listen(process.env.PORT||3000, function(){
    console.log("304");
       
})
