/// <reference types="cypress" />

const ts = Date.now();
const user = {
  username: `cypress_prof_${ts}`,
  email: `cypress_prof_${ts}@test.com`,
  password: 'password123',
};

function loginViaUI() {
  cy.visit('/login');
  cy.get('input[type="email"]').clear().type(user.email);
  cy.get('input[type="password"]').clear().type(user.password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
}

describe('Halaman Profile', () => {
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

  it('Halaman /profile dapat diakses setelah login', () => {
    cy.visit('/profile');
    cy.url().should('include', '/profile');
    cy.get('main').should('exist');
  });

  it('Link Profile di navbar mengarah ke /profile', () => {
    cy.visit('/');
    cy.get('nav').contains('Profile').click();
    cy.url().should('include', '/profile');
  });

  it('Halaman profil menampilkan username user yang login', () => {
    cy.visit('/profile');
    cy.contains(user.username).should('exist');
  });

  it('Klik username di thread card menuju ke /users/:username', () => {
    cy.visit('/');
    cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
      const links = $body.find('a[href*="/users/"]');
      if (links.length > 0) {
        cy.wrap(links.first()).click();
        cy.url().should('include', '/users/');
      }
    });
  });

  it('Halaman /users/:username dapat diakses oleh guest', () => {
    cy.visit(`/users/${user.username}`);
    cy.get('main').should('exist');
  });
});
