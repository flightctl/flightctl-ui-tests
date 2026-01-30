require('cypress-downloadfile/lib/downloadFileCommand')


Cypress.Commands.add('login', (url=`${Cypress.env('host')}`, auth=`${Cypress.env('auth')}`, user=`${Cypress.env('username')}`, password=`${Cypress.env('password')}`) => {
    cy.visit(url)
    cy.origin(auth, { args: { username: user, password: password } }, ({ username, password }) => {
        cy.get(':nth-child(1) > .pf-c-button', { timeout: 60000 })
        cy.contains('kube:admin').click()
        cy.get('#inputUsername').should('exist')
        cy.get('#inputUsername').should('be.visible')
        cy.get('#inputPassword').should('exist')
        cy.get('#inputPassword').should('be.visible')
        cy.get('#inputUsername').type(username)
        cy.get('#inputPassword').type(password)
        cy.get('#inputUsername').should('have.value', username)
        cy.get('#inputPassword').should('have.value', password)
        cy.contains('button', 'Log in').click()
      })
    cy.get('.pf-v5-c-modal-box__close > .pf-v5-c-button', { timeout: 60000 })
    cy.get('.pf-v5-c-modal-box__close > .pf-v5-c-button').should('be.visible')
    cy.get('.pf-v5-c-modal-box__close > .pf-v5-c-button').click()
    cy.url().should('include', `${Cypress.env('host')}`)
    //cy.get('[data-test-id="cluster-dropdown-toggle"]', { timeout: 30000 }).should('be.visible').click()
    //cy.get('button.pf-v5-c-menu__item').contains('All Clusters').click()
})

Cypress.Commands.add('downloadClifile', (platform = `${Cypress.env('platform')}`, arch = `${Cypress.env('arch')}`) => {
    let filename
    if (platform === 'Windows') {
        if (arch === 'ARM 64') {
            filename = `${platform}-flightctl-arm64.zip`;
        } else {
            filename = `${platform}-flightctl-x86_64.zip`;
        }
    } else {
        filename = `${platform}-${arch}-flightctl.tar.gz`;
    }
    cy.get('[data-test="help-dropdown-toggle"]').click().should('be.visible')
    cy.contains('Command Line Tools').click()
    cy.log(`Download flightctl for ${platform} for ${arch}`)
    cy.get('.co-external-link').contains(`Download flightctl for ${platform} for ${arch}`)
            .should('have.attr', 'href').then((href) => {
                cy.downloadFile(`${href}`, 'downloads', filename);
            })
    let fullpath = `downloads/${filename}`
    cy.log(`Downloaded file: ${fullpath}`)
    cy.readFile(fullpath).should('exist')
})