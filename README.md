## Environment Set Up

Both express and react use node to run them as well as for managing packages. To install them, I recommened installing NVM, Node version manager, which makes it easy to download new versions of node and switch between them as needed.

### Installing NVM

For Windows, heres the repo where you can download NVM:

https://github.com/coreybutler/nvm-windows#readme

Just click "Download Now" then scroll down to the list of files, select the .exe and install.

Here's a guide if you need, as well as for Linux/Mac:
https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/

### Set up Node

Once NVM is installed, open up a terminal and enter:

```
nvm -v
```

If it shows a version then it was installed properly. Next, enter:

```
nvm install v21.1.0
```

21.1.0 is one of the latest version. We should all stick to the same version to ensure consistency. Lastly, enter:

```
nvm use v21.1.0
```

### Running Express

Go to the root of the directory. Start by running:

```
npm i
```

To install all node packages. Afterwards, run:

```
npm run start
```

And express will start up on localhost:8080

Express does not automatically reload on saved changes, so you will have to close it and restart it after any changes.

To make it automatically reload on changes, run:

```
npm i nodemon -g
```

Then run

```
nodemon src/server/server.js
```

Now, the server will reload on saved changes.

### Running React

Go to the src/client directory and run:

```
npm i
```

Afterwards, run:

```
npm run start
```

React should automatically open in your browser. It will refreshes whenever changes are saved.
