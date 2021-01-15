import BaseEntity from "lynx-framework/entities/base.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import ChatUserEntity from "./chat-user.entity";
import ChatMessageEntity from "./chat-message.entity";
import ChatRoomEntity from "./chat-room.entity";

@Entity("chatnotifications")
export default class ChatNotificationEntity extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @ManyToOne(type => ChatRoomEntity, { eager: true })
    room: ChatRoomEntity;

    @ManyToOne(type => ChatMessageEntity, { eager: true })
    message: ChatMessageEntity;

    @ManyToOne(type => ChatUserEntity, { eager: true })
    user: ChatUserEntity;

}