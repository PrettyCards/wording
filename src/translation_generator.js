
function getObjectsFor(sheetObj) {
    if (!sheetObj["Type\/Translation Key"]) {
        console.log("ERR: No \"Type/Translation Key\" for ", sheetObj);
        return [];
    } 
    var objects = [
        {
            key: sheetObj["Type\/Translation Key"].toLowerCase(),
            value: sheetObj["Correct Wording (Translated)"]
        }
    ];
    var additionalData = sheetObj["Card\/Artifact Name"].trim();
    if (objects[0].key == "card" || objects[0].key == "card-name") {
        var card = window.getCardWithName(additionalData);
        if (!card) {
            //console.log('|' + sheetObj["Card\/Artifact Name"] + '|', '|' + additionalData + '|');
            return "INVALID_DATA";
        }
        objects[0].key = objects[0].key + "-" + card.id;
    } else if (objects[0].key == "artifact" || objects[0].key == "artifact-name") {
        var artifact = window.prettycards.artifactDisplay.GetArtifactByName(additionalData);
        if (!artifact) {
            return "INVALID_DATA";
        }
        objects[0].key = objects[0].key + "-" + artifact.id;
    } else if (objects[0].key == "soul" || objects[0].key == "kw") {
        objects.push({key: `${objects[0].key}-${additionalData.toLowerCase()}`, value: additionalData});
        objects[0].key = objects[1].key + "-desc";
    }
    return objects;
}

function generateTranslations(sheet = "Regular_Fixes", addIfs = true) {
    if (window.prettycards.artifactDisplay.artifacts.length <= 0) {
        console.log("LOG IN FIRST!!!");
        return;
    }
    console.log("Please wait . . .");
    window.$.getJSON("https://undercards.net/translation/en.json", {}, function(translationFile) {
        console.log("UC translation file fetched . . .");
        window.$.getJSON("https://sheetdb.io/api/v1/pos34noy6mzql?sheet=" + sheet, {}, function(sheets) {
            console.log("Translation sheet fetched . . .");
            var newFile = {};
            sheets.forEach(sheetObj => {
                var objs = getObjectsFor(sheetObj);
                if (objs == "INVALID_DATA") {
                    console.log("Unprocessable data: ", sheetObj);
                    return;
                }
                objs.forEach(obj => {
                    var org = translationFile[obj.key];
                    if (org && addIfs) {
                        if (org == obj.value) {
                            return; // Acts as a break if this was a normal loop.
                        }
                        newFile[obj.key] = {ifEqual : org, value: obj.value};
                        return; // Acts as a break if this was a normal loop.
                    }
                    newFile[obj.key] = obj.value;
                })
            })
            console.log(newFile);
            var save = JSON.stringify(newFile);
            window.prettycards.utility.downloadFile(save, "en.json", "text/plain");
        })
    })
}

function generateAprilFoolsSheetCorrection() {
    if (window.prettycards.artifactDisplay.artifacts.length <= 0) {
        console.log("LOG IN FIRST!!!");
        return;
    }
    console.log("Please wait . . .");
    window.$.getJSON("https://undercards.net/translation/en.json", {}, function(translationFile) {
        console.log("UC translation file fetched . . .");
        window.$.getJSON("https://sheetdb.io/api/v1/pos34noy6mzql?sheet=April Fools", {}, function(sheets) {
            console.log("Translation sheet fetched . . .");
            var newRows = [];
            sheets.forEach(sheetObj => {
                var key = sheetObj["Type\/Translation Key"].toLowerCase();
                var author = sheetObj["Suggester"];
                var additionalName = sheetObj["Card\/Artifact Name"];
                var value = sheetObj["Changed Version"];
                if (!key.startsWith("card")) {
                    return;
                }
                if (author == "TEMPLATE") {
                    var card = getCardWithName(additionalName);
                    if (!card) {
                        console.log("CARD NOT FOUND WITH NAME", additionalName);
                        return;
                    }
                    value = translationFile[key + "-" + card.id];
                    console.log("NEW VALUE", value);
                }
                newRows.push([key, additionalName, author, value]);
            })
            console.log(newRows);

            var rows = "";
            newRows.forEach((row) => {
                rows += "<tr>";
                row.forEach((cell) => {
                    rows += `<td>${cell}</td>`;
                })
                rows += "</tr>";
            })

            var table = window.$(`<table><tbody>${rows}</tbody></table>`);
            $(".mainContent").append(table);
        })
    })
}

window.prettycardswording_generateTranslations = generateTranslations;
window.prettycardswording_generateAprilFoolsSheetCorrection = generateAprilFoolsSheetCorrection;

export {generateTranslations};