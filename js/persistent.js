const KEYWORDS_KEY = "keywords";
const FILTERING_MODE_KEY = "filtering_mode";

// Initialize keywords
if (localStorage.getItem(KEYWORDS_KEY) === null) {
    localStorage.setItem(KEYWORDS_KEY, "[]");
}

// Initialize filtering mode
if (localStorage.getItem(FILTERING_MODE_KEY) === null) {
    localStorage.setItem(FILTERING_MODE_KEY, "all_out");
}

// Hook up listener for getting keywords
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getPersistent")
    {
        var response = {
            keywords: get_keywords(),
            filtering_mode: get_filtering_mode()
        };
        sendResponse(response);
    }
    else
    {
        sendResponse({});
    }
});

/**
 * Get keywords
 * @returns {Array} keywords array
 */
function get_keywords() {
	cesync.onLoad();
	return cesync.GetValue();
}

/**
 * Add a new keyword in keywords
 * @param {String} new_keyword
 */
function add_keyword(new_keyword) {
	record=new CeRecord;
	record.Value=new_keyword;
	record.CheckCode="+";
	cesync.value.data.push(record);
	cesync.onSave();
}

/**
 * Remove a keyword from keywords
 * @param {String} removed_keyword
 */
function remove_keyword(removed_keyword) {
	for(i=0;i<cesync.value.data.length;i++){
		if(cesync.value.data[i]==null)continue;
		if(removed_keyword===cesync.value.data[i].Value&&cesync.value.data[i].IfLove==100)
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

/**
 * Get current filtering mode
 * @returns {String}
 */
function get_filtering_mode() {
	return localStorage[FILTERING_MODE_KEY];
}

/**
 * Set current filtering mode
 * @param {String} filtering_mode
 */
function set_filtering_mode(filtering_mode) {
	localStorage[FILTERING_MODE_KEY] = filtering_mode;
}

