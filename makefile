all:
	@echo "make deploy    Send current dist directory to remote"
	@echo "make dist    Remake dist directory"

dist:
	grunt build:dist

deploy:
	rsync -r --delete dist/* techplex@blake.metheus.org:/var/www/team5122/easyj2
