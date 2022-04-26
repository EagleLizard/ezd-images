# EZD Images

Playing around with image manipulation

## Prerequisites

1. NodeJS 16.x+
2. Typescript

## Getting Started

Install deps:
```sh
npm i
```

Install Typescript globally if you do not have it:
```sh
npm i -g typescript
```

Compile at project root:
```sh
tsc
```

Alternatively, run `tsc` in watch mode in a separate terminal (recommended):
```sh
tsc -w
```

## Running the Code

Run the compiled program on a test image. You can use a provided one from `/test-data/`:
```sh
node dist/main.js ./test-data/i-feel-coke.jpeg
```


By default this applies a simple percentage color transform to the source image and writes the result in `./img-out/`:

## Before:

![original image](./test-data/i-feel-coke.jpeg)

## After:

![shuffle transformed image](./img-out/shuffle_transform_i-feel-coke.jpeg)
![color transformed image](./img-out/color_transform_i-feel-coke.jpeg)

