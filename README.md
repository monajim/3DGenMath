# 3D Print Designer Web Application

This project provides a web interface to design 3D print models using Vue.js.

## Prerequisites

- Before starting, ensure you have [Node.js](https://nodejs.org/) and `npm` (node package manager) installed on your system. You can verify the installation by running:
- To install npm in windows use the following cmd: **npm install -g npm**
- To check node and npm versions:

```bash
$ node --version
$ npm --version
```

## Setup

1. **Install Node.js and npm**:
   If you don't have Node.js and npm installed, download and install them from [Node.js official website](https://nodejs.org/).

2. **Install Vue CLI**:
After setting up Node.js and npm, install Vue CLI globally using the following command:

```bash (Not Git bash)
$ npm install -g @vue/cli
$ npm install -g @vue/cli-service
$ npm install -g three
$ npm install expr-eval
```


## Directory Structure

- `src/components:` For individual Vue components.
- `src/assets:` For static assets like images, icons.


## Components

- `ModelSettings.vue:` Contains fields related to the model such as equation, width, height, etc.
- `SupportSettings.vue:` Contains fields related to the support structures.
- `FileSettings.vue:` Contains fields for file naming and generating the STL file.


## Development

- To run the project in development mode, navigate to the project directory:

```bash
$ cd team09
```

- Then start the development server:

```bash
$ npm run serve
```

- Visit [http://localhost:8080/] in your browser to view the app.


## Contributing

1. Fork the repository.
2. Create a new feature branch.
3. Implement your feature or bug fix.
4. Push the branch to your fork.
5. Submit a pull request.


## Troubleshooting
- If the vue command isn't recognized, ensure that global npm packages are added to your system's PATH or try reopening your terminal.
