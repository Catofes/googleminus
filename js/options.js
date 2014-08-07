// Find elements
var keywords_table = document.getElementById("keywords_table");

/**
 * Init keywords table
 */
function init_keywords_table() {
    var keyword_configs = get_keyword_configs();
    for(var i = 0 ; i < keyword_configs.length ; ++i) {
        insert_a_row(i + 1, keyword_configs[i]);
    }
    insert_adder_row();
}

/**
 * Insert a row into keywords table
 * @param i {int} ith row in the table
 * @param keyword_config {KeywordConfig}
 */
function insert_a_row(i, keyword_config) {
    // Insert the row
    var new_row = keywords_table.insertRow(i);

    // Insert keyword cell
    var keyword_cell = new_row.insertCell(0);
    keyword_cell.innerHTML = keyword_config.keyword;

    // Insert filtering mode cell
    var filtering_mode_cell = new_row.insertCell(1);
    var filtering_mode_select = create_filtering_mode_select(keyword_config.filtering_mode);
    filtering_mode_select.onchange = function () {
        modify_keyword_config(keyword_config.keyword, filtering_mode_select.value, keyword_config.param);
    };
    filtering_mode_cell.appendChild(filtering_mode_select);

    // Insert param cell
    var param_cell = new_row.insertCell(2);
    var param_input = document.createElement("input");
    param_input.value = keyword_config.param;
    param_input.onchange = function () {
        modify_keyword_config(keyword_config.keyword, keyword_config.filtering_mode, param_input.value);
    };
    param_cell.appendChild(param_input);

    // Insert delete cell
    var delete_cell = new_row.insertCell(3);
    var delete_button = document.createElement("button");
    delete_button.innerText = "Delete";
    delete_button.onclick = function () {
        remove_keyword_config(keyword_config.keyword);
        remove_a_row(keyword_config.keyword);
    };
    delete_cell.appendChild(delete_button);
}

/**
 * Create a filtering mode select
 * @param {String} filtering_mode
 * @returns {HTMLElement}
 */
function create_filtering_mode_select(filtering_mode) {
    var filtering_mode_select = document.createElement("select");
    FILTERING_MODES.forEach(function(o) {
        var option = document.createElement("option");
        option.text = o;
        option.value = o;
        filtering_mode_select.add(option);
    });
    filtering_mode_select.value = filtering_mode;
    return filtering_mode_select;
}

/**
 * Remove a row from keywords table
 * @param keyword {String}
 */
function remove_a_row(keyword) {
    var all_rows = keywords_table.rows;
    for (var i = 0 ; i < all_rows.length ; ++i) {
        if (all_rows[i].cells[0].innerText === keyword && i !== 0 ) {
            keywords_table.deleteRow(i);
            return;
        }
    }
}

function insert_adder_row() {
    // Insert the row
    var i = keywords_table.rows.length;
    var new_row = keywords_table.insertRow(i);

    // Insert keyword cell
    var keyword_cell = new_row.insertCell(0);
    var keyword_input = document.createElement("input");
    keyword_cell.appendChild(keyword_input);

    // Insert filtering mode cell
    var filtering_mode_cell = new_row.insertCell(1);
    var filtering_mode_select = create_filtering_mode_select(DEFAULT_FILTERING_MODE);
    filtering_mode_cell.appendChild(filtering_mode_select);

    // Insert param cell
    var param_cell = new_row.insertCell(2);
    var param_input = document.createElement("input");
    param_cell.appendChild(param_input);

    // Insert add cell
    var add_cell = new_row.insertCell(3);
    var add_button = document.createElement("button");
    add_button.innerText = "Add";
    add_button.onclick = function () {
        var new_config = new KeywordConfig(keyword_input.value, filtering_mode_select.value, param_input.value);
        add_keyword_config(new_config);

        var new_i = keywords_table.rows.length - 1;
        keywords_table.deleteRow(new_i);
        insert_a_row(new_i, new_config);
        insert_adder_row();
    };
    add_cell.appendChild(add_button);
}

init_keywords_table();


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
