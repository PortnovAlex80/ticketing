import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";

it('404', async function () {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404)
});

it('should is found', async function () {
    const title = 'concert';
    const price = 20;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title, price
        })
        .expect(201);

    const ticketRespons = await request(app)
        .get(`/api/ticket/${response.body.id}`)
        .send()
        .expect(200)

    expect(ticketRespons.body.title).toEqual(title);
    expect(ticketRespons.body.price).toEqual(price)
});