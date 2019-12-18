//////////使用前必须先引用api.js
//// ///////////正式环境地址///////////////////////
// var serviceUrl = 'https://www.zxj888.cn:8443'//正式环境
// var serviceAjaxUrl = 'http://zxj888.cn/ajax?'//开发环境
// var serviceUrl02 = 'https://www.zxj888.cn:9443'//正式环境
// var upFileUrl="https://www.zxj888.cn:8443/upFile";//上传文件url
// var webSocketAgreement='wss';//webSocket协议
// var webSocketUrl='zxj888.cn'//webSocket域名
// var webSocketPort=9443;//webSocket端口
// var webSocketPath='zxj/websocket';//webSocket域名后面那部分路径
//// ///////////////正式环境地址end///////////////

///////////////开发环境地址//////////////
   var serviceUrl = 'https://www.zxjtest.xyz'//开发环境
   var serviceAjaxUrl = 'https://zxjtest.xyz/ajax?'//开发环境
   var serviceUrl02 = 'https://www.zxjtest.xyz:9443'//正式环境WSD
   var upFileUrl="https://www.zxjtest.xyz/upFile";//上传文件url
   var webSocketAgreement='wss';//webSocket协议
   var webSocketUrl='zxjtest.xyz'//webSocket域名
   var webSocketPort=9443;//webSocket端口
   var webSocketPath='zxj/websocket';//webSocket域名后面那部分路径
///////////////开发环境地址end///////////////

var serviceUrlApk = 'http://www.zxj888.cn'//正式环境
//    var serviceUrlApk = 'https://www.zxjtest.xyz'//测试环境

//////////////////////////////////
//var serviceUrl = 'http://172.16.7.66:8080/zxj'//本地开发原件
//var webSocketAgreement='ws';//webSocket协议
//var webSocketUrl='y2jzay.natappfree.cc'//webSocket域名
//var webSocketPort='';//webSocket端口
//////////////////////////////////

/////////////////////公用信息配置/////////////////////
var phoneService='400-8798980';//400电话
var wxService='zhuangxj888';//微信客服
var qqService='2809712409';//qq客服
var emailService='zhuangxj888@163.com';//邮箱

var baiduMapUrl='http://api.map.baidu.com';//百度地图url
var baiduMapCityParam='/geocoder?key=6L4yakzR0hjRvzSvHqZLOQGSubyGhAQj&output=json'

var ajaxTimeout=60;//设置超时请求时间

/**对比ios版本号*/
function checkIOSVersion(oldVersion,newVersion){
	if(oldVersion==undefined || oldVersion==null || oldVersion==''){
		return false;
	}
	if(newVersion==undefined || newVersion==null || newVersion==''){
		return false;
	}
	var oldArr = oldVersion.split(".")//通过.截取当前版本数据信息
	var newArr = newVersion.split(".")//通过.截取新版本数据信息
	if(oldArr.length==0 || newArr.length==0){
		return false;//如果截取都是0，认为没有新版本
	}
	if(newArr.length>oldArr.length){
		return true;//如果截取的新的版本号比当前号长，则认为有新版本
	}
	else if(newArr.length<oldArr.length){
		return false;//如果截取的新的版本号比当前版本号短，则认为没有新版本
	}
	var resule=false;
	//遍历版本每个区的数字判断是否是新版本
	for(var index in newArr){
		console.log(Number(newArr[index])+';'+Number(oldArr[index]))
		if(Number(newArr[index])>Number(oldArr[index])){
			//新版本号第index个位置比就当前版本的大，认为有新版本更新
			resule=true;
			break;
		}
		else if(Number(newArr[index])<Number(oldArr[index])){
			//新版本号第index个位置比就当前版本的小，认为没有新版本更新
			resule=false;
			break;
		}
	}
	return resule;
}

/**
 *检测更新app版本 
 */
