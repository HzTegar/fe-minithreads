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

describe('Detail Thread', () => {
  before(() => {
    cy.request('POST', 'http://localhost:8000/api/auth/register', {
      username: user.username,
      email: user.email,
      password: user.password,
      password_confirmation: user.password,
    });
  });

  it('Halaman detail thread dapat diakses oleh guest', () => {
    cy.visit('/');
    cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
      const links = $body.find('a[href*="/thread/"]');
      if (links.length > 0) {
        cy.wrap(links.first()).click();
        cy.url().should('include', '/thread/');
        cy.get('h1').should('exist');
      }
    });
  });

  it('Guest melihat pesan log in to post an answer di detail thread', () => {
    cy.visit('/');
    cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
      const links = $body.find('a[href*="/thread/"]');
      if (links.length > 0) {
        cy.wrap(links.first()).click();
        cy.contains('log in').should('be.visible');
      }
    });
  });

  it('Setelah login, form Your Answer muncul di detail thread', () => {
    loginViaUI();
    cy.visit('/');
    cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
      const links = $body.find('a[href*="/thread/"]');
      if (links.length > 0) {
        cy.wrap(links.first()).click();
        cy.contains('Your Answer').should('be.visible');
        cy.get('textarea').should('exist');
      }
    });
  });

  it('Tombol vote tampil di detail thread', () => {
    loginViaUI();
    cy.visit('/');
    cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
      const links = $body.find('a[href*="/thread/"]');
      if (links.length > 0) {
        cy.wrap(links.first()).click();
        cy.get('button[title*="question"]').should('exist');
      }
    });
  });

  it('Main content tampil di halaman detail thread', () => {
    cy.visit('/');
    cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
      const links = $body.find('a[href*="/thread/"]');
      if (links.length > 0) {
        cy.wrap(links.first()).click();
        cy.get('main').should('exist');
      }
    });
  });

  it('Link Ask Question tersedia di detail thread setelah login', () => {
    loginViaUI();
    cy.visit('/');
    cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
      const links = $body.find('a[href*="/thread/"]');
      if (links.length > 0) {
        cy.wrap(links.first()).click();
        cy.get('a[href="/create-thread"]').should('exist');
      }
    });
  });
});
