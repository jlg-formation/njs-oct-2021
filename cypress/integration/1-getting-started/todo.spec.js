describe('example to-do app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('display a header with Gestion Stock', () => {
    cy.get('header span').contains('Gestion stock');
  });

  it('display the list of articles', () => {
    cy.get('button').click();
  });
});