var checkUpAppVersion=function(){
	var systemType = api.systemType;
//	var appVersion = api.appVersion;
	// ios、android、win、wp
	if (systemType == 'android') {
		var fdAppInfo = api.require('fdAppInfo');
		fdAppInfo.getVersionCode(function(ret ,err){
			if(ret){
				if(ret.code){
					var localVersionCode = ret.data.versionCode;
					var url=serviceUrlApk+'/shopappVersion/shopVersion.json';
					var zxjToken=getToken();
					api.ajax({
						url : url,
						method : 'get',
						returnAll : false, //（可选项）是否需要返回所有 response 信息（包括响应头、消息体、状态码），为 true 时，返回的头信息获取方法(ret.headers)，消息体信息获取方法(ret.body)，状态码获取方法(ret.statusCode)
						headers: {
					       'token':zxjToken
					    },
					}, function(ret, err) {
						if (ret) {
							var serAppVersionCode = ret.versionCode;
							if(Number(serAppVersionCode)>Number(localVersionCode)){
								api.confirm({
								    title: '版本提示',
								    msg: '发现您有新版本待更新',
								    buttons: ['立即更新', '暂时不更']
								}, function(ret, err) {
								    var index = ret.buttonIndex;
								    if(index==1){
								    	//确定
										var appDwUrl=serviceUrlApk+'/shopappVersion/zxjShopKeeperApp.apk';
										// var appDwUrl='http://a.app.qq.com/o/simple.jsp?pkgname=com.ZXJShopKeeper.rjh';
								    	api.openApp({
										    androidPkg: 'android.intent.action.VIEW',
										    mimeType: 'text/html',
										    uri: appDwUrl
										}, function(ret, err) {});
										
										
								    }
								});
							}
						} else {
							var msg = err.msg + '(' + err.code + ')'
							api.toast({ msg: msg,duration: 2000, location: 'middle'});
						}
					});
				} else{
					api.toast({ msg: ret.msg,duration: 2000, location: 'middle'});
				}
				
			}else{
				api.toast({ msg: err.msg,duration: 2000, location: 'middle'});
			}
			
		});
	}
	else if(systemType == 'ios'){
		var ipa = api.require('ipa');
		var bundleVersion = ipa.getBundleVersion();
//  return;
		api.ajax({
			url : 'https://itunes.apple.com/cn/lookup?id=1478503721',
			method : 'post',
			returnAll : false //（可选项）是否需要返回所有 response 信息（包括响应头、消息体、状态码），为 true 时，返回的头信息获取方法(ret.headers)，消息体信息获取方法(ret.body)，状态码获取方法(ret.statusCode)
		}, function(ret, err) {
			if(ret){
				if(ret.results!=undefined && ret.results.length>0){
					var newVersion = ret.results[0].version;
					if(checkIOSVersion(bundleVersion,newVersion)){
						api.confirm({
						    title: '版本提示',
						    msg: '发现您有新版本待更新V'+newVersion,
						    buttons: ['立即更新', '暂时不更']
						}, function(ret, err) {
						    var index = ret.buttonIndex;
						    if(index==1){
						    	//确定
						    	var appDwUrl='http://itunes.apple.com/cn/app/id1478503721?mt=8';
						    	api.openApp({
								    iosUrl:appDwUrl
								}, function(ret, err) {});
						    }
						});
					}
				}
			}else {
				var msg = err.msg + '(' + err.code + ')'
				api.toast({ msg: msg,duration: 2000, location: 'middle'});
			}
			
		});
	
	}
};


/**检测缓存登录是否已经过期:true未过期，false已过期*/
var checkLoginOverdue = function(){
	var lastLiginDate = $api.getStorage("app_last_login_date");
	if(lastLiginDate==undefined || lastLiginDate==null || lastLiginDate==''){
		return false;
	}
	var curDate = getCurrentDate('yyyy-MM-dd');
	var endDateArr= lastLiginDate.split('-');
    var curDateArr= curDate.split('-');
    var strDateS = new Date(endDateArr[0], endDateArr[1]-1, endDateArr[2]);
    var strDateE = new Date(curDateArr[0], curDateArr[1]-1, curDateArr[2]);
    var iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数 
    if(iDays>30){
    	//有效期已为30天，超过视为过期
    	clearUserInfoCache();
    	$api.rmStorage("app_last_login_date");//保证金
    	api.alert({
			title : '温馨提示',
			msg : '您过久未重新进行登录过系统,请重新登录'
		});
    	return false;
    }else{
    	return true;
    }
}

/**通过用户id和手机号再次登录获取用户信息*/
var againLoginByUserId = function(funCal){
	console.log ('通过用户id和手机号再次登录获取用户信息')
	var userId = $api.getStorage("userid");//用户id
	var clientPhone = $api.getStorage("clientPhone");//手机号
	if(userId==undefined || userId==null || userId==''){
		return;
	}
	else if(clientPhone==undefined || clientPhone==null || clientPhone==''){
		return;
	} else{
		if(!checkLoginOverdue()) return;
		var param = 'phone='+clientPhone+'&clientId='+userId;
//		api.showProgress();
// alert (param)
		_getHttpsData('/user/login',param,
			function(res){
				console.log ('执行登录')
				// alert(JSON.stringify(res))
//				api.hideProgress();
				if(res.status){
					var pwd = $api.getStorage("pwd");
					saveUserInfoCache(pwd,res.data,function(){});
					if (funCal!=undefined && typeof funCal === "function") {
						funCal(true);
					}
				}
			},
			function(err){
//				api.hideProgress();
			},false
		);
	}


}

/**获取工人申请的信息，更新实名验证进度*/
var upUserRealNamePro=function(){
	var userId=$api.getStorage("userid");
	var clientLevel=$api.getStorage("clientLevel");
	var isCertification=$api.getStorage("isCertification");//是否实名验证（ 1为已实名认证    0 为未实名认证）
	if(userId==undefined || userId==null || userId==''){
		return;
	} 
	if(clientLevel==5 || clientLevel=='5'){
		if(isCertification!=1){
			var param = 'clientId='+userId+'&applyType=5';
			_getHttpsData('/member/getApplyInfo',param,
				function(ret){
					if(ret.status){
						var applyStatus = ret.data.applyStatus;//申请状态
						if(applyStatus==2){
							refreshIsCertification(1);
						} else{
							refreshIsCertification(0);
						}
					}
				},
				function(err){}
			);
		}
	}
}
/**
 *上传文件 
 */
var uploadFileHttps = function(param,imgArray, funRecall, errFunRecall){
	api.ajax({
        url: upFileUrl,
        method: 'post',
        timeout: 90,
        dataType: 'json',
		returnAll:false,
		headers: {
			// 'Content-Type': 'application/json;charset=utf-8',
			 token: getToken()
		 },
        data:{
            files:{attUrl:imgArray},
			values:param
		 }
    },function(ret,err){
    	if (ret) {
			funRecall(ret);
		} else {
			errFunRecall(err);
			var title = '网络请求状态码1(' + err.statusCode + ')';
			var msg = err.msg + '(' + err.code + ')'
			api.alert({
				title : title,
				msg : msg
			});
		}
    });	
}

