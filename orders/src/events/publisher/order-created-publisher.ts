import {OrderCreatedEvent, Publisher, Subjects} from "@alexeytickets/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {

    subject: Subjects.OrderCreated = Subjects.OrderCreated;

}

