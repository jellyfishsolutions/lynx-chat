import BaseEntity from 'lynx-framework/entities/base.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import User from 'lynx-framework/entities/user.entity';
import ChatRoomEntity from './chat-room.entity';
import EditableEntity from 'lynx-admin-ui/editable-entity';
import { AdminUI, AdminField, AdminType } from 'lynx-admin-ui/decorators';

@AdminUI('Utenti Chat')
@Entity('chatuser')
export default class ChatUserEntity
    extends BaseEntity
    implements EditableEntity {
    @AdminField({
        name: 'Id',
        type: AdminType.Id,
        readOnly: true,
        onSummary: true,
    })
    @PrimaryGeneratedColumn()
    id: number;

    @AdminField({ name: 'Nome', type: AdminType.String, onSummary: true })
    @Column({ default: '' })
    _name: string;

    @AdminField({
        name: 'Utente',
        type: AdminType.Selection,
        values: async () =>
            (await User.find()).map((k) => ({
                key: k.id,
                value: k.firstName + ' ' + k.lastName,
            })),
        onSummary: true,
        uiSettings: { listTemplate: '/chat/admin-ui/user-list' },
    })
    @ManyToOne((type) => User, { eager: true })
    user: User;

    @OneToMany((type) => ChatRoomEntity, (room) => room.users, { eager: false })
    chatRooms: Promise<ChatRoomEntity[]>;

    get name(): string {
        if (this.user) {
            return this.user.nickName;
        }
        return this._name;
    }

    getId() {
        return this.id;
    }

    getLabel(): string {
        return this.name;
    }

    static async createUser(
        nameOrUser: string | User
    ): Promise<ChatUserEntity> {
        let chatUser = new ChatUserEntity();
        if (nameOrUser instanceof User) {
            chatUser.user = nameOrUser;
        } else {
            chatUser._name = nameOrUser;
        }
        return await chatUser.save();
    }
}