//请求数据(提交JSON数据)
var _postHttpsData = function(actionUrl, param, funRecall, errFunRecall) {
	var url = serviceUrl+'/jaxrs' + actionUrl;
	console.log('_postHttpsData11111111-url:'+url)
	api.ajax({
		url : url,
		method : 'post',
		returnAll : false, //（可选项）是否需要返回所有 response 信息（包括响应头、消息体、状态码），为 true 时，返回的头信息获取方法(ret.headers)，消息体信息获取方法(ret.body)，状态码获取方法(ret.statusCode)
		dataType:'json',
		headers: {
		   'Content-Type': 'application/json;charset=utf-8',
			token: getToken()
		},
		timeout:ajaxTimeout,
		data : {
			body:param
		},
	}, function(ret, err) {
		if(ret.status == false && ret.code == '0009'){

			api.alert({
				title: '提示',
				msg: '长时间离开，请重新登录',
			}, function(ret, err) {
				clearUserInfoCache();
				clearShopInfoCache();
				api.openWin({
					name : 'login_win',
					url : 'widget://html/login/login_win.html',
					reload:true,
					allowEdit:true,
				});	
			});

			}
		if (ret) {
			funRecall(ret);
		} else {
			errFunRecall(err);
			var title = '网络请求状态码2(' + err.statusCode + ')';
			var msg = err.msg + '(' + err.code + ')'
			api.alert({
				title : title,
				msg : msg
			});
		}
	});

}

//请求数据(提交JSON数据)
var _postHttpsData1 = function(actionUrl, param, funRecall, errFunRecall) {
	var url;
	if(param==undefined || param==null || param==''){
		url = serviceUrl+'/jaxrs' + actionUrl;
	}else{
		url = serviceUrl+'/jaxrs' + actionUrl + '?' + param;
	}
	api.ajax({
		url : url,
		method : 'post',
		returnAll : false, //（可选项）是否需要返回所有 response 信息（包括响应头、消息体、状态码），为 true 时，返回的头信息获取方法(ret.headers)，消息体信息获取方法(ret.body)，状态码获取方法(ret.statusCode)
		dataType:'json',
		headers: {
		   'Content-Type': 'application/x-www-form-urlencoded',
		   token: getToken()
	    }
	}, function(ret, err) {
		alert (ret.msg)
		if (ret) {
			funRecall(ret);
		} else {
			errFunRecall(err);
			var title = '网络请求状态码3(' + err.statusCode + ')';
			var msg = err.msg + '(' + err.code + ')'
			api.alert({
				title : title,
				msg : msg
			});
		}
	});

}

  /**
   * 获取token
   */
  var getToken = function () {
    try {
      return $api.getStorage('token')
    } catch (e) {
      return null;
    }
  }

//请求数据(提交JSON数据)
var _getHttpsData = function(actionUrl, param, funRecall, errFunRecall) {
	var url;
	if(param==undefined || param==null || param==''){
		url = serviceUrl+'/jaxrs' + actionUrl;
	}else{
		url = serviceUrl+'/jaxrs' + actionUrl + '?' + param;
	}
	api.ajax({
		url : url,
		method : 'get',
		returnAll : false, //（可选项）是否需要返回所有 response 信息（包括响应头、消息体、状态码），为 true 时，返回的头信息获取方法(ret.headers)，消息体信息获取方法(ret.body)，状态码获取方法(ret.statusCode)
		timeout:ajaxTimeout,
		headers: {
		//    'content-type': 'application/json; charset=UTF-8',
			token: getToken()
	    },
			//data : {
			//	values : param
			//},
	}, function(ret, err) {
		if(ret.status == false && ret.code == '0009'){		
			// api.alert({
			// 	title: '提示',
			// 	msg: '长时间离开，请重新登录',
			// }, function(ret, err) {
				clearUserInfoCache();
				clearShopInfoCache();
				api.openWin({
					name : 'login_win',
					url : 'widget://html/login/login_win.html',
					reload:true,
					allowEdit:true,
				});	
			// });
			}
		if (ret) {
			funRecall(ret);
		} else {
			errFunRecall(err);
			var title = '网络请求状态码4(' + err.statusCode + ')';
			var msg = err.msg + '(' + err.code + ')'
		}
	});

}

//请求数据(提交JSON数据)
var _postDataMap = function(param, funRecall, errFunRecall) {
	api.ajax({
		url : baiduMapUrl+baiduMapCityParam+param,
		method : 'post',
		timeout:ajaxTimeout,
		returnAll : false, //（可选项）是否需要返回所有 response 信息（包括响应头、消息体、状态码），为 true 时，返回的头信息获取方法(ret.headers)，消息体信息获取方法(ret.body)，状态码获取方法(ret.statusCode)
	}, function(ret, err) {
		if (ret) {
			funRecall(ret);
		} else {
			errFunRecall(err);
			var title = '网络请求状态码5(' + err.statusCode + ')';
			var msg = err.msg + '(' + err.code + ')'
		}
	});

}

