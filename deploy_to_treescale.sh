#!/bin/bash

# Push to TreeScale, env vars are found in travis-ci.com as secret env vars.
echo "$DOCKER_PASSWORD" | docker login repo.treescale.com -u "$DOCKER_USERNAME" --password-stdin
docker push repo.treescale.com/devscesjsu/sce-core-backend-dev:staging
docker push repo.treescale.com/devscesjsu/sce-core-frontend-dev:staging
