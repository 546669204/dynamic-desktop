#!/bin/bash

set -vex

cd next-src 

yarn

yarn build

cd ..

if which cargo-tauri > /dev/null; then
    echo "Command exists"
else
    cargo install tauri-cli
fi

rm -rf target/release/bundle

# cargo tauri build --verbose
cargo build -r

  