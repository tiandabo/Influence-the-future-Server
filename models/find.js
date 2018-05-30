var mongodb = require('./db');

function Find(search) {
	this.search = search;
};

module.exports = Find;

//查找
Find.prototype.finds = function(search,callback) {
	
	//打开数据库
	mongodb.open(function (err, db) {
		if(err) {
			return callback(err)
		}
		//读取post集合
		db.collection('posts',function(err,collection) {
			if (err) {
		        mongodb.close();
		        return callback(err);//错误，返回 err 信息
		     }
			//搜索用户名为serch的数据
			collection.find({
				'name': search
			}).toArray(function(err,user) {
				mongodb.close();
				if(err) {
					return callback(err);//失败返回错误信息
				}
				callback(null,user);
			});
		});
	});
};







//查找
Find.get = function(search,callback) {
	
	//打开数据库
	mongodb.open(function (err, db) {
		if(err) {
			return callback(err)
		}
		//读取users集合
		db.collection('posts',function(err,collection) {
			if (err) {
		        mongodb.close();
		        return callback(err);//错误，返回 err 信息
		     }
			//用户名查找
			collection.find({
				'search': search
			},function(err,user) {
				mongodb.close();
				if(err) {
					return callback(err);//失败返回错误信息
				}
				callback(null,user);
			});
		});
	});
};