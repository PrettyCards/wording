
const rows_per_request = 50;
var allDatas = [];
var allCount = 0;
var successCount = 0;

function push_english_wording_to_onu_sheet() {
    console.log("Please wait . . . ");
    window.$.getJSON("/translation/en.json", {}, function(translationFile) {
        console.log("Translation file fetched!");
        window.$.ajax({
            url: "https://sheetdb.io/api/v1/yxlydzrv4h37y/all", 
            type: "DELETE",
            success: function() {
                console.log("Old sheet deleted!");
                var count = 0;
                allDatas = [];
                var data = [];
                allCount = 0;
                successCount = 0;
                for (var key in translationFile) {
                    data.push({"key": key, "value": translationFile[key]});
                    count++;
                    if (count >= rows_per_request) {
                        allDatas.push(data);
                        data = [];
                        count = 0;
                    }
                    allCount++;
                }
                if (data.length > 0) {
                    allDatas.push(data);
                }
                push_english_helper(0);
            }
        });
        //console.log(translationFile);
        
        
        
    })
}

function push_english_helper(index) {
    if (index >= allDatas.length) {
        console.log("DONE!", successCount, "/", allCount);
        return;
    }
    window.$.post("https://sheetdb.io/api/v1/yxlydzrv4h37y", { data: allDatas[index], mode: "RAW"}, function(response) {
        console.log("Batch #" + index + ": ",response.created, "/", allDatas[index].length, "entries created!");
        console.log(response);
        successCount += response.created;
        push_english_helper(index+1);
    });
}

window.prettycardswording_pushWordingToOnuSheet = push_english_wording_to_onu_sheet;