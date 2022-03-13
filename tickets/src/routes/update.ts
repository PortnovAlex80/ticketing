import express, { Request, Response} from "express";
import { body} from "express-validator";
import {
    validateRequest,
    NotFoundError,
    requireAuth,
    NotAuthorizredError, BadRequestError
} from "@alexeytickets/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatePublisher} from "../events/publisher/ticket-update-publisher";
import { natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.put('api/tickets/:id', requireAuth,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat( { gt: 0})
            .withMessage('Price must be provided and must be grater than 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
const ticket = await Ticket.findById(req.params.id);

if (!ticket) {
    throw new NotFoundError()
}

if (ticket.orderId) {
    throw new BadRequestError('Cannot edit a reserverd ticket');
}

if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizredError()
}

ticket.set({
title: req.body.title,
    price: req.body.price
});
await ticket.save();
await new TicketUpdatePublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
});

res.send(ticket)

});

export { router as updateTicketRouter }