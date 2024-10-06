define USAGE
Tool for building a browser extension for Chrome or Firefox
Usage: make [options] [target] ...

Targets:
endef
export USAGE

help: ##		Show this help.
	@echo "$$USAGE" && fgrep -h "##" $(firstword $(MAKEFILE_LIST)) | sed 's/\([^ ]*\).*##\(.*\)/  \1\t\2/g' | fgrep -v 'fgrep'

# web-ext run --firefox=/Applications/Firefox\ Developer\ Edition.app/Contents/MacOS/firefox-bin --start-url "https://localhost:3000/login"

link\:firefox: ## link manifest.json for Firefox
	@cd src && rm manifest.json && ln -s manifest-v2.json manifest.json

link\:chrome: ## link manifest.json for Chrome
	@cd src && rm manifest.json && ln -s manifest-v3.json manifest.json

build: ## create bundle for an extension
	@web-ext build -s src -a build

sign: ## sign an extension for Firefox
	@web-ext sign -s src --api-key=$AMO_JWT_ISSUER --api-secret=$AMO_JWT_SECRET -a build

firefox: ## build for Firefox
	@make link:firefox sign build
chrome: ## build for Chrome
	@make link:chrome build

.PHONY: build
