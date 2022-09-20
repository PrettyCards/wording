
import { plugin, us_loaded } from "./underscript_checker";

if (us_loaded) {

    plugin.events.on("PrettyCards:registerTranslationSources", function() {
        window.prettycards.translationManager.addLanguageSource("PrettyCards:Wording", (lan) => `https://raw.githubusercontent.com/PrettyCards/wording/main/json/translation/${lan}.json`);
    })
    
}

