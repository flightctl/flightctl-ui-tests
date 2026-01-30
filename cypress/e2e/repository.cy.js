import { repositoriesPage } from '../views/repositoriesPage'

describe('Repository Management', () => {
  beforeEach(() => {
    cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
  })

  /* it('Should create a repository', () => {
    repositoriesPage.createRepository(`${Cypress.env('repository')}`, `${Cypress.env('revision')}`, `${Cypress.env('resource')}`)
  }) */

  it('Should edit a repository', () => {
    repositoriesPage.editRepository(`${Cypress.env('repository')}`)
  })

  /* it('Should delete a repository', () => {
    repositoriesPage.deleteRepository(`${Cypress.env('repository')}`)
  }) */
})
