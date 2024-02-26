
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
            return "INVALID_DATA";
        }
        objects[0].key = objects[0].key + "-" + card.id;
    } else if (objects[0].key == "card-cyan" || objects[0].key == "card-red" || objects[0].key == "card-both") {
        var card = window.getCardWithName(additionalData);
        if (!card) {
            return "INVALID_DATA";
        }
        var bits = objects[0].key.split("-");
        objects[0].key = `${bits[0]}-${card.id}-${bits[1]}`;
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
    window.$.getJSON("/translation/en.json", {}, function(translationFile) {
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

function generateOnuTranslations(sheet = "Regular_Fixes", addIfs = true) {
    if (window.prettycards.artifactDisplay.artifacts.length <= 0) {
        console.log("LOG IN FIRST!!!");
        return;
    }
    console.log("Please wait . . .");
    window.$.getJSON("/translation/en.json", {}, function(translationFile) {
        console.log("UC translation file fetched . . .");
        window.$.getJSON("https://sheetdb.io/api/v1/pos34noy6mzql?sheet=" + sheet, {}, function(sheets) {
            console.log("Translation sheet fetched . . .");
            var newFile = []; // SQL Command Array
            sheets.forEach(sheetObj => {
                var objs = getObjectsFor(sheetObj);
                if (objs == "INVALID_DATA") {
                    console.log("Unprocessable data: ", sheetObj);
                    return;
                }
                objs.forEach(obj => {
                    var org = translationFile[obj.key];
                    obj.value = obj.value.replaceAll("'", "''");
                    if (org) {
                        if (org == obj.value) {
                            return; // Acts as a break if this was a normal loop. Prevents writing things that are already like that.
                        }
                        newFile.push(`UPDATE TranslateString SET stringReference = '${obj.value}' WHERE stringKey = '${obj.key}';`);
                        return; // Acts as a break if this was a normal loop.
                    }
                    newFile.push(`INSERT INTO TranslateString (stringKey, stringReference) VALUES ('${obj.key}', '${obj.value}');`);
                })
            })
            console.log(newFile);
            var save = newFile.join("\n");
            window.prettycards.utility.downloadFile(save, "en.sql", "text/plain");
        })
    })
}

function generateAprilFoolsSheetCorrection() {
    if (window.prettycards.artifactDisplay.artifacts.length <= 0) {
        console.log("LOG IN FIRST!!!");
        return;
    }
    console.log("Please wait . . .");
    window.$.getJSON("/translation/en.json", {}, function(translationFile) {
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
window.prettycardswording_generateOnuTranslations = generateOnuTranslations;

export {generateTranslations};