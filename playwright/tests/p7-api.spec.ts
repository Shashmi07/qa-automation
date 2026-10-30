import { expect, test } from '@playwright/test';

const apiUrl = 'https://jsonplaceholder.typicode.com';

test.describe('P7 JSONPlaceholder API tests', () => {
  test('GET /posts returns 200 and 100 items', async ({ request }) => {
    const response = await request.get(`${apiUrl}/posts`);

    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(posts).toHaveLength(100);
  });

  test('GET /posts/1 returns the expected fields', async ({ request }) => {
    const response = await request.get(`${apiUrl}/posts/1`);

    expect(response.status()).toBe(200);
    await expect(response).toBeOK();

    const post = await response.json();
    expect(post).toEqual({
      userId: 1,
      id: 1,
      title: expect.any(String),
      body: expect.any(String),
    });
  });

  test('POST /posts returns 201 with the submitted data', async ({ request }) => {
    const newPost = {
      title: 'Playwright API practice',
      body: 'Created during P7 API testing',
      userId: 7,
    };

    const response = await request.post(`${apiUrl}/posts`, { data: newPost });

    expect(response.status()).toBe(201);
    await expect(response).toBeOK();
    const createdPost = await response.json();
    expect(createdPost).toMatchObject(newPost);
    expect(createdPost.id).toEqual(expect.any(Number));
  });

  test('GET /posts/99999 returns 404', async ({ request }) => {
    const response = await request.get(`${apiUrl}/posts/99999`);

    expect(response.status()).toBe(404);
  });
});
