/// <reference types="cypress" />

const randId = Math.floor(Math.random() * 9000) + 1000;
const testUser = {
  username: `reportuser${randId}`,
  email: `reportuser${randId}@test.com`,
  password: 'password123',
};

describe('Reports Feature (Admin & User)', () => {
  before(() => {
    // Register standard user dynamically
    cy.request('POST', 'http://localhost:8000/api/auth/register', {
      username: testUser.username,
      email: testUser.email,
      password: testUser.password,
      password_confirmation: testUser.password,
    });
  });

  it('Standard user should be able to report a thread/post', () => {
    // 1. Login as user
    cy.visit('/login');
    cy.get('input[type="email"]').clear().type(testUser.email);
    cy.get('input[type="password"]').clear().type(testUser.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');

    // 2. Go to home and click first thread
    cy.visit('/');
    cy.get('a[href^="/thread/"]').first().click();
    cy.url().should('include', '/thread/');

    // 3. Find and click Report button
    cy.contains('button', 'Report').should('be.visible').click();

    // 4. Report Modal should be visible
    cy.contains('h2', 'Laporkan Postingan/Thread').should('be.visible');
    cy.get('input[type="radio"]').first().check();
    cy.get('textarea[placeholder*="detail tambahan"]').type('Laporan otomatis oleh Cypress.');
    cy.contains('button', 'Kirim Laporan').click();

    // 5. Success message should display
    cy.contains('Laporan kamu berhasil dikirim', { timeout: 10000 }).should('be.visible');
  });

  it('Admin should be able to see reports, filter, and resolve a report', () => {
    // 1. Login as admin
    cy.visit('/login');
    cy.get('input[type="email"]').clear().type('dg@gmail.com');
    cy.get('input[type="password"]').clear().type('123123');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');

    // 2. Click Reports in navbar
    cy.contains('a', 'Reports').should('be.visible').click();
    cy.url().should('include', '/admin/reports');

    // 3. Page title and lists should be visible
    cy.contains('h1', 'Reports').should('be.visible');
    
    // Select first report in the list if available
    cy.get('div[class*="cursor-pointer"]').first().click();

    // 4. Detail panel should load details
    cy.contains('h3', 'Laporan Detail').should('be.visible');
    cy.contains('h4', 'Alasan Laporan').should('be.visible');

    // 5. Fill notes and resolve report
    cy.get('textarea[placeholder*="catatan"]').clear().type('Selesai diproses oleh Admin via Cypress.');
    cy.contains('button', 'Setujui & Selesaikan').click();

    // 6. Success notification should show up
    cy.contains('Status laporan berhasil diubah', { timeout: 10000 }).should('be.visible');
  });

  it('Standard user cannot access /admin/reports and is redirected', () => {
    // 1. Login as standard user
    cy.visit('/login');
    cy.get('input[type="email"]').clear().type(testUser.email);
    cy.get('input[type="password"]').clear().type(testUser.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');

    // 2. Try directly accessing /admin/reports
    cy.visit('/admin/reports');
    cy.url().should('eq', Cypress.config().baseUrl); // Redirected to home
  });
});
