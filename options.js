const getData = key => Object.values(chrome.storage.local.get(key))[0];
const storeData = (key, value) => chrome.storage.local.set({ [key]: value });
const getMultipleDataValues = keys => chrome.storage.local.get(keys);
const storeMultipleDataValues = obj => chrome.storage.local.set(obj);

const STRING_TYPE = 0;
const INTEGER_TYPE = 1;
const BOOL_TYPE = 2;
const ARRAY_TYPE = 3;
const settingsKeys = [
    'extensionEnabled',
    'targetHeads'
];
const settingsDefaultValues = [
    true,
    true
];
const settingsKeyTypes = [
    BOOL_TYPE,
    BOOL_TYPE
];

async function saveSettings() {
    storedSettingsValues = {};

    for (var i = 0; i < settingsKeys.length; i++) {
        thisKey = settingsKeys[i];
        thisType = settingsKeyTypes[i];

        element = document.getElementById(thisKey);

        if (thisType == STRING_TYPE || thisType == INTEGER_TYPE) {
            storedSettingsValues[thisKey] = element.value;
        }
        else if (thisType == BOOL_TYPE) {
            storedSettingsValues[thisKey] = element.checked;
        }
    }


    await storeMultipleDataValues(storedSettingsValues);
}

async function fetchAndDisplaySettings() {
    const settingsValues = await getMultipleDataValues(settingsKeys);

    for (var i = 0; i < settingsKeys.length; i++) {
        thisKey = settingsKeys[i];
        thisType = settingsKeyTypes[i];
        keyValue = settingsValues[thisKey];

        if (keyValue == undefined) {
            thisKeyDefaultValue = settingsDefaultValues[i];
            await storeData(thisKey, thisKeyDefaultValue);
            settingsValues[thisKey] = thisKeyDefaultValue;
            i--;
            continue;
        }

        element = document.getElementById(thisKey);

        element.addEventListener("change", async (e) => {
            thisType = settingsKeyTypes[settingsKeys.indexOf(e.srcElement.id)];

            if (thisType == STRING_TYPE || thisType == INTEGER_TYPE) {
                await storeData(e.srcElement.id, e.srcElement.value);
            }
            else if (thisType == BOOL_TYPE) {
                await storeData(e.srcElement.id, e.srcElement.checked);
            }
        });

        if (thisType == STRING_TYPE || thisType == INTEGER_TYPE) {
            element.value = keyValue;
        }
        else if (thisType == BOOL_TYPE) {
            element.checked = keyValue;
        }

    }
}

window.addEventListener("load", async () => {
    await fetchAndDisplaySettings();
});