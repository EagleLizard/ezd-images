
run:
	node dist/main.js ./test-data/i-feel-coke.jpeg
	make open-output
open-output:
	open ./test-data/i-feel-coke.jpeg
	open ./img-out/color_transform_i-feel-coke.jpeg
	open ./img-out/red_transform_i-feel-coke.jpeg
	open ./img-out/shuffle_transform_i-feel-coke.jpeg
