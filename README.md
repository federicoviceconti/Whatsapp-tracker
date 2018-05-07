# Whatsapp-tracker
Don't miss any messages. (Works on Whatsapp web)<br />
This script works only on Whatsapp Web. <br />
It allows to record messages to avoid the problem of *deleted message* ("This message has been deleted").<br />

## Pay attention ##
I am not responsible for any incorrect use of this code.

## Filter method ##
The *filterBy* method could is called when you want to filter your log. You can use multiple filter or single one <br />
An example of filtering by name:
``` 
const stringName = 'Myname';
const orderBoolean = true;
filterBy(['name'], stringName, orderBoolean); 
```
Get all logged messages:
``` 
const orderBoolean = false;
filterBy(['all'], '', orderBoolean); 
```

Possible ordering are present in the **filterArray variable**.
