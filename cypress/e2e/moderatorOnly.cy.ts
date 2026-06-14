describe("MODERATOR TEST", () => {
    
});

it('Moderator Berhasil Test', function() {
    cy.visit('http://localhost:5173')

});

it('moderator', function() {
    cy.visit('http://localhost:5173/')
    
    cy.get('#root a[href="/login"]').click();
    cy.get('#root [name="email"]').click();
    cy.get('#root [name="email"]').type('bt');
    cy.get('#root [name="email"]').type('@gmail.com');
    cy.get('#root [name="password"]').click();
    cy.get('#root [name="password"]').type('123123');
    cy.get('#root button.rounded').click();
    cy.get('#root button.font-semibold').click();
    cy.get('#root [name="name"]').click();
    cy.get('#root [name="name"]').type('Olahraga');
    cy.get('#root button.disabled\\:opacity-50').click();
    cy.get('#root div:nth-child(12) button.hover\\:text-\\[rgb\\(0\\,116\\,204\\)\\] svg path').click();
    cy.get('#root [name="name"]').click();
    cy.get('#root [name="name"]').type('tes');
    cy.get('#root button.disabled\\:opacity-50').click();
    cy.get('#root div:nth-child(12) button.hover\\:text-red-400 svg path').click();
    cy.get('#root button.text-white').click();
    cy.get('#root div.min-w-0').click();
    cy.get('#root input.border').click();
    cy.get('#root input.border').click();
    cy.get('#root p.text-muted-foreground').click();
    cy.get('#root p.text-muted-foreground').click();
    cy.get('#root p.text-muted-foreground').click();
    cy.get('#root p.text-muted-foreground').click();
    cy.get('#root div.bg-accent div.flex-1').click();
    cy.get('#root div.bg-accent').click();
});
