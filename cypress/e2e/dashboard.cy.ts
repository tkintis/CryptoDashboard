describe('Dashboard Page', () => {

  it('should display logo, table and chart', () => {
    cy.intercept('GET', '/api/v3/coins/*').as('apiCall');
    cy.visit('/');

    cy.wait('@apiCall');
    cy.wait(2000);

    cy.get('#logo').should('be.visible'); // check logo visibility

    cy.get('#crypto-table').should('be.visible'); // check table visibility
    cy.get('#crypto-table tbody tr').should('have.length.greaterThan', 0);

    cy.get('#crypto-chart').should('be.visible'); // check chart visibility

    //#region test global search 
    cy.get('input[placeholder="Search Table"]').type('Bitcoin'); // Search for Bitcoin
    cy.get('table tbody tr').should('have.length', 1); // Only one result expected
    cy.get('table tbody tr').first().contains('Bitcoin'); // Verify the result
    cy.get('#clear-icon').click(); // reset search
    //#endregion

    //#region navigate next page
    cy.get('.mat-mdc-paginator-navigation-next').click();
    cy.wait('@apiCall');
    cy.wait(5000);

    cy.get('#crypto-table').should('be.visible'); // check table visibility
    cy.get('#crypto-table tbody tr').should('have.length.greaterThan', 0);

    cy.get('#crypto-chart').should('be.visible'); // check chart visibility
    //#endregion

    //#region check currency change
    cy.get('#eur').click();
    cy.wait('@apiCall');
    cy.wait(5000);

    cy.get('#crypto-table').contains('€'); // check table cointains eur symbol
    //#endregion

    //#region check error handling
    cy.get('.mat-mdc-paginator-navigation-next').click();
    cy.get('.mat-mdc-paginator-navigation-next').click();
    cy.wait('@apiCall');
    cy.wait(1000);
    cy.get('simple-snack-bar').should('be.visible'); // check visibility of notification message
    //#endregion
  });

});