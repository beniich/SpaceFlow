Write-Host "Stopping ReclamTrack Kafka Infrastructure..."
docker-compose stop zookeeper kafka schema-registry kafka-ui
Write-Host "Infrastructure stopped."
