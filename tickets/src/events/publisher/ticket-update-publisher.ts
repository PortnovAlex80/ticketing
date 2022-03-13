import {Publisher, Subjects, TicketUpdatedEvent} from "@alexeytickets/common";

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

