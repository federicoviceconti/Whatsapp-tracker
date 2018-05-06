const fatherNode = "_2EXPL", waWeb = "_1FKgS app-wrapper-web bN4GZ";
const getConversations = () => document.getElementsByClassName(fatherNode);

let conversations = undefined;
let logHistory = "";

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

console.log('--- Start ---')
const trackerFunction = () => {
    conversations = getConversations();

    if (document.getElementsByClassName(waWeb).length > 0) {
        console.log("You are offline! Please, connect your phone or enable your internet connection!");
    } else if (conversations.length == 0) {
        console.log("Actually there are no conversation, please be patient on next reload...");
    } else {
        console.log("Conversation elements observed are:", conversations.length);
        for (const conversation of conversations) {
            //------ Get the conversation element (Contains the child)
            const conversationElement = conversation.children[1];

            const callback = (mutationsList) => {
                if (mutationsList.length > 2) {
                    //------ Get the conversation piece (name and message)
                    const conversationMessageElement = conversationElement.lastChild.firstChild.firstChild
                    const conversationName = conversationElement.firstChild.firstChild.firstChild.title;
                    const conversationHour = conversationElement.firstChild.lastChild.innerText;
                    const conversationMessage = conversationMessageElement.title;

                    const ownMessage = conversationElement.lastChild.firstChild.innerHTML;

                    const classOwn = "_1VfKB"
                    const classStatus = "status-";
                    const itsOwnMessage = ownMessage.indexOf(classOwn) > 0 && ownMessage.indexOf(classStatus) > 0 ? '(own)' : '(not-own)';

                    const date = new Date().toISOString().split("T");
                    const currentTime = `Log at {${date[0]}T${date[1].split(".")[0]}} ->`;
                    const currentLog = `${currentTime} Person: {${conversationName}} Hour: {${conversationHour}} Message: {${conversationMessage}} {${itsOwnMessage}}`;

                    if (logHistory.indexOf(currentLog) == -1) {
                        logHistory += "\n" + currentLog;
                    }

                    //console.log(currentLog);
                    //console.log("Other log", mutationsList)
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
                console.log("You need to stay in menù page. In search function, tracker currently doesn't work")
            }
        }
    }
};

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
    if (types.length == 1 && types[0] === 'all') return {
        filter: ['all'],
        value: normalize(logHistory).split("\n")
    };
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
            logs.value = logs.value.sort(a, b => new Date(normalize(a.match(regex))) - new Date(normalize(a.match(regex))))
        }

        return logs;
    }
}

//TODO Create extension to start
setInterval(trackerFunction, 10000);
setTimeout(trackerFunction, 3000);

const normalize = (log) => log.replace(/\{/g, "").replace(/\}/g, "");

const printAllHistory = () => logHistory;