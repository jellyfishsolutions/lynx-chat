import SimpleModule from 'lynx-framework/simple.module';

export default class ChatModule extends SimpleModule {
    get controllers(): string {
        return __dirname + '/controllers';
    }

    get entities(): string {
        return __dirname + '/entities';
    }

    get public(): string {
        return __dirname + '/public';
    }

    get views(): string {
        return __dirname + '/views';
    }
}
