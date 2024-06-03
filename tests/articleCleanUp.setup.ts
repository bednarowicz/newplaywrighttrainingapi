import { expect, request } from '@playwright/test';
import { test as setup } from '@playwright/test';
import tags from '../test-data/tags.json'

setup('Deletion of article', async ({ request }) => {

    const deleteRequest = await request.delete('https://conduit-api.bondaracademy.com/api/articles/' + process.env.SLUGID)
    expect(deleteRequest.status()).toEqual(204)

})
