import { downloadsPage } from '../views/downloadsPage'

describe('Downloads Management', () => {
  beforeEach(() => {
    cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
  })

  it.skip('Should download flightctl CLI for Windows ARM 64', () => {
    downloadsPage.downloadCliFile('Windows', 'ARM 64')
  })

  it.skip('Should download flightctl CLI for Windows x86_64', () => {
    downloadsPage.downloadCliFile('Windows', 'x86_64')
  })

  it.skip('Should download flightctl CLI for Linux ARM 64', () => {
    downloadsPage.downloadCliFile('Linux', 'ARM 64')
  })

  it.skip('Should download flightctl CLI for Linux x86_64', () => {
    downloadsPage.downloadCliFile('Linux', 'x86_64')
  })

  it.skip('Should download flightctl CLI for macOS ARM 64', () => {
    downloadsPage.downloadCliFile('Mac', 'ARM 64')
  })

  it.skip('Should download flightctl CLI for macOS x86_64', () => {
    downloadsPage.downloadCliFile('Mac', 'x86_64')
  })
})