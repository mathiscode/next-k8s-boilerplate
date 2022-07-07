import mongoose from 'mongoose'
import request from 'supertest'
import { getTokenCookie } from '@next-k8s/common'
import app from '../../app'
import Order from '../../models/order'
import natsClient from '../../nats-client'

describe('[Create New Order] Route: /api/orders', () => {
  it('should be a valid route', async () => {
    const response = await request(app).post('/api/orders').send({})
    expect(response.status).not.toEqual(404)
  })

  it('should throw UnauthorizedError if unauthenticated', async () => {
    const response = await request(app).post('/api/orders').send({})
    expect(response.status).toEqual(401)
  })

  it('should not get UnauthorizedError if authenticated', async () => {
    const cookie = await getTokenCookie()
    const response = await request(app)
      .post('/api/orders')
      .set('Cookie', [cookie])
      .send({})

    expect(response.status).not.toEqual(401)
  })

  it('should throw NotFoundError if ticket is not found', async () => {
    const cookie = await getTokenCookie()
    const id = new mongoose.Types.ObjectId()

    await request(app)
      .post('/api/orders')
      .set('Cookie', [cookie])
  })

  it('should throw BadRequestError if new order has invalid ticketId', async () => {
    const cookie = await getTokenCookie()
    await request(app)
      .post('/api/orders')
      .set('Cookie', [cookie])
      .send({ ticketId: 'notarealid' })
      .expect(400)
  })

  it('should create a new order', async () => {

  })

  it('should publish an order:created event', async () => {

  })
})