//请求数据(提交JSON数据)
var _postHttpsData2 = function(actionUrl, param, funRecall, errFunRecall,isPopupErr) {
	if(isPopupErr==undefined || isPopupErr==null || isPopupErr==''){
		isPopupErr=true;
	}
	var url=serviceUrl02+'/zxj'+actionUrl;
	api.ajax({
		url : url,
		method : 'post',
		returnAll : false, //（可选项）是否需要返回所有 response 信息（包括响应头、消息体、状态码），为 true 时，返回的头信息获取方法(ret.headers)，消息体信息获取方法(ret.body)，状态码获取方法(ret.statusCode)
		dataType:'json',
	    timeout:ajaxTimeout,
	    headers: {
			token: getToken()
	    },
	   	data : {
			values : param
		},
	}, function(ret, err) {
		if (ret) {
			funRecall(ret);
		} else {
			errFunRecall(err);
			if(isPopupErr){
//				var title = '网络请求状态码(' + err.statusCode + ')';
//				var msg = err.msg + '(' + err.code + ')'
//				api.alert({
//					title : title,
//					msg : msg
//				});
				var msg = err.msg +'['+err.statusCode+'](' + err.code + ')'
				api.toast({ msg: msg,duration: 2000, location: 'middle'});
			}
		}
	});

}




/**
  * 通过平台接口获取数据（sql）
  * dataSet 查询调用的名称
  * queryMode map或list
  * param 请求参数
  * funRecall 请求成功回调
  * errFunRecall 请求失败回调
*/
var _httpsPlatformSql=function(dataSet, queryMode, param, funRecall, errFunRecall){
	 //key = 'zxj_repertory';//数据源名称
    //AJAX_MODE = 'AJAX_MODE_QUERY';//固定
    //DATASET = 'client_rec_addres_default';//查询调用的名称
    //QUERY_MODE = 'map';//’map或list’
     var paramStr;
    if(param==undefined || param==null || param==''){
    	paramStr = "key=zxj_repertory&AJAX_MODE=AJAX_MODE_QUERY&DATASET=" + dataSet + "&QUERY_MODE=" + queryMode;
    }else{
    	paramStr = "key=zxj_repertory&AJAX_MODE=AJAX_MODE_QUERY&DATASET=" + dataSet + "&QUERY_MODE=" + queryMode + "&" + param;
    }
    var url = serviceUrl + '/ajax?' + paramStr;
    
    api.ajax({
		url : url,
		method : 'post',
		returnAll : false, //（可选项）是否需要返回所有 response 信息（包括响应头、消息体、状态码），为 true 时，返回的头信息获取方法(ret.headers)，消息体信息获取方法(ret.body)，状态码获取方法(ret.statusCode)
		dataType:'json',
		headers: {
		   'Content-Type': 'application/json;charset=utf-8',
		   token: getToken()
		},
		timeout:ajaxTimeout
	}, function(ret, err) {
		api.hideProgress();
		if (ret) {
			funRecall(ret)
		} else {
			errFunRecall(err);
			var title = '网络请求状态码6(' + err.statusCode + ')';
			var msg = err.msg + '(' + err.code + ')'
			api.alert({
				title : title,
				msg : msg
			});
		}
	});
    
    
};


/**
 * 通过平台请求接口(class)
 * dataSet 查询调用的名称
 * param 请求参数
 * funRecall 请求成功回调
 * errFunRecall 请求失败回调 
 */
var _httpsPlatformClass=function(dataSet, param, funRecall, errFunRecall){
//	var paramStr = "AJAX_MODE=AJAX_MODE_OPERATE&operate=" + dataSet + "&" + param;
//  var url = serviceUrl + '/ajax?' + paramStr;
//  var param = "CLIENT_ID=" + "1905101424041113";

	//key = 'zxj_repertory';//数据源名称
    //AJAX_MODE = 'AJAX_MODE_QUERY';//固定
    //DATASET = 'client_rec_addres_default';//查询调用的名称
    //QUERY_MODE = 'map';//’map或list’
    // var paramStr = "AJAX_MODE_OPERATE=" + dataSet + "&" + param
	var paramStr = "AJAX_MODE=AJAX_MODE_OPERATE&operate=" + dataSet + "&" + param;
	var url = serviceUrl + '/ajax?' + paramStr;
	api.ajax({
		url : url,
		method : 'post',
		returnAll : false, //（可选项）是否需要返回所有 response 信息（包括响应头、消息体、状态码），为 true 时，返回的头信息获取方法(ret.headers)，消息体信息获取方法(ret.body)，状态码获取方法(ret.statusCode)
		dataType:'json',
		headers: {
		   'Content-Type': 'application/json;charset=utf-8',
		   token: getToken()
		},
		timeout:ajaxTimeout
	}, function(ret, err) {
		api.hideProgress();
		if (ret) {
			funRecall(ret)
		} else {
			errFunRecall(err);
			var title = '网络请求状态码7(' + err.statusCode + ')';
			var msg = err.msg + '(' + err.code + ')'
			api.alert({
				title : title,
				msg : msg
			});
		}
	});
}

