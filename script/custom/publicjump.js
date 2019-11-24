////////////使用前先引用api.js////////////////

/**跳转用户协议*/
// function jumpUserAgreement(){
// 	api.toast({msg: '开发中...',duration: 2000,location: 'bottom'});
// }

function jumpUserAgreement(page){
	if(page=='用户协议'){
		api.openWin({
			name : 'agreement_win',
			url : 'widget://html/login/agreement/agreement_win.html',
			slidBackEnabled:true,
			delay:300
		});
	}else
	if(page=='隐私政策'){
		api.openWin({
			name : 'statement_win',
			url : 'widget://html/setup/aboutzxj/statement/statement_win.html',
			slidBackEnabled:true,
			delay:300
		});
	}
}