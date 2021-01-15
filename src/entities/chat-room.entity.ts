import BaseEntity from 'lynx-framework/entities/base.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import ChatMessageEntity from './chat-message.entity';
import ChatUserEntity from './chat-user.entity';
import {
    AdminUI,
    AdminField,
    AdminType,
    QueryParams,
} from 'lynx-admin-ui/decorators';
import Request from 'lynx-framework/request';
import EditableEntity from 'lynx-admin-ui/editable-entity';

async function fetchMessages(
    req: Request,
    entity: ChatRoomEntity,
    params: QueryParams
): Promise<[any[], number]> {
    return await ChatMessageEntity.findAndCount({
        where: {
            chatRoom: entity,
        },
        take: params.take,
        skip: params.skip,
        order: params.order,
    });
}

async function fetchUsers(
    req: Request,
    entity: ChatRoomEntity,
    params: QueryParams
): Promise<[any[], number]> {
    if (!entity.users) {
        return [[], 0];
    }
    return [entity.users, entity.users.length];
}

@AdminUI('Chat Rooms')
@Entity('chatrooms')
export default class ChatRoomEntity
    extends BaseEntity
    implements EditableEntity {
    @AdminField({
        name: 'Id',
        type: AdminType.Id,
        readOnly: true,
        onSummary: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @AdminField({ name: 'Nome chat', type: AdminType.String, onSummary: true })
    @Column()
    name: string;

    @AdminField({
        name: 'Utenti',
        type: AdminType.Table,
        selfType: 'ChatUserEntity',
        query: fetchUsers,
    })
    @ManyToMany((type) => ChatUserEntity, (user) => null, { eager: true })
    @JoinTable()
    users: ChatUserEntity[];

    @AdminField({
        name: 'Messaggi',
        type: AdminType.Table,
        selfType: 'ChatMessageEntity',
        query: fetchMessages,
    })
    @OneToMany((type) => ChatMessageEntity, (message) => message.chatRoom)
    messages: Promise<ChatMessageEntity[]>;

    getId() {
        return this.id;
    }

    getLabel(): string {
        return this.name;
    }

    static async createRoom(
        name: string,
        users: ChatUserEntity[]
    ): Promise<ChatRoomEntity> {
        let room = new ChatRoomEntity();
        room.name = name;
        room.users = users;
        return await room.save();
    }
}
