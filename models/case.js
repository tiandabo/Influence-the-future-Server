var mongodb = require('./db');

function Case(title, content, images) {
	this.title = title;
	this.content = content;
	this.images = images;
};

module.exports = Case;

//查找
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
	//要存入数据库的文档
	var add_case = {
		time: time,
		title: this.title,
		content: this.content,
		images: this.images
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
