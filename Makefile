# Makefile for local Backstage Dockerized build and run
# Requires: Docker, GITHUB_TOKEN environment variable

# Variables
# Default to local dev image name. For CI images, override with:
#   IMAGE_NAME=ghcr.io/bcgov/developer-portal make run-demo
IMAGE_NAME ?= backstage
DOCKERFILE := packages/backend/Dockerfile
CONTEXT := .
GITHUB_TOKEN ?= $(shell echo $$GITHUB_TOKEN)

# Default target
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  build-demo    - Build Docker image for local demo"
	@echo "  run-demo      - Run locally with demo config (SQLite in-memory)"
	@echo "  clean         - Remove local Docker images"
	@echo ""
	@echo "Examples:"
	@echo "  GITHUB_TOKEN=ghp_xxx make build-demo"
	@echo "  make run-demo"
	@echo ""
	@echo "Using CI-built image (check your repo name):"
	@echo "  IMAGE_NAME=ghcr.io/$$(git remote get-url origin 2>/dev/null | sed 's/.*github.com[:/]//;s/.git$$//' || echo '<owner>/<repo>') make run-demo"

# Build for demo (local testing)
.PHONY: build-demo
build-demo: check-token
	docker build \
		--build-arg GITHUB_TOKEN=$(GITHUB_TOKEN) \
		--secret id=GITHUB_TOKEN,env=GITHUB_TOKEN \
		-f $(DOCKERFILE) \
		-t $(IMAGE_NAME):demo \
		$(CONTEXT)
	@echo "Built image: $(IMAGE_NAME):demo"

# Run with demo config (SQLite in-memory, guest auth)
# Note: We rename production config to prevent it from being auto-loaded
.PHONY: run-demo
run-demo:
	@echo "Starting Backstage with demo config..."
	@echo "Access at: http://localhost:7007"
	@echo "Login with guest access (no GitHub required)"
	@echo ""
	docker run -it --rm \
		-p 7007:7007 \
		--name backstage-demo \
		--entrypoint sh \
		$(IMAGE_NAME):demo \
		-c "mv app-config.production.yaml app-config.production.yaml.bak 2>/dev/null || true; node packages/backend --config app-config.yaml --config app-config.demo.yaml"

# Clean up local images
.PHONY: clean
clean:
	docker rmi -f $(IMAGE_NAME):demo $(IMAGE_NAME):latest 2>/dev/null || true
	@echo "Cleaned up local images"

# Check for required GITHUB_TOKEN
.PHONY: check-token
check-token:
	@if [ -z "$(GITHUB_TOKEN)" ]; then \
		echo "Error: GITHUB_TOKEN is required for build"; \
		echo "Set it as an environment variable: export GITHUB_TOKEN=ghp_xxx"; \
		echo "Or pass it: GITHUB_TOKEN=ghp_xxx make build-demo"; \
		exit 1; \
	fi
