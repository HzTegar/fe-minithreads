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

describe('Home Page', () => {
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

  it('Tombol Ask Question muncul setelah login', () => {
    cy.visit('/');
    cy.contains('a', 'Ask Question').should('be.visible');
  });

  it('Sidebar user card menampilkan username setelah login', () => {
    cy.visit('/');
    cy.get('aside').should('contain', user.username);
  });

  it('Sidebar menampilkan Reputation dan Current Rank', () => {
    cy.visit('/');
    cy.get('aside').should('contain', 'Reputation');
    cy.get('aside').should('contain', 'Current Rank');
  });

  it('Sidebar menampilkan Points Guide', () => {
    cy.visit('/');
    cy.contains('Points Guide').should('be.visible');
  });

  it('Klik Ask Question menuju ke /create-thread', () => {
    cy.visit('/');
    cy.contains('a', 'Ask Question').first().click();
    cy.url().should('include', '/create-thread');
  });

  it('Thread card atau pesan kosong tampil di halaman utama', () => {
    cy.visit('/');
    cy.get('body').should(($body) => {
      const hasThreads = $body.find('a[href*="/thread/"]').length > 0;
      const hasNoThreads = $body.text().includes('No threads found');
      expect(hasThreads || hasNoThreads).to.be.true;
    });
  });
});
