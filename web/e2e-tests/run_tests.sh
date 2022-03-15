#!/bin/bash

echo "Starting smoke testing!"

npm run wdio -- --cucumberOpts.tagExpression='@parser'