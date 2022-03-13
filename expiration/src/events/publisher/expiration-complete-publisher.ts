import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@alexeytickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
