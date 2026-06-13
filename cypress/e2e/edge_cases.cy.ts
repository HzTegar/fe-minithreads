/// <reference types="cypress" />

const ts = Date.now();
const user = {
  username: `cypress_edge_${ts}`,
  email: `cypress_edge_${ts}@test.com`,
  password: 'password123',
};

function loginViaUI() {
  cy.visit('/login');
  cy.get('input[type="email"]').clear().type(user.email);
  cy.get('input[type="password"]').clear().type(user.password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
}

describe('Edge Case & Validasi UI', () => {
  before(() => {
    cy.request('POST', 'http://localhost:8000/api/auth/register', {
      username: user.username,
      email: user.email,
      password: user.password,
      password_confirmation: user.password,
    });
  });

  it('Route tidak dikenal tidak crash', () => {
    cy.visit('/halaman-yang-tidak-ada', { failOnStatusCode: false });
    cy.get('body').should('exist');
  });

  it('Login form tidak bisa disubmit dengan field kosong', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/login');
  });

  it('Register form tidak bisa disubmit dengan field kosong', () => {
    cy.visit('/register');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/register');
  });

  it('Setelah login, user bisa navigasi antar halaman tanpa error', () => {
    loginViaUI();
    cy.visit('/');
    cy.visit('/search');
    cy.visit('/bookmarks');
    cy.visit('/notifications');
    cy.visit('/profile');
    cy.get('main').should('exist');
  });

  it('Refresh halaman setelah login tetap mempertahankan sesi', () => {
    loginViaUI();
    cy.visit('/');
    cy.reload();
    cy.get('nav').should('contain', user.username);
  });
});
