const fatherNode = "_2EXPL", waWeb = "_1FKgS app-wrapper-web bN4GZ";
const splitNormalize = "[-split-]"
let conversations = undefined;
let logHistory = "";

const trackerFunction = () => {
    conversations = getConversations();

    if (document.getElementsByClassName(waWeb).length > 0) {
        console.log("You are offline! Please, connect your phone or enable your internet connection!");
    } else if (conversations.length == 0) {
        console.log("Actually there are no conversation, please be patient on next reload...");
    } else {
        console.log("Conversation elements observed are:", conversations.length);
        for (const conversation of conversations) {
            // Get the conversation element (Contains the child)
            const conversationElement = conversation.children[1];

            const callback = (mutationsList) => {
                if (mutationsList.length > 2) {
                    // Get the conversation piece (name and message)
                    const conversationMessageElement = conversationElement.lastChild.firstChild.firstChild
                    const conversationName = conversationElement.firstChild.firstChild.firstChild.title;
                    const conversationHour = conversationElement.firstChild.lastChild.innerText;
                    const conversationMessage = conversationMessageElement.title;
                    const ownMessage = conversationElement.lastChild.firstChild.innerHTML;
                    const classOwn = "_1VfKB"
                    const classStatus = "status-";
                    const itsOwnMessage = ownMessage.indexOf(classOwn) > 0 && ownMessage.indexOf(classStatus) > 0 ? '(own)' : '(not-own)';
                    const date = new Date().toISOString().split("T");
                    const currentTime = `Log at {${date[0]}T${date[1].split(".")[0]}} ${splitNormalize} `;
                    const currentLog = `{${conversationName}} ${splitNormalize} {${conversationHour}} ${splitNormalize} {${conversationMessage.replace(/(?:\r\n|\r|\n)/g, " -- linebreak -- ")}} ${splitNormalize} {${itsOwnMessage}}`;

                    if (logHistory.indexOf(currentLog) == -1) {
                        const len = logHistory.length;
                        logHistory += `${len !== 0 ? '\n' : ''} ${currentTime} ${currentLog}`;
                    }
                }
            };

            const observer = new MutationObserver(callback);
            const options = {
                childList: true,
                subtree: true,
                attributes: true,
                characterOldValue: true
            };

            //Detach previous elements
            observer.disconnect();

            try {
                //Attach new elements
                observer.observe(conversationElement.lastChild, options);
            } catch (error) {
                console.log("You need to stay in menù page. In other section, the tracker doesn't work")
            }
        }
    }
};

const getConversations = () => document.getElementsByClassName(fatherNode);

const filterArray = [
    [
        { label: 'date', value: 0 },
    ],
    [
        { label: 'name', value: 1 },
        { label: 'time', value: 2 },
        { label: 'message', value: 3 },
    ]
];

/**
 * Filter elements presents into logHistory
 * The filter options are present into filterArray
 * 
 * -- For example --
 * We want to filter by name -> call the function filterBy(['name'], 'My Name');
 * We want to retrieve all the history -> call the function filterBy(['all']);
 * 
 * @param {array} types array of string which contains value into filterArray's label
 * @param {string} value value is the index in the line (represented by curly braces)
 * @param {boolean} sort order by date (ascending)
 */
const filterBy = (types = ['all'], value = "", sort = false) => {
    let logs = {
        filter: [],
        value: []
    };
    const filtering = collection => {
        return collection.filter(item => {
            for (const type of types) {
                if (item.label === type) return true;
            }

            return false;
        });
    }

    let myFilter = [];
    if (types.length == 1 && types[0] === 'all') return outputItemsNormalized({
        filter: ['all'],
        value: normalize(logHistory).split("\n")
    });
    else {
        for (const currentFilter of filterArray) {
            myFilter = [...myFilter, ...filtering(currentFilter)];

            logs.filter = myFilter;
        }

        const regex = /{([^}]+)}/g
        for (const log of logHistory.split("\n")) { //Take the current line

            const currentLineMatch = log.match(regex);
            for (const filter of myFilter) {
                if (!currentLineMatch || currentLineMatch === "") continue;

                if ((currentLineMatch[filter.value] || '').toLowerCase().includes(value.toLowerCase())) {
                    logs.value = [...logs.value, normalize(log)];
                    break;
                }
            }
        }

        if (sort) {
            logs.value = logs.value.sort((a, b) => new Date(normalize(a.match(regex))) - new Date(normalize(a.match(regex))))
        }

        return outputItemsNormalized(logs);
    }
}

const outputItemsNormalized = (items) => {
    let results = [];
    for (const item of items.value) {
        const splittedItem = item.split(splitNormalize);

        if (splittedItem.length > 1) {
            const str = "Log at ";
            const len = str.length;
            const idx = splittedItem[0].indexOf(str) + len;

            results = [...results, {
                logTime: splittedItem[0].substring(idx),
                name: (splittedItem[1] || '').trim(),
                time: (splittedItem[2] || '').trim(),
                message: (splittedItem[3] || '').trim(),
                own: (splittedItem[4] || '').trim()
            }]
        }
    }

    return {
        ...items,
        value: results
    }
}

const normalize = (log) => log.replace(/\{/g, "").replace(/\}/g, "");

const printAllHistory = () => logHistory;

const main = () => {
    const confirm = prompt("Do you agree to records your messages on your machine? Yes, type 'agree' in the input below.");
    if (confirm.toLowerCase() === "agree") {
        console.log('--- Start ---')
        setInterval(trackerFunction, 10000);
        setTimeout(trackerFunction, 3000);
    } else {
        console.log("The script doesn't have the permission to run!");
    }
}

//Entry point
main();
