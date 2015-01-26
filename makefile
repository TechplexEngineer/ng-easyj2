.PHONY: all dist deploy blockly closure

all:
	@echo "make deploy		Send current dist directory to remote"
	@echo "make dist		Remake dist directory"
	@echo "make blockly		Clone blockly locally"
	@echo "make closure		Get closure locally"

dist:
	gulp build

deploy:
	rsync -r --delete dist/* techplex@blake.metheus.org:/var/www/team5122/easyj2

blockly:
	@if  test -d blockly; \
	then cd blockly; git pull; \
	else git clone git@github.com:google/blockly.git; \
	fi

closure:
	-rm master.zip
	-rm -rf closure-library-master closure-library
	wget https://github.com/google/closure-library/archive/master.zip
	unzip master.zip
	mv closure-library-master closure-library
	rm master.zip
