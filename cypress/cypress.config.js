const { defineConfig } = require('cypress')
const {downloadFile} = require('cypress-downloadfile/lib/addPlugin')

module.exports = defineConfig({
  video: true,
  videoCompression: false,
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {downloadFile})
    },
    supportFile: 'support/e2e.js',
    specPattern: 'e2e/*.cy.{js,jsx,ts,tsx}'
  },
  env: {
    host: process.env.OPENSHIFT_HOST || 'https://console-openshift-console.apps.ocp-edge-cluster-0.qe.lab.redhat.com',
    auth: process.env.OPENSHIFT_AUTH || 'https://oauth-openshift.apps.ocp-edge-cluster-0.qe.lab.redhat.com',
    username: process.env.OPENSHIFT_USERNAME || 'kubeadmin',
    password: process.env.OPENSHIFT_PASSWORD || 'kubeadmin',
    image: process.env.QUAY_IMAGE || 'quay.io/sdelacru/flightctl-centos:v1',
    fleetname: process.env.FLEETNAME || 'test-fleet',
    newimage: process.env.NEWIMAGE || 'quay.io/sdelacru/flightctl-centos:v2',
    repository: process.env.REPOSITORY || 'https://github.com/flightctl/flightctl-demos',
    revision: process.env.REVISION || 'main',
    yaml: process.env.YAML || '/demos/basic-nginx-demo/deployment/fleet.yaml',
    newyaml: process.env.NEWYAML || '/demos/quadlet-wordpress-demo/deployment/fleet.yaml',
    repositoryname: process.env.REPOSITORYNAME || 'test-repository',
    resourcename: process.env.RESOURCENAME || 'base/fedora-bootc/deploy/fleet.yaml',
  },
})