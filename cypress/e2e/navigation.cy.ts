/// <reference types="cypress" />

describe('Halaman Publik & Navigasi', () => {
  it('Halaman utama dapat dibuka tanpa login', () => {
    cy.visit('/');
    cy.contains('Top Questions').should('be.visible');
  });

  it('Navbar menampilkan link Login dan Register saat belum login', () => {
    cy.visit('/');
    cy.contains('a', 'Login').should('be.visible');
    cy.contains('a', 'Register').should('be.visible');
  });

  it('Sidebar menampilkan tombol Sign up today saat belum login', () => {
    cy.visit('/');
    cy.contains('a', 'Sign up today').should('be.visible');
  });

  it('Klik logo navigasi ke homepage', () => {
    cy.visit('/search');
    cy.get('nav').find('a').first().click();
    cy.url().should('eq', Cypress.config().baseUrl);
  });

  it('Klik link Home di navbar navigasi ke /', () => {
    cy.visit('/search');
    cy.get('nav').contains('a', 'Home').click();
    cy.url().should('eq', Cypress.config().baseUrl);
  });

  it('Klik link Search di navbar navigasi ke /search', () => {
    cy.visit('/');
    cy.get('nav').contains('a', 'Search').click();
    cy.url().should('include', '/search');
  });

  it('Halaman /login dapat diakses', () => {
    cy.visit('/login');
    cy.get('h2').should('contain', 'Sign in');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
  });

  it('Halaman /register dapat diakses', () => {
    cy.visit('/register');
    cy.get('h2').should('contain', 'Create an account');
    cy.get('button[type="submit"]').should('exist');
  });
});
