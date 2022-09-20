
import { plugin, us_loaded } from "./underscript_checker";
import {} from "./translation_generator";

if (us_loaded) {

    console.log("PrettyCards:Wording!");

    plugin.events.on("PrettyCards:registerTranslationSources", function() {
        window.prettycards.translationManager.addLanguageSource("PrettyCards:Wording", (lan) => `https://raw.githubusercontent.com/PrettyCards/wording/main/json/translation/${lan}.json`);
    })
    
}

