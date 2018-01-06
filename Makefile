MOCHA_OPTS =

MOCHA = ./node_modules/.bin/mocha --reporter=tap $(MOCHA_OPTS)
BABEL = ./node_modules/.bin/babel

build:
	$(BABEL) src --out-dir lib

test: build
	$(MOCHA) test

publish: build
	npm publish
