import { test as setup} from '@playwright/test'
import user from "../.auth/user.json"
import fs from 'fs'

const authFile = '.auth/user.json'

setup('authentication', async({page, request}) => {
    // await page.goto('https://conduit.bondaracademy.com/') // for some reasons do not work for new url; worked for http://demo.realworld.io/#/
    // await page.getByText('Sign in').click()
    // await page.getByRole('textbox', { name: 'Email'}).fill('fedorawannabe@cheese.com')
    // await page.getByRole('textbox', { name: 'Password'}).fill('cheese')
    // await page.getByRole('button').click()
    // await page.waitForResponse('')

    // await page.context().storageState({path: authFile})

    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
          "user":{"email":"fedorawannabe@cheese.com","password":"cheese"}
        }
      })
      const responseBody = await response.json()
      // console.log(responseBody.user.token)
      const accessToken = responseBody.user.token
      user.origins[0].localStorage[0].value = accessToken
      fs.writeFileSync(authFile, JSON.stringify(user))

      process.env['ACCESS_TOKEN'] = accessToken
}
)