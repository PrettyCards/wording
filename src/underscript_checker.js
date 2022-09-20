
var us_loaded = false;
var plugin;
var settings = {};

function addSetting(data) {
    if (data.note && typeof(data.note) != "function") {
        data.note = `<div style="max-width: 600px;">${data.note}</div>`;
    }
    //data.category = categories[data.category || "misc"];
    var setting = plugin.settings().add(data);
    settings[data.key] = setting;
    return setting;
}

if (underscript) {
    us_loaded = true;
    plugin = window.underscript.plugin("PrettyCards Wording");
}

if (us_loaded) {

    /*
    plugin.events.on("PrettyCards:onPageLoad", function() {
        window.prettycards.utility.addCSSSourceData("shops", {
            version: GM_info.script.version,
			eventName: "PrettyCardsShops:CommitCSSLoad",
			apiLink: "https://api.github.com/repos/PrettyCards/shops/commits",
			urlLinkFunc: (data, name) => `https://cdn.jsdelivr.net/gh/PrettyCards/shops@${data}/css/${name}.css`
		})
    })
    */

} else {
    
}

//console.log(settings);

export {us_loaded, settings, plugin, addSetting}