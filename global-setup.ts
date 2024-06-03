import { request, expect } from "@playwright/test"
import user from '../pwapitests/.auth/user.json'
import fs from 'fs'



async function globalSetup() {
    const authFile = '.auth/user.json'
    const context = await request.newContext()

    const responseToken = await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
          "user":{"email":"fedorawannabe@cheese.com","password":"cheese"}
        }
      })
      const responseBody = await responseToken.json()
      // console.log(responseBody.user.token)
      const accessToken = responseBody.user.token
      user.origins[0].localStorage[0].value = accessToken
      fs.writeFileSync(authFile, JSON.stringify(user))
      process.env['ACCESS_TOKEN'] = accessToken

    const articleResponse = await context.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
          "article": { "title": "Global Likes test article", "description": "This is test tile", "body": "This is test body", "tagList": [] }
        },
        headers: {
            Authorization: 'Token ' + process.env.ACCESS_TOKEN
        }
      })
      expect(await articleResponse.status()).toEqual(201)
      const response = await articleResponse.json()
      const slugId = response.article.slug
      process.env['SLUGID'] = slugId
}

export default globalSetup;