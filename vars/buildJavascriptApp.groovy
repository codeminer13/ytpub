def call() {
    node {
        checkout scm

        stage("Install") {
            sh "npm install"
        }

        stage("Test") {
            sh "npm test"
        }

        stage("Deploy") {
            if (config.deploy) {
                sh "npm publish"
            }
        }
    }
}
