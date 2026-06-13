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

describe('Halaman Bookmarks', () => {
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

  it('Halaman /bookmarks dapat diakses setelah login', () => {
    cy.visit('/bookmarks');
    cy.get('h1').should('contain', 'My Bookmarks');
  });

  it('Link Bookmarks di navbar bekerja', () => {
    cy.visit('/');
    cy.get('nav').contains('a', 'Bookmarks').click();
    cy.url().should('include', '/bookmarks');
  });

  it('Empty state atau daftar bookmark tampil', () => {
    cy.visit('/bookmarks');
    cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
      if ($body.text().includes('No bookmarks yet')) {
        cy.contains('No bookmarks yet').should('be.visible');
        cy.contains('a', 'Explore Threads').should('be.visible');
      } else {
        cy.get('main').should('exist');
      }
    });
  });

  it('Sidebar About Bookmarks tampil', () => {
    cy.visit('/bookmarks');
    cy.contains('About Bookmarks').should('be.visible');
  });

  it('Klik Explore Threads di empty state menuju ke /', () => {
    cy.visit('/bookmarks');
    cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
      if ($body.text().includes('Explore Threads')) {
        cy.contains('a', 'Explore Threads').click();
        cy.url().should('eq', Cypress.config().baseUrl);
      }
    });
  });
});