/**保存用户信息到缓存*/
var saveUserInfoCache=function(pwd,obj,funCall){
	if(clearUserInfoCache()){
	//工人信息
	$api.setStorage("pwd", pwd);//登录密码
	$api.setStorage("token", obj.token);//登录密码
	$api.setStorage("userid", obj.clientId);//用户id
	$api.setStorage("openId", obj.openId);//openId
	$api.setStorage("nickname", obj.clientAccount);//昵称
	$api.setStorage("avatar", obj.avatar);//用户头像
	$api.setStorage("financeOption", obj.financeOption);//
	$api.setStorage("financeDues", obj.financeDues);//
	$api.setStorage("regFrom", obj.regFrom);//注册来源
	$api.setStorage("starLevel", obj.starLevel);//星级(1-5级，由返回信息时自动计算)
	$api.setStorage("clientLevel", obj.clientLevel);//用户级别(0-行业代表   1-服务中心  2-县级代理  3-市级代理  4-省级代理   5-工匠  6-商铺  9-普通用户)
	$api.setStorage("clientStatus", obj.clientStatus);//状态(1有效)
	$api.setStorage("clientLastLoginDate", obj.clientLastLoginDate);//最近登陆日期
	$api.setStorage("financeVirtualCurrency", obj.financeVirtualCurrency);//
	$api.setStorage("clientClassId", obj.clientClassId);//用户类别ID
	$api.setStorage("clientPhone", obj.clientPhone);//手机号
	$api.setStorage("clientRegDate", obj.clientRegDate);//注册日期
	$api.setStorage("isCertification", obj.isCertification);//是否实名验证（ 1为已实名认证    0 为未实名认证）
	funCall(true)
	}
}

/**保存店铺信息到缓存*/
var saveShopInfoCache=function(obj){
	if(clearShopInfoCache()) {
	//店铺信息
	// $api.setStorage("pwd", pwd);//登录密码
	$api.setStorage("shopArea", obj.shopArea);//店铺所在区域
	$api.setStorage("PAIZHAO", obj.PAIZHAO);//
	$api.setStorage("favStatus", obj.favStatus);//
	$api.setStorage("shopLogo", obj.shopLogo);//
	$api.setStorage("submitDate", obj.submitDate);//
	$api.setStorage("shopName", obj.shopName);//
	$api.setStorage("shopYyzzZzjgdm", obj.shopYyzzZzjgdm);//
	$api.setStorage("shopApplyIdcard", obj.shopApplyIdcard);//
	$api.setStorage("shopAddress", obj.shopAddress);//
	$api.setStorage("orgId", obj.orgId);//
	$api.setStorage("shopJyfw", obj.shopJyfw);//
	$api.setStorage("shopLongTx", obj.shopLongTx);//
	$api.setStorage("shopStatus", obj.shopStatus);//
	$api.setStorage("shopAbstract", obj.shopAbstract);//
	$api.setStorage("shopPhone", obj.shopPhone);//
	$api.setStorage("shopId", obj.shopId);//
	$api.setStorage("createDate", obj.createDate);//
	$api.setStorage("clientId", obj.clientId);//
	$api.setStorage("commentTotal", obj.commentTotal);//
	$api.setStorage("shopLatTx", obj.shopLatTx);//
	$api.setStorage("shopIdea", obj.shopIdea);//
	$api.setStorage("shopLong", obj.shopLong);//
	$api.setStorage("shopYyzzClass", obj.shopYyzzClass);//
	$api.setStorage("shopType", obj.shopType);//
	$api.setStorage("shopFzr", obj.shopFzr);//
	$api.setStorage("shopLat", obj.shopLat);//
	$api.setStorage("shopTypeName", obj.shopTypeName);//
	$api.setStorage("visitNum", obj.visitNum);//月访客数量
	$api.setStorage("totalAmount", obj.totalAmount);//月交易额
	$api.setStorage("totalNum", obj.totalNum);//月成交笔数
	}
}

/**清除店铺信息*/
var clearShopInfoCache=function(){
	//店铺信息
	$api.rmStorage("shopArea");//店铺所在区域
	$api.rmStorage("PAIZHAO");//
	$api.rmStorage("favStatus");//
	$api.rmStorage("shopLogo");//
	$api.rmStorage("submitDate");//
	$api.rmStorage("shopName");//
	$api.rmStorage("shopYyzzZzjgdm");//
	$api.rmStorage("shopApplyIdcard");//
	$api.rmStorage("shopAddress");//
	$api.rmStorage("orgId");//
	$api.rmStorage("shopJyfw");//
	$api.rmStorage("shopLongTx");//
	$api.rmStorage("shopStatus");//
	$api.rmStorage("shopAbstract");//
	$api.rmStorage("shopPhone");//
	$api.rmStorage("shopId");//
	$api.rmStorage("createDate");//
	$api.rmStorage("clientId");//
	$api.rmStorage("commentTotal");//
	$api.rmStorage("shopLatTx");//
	$api.rmStorage("shopIdea");//
	$api.rmStorage("shopLong");//
	$api.rmStorage("shopYyzzClass");//
	$api.rmStorage("shopType");//
	$api.rmStorage("shopFzr");//
	$api.rmStorage("shopLat");//
	$api.rmStorage("shopTypeName");//
	$api.rmStorage("visitNum")//月访客数量
	$api.rmStorage("totalAmount")//月交易额
	$api.rmStorage("totalNum")//月成交笔数
	return true
}

var setPwdStor=function(pwd){
	$api.setStorage("pwd", pwd);//登录密码
}

var setAvatarStor=function(avatar){
	$api.setStorage("avatar", avatar);//用户头像
}

