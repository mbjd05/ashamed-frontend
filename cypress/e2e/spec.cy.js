function selectLast7Days() {
  cy.get('[data-cy="date-range-picker"]')
      .find('button')
      .eq(1)
      .click();

  cy.get('[role="listbox"]')
      .contains('Last 7 days')
      .click();
}

function fetchData() {
  cy.get('[data-cy="data-fetch"]')
      .click();
}

function ensureDataTableHasRows() {
  cy.get('[data-cy="data-table"]')
      .should('exist')
      .find('tbody tr')
      .should('have.length.greaterThan', 0);
}

describe('History View Tests', () => {
  beforeEach(() => {
    cy.visit('/historyview');
    selectLast7Days();
    fetchData();
  });

  it('measurements load when date range selected', () => {
    ensureDataTableHasRows();
  });

  it('snapshot creation succeeds', () => {
    cy.get('[data-cy="snapshot-create"]')
        .should('exist')
        .click();
    
    cy.get('[data-cy="snapshot-title"]')
        .type('Cypress Snapshot Title');
    
    cy.get('[data-cy="snapshot-description"]')
        .find('[contenteditable="true"]')  
        .click()
        .type('This snapshot was created by Cypress!');
    
    cy.get('[data-cy="snapshot-save"]')
        .click();
    
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.contains('Snapshot created successfully');
    });
  });
});
