import { Subjects, Publisher, PaymentCreatedEvent} from "@alexeytickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
