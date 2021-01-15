# Lynx Chat Module

This module adds chat functionality to the lynx framework.

The frontend is implemented as a React application, that can be easily integrated as an iframe.
The backend is currently implemented as REST APIs, and the React application perform a polling-like method to update the message list.

## Installation and usage

The Chat Module depends on the Lynx Admin UI module to provide a basic automatic administration area.

For installation:

```
npm install lynx-datagrid lynx-admin-ui lynx-chat
```

A typical configuration could be:

```
import AdminUIModule from 'lynx-admin-ui';
import DatagridModule from 'lynx-datagrid';
import { App, ConfigBuilder } from 'lynx-framework';
import ChatModule from '..';

const port = Number(process.env.PORT) || 3000;

let myConfig = new ConfigBuilder(__dirname, false).build();

const app = new App(myConfig, [
    new DatagridModule(),
    new AdminUIModule(),
    new ChatModule(),
]);

app.startServer(port);
```

## Rooms, users and message types

The module supports multiple rooms (or channel). Each room can contain multiple users.

Users can be associated with a standard lynx `UserEntity`, or they can be guest-user.

To create a new user, it is possible to execute the following code:

```
//creation of a chat guest user, named 'Boris'
let userA = await ChatUserEntity.createUser('Boris');

//creation of a chat user connected to a lynx standard user
let userB = await ChatUserEntity.createUser(lynxStandardUser);
```

To create a new room, it is possible to execute the following code:

```
let room = await ChatRoomEntity.createRoom('Jellyfish', [userA, userB, userC]);
```

in this example, a new room named 'Jellyfish' is created, formed by three users.

The module supports text messages and file messages. For the latter, each uploaded file will be a `Media` object, stored inside the `/chat/uploads` virtual directory.

## Integrate the frontend

The frontend is available at the following path:

```
/chat/app/index.html?room={{roomId}}&id={{chatUserId}}
```

where `roomId` specify the id of the room to use; the `chatUserId` specify the current Chat User Id that sends the message.

IMPORTANT: the frontend should always used inside an iframe or similar and the url should be as masked as possible to the end user. Moreover, to provide security for user access, a middleware should be provided.

## Security and validations

The API endpoints are in the `/chat/api/` path. You should provide your own middleware to provide security (if needed) on the access of this endpoints.
