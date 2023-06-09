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
	@if  test -d src/blockly; \
	then cd src/blockly; git pull; \
	else git -C src clone https://github.com/google/blockly blockly-src; git -C src checkout 703ac981dab8020aa4d0410566616d28d349ac56; \
	fi

closure:
	-rm src/master.zip || true
	-rm -rf src/closure-library-master src/closure-library || true
	cd src; wget https://github.com/google/closure-library/archive/master.zip
	cd src; unzip -q master.zip
	cd src; mv closure-library-master closure-library

cc:
	-rm -rf bower_components/closure-compiler || true
	mkdir -p bower_components/closure-compiler || true
	cd bower_components/closure-compiler; wget https://dl.google.com/closure-compiler/compiler-20161201.zip
	cd bower_components/closure-compiler; unzip compiler-20161201.zip
	cd bower_components/closure-compiler; rm compiler-20161201.zip
	cd bower_components/closure-compiler; mv closure-compiler-v20161201.jar compiler.jar
