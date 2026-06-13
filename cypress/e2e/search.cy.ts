/// <reference types="cypress" />

describe('Halaman Search', () => {
  it('Halaman search dapat diakses oleh guest', () => {
    cy.visit('/search');
    cy.get('h1').should('contain', 'Search');
    cy.get('input').should('exist');
  });

  it('Placeholder input search tidak kosong', () => {
    cy.visit('/search');
    cy.get('input').should('have.attr', 'placeholder').and('not.be.empty');
  });

  it('Ketik kurang dari 2 karakter menampilkan pesan minimal karakter', () => {
    cy.visit('/search');
    cy.get('input').type('a');
    cy.contains('at least').should('be.visible');
  });

  it('Ketik keyword 2 karakter atau lebih memulai pencarian', () => {
    cy.visit('/search');
    cy.get('input').type('te');
    cy.get('body').should('not.contain', 'Enter at least 2 characters');
  });

  it('Hasil pencarian menampilkan jumlah hasil atau pesan tidak ditemukan', () => {
    cy.visit('/search');
    cy.get('input').type('test');
    cy.wait(1000);
    cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
      if ($body.text().includes('Showing')) {
        cy.contains('Showing').should('be.visible');
      } else {
        cy.contains('No results found').should('be.visible');
      }
    });
  });

  it('Klik thread card dari hasil search mengarah ke /thread/:id', () => {
    cy.visit('/search');
    cy.get('input').type('test');
    cy.wait(1000);
    cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
      if ($body.find('a[href*="/thread/"]').length > 0) {
        cy.get('a[href*="/thread/"]').first().click();
        cy.url().should('include', '/thread/');
      }
    });
  });
});
