import { request, expect } from "@playwright/test"

async function globalTeardown() {
    const context = await request.newContext()

    const deleteRequest = await context.delete('https://conduit-api.bondaracademy.com/api/articles/' + process.env.SLUGID,{
    headers: {
        Authorization: 'Token ' + process.env.ACCESS_TOKEN
    }})
    expect(deleteRequest.status()).toEqual(204)
    console.log('TEardown run')
}

export default globalTeardown;