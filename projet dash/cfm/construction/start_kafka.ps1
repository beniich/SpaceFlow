Write-Host "Starting ReclamTrack Kafka Infrastructure & Microservices..."
docker-compose up -d zookeeper kafka schema-registry kafka-ui auth-service complaints-service teams-service notification-service analytics-service inventory-service
Write-Host "Infrastructure started."
Write-Host "Kafka UI available at http://localhost:8080"
Write-Host "Schema Registry available at http://localhost:8081"
