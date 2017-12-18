import en from "./en";

class LocalizationManager {
    constructor() {
        this.localization = en;
    }

    setLocalization(loc) {
        switch(loc) {
            case "en":
                this.localization = en;
                break;
            default:
                this.localization = en;
                break;
        }
    }
}

const localizationManager = new LocalizationManager();

export default localizationManager;