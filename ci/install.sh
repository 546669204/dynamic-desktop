#!/bin/bash

set -vex

if which cargo-tauri > /dev/null; then
    echo "Command exists"
else
    cargo install tauri-cli
fi

rm -rf target/release/bundle

# cargo tauri build --verbose
cargo tauri build -r

  