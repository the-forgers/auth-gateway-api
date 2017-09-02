# auth-gateway-api #

### What is this? ###

REST API that issues and authenticates tokens using the auth0 JWT standard.
Some endpoint routes covered are:
* GET: /status
* POST: /register
* POST: /login
* POST: /checkToken
* POST: /getUser

### Is there a working demo? ###

Not just yet, but hopefully soon.

### What you need before you run the app: ###

* NodeJS version >= 8.4.x installed
* npm version >= 5.3.x installed
* A mongodb instance at version >= 3.4.x installed
* A redis instance at version >= 4.0.x installed
* An RSA public and private key `ssh-keygen -t rsa -b 2048`
* A public certificate generated from the above public key `ssh-keygen -f my_public_key.pub -e -m pem > auth-gateway-cert.pem`

### How do I install? ###

Once cloned/downloaded, cd to directory and `npm i`

### How do use it? ###

* Within the auth-gateway-api directory run `npm start`

### Who do I talk to? ###

* Repo owner or admin