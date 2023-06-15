.PHONY: all dist deploy blockly closure

all:
	@echo "make deploy		Send current dist directory to remote"
	@echo "make dist		Remake dist directory"
	@echo "make blockly		Clone blockly locally"
	@echo "make closure		Get closure locally"

dist:
	npx gulp build

deploy:
	rsync -r --progress --delete dist/* techplex@blake.metheus.org:/var/www/team5122/easyj2

blockly:
	-rm -rf src/blockly-src || true
	git -C src clone https://github.com/google/blockly blockly-src
	git -C src/blockly-src checkout 2844da768f00661c5b2886f73a5be427013673dc;
	

closure:
	-rm -rf src/closure-library-master src/closure-library || true
	cd src; wget https://github.com/google/closure-library/archive/refs/tags/v20160713.zip
	cd src; unzip -q v20160713.zip
	cd src; mv closure-library-20160713 closure-library
	-rm -f src/v20160713.zip || true

cc:
	-rm -rf bower_components/closure-compiler || true
	mkdir -p bower_components/closure-compiler || true
	cd bower_components/closure-compiler; wget https://dl.google.com/closure-compiler/compiler-20161201.zip
	cd bower_components/closure-compiler; unzip compiler-20161201.zip
	cd bower_components/closure-compiler; rm compiler-20161201.zip
	cd bower_components/closure-compiler; mv closure-compiler-v20161201.jar compiler.jar
