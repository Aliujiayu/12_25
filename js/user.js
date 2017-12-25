//$(function() {
var ljyurl = "http://localhost:8000/user/";

function clear(){
	if(sessionStorage.key(0)!="ljy"){
		var str = "<h1>您所访问的页面找不到</h1>"
		$("body").html(str);
	}
}
clear();
var uid = "";

function uidi(i) {
	uid = i;
}

function del() {
	$.ajax({
		url: ljyurl + "remove",
		type: "post",
		data: {
			uid: uid
		},
		success: function(e) {
			login();
		},
		error: function(e) {
			console.log(e);
		}
	})
}

function look(uid) {
	$.ajax({
		url: ljyurl + "look",
		type: "post",
		data: {
			uid: uid
		},
		success: function(e) {
			console.log(e);
			var str = "";
			str += "<div class='text-center'><img style='width:50px; height:50px;' class='img-circle' src='" + e[0].imgurl + "'/><p><span class='text-info'>序号:</span>" + e[0].num + "</p><p><span class='text-info'>姓名</span>:" + e[0].name + "</p><p><span class='text-info'>年龄:</span>" + e[0].age + "</p><p><span class='text-info'>性别:</span>" + e[0].sex + "</p><p><span class='text-info'>出生日期:</span>" + e[0].birthday + "</p><p><span class='text-info'>学历:</span>" + e[0].background + "</p></div>";
			$(".look").html(str);
		},
		error: function(e) {
			console.log(e);
		}
	})
}

function login() {
	$.ajax({
		url: ljyurl + "total",
		type: "post",
		success: function(e) {
			var str = ""
			for(var i in e) {
				if(Number(e[i].age) < 20) {
					str += "<tr class='text-danger'><td>" + e[i].num + "</td><td><img style='width:50px; height:50px;' class='img-circle' src='" + e[i].imgurl + "'/></td><td style='cursor: pointer;' data-target='#look' data-toggle='modal' onclick='look(" + e[i].uid + ")'>" + e[i].name + "</td><td>" + e[i].sex + "</td><td>" + e[i].age + "</td><td>" + e[i].birthday + "</td><td>" + e[i].background + "</td><td><button type='button' data-target='#remove' data-toggle='modal' class='btn btn-default btn-danger' onclick='uidi(" + e[i].uid + ")'><span class='glyphicon glyphicon-trash' aria-hidde='true'><span></button></td></tr>";
				} else {
					str += "<tr><td>" + e[i].num + "</td><td><img style='width:50px; height:50px;' class='img-circle' src='" + e[i].imgurl + "'/></td><td style='cursor: pointer;' data-target='#look' data-toggle='modal' onclick='look(" + e[i].uid + ")'>" + e[i].name + "</td><td>" + e[i].sex + "</td><td>" + e[i].age + "</td><td>" + e[i].birthday + "</td><td>" + e[i].background + "</td><td><button type='button' data-target='#remove' data-toggle='modal' class='btn btn-default btn-danger' onclick='uidi(" + e[i].uid + ")'><span class='glyphicon glyphicon-trash' aria-hidde='true'><span></button></td></tr>";
				}
			}
			$(".tbody").html(str);
		},
		error: function(e) {
			console.log(e);
		}
	})
}
login();
var imgurl = "";
$("body").on("change", ".img", function() {
	var img = this.files[0];
	var images = new FormData();
	images.append("img", img);
	console.log(images);
	$.ajax({
		url: ljyurl + "img",
		type: "post",
		data: images,
		success: function(e) {
			imgurl = e;
			var str = "<img style='width:100px; height:100px' class='img-circle' src='" + e + "'/>";
			$(".box").html(str);
		},
		error: function(e) {
			console.log(e);
		},
		processData: false, // 不处理数据
		contentType: false // 不设置内容类型
	})
})
$("body").on("change", ".birthday", function() {
	var date = new Date();
	var birthday = $(".birthday").val();
	var startDate = new Date(birthday);
	var newDate = date.getTime() - startDate.getTime();
	var age = Math.ceil(newDate / 1000 / 60 / 60 / 24 / 365);
	if(isNaN(age)) {
		age = "";
	}
	$(".age").val(age);
})
$("body").on("click", ".btn-go", function() {
	var name = $(".name").val();
	var num = $(".num").val();
	var age = Number($(".age").val());
	var sex = $(".sex").val();
	var background = $(".background").val();
	var birthday = $(".birthday").val();
	console.log(imgurl);
	if(imgurl == "") {
		$(".box").addClass("bg-danger");
		$(".age").parent("div").removeClass("has-error");
		$(".birthday").parent("div").removeClass("has-error");
		$(".name").parent("div").removeClass("has-error");
		$(".num").parent("div").removeClass("has-error");
		alert("请上传图片");
	}else if(num == "") {
		$(".box").removeClass("bg-danger");
		$(".age").parent("div").removeClass("has-error");
		$(".birthday").parent("div").removeClass("has-error");
		$(".name").parent("div").removeClass("has-error");
		$(".num").parent("div").addClass("has-error");
		alert("请输入序号");
	}else if(name == "") {
		$(".box").removeClass("bg-danger");
		$(".age").parent("div").removeClass("has-error");
		$(".birthday").parent("div").removeClass("has-error");
		$(".num").parent("div").removeClass("has-error");
		$(".name").parent("div").addClass("has-error");
		alert("请输入姓名");
	} else if(birthday == "") {
		$(".box").removeClass("bg-danger");
		$(".age").parent("div").removeClass("has-error");
		$(".num").parent("div").removeClass("has-error");
		$(".name").parent("div").removeClass("has-error");
		$(".birthday").parent("div").addClass("has-error");
		alert("请输入出生日期");
	} else if(Number(0) > age || age > Number(120)) {
		console.log(age);
		console.log(typeof age);
		$(".box").removeClass("bg-danger");
		$(".num").parent("div").removeClass("has-error");
		$(".name").parent("div").removeClass("has-error");
		$(".age").parent("div").addClass("has-error");
		$(".birthday").parent("div").addClass("has-error");
		alert("您的年龄不符合实际情况,请重新输入出生日期");
	} else {
		$(".box").removeClass("bg-danger");
		$(".num").parent("div").removeClass("has-error");
		$(".name").parent("div").removeClass("has-error");
		$(".age").parent("div").removeClass("has-error");
		$(".birthday").parent("div").removeClass("has-error");
		$.ajax({
			url: ljyurl + "add",
			type: "post",
			data: {
				name: name,
				num: num,
				imgurl: imgurl,
				age: age,
				sex: sex,
				background: background,
				birthday: birthday
			},
			success: function(e) {
				login();
			},
			error: function(e) {
				console.log(e);
			}
		})
	}
})