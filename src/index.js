
import { plugin, us_loaded, translationFileSource, isApril } from "./underscript_checker";
import {} from "./translation_generator";

if (us_loaded) {

    console.log("PrettyCards:Wording!");

    plugin.events.on("PrettyCards:registerTranslationSources", function() {
        if (!PrettyCards_settings.april_fools_wording.value()) {
            var translationFileSource = (lan) => `https://raw.githubusercontent.com/PrettyCards/wording/main/json/translation/${lan}.json`;
            window.prettycards.translationManager.addLanguageSource("PrettyCards:Wording", translationFileSource);
        }
    })

    
    
}

