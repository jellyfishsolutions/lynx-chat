import BaseEntity from 'lynx-framework/entities/base.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import ChatRoomEntity from './chat-room.entity';
import ChatUserEntity from './chat-user.entity';
import EditableEntity, { map } from 'lynx-admin-ui/editable-entity';
import { AdminUI, AdminField, AdminType } from 'lynx-admin-ui/decorators';

export enum MessageType {
    text = 'text',
    file = 'file',
}

@AdminUI('Chat Messages', {
    relations: ['chatRoom'],
})
@Entity('chatmessages')
export default class ChatMessageEntity
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

    @AdminField({ name: 'Type', type: AdminType.String, readOnly: true })
    @Column()
    type: MessageType;

    @AdminField({ name: 'Testo', type: AdminType.Text, onSummary: true })
    @Column({ type: 'text' })
    text: string;

    @AdminField({
        name: 'Id generato dal client',
        type: AdminType.Id,
        readOnly: true,
        onSummary: true,
    })
    @Column({ nullable: true })
    clientId: string;

    @AdminField({ name: 'Lettura', type: AdminType.Text })
    @Column({ type: 'text', nullable: true })
    _read: any;

    @AdminField({
        name: 'Chat Room',
        type: AdminType.Selection,
        selfType: 'ChatRoomEntity',
        inverseSide: 'messages',
        values: async () => map(await ChatRoomEntity.find()),
    })
    @ManyToOne((type) => ChatRoomEntity, { eager: false })
    chatRoom: ChatRoomEntity;

    @AdminField({
        name: 'Sender',
        type: AdminType.Selection,
        selfType: 'ChatUserEntity',
        onSummary: true,
        values: async () => map(await ChatUserEntity.find()),
    })
    @ManyToOne((type) => ChatUserEntity, { eager: true })
    sender: ChatUserEntity;

    get read(): any {
        return JSON.parse(this._read);
    }

    set read(_read: any) {
        this._read = JSON.stringify(_read);
    }

    static getType(type: string) {
        switch (type) {
            case MessageType.text:
                return MessageType.text;
            case MessageType.file:
                return MessageType.file;
            default:
                return MessageType.text;
        }
    }

    getId() {
        return this.id;
    }
    getLabel(): string {
        return this.text;
    }
}
