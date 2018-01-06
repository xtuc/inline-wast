MOCHA_OPTS =

NODE = node
MOCHA = ./node_modules/.bin/mocha --reporter=tap $(MOCHA_OPTS)
BABEL = ./node_modules/.bin/babel --ignore ./src/native/libwabt.js

build:
	$(BABEL) src --out-dir lib
	cp ./src/native/libwabt.js ./lib/native/

test: build
	$(MOCHA) test

publish: build
	npm publish

bench:
	$(NODE) ./benchmark
