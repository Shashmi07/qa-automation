describe('Cypress API Testing - JSONPlaceholder', () => {

  it('GET /posts should return 200 and 100 posts', () => {
    cy.request('GET', 'https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.length(100);
      });
  });

  it('GET /posts/1 should return the correct fields', () => {
    cy.request('GET', 'https://jsonplaceholder.typicode.com/posts/1')
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('id', 1);
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('body');
      });
  });

  it('POST /posts should create a post', () => {
    const newPost = {
      title: 'Cypress API Testing',
      body: 'Learning cy.request',
      userId: 1
    };

    cy.request('POST', 'https://jsonplaceholder.typicode.com/posts', newPost)
      .then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal(newPost.title);
        expect(response.body.body).to.equal(newPost.body);
        expect(response.body.userId).to.equal(newPost.userId);
      });
  });

  it('GET /posts/99999 should return 404', () => {
    cy.request({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/99999',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(404);
    });
  });

});