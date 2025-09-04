# Cypress testing 
## Installation

For installing the cypress testing tool is needed to have:

1. node.js installed
2. npm or yarn (npm preferred)
3. flightctl installed in openshift deployment (no local testing, only on cluster)

install with:
```
    cd /yourrepopath/flightctl/test/e2e/cypress/
    npm install

## Execution

To run the app in cypress folder you need to run:
```
export OPENSHIFT_PASSWORD="userpass"
export OPENSHIFT_HOST="https://console-openshift-console.apps.ocp-edge-cluster-0.qe.lab.redhat.com"
export NODE_TLS_REJECT_UNAUTHORIZED=0
export OPENSHIFT_AUTH="https://oauth-openshift.apps.ocp-edge-cluster-0.qe.lab.redhat.com"
export FLIGHTCTL_API="https://api.flightctl.apps.ocp-edge-cluster-0.qe.lab.redhat.com"
export OPENSHIFT_TOKEN="token"
export QUAY_IMAGE="quay.io/repository/sdelacru/flightctl-centos:v1"
export OCI_REGISTRY="your_registry"
export QUAY_IMAGE="quay.io/repository/sdelacru/flightctl-centos:v1"
export OCI_IMAGE_TAG=v1
export OPENSHIFT_API="https://api.ocp-edge-cluster-0.qe.lab.redhat.com:6443"
export OCI_IMAGE_REPO=${OCI_REGISTRY}/folder

npx cypress open
```

To load on GUI mode.

If you want to load automaticly you need to run this command

```
export OPENSHIFT_PASSWORD="userpass"
export OPENSHIFT_HOST="https://console-openshift-console.apps.ocp-edge-cluster-0.qe.lab.redhat.com"
export NODE_TLS_REJECT_UNAUTHORIZED=0
export OPENSHIFT_AUTH="https://oauth-openshift.apps.ocp-edge-cluster-0.qe.lab.redhat.com"
export FLIGHTCTL_API="https://api.flightctl.apps.ocp-edge-cluster-0.qe.lab.redhat.com"
export OPENSHIFT_TOKEN="token"
export QUAY_IMAGE="quay.io/repository/sdelacru/flightctl-centos:v1"
export OCI_REGISTRY="your_registry"
export QUAY_IMAGE="quay.io/repository/sdelacru/flightctl-centos:v1"
export OCI_IMAGE_TAG=v1
export OPENSHIFT_API="https://api.ocp-edge-cluster-0.qe.lab.redhat.com:6443"
export OCI_IMAGE_REPO=${OCI_REGISTRY}/folder

cypress run --browser chrome
```

This will run e2e testing on chrome browser for firefox use:

```
cypress run --browser firefox
```

To run automatic testing you can use

```
run-e2e-test.sh chrome/firefox true
```

This will create a centos9 VM and run all the tests in headless mode in the selected browser

If you want to create a VM and not use the run-e2e-test.sh you can go to https://github.com/Samudelacruz77/containers clone the repo and run

```
make-vm.sh
```