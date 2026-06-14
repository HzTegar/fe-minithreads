/// <reference types="cypress" />

describe('Admin Role', () => {
  before(() => {
    cy.visit('/login');
    cy.get('input[type="email"]').clear().type('admin@minithreads.com');
    cy.get('input[type="password"]').clear().type('password123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 8000 }).should('not.include', '/login');
    cy.log('Login OK — admin_super');
  });

  it('Debug — cek localStorage auth state', () => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem('auth_token');
      const userData = win.localStorage.getItem('user_data');
      cy.log('AUTH_TOKEN:', token?.substring(0, 20) + '…');
      cy.log('USER_DATA:', userData);
      expect(token).to.not.be.null;
      if (userData) {
        const user = JSON.parse(userData);
        expect(user.level).to.eq('admin');
      }
    });
  });

  it('Navbar — link Reports tersedia', () => {
    cy.visit('/');
    cy.url().should('not.include', '/login');
    cy.get('main').should('exist');
    cy.contains('a', 'Reports').should('be.visible');
  });

  it('Reports — daftar laporan dapat diakses', () => {
    cy.visit('/admin/reports');
    cy.url().should('not.include', '/login');
    cy.contains('h1', 'Reports').should('be.visible');
  });

  it('Role — melihat role switcher di profile user biasa', () => {
    cy.visit('/users/user_biasa');
    cy.url().should('not.include', '/login');
    cy.get('main').should('exist');
    cy.contains('Change Role').should('be.visible');
  });

  it('Role — mengubah role user_biasa ke moderator lalu balik ke user', () => {
    cy.visit('/users/user_biasa');
    cy.contains('Change Role').should('be.visible');

    cy.get('select').select('moderator');
    cy.contains('button', 'Update Role').click();
    cy.contains('berhasil diubah', { timeout: 10000 }).should('be.visible');

    cy.get('select').select('user');
    cy.contains('button', 'Update Role').click();
    cy.contains('berhasil diubah', { timeout: 10000 }).should('be.visible');
  });

  it('Role — tidak bisa demote diri sendiri', () => {
    cy.visit('/profile');
    cy.contains('Change Role').should('not.exist');
  });
});
