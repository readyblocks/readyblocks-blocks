import crypto from 'crypto'

import supertest from 'supertest'
import chai from 'chai'
import sinon from 'sinon'
import { beforeEach, afterEach, describe, it } from 'mocha'

import { server } from './index.js'

const should = chai.should()

const request = supertest(server)

let clock

// Configure timers and server hangups
beforeEach(() => {
  clock = sinon.useFakeTimers()
})

afterEach(() => {
  server.close()
  clock.restore()
})

// Check headers and body tags
describe('Requests', () => {
  it('Returns timestamps that update properly', async () => {
    clock.tick(0)
    let response = await request.get('/ping')
    response.statusCode.should.be.a('number').and.be.equal(200)
    should.exist(response.body)
    should.exist(response.body.received)
    response.body.received.should.be.a('number').and.be.equal(0)

    clock.tick(100)
    response = await request.get('/ping')
    response.statusCode.should.be.a('number').and.be.equal(200)
    should.exist(response.body)
    should.exist(response.body.received)
    response.body.received.should.be.a('number').and.be.equal(100)
  })

  it('Provides a valid integrity checksum', async () => {
    const response = await request.get('/ping')
    response.statusCode.should.be.a('number').and.be.equal(200)
    should.exist(response.body)
    should.exist(response.headers['x-integrity'])

    let hash = crypto.createHash('sha1')
    hash.update(JSON.stringify(response.body))

    response.headers['x-integrity'].should.be.a('string').and.be.equal(hash.digest('hex'))
  })
})

describe('Routes', () => {
  it('Responds to status checks', async () => {
    const response = await request.get('/ping')
    response.statusCode.should.be.a('number').and.be.equal(200)
    should.exist(response.body)
    should.exist(response.body.ping)
    response.body.ping.should.be.a('string').and.be.equal('pong')
  })

  it('Responds to invalid paths', async () => {
    const response = await request.get('/foo/bar')
    response.statusCode.should.be.a('number').and.be.equal(404)
    should.exist(response.body)
    should.exist(response.body.received)
    should.exist(response.headers['x-integrity'])

    let hash = crypto.createHash('sha1')
    hash.update(JSON.stringify(response.body))

    response.headers['x-integrity'].should.be.a('string').and.be.equal(hash.digest('hex'))
  })
})
