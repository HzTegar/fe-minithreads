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

describe('Login & Logout', () => {
  before(() => {
    cy.request('POST', 'http://localhost:8000/api/auth/register', {
      username: user.username,
      email: user.email,
      password: user.password,
      password_confirmation: user.password,
    });
  });

  it('Form login memiliki field email, password, dan tombol submit', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Sign In');
  });

  it('Link Register pada login page mengarah ke /register', () => {
    cy.visit('/login');
    cy.contains('a', 'Register').click();
    cy.url().should('include', '/register');
  });

  it('Login gagal dengan password salah menampilkan error', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(user.email);
    cy.get('input[type="password"]').type('salah1234');
    cy.get('button[type="submit"]').click();
    cy.get('p[style*="color: rgb(239"]').should('exist');
  });

  it('Login berhasil mengarahkan ke halaman utama', () => {
    loginViaUI();
    cy.url().should('eq', Cypress.config().baseUrl);
  });

  it('Setelah login, navbar menampilkan username dan tombol Logout', () => {
    loginViaUI();
    cy.get('nav').should('contain', user.username);
    cy.get('nav').should('contain', 'Logout');
  });

  it('Setelah login, tombol Login dan Register tidak terlihat di navbar', () => {
    loginViaUI();
    cy.get('nav').contains('a', 'Login').should('not.exist');
    cy.get('nav').contains('a', 'Register').should('not.exist');
  });

  it('Logout berhasil mengarahkan ke /login', () => {
    loginViaUI();
    cy.get('nav').contains('Logout').click();
    cy.url().should('include', '/login');
  });

  it('Setelah logout, navbar kembali menampilkan Login dan Register', () => {
    loginViaUI();
    cy.get('nav').contains('Logout').click();
    cy.visit('/');
    cy.get('nav').contains('a', 'Login').should('be.visible');
  });
});
