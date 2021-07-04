var express = require("express");  
var path = require("path");  
var mongoose = require('mongoose');   
var bodyParser = require('body-parser');   
var morgan = require("morgan");  
var db = require("./config.js");  
var ejs = require('ejs');

var app = express();  
var port = process.env.port || 9999;  
var srcpath  =path.join(__dirname,'/public') ;  
app.use(express.static('public'));  
app.use(bodyParser.json());    
app.use(bodyParser.urlencoded({extended:true}));  
  

 ///////////////////////////////////////
var Schema = mongoose.Schema;  
var studSchema = new Schema({      
  	studusn: { type: String, unique : true, dropDups: true  },       
    studname: { type: String   },            
    studph: { type: String },
    marks_maths: { type: String  },
    marks_daa: { type: String  },
    marks_os: { type: String  },
    marks_mces: { type: String  },
    marks_ooc: { type: String  },
    marks_dc: { type: String  },
    studper: { type: String  }
},{ versionKey: false });  
var model = mongoose.model('Student', studSchema, 'Student');  

app.get('/index.html', function (req, res) {  
   console.log("Got a GET request for the homepage");  
   res.sendFile("index.html");   
})

//api for INSERT data from database  
app.post("/api/savedata",function(req,res){   
       
    var mod = new model(req.body);  
	req.body.serverMessage = "NodeJS replying to REACT"
	mod.save(function (err, result){                       
        if(err) 
		{ 
			console.log(err.message); 
			res.json({
			status: 'fail'
		    })
		} 
		else
		{
            console.log('Student marks Inserted');
			res.json({
			msg: 'We received your data!!!(nodejs)',
			status: 'success',mydata:req.body
			})
		}
       })     
})  

 // get data from database DISPLAY  
 app.get('/display', function (req, res) { 
//------------- USING EMBEDDED JS -----------
 model.find().sort({studusn:1}).exec(
 		function(err , i){
        if (err) return console.log(err)
        res.render('disp.ejs',{students: i})  
     })
})


//delete
app.get('/delete.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "delete.html" );    
})

//api for Delete data from database  
app.get("/delete", function(req, res) {
	var studusn1=req.query.studusn;
	
        model.remove({"studusn":studusn1},function(err, obj){
				if (err) {
					console.log("Failed to remove data.");
			} else {
				if (obj.result.n>=1)
				{	
				res.send("<br/>"+studusn1+":"+"<b>Student info Deleted</b>");
				console.log("Student info Deleted")
				}
				else
					res.send("Student not found");
			}
        });
  })
  
//update1
app.get('/update1.html', function (req, res) {
    res.sendFile( __dirname + "/" + "update.html" );
})

app.get("/update1", function(req, res) {
	var studusn1=req.query.studusn;
	var newusn=req.query.newusn;
	var newmath=parseInt(req.query.newmath);
	var newdaa=parseInt(req.query.newdaa);
	var newos=parseInt(req.query.newos);
	var newmces=parseInt(req.query.newmces);
	var newooc=parseInt(req.query.newooc);
	var newdc=parseInt(req.query.newdc);
	
   	model.findOneAndUpdate({"studusn":studusn1},{"marks_maths":newmath,"marks_daa":newdaa,"marks_os":newos,
   		"marks_mces":newmces,"marks_ooc":newooc,"marks_dc":newdc},{multi:true},   
    function(err,obj) {  
     if (err) {  
        res.send(err);
       console.log("Failed to updated data") 
      }
      else 
     {
      if (obj==null)
       {  res.send("Student Not Found") }
     else
      {
	    res.send("<br/>"+studusn1+" : "+"<b>Student Marks Updated</b>");
	   console.log("Student Marks Updated")
       }
     	}
 	})

 	;
 })	




//--------------SEARCH------------------------------------------
app.get('/search.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "search.html" );    
})

app.get("/search", function(req, res) {
	var studusnnum=req.query.studusn;
	model.find({studusn: studusnnum},{studname:1,studusn:1,studph:1,marks_maths:1,marks_daa:1,marks_os:1,marks_mces:1,marks_ooc:1,marks_dc:1,_id:0}).exec(function(err, docs) {
    if (err) {
      console.log(err.message+ "Failed to get data.");
    } else
	{
	if (docs=='')
		res.send("<br/>"+studusnnum+":"+"<b>Student info Not Found</b>")
	else
        res.render('disp.ejs',{students: docs});
	}
  });
  })  
  



// call by default index.html page  
app.get("*",function(req,res){   
    res.sendFile(srcpath +'/index.html');  
})   
//server stat on given port  
app.listen(port,function(){   
    console.log("server start on port:"+ port);  
})  