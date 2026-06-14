/// <reference types="cypress" />

describe('Moderator Role', () => {
  before(() => {
    cy.visit('/login');
    cy.get('input[type="email"]').clear().type('moderator@minithreads.com');
    cy.get('input[type="password"]').clear().type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });

  it('Navbar — link Reports tersedia', () => {
    cy.visit('/');
    cy.contains('a', 'Reports').should('be.visible');
  });

  it('Reports — daftar laporan dapat diakses', () => {
    cy.visit('/admin/reports');
    cy.contains('h1', 'Reports').should('be.visible');
    cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
      if ($body.find('div[class*="cursor-pointer"]').length > 0) {
        cy.get('div[class*="cursor-pointer"]').first().click({ multiple: true });
        cy.contains('h3', 'Laporan Detail').should('be.visible');
      }
    });
  });

  it('Role — tidak bisa melihat role switcher', () => {
    cy.visit('/users/user_biasa');
    cy.get('main').should('exist');
    cy.contains('Change Role').should('not.exist');
  });
});
