const KEYWORDS_KEY = "keywords";

// Initialize keywords
if (localStorage.getItem(KEYWORDS_KEY) === null) {
    localStorage.setItem(KEYWORDS_KEY, "[]");
	console.log("Create keywords complete");
}

/**
 * Get keywords
 * @returns {Array} keywords array
 */
function get_keyword_configs() {
	cesync.onLoad();
	return cesync.GetValue();
}

/**
 * Add a new keyword in keywords
 * @param {String} new_keyword
 */
function add_keyword_config(new_keyword) {
	record=new CeRecord;
	record.Value=JSON.stringify(new_keyword);
	record.CheckCode="+";
	cesync.value.data.push(record);
	cesync.onSave();
}

/**
 * Remove a keyword from keywords
 * @param {String} removed_keyword
 */
function remove_keyword_config(removed_keyword) {
	for(i=0;i<cesync.value.data.length;i++){
		if(cesync.value.data[i]==null)continue;
		if(removed_keyword===JSON.parse(cesync.value.data[i].Value).keyword&&cesync.value.data[i].IfLove==100)
		  break;
	}
	if(i<cesync.value.data.length){
		if(cesync.value.data[i].CheckCode=="+")
		  cesync.value.data[i]=null;
		else{
			cesync.value.data[i].CheckCode="*";
			cesync.value.data[i].IfLove=101;
		}
	}
	cesync.onSave();
}

function modify_keyword_config(modified_keyword, filtering_mode, param) {
	for(i=0;i<cesync.value.data.length;i++){
		if(cesync.value.data[i]==null)continue;
		if(modified_keyword===JSON.parse(cesync.value.data[i].Value).keyword&&cesync.value.data[i].IfLove==100)
		  break;
	}
	if(i<cesync.value.data.length){
		var modified_config = JSON.parse(cesync.value.data[i].Value);
		modified_config.filtering_mode=filtering_mode;
		modified_config.param=param;
		cesync.value.data[i].Value=JSON.stringify(modified_config);
		if(cesync.value.data[i].CheckCode=="+")
		  cesync.value.data[i].CheckCode="+";
		else
		  cesync.value.data[i].CheckCode="*";
	}
	cesync.onSave();
}



