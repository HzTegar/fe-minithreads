/// <reference types="cypress" />

const ts = Date.now();
const user = {
  username: `user_${ts}`,
  email: `user_${ts}@test.com`,
  password: 'pass1234',
};

function loginViaUI() {
  cy.visit('/login');
  cy.get('input[type="email"]').clear().type(user.email);
  cy.get('input[type="password"]').clear().type(user.password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
}

describe('User Role', () => {
  context('Guest — Tanpa Login', () => {
    it('Halaman publik dan navigasi dapat diakses', () => {
      cy.visit('/');
      cy.contains('Top Questions').should('be.visible');
      cy.contains('a', 'Login').should('be.visible');
      cy.contains('a', 'Register').should('be.visible');

      cy.visit('/search');
      cy.location('pathname').should('eq', '/search');
      cy.get('h1').should('exist');

      cy.visit('/login');
      cy.get('input[type="email"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Sign In');

      cy.visit('/halaman-yang-tidak-ada', { failOnStatusCode: false });
      cy.get('body').should('exist');
    });

    it('Guest dapat melihat detail thread', () => {
      cy.visit('/');
      cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
        const links = $body.find('a[href*="/thread/"]');
        if (links.length > 0) {
          cy.wrap(links.first()).click();
          cy.url().should('include', '/thread/');
          cy.get('h1').should('exist');
          cy.contains('log in').should('be.visible');
        }
      });
    });

    it('Guest dapat mencari thread', () => {
      cy.visit('/search');
      cy.get('h1').should('exist');
      cy.get('input').first().type('test', { delay: 50 });
      cy.wait(1500);
      cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
        const hasResults = $body.text().includes('Showing');
        const noResults = $body.text().includes('No results found');
        expect(hasResults || noResults).to.be.true;
      });
    });
  });

  context('Login — Satu Kali Login', () => {
    before(() => {
      cy.request('POST', 'http://localhost:8000/api/auth/register', {
        username: user.username,
        email: user.email,
        password: user.password,
        password_confirmation: user.password,
      });
      loginViaUI();
    });

    it('Home page — Ask Question dan sidebar tersedia', () => {
      cy.visit('/');
      cy.contains('a', 'Ask Question').should('be.visible');
      cy.get('aside').should('contain', 'Reputation');
    });

    it('Create thread — form tersedia', () => {
      cy.visit('/create-thread');
      cy.get('h1').should('contain', 'Ask a public question');
    });

    it('Thread detail — form komentar muncul', () => {
      cy.visit('/');
      cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
        const links = $body.find('a[href*="/thread/"]');
        if (links.length > 0) {
          cy.wrap(links.first()).click();
          cy.contains('Your Answer').should('be.visible');
        }
      });
    });

    it('Komentar — user hanya bisa edit komentar 1 kali', () => {
      cy.visit('/');
      cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
        const links = $body.find('a[href*="/thread/"]');
        if (links.length > 0) {
          cy.wrap(links.first()).click();
          cy.get('textarea').should('exist').type('Komentar pertama dari user test');
          cy.contains('button', 'Post Your Answer').click();
          cy.wait(1000);
          cy.get('body').then(($b: JQuery<HTMLBodyElement>) => {
            if ($b.find('button[title="Edit"]').length > 0 || $b.text().includes('Edit')) {
              cy.contains('button', 'Edit').first().click();
              cy.get('textarea').last().clear().type('Komentar setelah diedit');
              cy.contains('button', 'Save').click();
              cy.wait(1000);
              cy.contains('button', 'Edit').should('not.exist');
            }
          });
        }
      });
    });

    it('Profile — data diri tampil', () => {
      cy.visit('/profile');
      cy.url().should('include', '/profile');
      cy.get('main').should('exist');
    });

    it('Bookmarks — halaman dapat diakses', () => {
      cy.visit('/bookmarks');
      cy.get('h1').should('contain', 'My Bookmarks');
    });

    it('Notifications — halaman dapat diakses', () => {
      cy.visit('/notifications');
      cy.get('h1').should('contain', 'Notifications');
    });

    it('Redirect — user biasa tidak bisa akses /admin/reports', () => {
      cy.visit('/admin/reports');
      cy.location('pathname', { timeout: 10000 }).should('eq', '/');
    });

    it('Logout — berhasil keluar', () => {
      cy.visit('/');
      cy.get('nav').contains('Logout').click();
      cy.url().should('include', '/login');
    });
  });
});
