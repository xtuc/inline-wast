MOCHA_OPTS =

NODE = node
MOCHA = ./node_modules/.bin/mocha --reporter=tap $(MOCHA_OPTS)
BABEL = ./node_modules/.bin/babel --ignore ./src/libwabt.js

build:
	$(BABEL) src --out-dir lib
	cp ./src/libwabt.js ./lib/

test: build
	$(MOCHA) test

publish: build
	npm publish

bench:
	$(NODE) ./benchmark
