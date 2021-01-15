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