var setClientPhoneStor=function(clientPhone){
	$api.setStorage("clientPhone", clientPhone);//手机号
}

/**设置在线模式关闭或者开启*/
var setOnlineModel=function(onlineModel){
	$api.setStorage("onlineModel", onlineModel);
	api.execScript({
	    name: 'main_win',
	    script: 'openLocation()'
	});
}
/**获取是否开启在线模式*/
var getOnlineModel=function(){
	return $api.getStorage("onlineModel");
}


/**
 *刷新是否实名验证缓存 
 */
var refreshIsCertification=function(isCertificationNew){
	var isCertification = $api.getStorage("isCertification");
	$api.setStorage("isCertification", isCertificationNew);//是否实名验证（ 1为已实名认证    0 为未实名认证）
	if(isCertification!=isCertificationNew){
		api.sendEvent({
		    name: 'refresh_certification_event',
		    extra: {
		        isRefreshData: true,
		    }
		});
	}
}

/**清除缓存中的用户信息*/
var clearUserInfoCache=function(){
	//用户信息
	$api.rmStorage("clientId");//登录密码
	$api.rmStorage("pwd");//登录密码
	$api.rmStorage("token");//登录密码
	$api.rmStorage("userid");//用户id
	$api.rmStorage("openId");//openId
	$api.rmStorage("nickname");//昵称
	$api.rmStorage("avatar");//用户头像
	$api.rmStorage("financeOption");//
	$api.rmStorage("financeDues");//
	$api.rmStorage("regFrom");//注册来源
	$api.rmStorage("starLevel");//星级(1-5级，由返回信息时自动计算)
	$api.rmStorage("clientLevel");//用户级别(0-行业代表   1-服务中心  2-县级代理  3-市级代理  4-省级代理   5-工匠  6-商铺  9-普通用户)
	$api.rmStorage("clientStatus");//状态(1有效)
	$api.rmStorage("clientLastLoginDate");//最近登陆日期
	$api.rmStorage("financeVirtualCurrency");//
	$api.rmStorage("clientClassId");//用户类别ID
	$api.rmStorage("clientPhone");//手机号
	$api.rmStorage("clientRegDate");//注册日期
	$api.rmStorage("isCertification");//是否实名验证（ 1为已实名认证    0 为未实名认证）

	//店铺信息
	$api.rmStorage("shopArea");//店铺所在区域
	$api.rmStorage("PAIZHAO");//
	$api.rmStorage("favStatus");//
	$api.rmStorage("shopLogo");//
	$api.rmStorage("submitDate");//
	$api.rmStorage("shopName");//
	$api.rmStorage("shopYyzzZzjgdm");//
	$api.rmStorage("shopApplyIdcard");//
	$api.rmStorage("shopAddress");//
	$api.rmStorage("orgId");//
	$api.rmStorage("shopJyfw");//
	$api.rmStorage("shopLongTx");//
	$api.rmStorage("shopStatus");//
	$api.rmStorage("shopAbstract");//
	$api.rmStorage("shopPhone");//
	$api.rmStorage("shopId");//
	$api.rmStorage("createDate");//
	$api.rmStorage("clientId");//
	$api.rmStorage("commentTotal");//
	$api.rmStorage("shopLatTx");//
	$api.rmStorage("shopIdea");//
	$api.rmStorage("shopLong");//
	$api.rmStorage("shopYyzzClass");//
	$api.rmStorage("shopType");//
	$api.rmStorage("shopFzr");//
	$api.rmStorage("shopLat");//
	$api.rmStorage("shopTypeName");//
	return true
}

var getShopDataHttps = function (funCal) {
	//获取店铺信息
	var param = "clientId=" + $api.getStorage("userid") + '&openId=' + $api.getStorage("openId") + '&shopId=' + $api.getStorage("shopId") + '&from=1'
	_getHttpsData('/shop/getShopInfo', param,
		function (res) {
				api.sendEvent({
					name: 'refreshData_Event',
					extra: {
						resObj: res,
					}
				});
				funCal(res)
		},
		function (err) {
			api.hideProgress();
		}
	)
};

	function _getUserInfoHttps(funResult) { //校验并提示
	// 	//获取店铺信息
	// api.showProgress();
	var param = "clientId=" + $api.getStorage("userid") + '&openId=' + $api.getStorage("openId") + '&shopId=' + $api.getStorage("userid") + '&from=1'
	_getHttpsData('/shop/getShopInfo', param,
	  function (res) {
		// api.hideProgress();
		if (res.code == 0005) {
		  api.confirm({
			title: '提示',
			msg: '您未开店，是否申请开店',
			buttons: ['确定', '取消']
		  }, function (ret, err) {
			var index = ret.buttonIndex;
			if (index == 1) {
			  api.openWin({
				name : 'shopManage_win',
				url : 'widget://html/shopManage/shopManage_win.html',
				reload:true,
			  });
			} else {
			  api.closeToWin({
				name : 'main_win',
				url : 'widget://html/main/main_win.html',
				 reload:true,
			  });
			}
		  })
		  funResult(false)
		} else if(res.data.shopStatus == 1){
			api.confirm({
			title: '提示',
			msg: '店铺审核中，请联系管理员',
			buttons: ['确定', '取消']
		  }, function (ret, err) {
			var index = ret.buttonIndex;
			if (index == 1) {
			  api.closeToWin({
				name : 'main_win',
				url : 'widget://html/main/main_win.html',
				 reload:true,
			  });
			} else {
			  api.closeToWin({
				name : 'main_win',
				url : 'widget://html/main/main_win.html',
				 reload:true,
			  });
			}
		  })
		  funResult(false)
		  }
		  else if(res.data.shopStatus == 3){
			api.confirm({
			title: '提示',
			msg: '店铺信息审核未通过，请重新提交审核',
			buttons: ['确定', '取消']
		  }, function (ret, err) {
			var index = ret.buttonIndex;
			if (index == 1) {
			  api.closeToWin({
				name : 'main_win',
				url : 'widget://html/main/main_win.html',
				 reload:true,
			  });
			} else {
			  api.closeToWin({
				name : 'main_win',
				url : 'widget://html/main/main_win.html',
				 reload:true,
			  });
			}
		  })
		  funResult(false)
		  }else {
			funResult(true)
		  }
	  },
	  function (err) {
		funResult(false)
		api.hideProgress();
	  }
	)
  };

