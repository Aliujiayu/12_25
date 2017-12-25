var express = require("express");
var multer = require("multer");
var mysql = require("mysql");
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");
var app = express();
var user = express.Router();

var pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "123456",
	database: "sy",
	port: "3306"
})

app.use(bodyParser.urlencoded({}));
app.use(multer({
	dest: "./images"
}).any());
app.use("/user", user);

user.post("/login", function(req, res) {
	var user = req.body.user;
	var pass = req.body.pass;
	if(user == "ljy") {
		if(pass == "123") {
			res.send("登录成功");
			console.log("登录成功");
		} else {
			res.send("用户名或者密码不对");
			console.log("用户名或者密码不对");
		}
	} else {
		res.send("用户名或者密码不对");
		console.log("用户名或者密码不对");
	}
})
user.post("/img", function(req, res) {
	var img = req.files[0];
	var name = img.filename;
	var newname = name + path.parse(img.originalname).ext;
	fs.rename("./images/" + name, "./images/" + newname, function(err) {
		if(err) {
			console.log(err);
			return
		}
		console.log(newname);
		res.send('http://localhost:8000/images/' + newname);
	})
})
//增加
user.post("/add", function(req, res) {
	var name = req.body.name;
	var num = req.body.num;
	var age = req.body.age;
	var sex = req.body.sex;
	var imgurl = req.body.imgurl;
	var background = req.body.background;
	var birthday = req.body.birthday;
	pool.getConnection(function(err, connection) {
		if(err) {
			console.log("connection:::::::::" + err);
			return
		}
		connection.query("insert into login(name,num,age,sex,imgurl,background,birthday) values(?,?,?,?,?,?,?)", [name, num, age, sex, imgurl, background, birthday], function(err, data) {
			if(err) {
				console.log("mysql:::::::::" + err);
				return
			}
			res.send(data);
			connection.end();
		})
	})
})
//全部
user.post("/total", function(req, res) {
	pool.getConnection(function(err, connection) {
		if(err) {
			console.log("connection:::::::::" + err);
			return
		}
		connection.query("select * from login", function(err, data) {
			if(err) {
				console.log("mysql:::::::::" + err);
				return
			}
			res.send(data);
			connection.end();
		})
	})
})
//删除
user.post("/remove", function(req, res) {
	var uid = req.body.uid;
	pool.getConnection(function(err, connection) {
		if(err) {
			console.log("connection::::::::" + err);
			return
		}
		connection.query("delete from login where uid=?", [uid], function(err, data) {
			if(err) {
				console.log("mysql::::::::" + err);
				return
			}
			connection.query("select * from login", function(err, data) {
				if(err) {
					console.log("mysql:::::::::" + err);
					return
				}
				res.send(data);
				connection.end();
			})
		})
	})
})
//查看
user.post("/look", function(req, res) {
	var uid = req.body.uid;
	pool.getConnection(function(err, connection) {
		if(err) {
			console.log("connection::::::::" + err);
			return
		}
		connection.query("select * from login where uid=?", [uid], function(err, data) {
			if(err) {
				console.log("mysql::::::::" + err);
				return
			}
			res.send(data);
			connection.end();
		})
	})
})
app.use(express.static("./"));
app.listen(8000, function() {
	console.log("启动...");
})