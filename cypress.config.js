const { defineConfig } = require('cypress')
const fs = require('fs')

module.exports = defineConfig({
  video: true,
  videoCompression: true,
  e2e: {
    setupNodeEvents(on, config) {
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === 'failed')
          )
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            fs.unlinkSync(results.video)
          }
        }
      })
    },
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/*.cy.{js,jsx,ts,tsx}'
  },
  env: {
    host: process.env.OPENSHIFT_HOST || 'https://console-openshift-console.apps.ocp-edge-cluster-0.qe.lab.redhat.com',
    auth: process.env.OPENSHIFT_AUTH || 'https://oauth-openshift.apps.ocp-edge-cluster-0.qe.lab.redhat.com',
    username: process.env.OPENSHIFT_USERNAME || 'kubeadmin',
    password: process.env.OPENSHIFT_PASSWORD || 'kubeadmin'
  },
})