/// <reference types="cypress" />

const id = Math.floor(Math.random() * 9000) + 1000;
const user = {
  username: `user${id}`,
  email: `user${id}@test.com`,
  password: 'pass1234',
};

function loginViaUI() {
  cy.visit('/login');
  cy.get('input[type="email"]').clear().type(user.email);
  cy.get('input[type="password"]').clear().type(user.password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
}

describe('Buat Thread Baru', () => {
  before(() => {
    cy.request('POST', 'http://localhost:8000/api/auth/register', {
      username: user.username,
      email: user.email,
      password: user.password,
      password_confirmation: user.password,
    });
  });

  beforeEach(() => {
    loginViaUI();
  });

  it('Halaman /create-thread dapat diakses setelah login', () => {
    cy.visit('/create-thread');
    cy.get('h1').should('contain', 'Ask a public question');
  });

  it('Form create thread memiliki input dan textarea', () => {
    cy.visit('/create-thread');
    cy.get('input, textarea').should('have.length.gte', 2);
  });

  it('Sidebar panduan Step 1 tampil', () => {
    cy.visit('/create-thread');
    cy.contains('Step 1: Draft your question').should('be.visible');
  });

  it('Tombol submit ada di form', () => {
    cy.visit('/create-thread');
    cy.get('button[type="submit"]').should('exist');
  });
});
