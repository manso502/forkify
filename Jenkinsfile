node {
def img
def url = 'https://785345357562.dkr.ecr.eu-west-1.amazonaws.com/web-app'
  try {

    stage ('Checkout') {
      checkout scm
    }

    stage ('Build Docker Image'){
    img = docker.build('web-app')
    }

    stage ('Push image to ECR'){
    docker.withRegistry(url, 'ecr:eu-west-1:product-ops-credentials') {
    img.push(env.BUILD_NUMBER)
    }
    }

    stage ('Trigger deploy'){
         build job: 'acme-deployment', parameters: [string(name: 'ENV_PARAM', value: env.BUILD_NUMBER)]
     }
  }
  catch(err) {
  currentBuild.result = 'FAILED'
  println(err.toString())
  println(err.getMessage())

} finally {
  stage('Clean Up'){
    cleanWs()
  }
}
}

