describe('Home Page E2E Tests', () => {
  context('Desktop layout tests', () => {
    beforeEach(() => {
      // Set desktop screen resolution and visit the page
      cy.viewport(1280, 800);
      cy.visit('/');
    });

    it('should successfully load home page components and search on desktop', () => {
      // Verify main page elements are rendered
      cy.contains('h1', 'Discover your next escape').should('be.visible');
      cy.contains(
        'p',
        'Find exclusive deals on hotels, flights, and car rentals.',
      ).should('be.visible');
      cy.get('.form-card.is-sticky').should('be.visible');

      // Interact with the desktop destination place combobox input
      cy.get('#desktop-search-place')
        .should('be.visible')
        .click()
        .type('Miami');

      // Select "Miami" from the suggestions popover list
      cy.get('[data-slot="combobox-content"]')
        .should('be.visible')
        .contains('Miami')
        .click();

      // Click the search submission button
      cy.get('.search-button').should('be.visible').click();

      // Assert that we successfully navigate to the stays search page with query parameters
      cy.url().should('include', '/stays');
      cy.url().should('include', 'place=Miami');
    });

    it('should handle custom date range selection rules on desktop', () => {
      // Open the dates popover trigger
      cy.get('button[aria-label="Cycle options for Dates"]')
        .should('be.visible')
        .click();

      // Verify the calendar popover content is visible
      cy.get('[data-slot="popover-content"]').should('be.visible');

      // Ensure we have day buttons in the calendar
      cy.get(
        'button[data-day]:not([disabled]):not([aria-disabled="true"])',
      ).should('have.length.greaterThan', 20);

      // Click 1: Select a day (index 10) to set as check-in. Check-out is cleared.
      cy.get('button[data-day]:not([disabled]):not([aria-disabled="true"])')
        .eq(10)
        .click();

      // Check-out should be empty (so display value does not contain range indicator " - ")
      cy.get('button[aria-label="Cycle options for Dates"]')
        .find('.selection-field-value')
        .should('not.contain', ' - ');

      // Click 2 (Before Check-in): Select a day before index 10 (index 5).
      // It should become the new check-in date, keeping check-out empty.
      cy.get('button[data-day]:not([disabled]):not([aria-disabled="true"])')
        .eq(5)
        .click();

      cy.get('button[aria-label="Cycle options for Dates"]')
        .find('.selection-field-value')
        .should('not.contain', ' - ');

      // Click 3 (After Check-in): Select a day after index 5 (index 8).
      // It should set check-out, completing the range.
      cy.get('button[data-day]:not([disabled]):not([aria-disabled="true"])')
        .eq(8)
        .click();

      // Display value should now show a range (" - ")
      cy.get('button[aria-label="Cycle options for Dates"]')
        .find('.selection-field-value')
        .should('contain', ' - ');

      // Click 4 (Reset): Click a new day (index 12).
      // It should reset check-in to index 12, clearing check-out.
      cy.get('button[data-day]:not([disabled]):not([aria-disabled="true"])')
        .eq(12)
        .click();

      cy.get('button[aria-label="Cycle options for Dates"]')
        .find('.selection-field-value')
        .should('not.contain', ' - ');

      // Click outside to close the popover.
      // Since check-out was empty, check-out should automatically default to check-in + 1 day,
      // and display value should automatically show a valid date range.
      cy.contains('h1', 'Discover your next escape').click({ force: true });
      cy.get('[data-slot="popover-content"]').should('not.exist');

      cy.get('button[aria-label="Cycle options for Dates"]')
        .find('.selection-field-value')
        .should('contain', ' - ');
    });
  });

  context('Mobile layout tests', () => {
    beforeEach(() => {
      // Set mobile screen resolution and visit the page
      cy.viewport(375, 812);
      cy.visit('/');
    });

    it('should successfully trigger mobile search trigger and submit search', () => {
      // Verify desktop form card is not visible on mobile view
      cy.get('.form-card.is-sticky').should('not.exist');

      // Tap on the mobile search bar trigger component
      cy.contains('button', 'Where to?').should('be.visible').click();

      // Verify accordion search modal has opened and Where input is visible
      cy.get('#mobile-search-place').should('be.visible').type('Miami');

      // Tap on Miami option in the suggestion list
      cy.contains('button', 'Miami').should('be.visible').click();

      // Submit the search via the bottom sticky footer bar button
      cy.contains('button', 'Search').should('be.visible').click();

      // Assert that we navigate to stays search results page
      cy.url().should('include', '/stays');
      cy.url().should('include', 'place=Miami');
    });
  });
});
