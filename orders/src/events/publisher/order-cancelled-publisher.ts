import {OrderCancelledEvent, Publisher, Subjects} from "@alexeytickets/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
