CeRecord = function() {
	this.Id=0;
	this.UserId=0;
	this.Value="";
	this.Addon="";
	this.IfLove=100;
	this.LastModified="";
	this.CheckCode="";
}


CeSync = function ()
{
	_this=this;
	this.url="https://web.emoticon.moe";
	this.version="0.0.1";
	this.appid=1;
	//Store All Info Into Here.
	this.value={
		username:"",
		password:"",
		accesskey:"",
		deviceid:"",
		pullrequesttime:"Never Synced",
		login:0,
		logininfo:"No Login",
		userid:0,
		data:[null],
	}
	//Clear Info.
	this.init = function()
	{
		this.value={
			username:"",
			password:"",
			accesskey:"",
			deviceid:"",
			pullrequesttime:"Never Synced",
			login:0,
			logininfo:"No Login",
			userid:0,
			data:[null],
		}
		this.onSave();
	}
	//The functio save value into localstorage.
	this.onSave = function()
	{
		localStorage.setItem('CeSync', JSON.stringify(this.value));
	}
	//Get value from localstorage.
	this.onLoad = function()
	{
		if(localStorage.getItem('CeSync')==null)this.onSave();
		this.value = JSON.parse(localStorage.getItem('CeSync'));
	}

	this.onLogin = function(callback)
	{
		if(this.value.username==="")return ;
		$.post(this.url+"/api/account.php?f=login",{ "u": this.value.username, "p": this.value.password, "k": 1},
					function(data){
						if(data.code===101){
							_this.value.accesskey=data.AccessKey;
							_this.value.userid=data.UserId;
							_this.value.login=1;
							console.log("登陆成功。");
							_this.value.logininfo="Login Success";
							_this.onSave();
							if(callback!=null)
							  callback(true);
						}else{
							console.log(data);
							_this.value.logininfo="Login Failed";
							_this.value.login=0;
							if(callback!=null)
							  callback(false);
						}
					},"json");
		this.onSave();
	}



	this.onCheckLogin = function()
	{
		$.post(this.url+"/api/account.php?f=checklogin",{ "ak" : this.value.accesskey }, 
					function(data){
						if(data.code===302){
							_this.onLogin();
						}   
					},"json");
	}

	this.onCheckDeviceId = function()
	{
		if(this.value.login===0)return ;
		if(this.value.deviceid===""){
			$.post(this.url+"/api/device.php?f=generatedeviceid",{ "ak" : this.value.accesskey }, 
						function(data){
							if(data.code===101){
								_this.value.deviceid=data.DeviceCode;
								_this.onSave();
							}
						},"json");

		}
	}

	this.pull = function(callback)
	{
		this.onLoad();
		if(this.value.login===0)return ;
		$.post(this.url+"/api/device.php?f=now",{ "ak" : this.value.accesskey }, 
					function(data){
						if(data.code===101){
							_this.value.pullrequesttime=data.Now;
						}
						_this.onSave();
						$.post(_this.url+"/api/device.php?f=pull",{ "ak" : _this.value.accesskey ,"d": _this.value.deviceid},  
							function(data){
								if(data.code===101){
									for(i=0;i<data.Result.length;i++){
										Id=data.Result[i].Id;
										if(_this.value.data[Id]==null){
											_this.value.data[Id]=$.extend(true, {},data.Result[i]);
										}else if(_this.value.data[Id].CheckCode.length<4){
											_this.value.data[Id].CheckCode="+";
											_this.value.data.push(_this.value.data[Id]);
											_this.value.data[Id]=$.extend(true, {},data.Result[i]);
										}else {
											_this.value.data[Id]=$.extend(true, {},data.Result[i]);
										}
										_this.value.pullrequesttime=data.Result[0].PullTime;
									}
									_this.onSave();
								}else{
									console.log(data);
								}
								_this.push();
								_this.pullok();
								if(callback!=null)
								  callback();
							},"json");
					},"json");
	}

	this.push = function()
	{
		if(this.value.login===0)return;
		for(i=0;i<this.value.data.length;i++){
			_i=i;
			if(this.value.data[i]==null)continue;
			switch(this.value.data[i].CheckCode){
				case "+":
					var tempdata=$.extend(true,{},this.value.data[i]);
					this.value.data[i]=null;
					$.post(this.url+"/api/favor.php?f=add",{"ak": this.value.accesskey, "v": tempdata.Value,"l":tempdata.IfLove,"t": tempdata.pullrequesttime},
								function(data){
									if(data.code===101){
										if(_this.value.data[data.Result.Id]!=null)
										  _this.value.data.push(_this.value.data[data.Result.Id]);
										_this.value.data[data.Result.Id]=$.extend(true, {}, data.Result);
										_this.onSave();
									}else{
										console.log(data);
									}
								},"json");
					break;
				case "*":
					$.post(this.url+"/api/favor.php?f=modify",{"ak": this.value.accesskey, "i": this.value.data[i].Id, "v": this.value.data[i].Value, "l":this.value.data[i].IfLove, "t": this.value.pullrequesttime},
								function(data){
									if(data.code===101){
										_this.value.data[data.Result.Id]=$.extend(true, {}, data.Result);
										_this.onSave();
									}else{
										console.log(data);
									}
								},"json");
					break;
				default :
					break;
			}
		}
	}
	this.pullok = function()
	{
		if(this.value.login===0)return;
		$.post(this.url+"/api/device.php?f=pullok",{"ak":this.value.accesskey, 'd' : this.value.deviceid , 't' : this.value.pullrequesttime});
	}
	this.GetValue = function()
	{
		result=[];
		for(i=0;i<this.value.data.length;i++){
			if(this.value.data[i]==null)
			  continue;
			if(this.value.data[i].IfLove==100)
			  result.push(JSON.parse(this.value.data[i].Value));
		}
		return result;
	}

	this.onLoad();
	this.onCheckLogin();
	this.onCheckDeviceId();
}
var cesync=new CeSync();

chrome.alarms.create("CESYNC",{delayInMinutes:1,periodInMinutes:5});

chrome.alarms.onAlarm.addListener(function(alarm){cesync.pull();});
