.PHONY: all dist deploy blockly closure

all:
	@echo "make deploy		Send current dist directory to remote"
	@echo "make dist		Remake dist directory"
	@echo "make blockly		Clone blockly locally"
	@echo "make closure		Get closure locally"

dist:
	gulp build

deploy:
	rsync -r --progress --delete dist/* techplex@blake.metheus.org:/var/www/team5122/easyj2

blockly:
	@if  test -d src/blockly; \
	then cd src/blockly; git pull; \
	else cd src; git clone --depth=1 git@github.com:google/blockly.git blockly-src; \
	fi

closure:
	-rm src/master.zip
	-rm -rf src/closure-library-master src/closure-library
	cd src; wget https://github.com/google/closure-library/archive/master.zip
	cd src; unzip master.zip
	cd src; mv closure-library-master closure-library
	cd src; rm master.zip
