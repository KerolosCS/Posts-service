$MONGODB_URI      = $args[0]
$KAFKA_BROKER     = $args[1]
$KAFKA_API_KEY    = $args[2]
$KAFKA_API_SECRET = $args[3]

$commonEnvVars = "NODE_ENV=production,KAFKA_TOPIC=post-events,MONGODB_URI=$MONGODB_URI,KAFKA_BROKER=$KAFKA_BROKER,KAFKA_API_KEY=$KAFKA_API_KEY,KAFKA_API_SECRET=$KAFKA_API_SECRET"

$projectRoot = Resolve-Path "$PSScriptRoot\..\.."

# Build and push API image
Write-Host "Building API image..."
docker build --no-cache -t gcr.io/posts-service-495401/posts-api "$projectRoot"
docker push gcr.io/posts-service-495401/posts-api

Write-Host "Deploying API Service..."
gcloud run deploy posts-service-api `
  --image gcr.io/posts-service-495401/posts-api `
  --region us-central1 `
  --allow-unauthenticated `
  --set-env-vars $commonEnvVars `
  --port 3000 `
  --memory 1Gi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 10

Write-Host "API Service deployed!"

# Build and push Consumer image
Write-Host "Building Consumer image..."
docker build --no-cache -f "$projectRoot\Dockerfile.consumer" -t gcr.io/posts-service-495401/posts-consumer "$projectRoot"
docker push gcr.io/posts-service-495401/posts-consumer

Write-Host "Deploying Consumer Service..."
gcloud run deploy posts-service-consumer `
  --image gcr.io/posts-service-495401/posts-consumer `
  --region us-central1 `
  --no-allow-unauthenticated `
  --set-env-vars $commonEnvVars `
  --memory 512Mi `
  --cpu 1 `
  --no-cpu-throttling `
  --min-instances 1 `
  --max-instances 3

Write-Host "Consumer Service deployed!"