/**检查是否是登录状态*/
var checkLoginState=function(isShowErrHint){
	if (isShowErrHint != undefined && typeof isShowErrHint === "boolean") {
		
	} else{
		isShowErrHint=true;
	}
	// alert ('检查是否是登录状态：'+ isShowErrHint)
	var userId=$api.getStorage("userid");
	if(userId==undefined || userId==null || userId==''){
		if(isShowErrHint){
			api.toast({ msg: '请先登录',duration: 2000, location: 'middle'});
		}
		return false;
	} else{
		return true;
	}
}
/**检查是否是工匠类型*/
var checkCurLoginClientLevel=function(isShowErrHint){
	if (isShowErrHint != undefined && typeof isShowErrHint === "boolean") {
		
	} else{
		isShowErrHint=true;
	}
	var userId=$api.getStorage("userid");
	if(userId==undefined || userId==null || userId==''){
		if(isShowErrHint){
			api.toast({ msg: '请先登录',duration: 2000, location: 'middle'});
		}
		return false;
	} else{
		var clientLevel=$api.getStorage("clientLevel");
		if(clientLevel==5 || clientLevel=='5') {
			var isCertification=$api.getStorage("isCertification");//是否实名验证（ 1为已实名认证    0 为未实名认证）
			if(isCertification==1){
				return true;
			} else{
				if(isShowErrHint){
					api.toast({ msg: '您还未实名验证或实名验证未通过',duration: 2000, location: 'middle'});
				}
				return false;
			}
		} else{
			if(isShowErrHint){
				api.toast({ msg: '您尚未是工匠,请切换账号或者完成实名验证 试试?',duration: 2000, location: 'middle'});
			}
			return false;
		}
	}
}

    //时间格式调整
    var dataFormatting = function (upDate) {
		return upDate.substr(0,16)
	  }


var socketManagerTemp;
var socketSid='';//socket的唯一标识
var otherPartyHost='';//udp收到数据时发送方地址
var otherPartyPort='';//udp收到数据时发送方端口
//获取socketManager；
var getSocketManager=function(){
	if(socketManagerTemp==undefined || socketManagerTemp==null || socketManagerTemp==''){
		socketManagerTemp = api.require('socketManager');
	}
	return socketManagerTemp;
};
//ios:1904031722011511  android 1903141141000740
/**
 *创建socket 
 */ 
var createSocket = function(host){
//	var userId=$api.getStorage("userid");
	var socketManager = getSocketManager();
	console.log(host)
	socketManager.createSocket({
		type:'tcp',//socket 类型，tcp 或 udp(默认值：tcp)
//		udpMode:'unicast',//：udp 通讯模式，取值范围为（unicast-单播、multicast-组播、broadcast-广播）(默认值：unicast)
	    host: host,//主机地址，IP 或者域名，不能为空
	    port: 8080,//主机端口
//	    localPort:8282,//本机绑定的端口，用于udp(默认值：8282)
	    timeout:5,//连接超时时间，单位秒(默认值：5)
	    bufferSize:300,//缓冲大小，客户端根据自己传输的数据可能的最大值进行设置，单位kb(默认值：16)
	    charset:'utf-8',//字符集，发送和接收数据时使用此字符集进行编码(默认值：utf-8)
	    returnBase64:false//收到数据时是否返回base64编码后的数据(默认值：false)
	}, function(ret, err) {
//	{
//  sid:            //socket的唯一标识，字符串类型
//  state:            //socket状态码，见常量里面的socket状态码，数字类型
//  data:            //state为接收数据时的数据，字符串类型
//  host：            //udp收到数据时发送方地址
//  port：            //udp收到数据时发送方端口
//}
//state
//101 //创建成功
//102 //连接成功
//103 //收到数据
//201 //创建失败
//202 //连接失败
//203 //异常断开
//204 //正常断开
//205 //发生未知错误断开
	    if (ret) {
	    	socketSid=ret.sid;//socket的唯一标识，字符串类型
//	    	otherPartyHost=ret.host;//udp收到数据时发送方地址
//	    	otherPartyPort=ret.port;//udp收到数据时发送方端口
	    	if(ret.state==103){
	    		 alert('103:'+JSON.stringify(ret));
	    	}
	    	
	        console.log('ret:'+JSON.stringify(ret));
	    } else {
	        console.log('err:'+JSON.stringify(err));
	    }
	});
}

/**
 *关闭socket 
 */
