pipeline {
    agent any

    stages {
        stage('Deploy to Render') {
            steps {
                script {
                    // Récupérer la clé API Render depuis les Credentials Jenkins
                    withCredentials([string(credentialsId: 'render-api-key', variable: 'RENDER_API_KEY')]) {
                        sh '''
                        # Installer le CLI Render si ce n'est pas déjà installé
                        if ! command -v render &> /dev/null; then
                            echo "Installing Render CLI..."
                            npm install -g @render/cli
                        fi
                        
                        # Déployer le service via Render CLI
                        echo "Deploying to Render..."
                        render deploy --api-key $RENDER_API_KEY --service srv-cttffghu0jms73bic4h0
                        '''
                    }
                }
            }
        }
    }
}
