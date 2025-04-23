# Electron React Vite TypeScript Template

This is a template repository for building desktop applications using **Electron**, **React**, **Vite**, and **TypeScript**. It provides a modern development setup with hot module replacement, type safety, and multi-platform build scripts, making it ideal for creating cross-platform desktop apps.

## Features

- **Fast Development**: Vite’s blazing-fast hot module replacement for React components.
- **Type Safety**: TypeScript for robust, maintainable code.
- **Cross-Platform Builds**: Scripts for macOS, Windows, and Linux using Electron Builder.
- **Linting**: ESLint with React-specific plugins for code quality.
- **Modular Structure**: Separated main (`src/electron`) and renderer (`src/ui`) processes.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A code editor like [VS Code](https://code.visualstudio.com/) (recommended for TypeScript support)

## Installation

1. Clone the repository:
    
    ```bash
    git clone https://github.com/your-username/electron-app.git
    cd electron-app
    ```
    
2. Install dependencies:
    
    ```bash
    npm install
    ```
    

## Usage

### Development

Run the app in development mode with hot reloading:

```bash
npm run dev
```

This starts both the Vite dev server (`dev:react`) for the renderer process and the Electron app (`dev:electron`). The app will automatically reload when you make changes to the React code.

### Building

Build the app for production:

- **macOS** (ARM64):
    
    ```bash
    npm run dist:mac
    ```
    
- **Windows** (x64):
    
    ```bash
    npm run dist:win
    ```
    
- **Linux** (x64):
    
    ```bash
    npm run dist:linux
    ```
    

These scripts transpile the Electron code, build the React app, and package it using Electron Builder.

### Linting

Check code quality with ESLint:

```bash
npm run lint
```

### Preview

Preview the production build of the React app (without Electron):

```bash
npm run preview
```

## Project Structure

```
├── src
│   ├── electron      # Main process code (Electron backend)
│   └── ui           # Renderer process code (React frontend)
├── tsconfig.json    # Base TypeScript configuration
├── tsconfig.app.json # TypeScript config for the renderer process
├── tsconfig.node.json # TypeScript config for the main process
├── vite.config.ts   # Vite configuration
├── package.json     # Project dependencies and scripts
```

- **`src/electron`**: Contains the main process code that runs Node.js and controls the Electron app (e.g., window creation).
- **`src/ui`**: Contains the React app rendered in the Electron window.
- **TypeScript Configs**: Separate configs ensure proper type-checking for Node.js (`tsconfig.node.json`) and browser (`tsconfig.app.json`) environments.

## Scripts Explained

- `dev`: Runs `dev:react` and `dev:electron` in parallel.
- `dev:react`: Starts the Vite dev server for the React app.
- `dev:electron`: Transpiles Electron code and launches the Electron app in development mode.
- `transpile:electron`: Compiles TypeScript in `src/electron` to JavaScript.
- `build`: Builds the React app for production.
- `dist:mac/win/linux`: Packages the app for the specified platform.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.