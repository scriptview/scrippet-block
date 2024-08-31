#!/bin/bash
set -euo pipefail

npm run build
npm run plugin-zip

# test that we have the zip file
ls scrippet-block.zip


unzip scrippet-block.zip -d submission/svn/scrippet/trunk


find submission -type f -name ".DS_Store" | xargs rm -f
