
function getObjectsFor(sheetObj) {
    var objects = [
        {
            key: sheetObj["Type\/Translation Key"].toLowerCase(),
            value: sheetObj["Correct Wording (Translated)"]
        }
    ];
    var additionalData = sheetObj["Card\/Artifact Name"];
    if (objects[0].key == "card" || objects[0].key == "card-name") {
        var card = window.getCardWithName(additionalData);
        if (!card) {
            return "INVALID_DATA";
        }
        objects[0].key = objects[0].key + "-" + card.id;
    } else if (objects[0].key == "artifact" || objects[0].key == "artifact-name") {
        var artifact = window.prettycards.artifactDisplay.GetArtifactByName(additionalData);
        if (!artifact) {
            return "INVALID_DATA";
        }
        objects[0].key = objects[0].key + "-" + artifact;
    } else if (objects[0].key == "soul" || objects[0].key == "kw") {
        objects.push({key: `${objects[0].key}-${additionalData.toLowerCase()}`, value: additionalData});
        objects[0].key = objects[1].key + "-desc";
    }
    return objects;
}

function generateTranslations() {
    console.log("Please wait . . .");
    window.$.getJSON("https://undercards.net/translation/en.json", {}, function(translationFile) {
        console.log("UC translation file fetched . . .");
        window.$.getJSON("https://sheetdb.io/api/v1/pos34noy6mzql", {}, function(sheets) {
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
                    if (org) {
                        if (org == obj.value) {
                            return;
                        }
                        newFile[obj.key] = {ifEqual : org, value: obj.value};
                        return;
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

window.prettycardswording_generateTranslations = generateTranslations;

export {generateTranslations};