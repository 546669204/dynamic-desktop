#!/bin/bash

set -vex

yarn add -D @tauri-apps/cli

# rm -rf target/release/bundle

# cargo tauri build --verbose
yarn tauri build -r

  