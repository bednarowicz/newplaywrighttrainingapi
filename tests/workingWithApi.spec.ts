import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'

/*
fedorawannabe
fedorawannabe@cheese.com
cheese
*/

test.beforeEach(async ({ page }) => {
  await page.route('*/**/api/tags', async route => { // for some reasons do not work for new url; worked for https://conduit.productionready.io/api/tags
    await route.fulfill({ body: JSON.stringify(tags) })
  })

  await page.goto('https://conduit.bondaracademy.com/') // for some reasons do not work for new url; worked for http://demo.realworld.io/#/

})

test('has title', async ({ page }) => {
  await page.route('*/**/api/articles?limit=10&offset=0', async route => {
    const response = await route.fetch()
    const reponseBody = await response.json()
    reponseBody.articles[0].title = 'This is MOCK test title'
    reponseBody.articles[0].description = 'This is MOCK test description'

    route.fulfill({
      body: JSON.stringify(reponseBody)
    })
  })
  await page.getByText('Global Feed').click()
  await expect(page.locator('.navbar-brand')).toHaveText('conduit')
  await expect(page.locator('app-article-list h1').first()).toContainText('This is MOCK test title')
  await expect(page.locator('app-article-list p').first()).toContainText('This is MOCK test description')
})

test('delete article', async ({ page, request }) => {
  // const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  //   data: {
  //     "user":{"email":"fedorawannabe@cheese.com","password":"cheese"}
  //   }
  // })
  // const responseBody = await response.json()
  // // console.log(responseBody.user.token)
  // const accessToken = responseBody.user.token

  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": { "title": "This is test ttile", "description": "This is test tile", "body": "This is test body", "tagList": [] }
    }
    // ,
    // headers: {
    //   Authorization: `Token ${accessToken}`
    // }
  })
  expect(articleResponse.status()).toEqual(201)
  await page.getByText('Global feed').click()
  await page.getByText('This is test ttile').click()
  await page.getByRole('button', { name: 'Delete Article' }).first().click()
  await expect(page.locator('app-article-list h1').first()).not.toContainText('This is test ttile')
})

test('Create article', async ({ page, request }) => {
  await page.getByText('New Article').click()
  await page.getByRole('textbox', { name: 'Article title' }).fill('Playwright is awesome')
  await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill('about the playwright')
  await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('We like to use playwright')
  await page.getByRole('button', { name: 'publish article' }).click()
  const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
  const articleResponseBody = await articleResponse.json()
  const slugId = articleResponseBody.article.slug

  await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome')
  await page.getByText('Home').click()
  await page.getByText('Global Feed').click()

  await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome')

  // const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  //   data: {
  //     "user":{"email":"fedorawannabe@cheese.com","password":"cheese"}
  //   }
  // })
  // const responseBody = await response.json()
  // console.log(responseBody.user.token)
  // const accessToken = responseBody.user.token

  const deleteRequest = await request.delete('https://conduit-api.bondaracademy.com/api/articles/' + slugId
    // ,{
    // headers: {
    //   Authorization: `Token ${accessToken}`
    // }} 
  )
  expect(deleteRequest.status()).toEqual(204)
})
