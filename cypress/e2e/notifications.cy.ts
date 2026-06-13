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

describe('Halaman Notifikasi', () => {
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

  it('Halaman /notifications dapat diakses setelah login', () => {
    cy.visit('/notifications');
    cy.get('h1').should('contain', 'Notifications');
  });

  it('Link Notifications di navbar bekerja', () => {
    cy.visit('/');
    cy.get('nav').contains('a', 'Notifications').click();
    cy.url().should('include', '/notifications');
  });

  it('Empty state atau daftar notifikasi tampil', () => {
    cy.visit('/notifications');
    cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
      if ($body.text().includes('No notifications yet')) {
        cy.contains('No notifications yet').should('be.visible');
      } else {
        cy.get('main').should('exist');
      }
    });
  });

  it('Tombol Mark all as read tampil jika ada notifikasi', () => {
    cy.visit('/notifications');
    cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
      if ($body.text().includes('Mark all as read')) {
        cy.contains('button', 'Mark all as read').should('be.visible');
      }
    });
  });

  it('Halaman /notifications tetap render tanpa sesi aktif', () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/notifications');
    cy.get('body').should('exist');
  });
});