var closeSocket = function(){
	var socketManager = getSocketManager();
	socketManager.closeSocket({
	    sid: socketSid
	}, function(ret, err) {
	    if (ret.status) {
	        console.log(JSON.stringify(ret));
	    } else {
	        console.log(JSON.stringify(err));
	    }
	});
}

/**
 *发送消息socket 
 */
var sendSocket = function(sendObg){
//	var userId=$api.getStorage("userid");
//	var tagid = userId == '1904031722011511' ? '1903141141000740' : '1904031722011511';
//	//临时测试使用
////	var sendParam = {};
////	sendParam.TARGET_ID = tagid;
////	//目标人的id
////	sendParam.SOURCE_ID = userId;
////	//发送人的id
////	sendParam.OPERATE = 'SEND';
////	//操作方式，SEND
////	sendParam.CHAT_TYPE = '1';
////	//类型 0工人 1商城
////	sendParam.PAGE_NO = '1';
////	//页码
////	sendParam.PAGE_SIZE = '30';
////	//每页30
////	sendParam.MESSAGE = sendObg;
//	
//	
//		var par = {};
//    	$(par).attr('TARGET_ID',tagid);				//目标人的id
//    	$(par).attr('SOURCE_ID',userId);			//发送人的id
//    	$(par).attr('OPERATE','SEND');				//操作方式，SEND
//    	$(par).attr('CHAT_TYPE','1');				//类型 0工人 1商城
//    	$(par).attr('PAGE_NO','1');					//页码
//    	$(par).attr('PAGE_SIZE','30');				//每页30
//    	$(par).attr('MESSAGE',sendObg);	//发送的消息
//	
//	
	console.log(sendObg)
	var socketManager = getSocketManager();
	socketManager.write({
	    sid: socketSid,
	    data: sendObg
//	    host:otherPartyHost,
//	    port:otherPartyPort
	}, function(ret, err) {
	    if (ret.status) {
	         console.log(JSON.stringify(ret));
	    } else {
	         console.log(JSON.stringify(err));
	    }
	});
}

        //检查token是否过期
        var getTokenRes = function (funCal) {
			var funCal
			_getHttpsData('/utils/getPK', '',
				function (res) {
				if (res.status == false && res.code == '0009') {
					clearUserInfoCache();
                    clearShopInfoCache();
					api.closeFrameGroup({
						name: 'main_group'
					});
                    api.closeToWin({
						name : 'login_win',
						url : 'widget://html/login/login_win.html',
						reload:true,
						allowEdit:true,
					});
					// api.toast({ msg: '长时间离开，请重新登录',duration: 5000, location: 'middle'});
				}
				else if (res.status){
					funCal(res.data);
				} 
			})
		};

			
		

//角色筛选登录
var clientRole= ['行业代表','服务中心','县级代理','市级代理','省级代理','工匠','商铺店主','','','普通用户'];
var getClientVevel = function(clientLevel,funcall){
	console.log ('clientLevel等级:'+clientLevel)
	switch(clientLevel) {
			case 0:
				api.alert({
					title: '请用其他手机号登录/注册',
					msg: '您当前已成为（' + clientRole[clientLevel] + '），无法登录',
					buttons: ['确认']
				}, function (ret, err, message) {
					clearUserInfoCache();
					funcall(false)
				});
			break;
			case 1:
				api.alert({
					title: '请用其他手机号登录/注册',
					msg: '您当前已成为（' + clientRole[clientLevel] + '），无法登录',
					buttons: ['确认']
				}, function (ret, err, message) {
					clearUserInfoCache();
					funcall(false)
				});
			break;
			case 2:
				api.alert({
					title: '请用其他手机号登录/注册',
					msg: '您当前已成为（' + clientRole[clientLevel] + '），无法登录',
					buttons: ['确认']
				}, function (ret, err, message) {
					clearUserInfoCache();
					funcall(false)
				});
			break;
			case 3:
				api.alert({
					title: '请用其他手机号登录/注册',
					msg: '您当前已成为（' + clientRole[clientLevel] + '），无法登录',
					buttons: ['确认']
				}, function (ret, err, message) {
					clearUserInfoCache();
					funcall(false)
				});
			break;
			// case 4:
			// 	api.alert({
			// 		title: '请用其他手机号登录/注册',
			// 		msg: '您当前已成为（' + clientRole[clientLevel] + '），无法登录',
			// 		buttons: ['确认']
			// 	}, function (ret, err, message) {
			// 		clearUserInfoCache();
			// 		funcall(false)
			// 	});
			// break;
			// case 5:
			// 	api.alert({
			// 		title: '请用其他手机号登录/注册',
			// 		msg: '您当前已成为（' + clientRole[clientLevel] + '），无法登录',
			// 		buttons: ['确认']
			// 	}, function (ret, err, message) {
			// 		clearUserInfoCache();
			// 		funcall(false)
			// 	});
			// break;
			// case 0:
			// 	funcall(true)
			// break;
			// case 1:
			// 	funcall(true)
			// break;
			// case 2:
			// 	funcall(true)
			// break;
			// case 3:
			// 	funcall(true)
			// break;
			case 4:
				funcall(true)
			break;
			case 5:
				funcall(true)
			break;
			case 6:
				funcall(true)
			break;
			case 9:
				funcall(true)
			break;
			default:
				// 默认代码块
		} 
}