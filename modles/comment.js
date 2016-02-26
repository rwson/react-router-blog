/**
 * 评论类
 */

var mongodb = require('./db');

/**
 * 评论类
 * @param {[type]} name    [description]
 * @param {[type]} day     [description]
 * @param {[type]} title   [description]
 * @param {[type]} comment [description]
 */
function Comment(name,day,title,comment){
	this.name = name;
	this.day = day;
	this.title = title;
	this.comment = comment;
}

/**
 * 存储一条留言信息
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Comment.prototype.save = function(callback){
	var name = this.name,
		day = this.day,
		title = this.title,
		comment = this.comment;

	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		//	打开失败

		db.collection('posts',function(err,collection){
			//	读取posts集合

			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.update({
				'name':name,
				'title':title,
				'time.day':day
			},{
				'$push':{
					'comments':comment
				}
			},function(err){
				//	通过名字、日期、标题来给文章增加一个新评论

				mongodb.close();
				if(err){
					return callback(err);
				}
				//	插入失败

				callback(null);

			});

		});

	});		
};

module.exports = Comment;