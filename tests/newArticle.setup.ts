import { test as setup} from '@playwright/test'
import {  expect } from '@playwright/test'
import user from "../.auth/user.json"

setup('create new article', async ({request}) => {
    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
          "article": { "title": "Likes test article", "description": "This is test tile", "body": "This is test body", "tagList": [] }
        }
      })
      expect(await articleResponse.status()).toEqual(201)
      const response = await articleResponse.json()
      const slugId = response.article.slug
      process.env['SLUGID'] = slugId
})