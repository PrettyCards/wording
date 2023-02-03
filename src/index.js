
import { plugin, us_loaded, translationFileSource, isApril } from "./underscript_checker";
import {} from "./translation_generator";
import {} from "./april_fools";

var aprilFoolsWording = plugin.settings().add({
        'key': 'april_fools_translations',
        'name': 'April Fools Translations', // Name in settings page
        'type': 'boolean',
        'refresh': true, // true to add note "Will require you to refresh the page"
        'default': true, // default value
        'hidden': !isApril()
    });

if (us_loaded) {

    console.log("PrettyCards:Wording!");

    plugin.events.on("PrettyCards:registerTranslationSources", function() {
        var translationFileSource = (lan) => `https://raw.githubusercontent.com/PrettyCards/wording/main/json/translation/${lan}.json`;
        if (aprilFoolsWording.value() && isApril()) {
            translationFileSource = (lan) => `https://raw.githubusercontent.com/PrettyCards/wording/main/json/translation/aprilFools/${lan}.json`
        }
        window.prettycards.translationManager.addLanguageSource("PrettyCards:Wording", translationFileSource);
    })

    
    
}

