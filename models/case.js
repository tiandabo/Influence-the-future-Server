var mongodb = require('./db');
var ObjectId = require('mongodb').ObjectId;
var fs = require('fs');

function Case(title, content, images) {
	this.title = title;
	this.content = content;
	this.images = images;
};

module.exports = Case;

//添加新的案例
Case.prototype.save = function(callback) {
	var date = new Date();
	//存储各种时间格式，方便以后扩展
	var time = {
		date: date,
		year: date.getFullYear(),
		month: date.getFullYear() + "-" + (date.getMonth() + 1),
		day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
			date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	}
	//打开数据库
	//接收前台POST过来的base64
	var imgData = this.images;
	var images = [];
	for(var i = 0; i < imgData.length; i++) {
		var path = 'images/sever/' + Date.now() + [i] + '.png'; //从app.js级开始找--在我的项目工程里是这样的
		images.push(path)
		var base64Data = imgData[i].replace(/^data:image\/\w+;base64/, "");
		var dataBuffer = new Buffer(base64Data, "base64");
		fs.writeFile(path, dataBuffer, function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log("保存成功！");
			}
		});
	}

	//要存入数据库的文档
	var add_case = {
		time: time,
		title: this.title,
		content: this.content,
		images: images
	};
	//打开数据库
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		//读取 cases 集合
		db.collection('cases', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			//将文档插入 cases 集合
			collection.insert(add_case, {
				safe: true
			}, function(err) {
				mongodb.close();
				if(err) {
					return callback(err); //失败！返回 err
				}
				callback(null); //返回 err 为 null
			});
		});
	});

};

//获取全部案例
Case.case = function(callback) {
	//打开数据库
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		//读取 cases 集合
		db.collection('cases', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err); //错误，返回 err 信息
			}
			//获取cases集合的数据
			collection.find().toArray(function(err, data) {
				mongodb.close();
				if(err) {
					return callback(err); //失败返回错误信息
				}

				for(var i = 0; i < data.length; i++) {
					var images = [];
					var slices = data[i].images[0].slice(6)
					var img = 'http://localhost:3000/' + slices;
					images.push(img);
					data[i].images = images;
				};		
				callback(null, data);
			});
		})
	});
};

//获取案例详情
Case.caseOne = function(id, callback) {
	//打开数据库
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		//读取 cases 集合
		db.collection('cases', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err); //错误，返回 err 信息
			}
			//获取_id是id的cases集合的数据
			collection.find({
				 _id: ObjectId(id)
			}).toArray(function(err, data) {
				mongodb.close();
				if(err) {
					return callback(err); //失败返回错误信息
				};
				var images = data[0].images;
				for(var i=0;i<images.length;i++) {
					images[i]='http://localhost:3000/'+images[i].slice(6);
				};
				console.log(images,data[0].images)
				callback(null, data);
			});
		})
	});
};