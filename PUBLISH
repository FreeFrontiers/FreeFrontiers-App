#!/bin/sh

export GH_TOKEN=""

if [ -z "$GH_TOKEN" ]; then
    echo "You must set the GH_TOKEN environment variable."
    echo "export GH_TOKEN=''"
    exit 1
fi

# This will build, package and upload the app to GitHub.
node_modules/.bin/build --win --mac default --linux tar.gz -p always