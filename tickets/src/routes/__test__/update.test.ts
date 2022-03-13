import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import { Ticket } from '../../models/ticket';
import { natsWrapper} from "../../__mocks__/nats-wrapper";

it('404 provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'sdfsd',
            price: 23
        })
        .expect(404);

});


it('retursn a 401 if the  user not auth', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'sdfsd',
            price: 23
        })
        .expect(404);

});


it('retutns a 401 if the user does not own the ticket', async () => {

    const response = await request(app)
        .post('/api/tickets/')
        .set('Cookie', global.signin())
        .send({
            title: 'asdas',
            price: 20
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'asdadds',
            price: 200
        })
        .expect(401)

});


it('returns a 400 if the user provides an invalid title or price', async () => {

    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets/')
        .set('Cookie', cookie)
        .send({
            title: 'asdas',
            price: 20
        });


    request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'aas',
            price: 20
        })
        .expect(400);

    request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'asdas',
            price: -10
        })
        .expect(400);

})


it('updates the ticket provided valid inputs', async () => {

    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets/')
        .set('Cookie', cookie)
        .send({
            title: 'asdas',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(200)

        const ticketResponse = await request(app)
            .get(`/api/tickets/${response.body.id}`)
            .send();

    expect(ticketResponse.body.title).toEqual('new title');
    expect(ticketResponse.body.price).toEqual('100');


})

it('publisher an event', async ()=> {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets/')
        .set('Cookie', cookie)
        .send({
            title: 'asdas',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})


it('rejects updates if the ticket is reserved', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asldkfj',
            price: 20,
        });

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100,
        })
        .expect(400);
});
