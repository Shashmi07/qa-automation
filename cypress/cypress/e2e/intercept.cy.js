describe('Cypress Stub Response', () => {
  it('should replace the server response with custom data', () => {

    cy.intercept('GET', '**/comments/*', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Custom Cypress Comment',
        email: 'test@example.com',
        body: 'This is my custom response.'
      }
    }).as('getComment');

    cy.visit('https://example.cypress.io/commands/network-requests');

    cy.contains('button', 'Get Comment').click();

    cy.wait('@getComment').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);

      expect(interception.response.body.name)
        .to.equal('Custom Cypress Comment');

      cy.log('Custom response received successfully');
    });

  });
});