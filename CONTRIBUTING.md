# For production

## Command to build the app
`npm run build`

## To compress the built app
`tar zcvmfp build.tgz build`

## Copy the file to the server
`scp build.tgz user@[IP Address]:/var/www/quickbiller/www.quickbiller.online`

## Command to extract the build.tgz inside the server
`tar zxvmfp build.tgz`

