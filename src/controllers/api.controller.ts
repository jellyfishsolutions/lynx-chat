import { BaseController } from 'lynx-framework/base.controller';
import {
    Route,
    GET,
    API,
    POST,
    MultipartForm,
    IsDisabledOn,
} from 'lynx-framework/decorators';
import ChatUserEntity from '../entities/chat-user.entity';
import ChatRoomEntity from '../entities/chat-room.entity';
import Request from 'lynx-framework/request';
import ChatMessageEntity, {
    MessageType,
} from '../entities/chat-message.entity';
import { MoreThan } from 'typeorm';
import ChatNotificationEntity from '../entities/chat-notification.entity';
import MediaEntity from 'lynx-framework/entities/media.entity';
import FileResponse from 'lynx-framework/file.response';
import { isProduction } from 'lynx-framework/app';

@Route('/chat/api/')
export default class ApiController extends BaseController {
    private readonly BASE_PATH = 'chat/uploads';

    async postConstructor() {
        super.postConstructor();
        await MediaEntity.mkdir(this.BASE_PATH);
    }

    @IsDisabledOn(isProduction)
    @API()
    @GET('create-test-room')
    async createTestRoom() {
        let userA = await ChatUserEntity.createUser('Boris');
        let userB = await ChatUserEntity.createUser('Chiara');
        let userC = await ChatUserEntity.createUser('Gabriele');

        let room = await ChatRoomEntity.createRoom('Jellyfish', [
            userA,
            userB,
            userC,
        ]);

        return room;
    }

    @GET('rooms/file/:id')
    async downloadFile(id: string, req: Request): Promise<FileResponse> {
        let media = await MediaEntity.findBySlugOrId(id);
        if (!media) {
            throw new Error('not found');
        }
        return this.download(media);
    }

    @API()
    @GET('rooms/:id/:user')
    async getChatInfo(id: number, user: number, req: Request) {
        let room = (await ChatRoomEntity.findOne(id)) as ChatRoomEntity;
        let messages = await ChatMessageEntity.find({
            where: { chatRoom: room },
            order: { id: 'ASC' },
        });
        let reader = (await ChatUserEntity.findOne(user)) as ChatUserEntity;

        let array: any;
        let now = new Date();

        messages.forEach(async (m) => {
            if (reader.id != m.sender.id) {
                let read = {
                    id: user,
                    readAt: new Date(
                        now.getTime() - now.getTimezoneOffset() * 60000
                    ).toISOString(),
                };
                if (m.read == null) {
                    array = [];
                } else {
                    array = m.read;
                }

                if (
                    array.filter(function (e: any) {
                        return e.id === user;
                    }).length == 0
                ) {
                    array.push(read);
                    m.read = array;
                    let msg = await m.save();
                    let notification = (await ChatNotificationEntity.findOne({
                        where: { user: reader, message: msg },
                    })) as ChatNotificationEntity;
                    if (notification) {
                        await notification.remove();
                    }
                }
            }
        });
        return { name: room.name, messages: messages, users: room.users };
    }

    @API()
    @POST('rooms/:room/messages')
    async addMessage(room: number, req: Request) {
        let sender = (await ChatUserEntity.findOne(
            req.body.sender
        )) as ChatUserEntity;
        let chat = (await ChatRoomEntity.findOne(room)) as ChatRoomEntity;

        let msg = new ChatMessageEntity();
        msg.type = ChatMessageEntity.getType(req.body.type) as MessageType;
        msg.text = req.body.text;
        msg.chatRoom = chat;
        msg.sender = sender;
        msg.clientId = req.body.clientId;

        msg = await msg.save();

        chat.users.forEach(async (u) => {
            if (u.id != sender.id) {
                let notification = new ChatNotificationEntity();
                notification.user = u;
                notification.message = msg;
                notification.room = chat;
                await notification.save();
            }
        });
        return msg;
    }

    @API()
    @MultipartForm()
    @POST('rooms/:room/files')
    async addFile(room: number, req: Request) {
        if (!req.files || req.files.length == 0) {
            throw new Error('file not found');
        }

        let folder = await MediaEntity.getFolder(this.BASE_PATH);

        let file = await MediaEntity.persist(req.files[0], req.user, folder);

        if (!file) {
            throw new Error('unable to save the file');
        }

        let sender = (await ChatUserEntity.findOne(
            req.body.senderId
        )) as ChatUserEntity;
        let chat = (await ChatRoomEntity.findOne(room)) as ChatRoomEntity;

        let msg = new ChatMessageEntity();
        msg.type = ChatMessageEntity.getType(req.body.type) as MessageType;
        msg.text = JSON.stringify({ id: file.id, name: file.originalName });
        msg.chatRoom = chat;
        msg.sender = sender;
        msg.clientId = req.body.clientId;

        msg = await msg.save();

        chat.users.forEach(async (u) => {
            if (u.id != sender.id) {
                let notification = new ChatNotificationEntity();
                notification.user = u;
                notification.message = msg;
                notification.room = chat;
                await notification.save();
            }
        });
        return msg;
    }

    @API()
    @GET('rooms/:room/messages/:msgId/:user')
    async getUpdates(room: number, msgId: number, user: number, req: Request) {
        let messages = await ChatMessageEntity.find({
            where: { chatRoom: room, id: MoreThan(msgId) },
            order: { id: 'ASC' },
        });
        let reader = (await ChatUserEntity.findOne(user)) as ChatUserEntity;

        let array: any;
        let now = new Date();

        messages.forEach(async (m) => {
            if (reader.id != m.sender.id) {
                let read = {
                    id: user,
                    readAt: new Date(
                        now.getTime() - now.getTimezoneOffset() * 60000
                    ).toISOString(),
                };
                if (m.read == null) {
                    array = [];
                } else {
                    array = m.read;
                }
                array.push(read);
                m.read = array;
                let msg = await m.save();
                let notification = (await ChatNotificationEntity.findOne({
                    where: { user: reader, message: msg },
                })) as ChatNotificationEntity;
                if (notification) {
                    await notification.remove();
                }
            }
        });
        return { messages: messages };
    }
}
