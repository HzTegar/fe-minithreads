/// <reference types="cypress" />

const id = Math.floor(Math.random() * 9000) + 1000;
const user = {
  username: `user${id}`,
  email: `user${id}@test.com`,
  password: 'pass1234',
};

describe('Register', () => {
  it('Form register memiliki semua field yang dibutuhkan', () => {
    cy.visit('/register');
    cy.get('input').should('have.length.gte', 4);
    cy.get('button[type="submit"]').should('contain', 'Register');
  });

  it('Tombol Sign In pada register page mengarah ke /login', () => {
    cy.visit('/register');
    cy.contains('a', 'Sign In').click();
    cy.url().should('include', '/login');
  });

  it('Register berhasil dan diarahkan ke halaman utama', () => {
    cy.visit('/register');
    cy.get('input').eq(0).clear().type(user.username);
    cy.get('input[type="email"]').clear().type(user.email);
    cy.get('input[type="password"]').eq(0).clear().type(user.password);
    cy.get('input[type="password"]').eq(1).clear().type(user.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/register');
  });

  it('Register dengan data duplikat menampilkan error', () => {
    cy.visit('/register');
    cy.get('input').eq(0).clear().type(user.username);
    cy.get('input[type="email"]').clear().type(user.email);
    cy.get('input[type="password"]').eq(0).clear().type(user.password);
    cy.get('input[type="password"]').eq(1).clear().type(user.password);
    cy.get('button[type="submit"]').click();
    cy.get('p[style*="color: rgb(239"]').should('exist');
  });
});
