class SettingsStorage {
    constructor() {
        this.settings = JSON.parse(localStorage.getItem('settings')) || {};
    }

    setItem(name, value) {
        this.settings[name] = value;
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }

    getItem(name) {
        return this.settings[name];
    }
}

export const settingsStorage = new SettingsStorage();
