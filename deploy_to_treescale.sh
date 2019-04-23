#!/bin/bash

echo "Logging in to TreeScale" | docker login repo.treescale.com -u "$DOCKER_USERNAME" --password "$DOCKER_PASSWORD"
docker push repo.treescale.com/devscesjsu/sce-core-backend-dev:staging
docker push repo.treescale.com/devscesjsu/sce-core-frontend-dev:staging
