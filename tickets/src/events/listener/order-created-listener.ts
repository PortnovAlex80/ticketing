import {Message} from 'node-nats-streaming';
import {Listener, OrderCreatedEvent, Subjects} from '@alexeytickets/common';
import {queueGroupName} from './queue-group-name';
import {Ticket} from "../../models/ticket";
import {TicketUpdatePublisher} from "../publisher/ticket-update-publisher";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // reach .. find the ticket///
        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error('Ticket not found')
        }

        ticket.set({orderId: data.id})

        await ticket.save();
        new TicketUpdatePublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });

        msg.ack()
    }
}
