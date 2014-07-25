// Find elements
var keywords_table = document.getElementById("keywords_table");
var new_keyword_text_field = document.getElementById("new_keyword_text_field");
var new_keyword_button = document.getElementById("new_keyword_button");
var all_out_radio = document.getElementById("all_out_radio");
var blacken_keywords_radio = document.getElementById("blacken_keywords_radio");

//Prepare for CeSync;

// Setup submit button listener
new_keyword_button.onclick = function() {
    var i = keywords_table.rows.length;
    var new_keyword = new_keyword_text_field.value;
    add_keyword(new_keyword);
    insert_a_row(i, new_keyword);
    new_keyword_text_field.value = "";
};

// Setup radio listeners
all_out_radio.onclick = function() {
    set_filtering_mode("all_out");
    init_filtering_mode_radios();
};

blacken_keywords_radio.onclick = function () {
    set_filtering_mode("blacken_keywords");
    init_filtering_mode_radios();
};

/**
 * Init keywords table
 */
function init_keywords_table() {
    var keywords = get_keywords();
    for (var i = 0 ; i < keywords.length ; ++i) {
        insert_a_row(i, keywords[i])
    }
}

function init_filtering_mode_radios() {
    var filtering_mode = get_filtering_mode();
    switch (filtering_mode) {
        case "all_out":
        {
            all_out_radio.checked = true;
            blacken_keywords_radio.checked = false;
            break;
        }
        case "blacken_keywords":
        {
            all_out_radio.checked = false;
            blacken_keywords_radio.checked = true;
            break;
        }
    }
}

/**
 * Insert a row into keywords table
 * @param i {int} ith row in the table
 * @param keyword {String}
 */
function insert_a_row(i, keyword) {
    // Insert the row
    var new_row = keywords_table.insertRow(i);

    // Insert keyword cell
    var keyword_cell = new_row.insertCell(0);
    keyword_cell.innerHTML = keyword;

    // Insert remove cell
    var remove_cell = new_row.insertCell(1);
    remove_cell.onclick = function () {
        remove_keyword(keyword);
        remove_a_row(keyword);
    };
    remove_cell.innerHTML = "<a href=''>(Delete)</a>";
}

/**
 * Remove a row from keywords table
 * @param keyword {String}
 */
function remove_a_row(keyword) {
    var all_rows = keywords_table.rows;
    for (var i = 0 ; i < all_rows.length ; ++i) {
        if (all_rows[i].cells[0].innerText === keyword) {
            keywords_table.deleteRow(i);
            return;
        }
    }
}

init_keywords_table();
init_filtering_mode_radios();

$("#Login").click(function(){
	cesync.value.username=$("#username")[0].value;
	cesync.value.password=$("#password")[0].value;
	cesync.onSave();
	$("#status").text("信息已经保存，请刷新本页面。");
});
$("#Logout").click(function(){
	cesync.init();
	$("istatus").text("操作已经完成，请刷新本页面。");
});
$("#syncnow").click(function(){
	cesync.pull(function(){$("#time").text(cesync.value.pullrequesttime)});
});
$("#status").text(cesync.value.logininfo);
$("#time").text(cesync.value.pullrequesttime);
