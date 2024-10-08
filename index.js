#!/usr/bin/env node


const { spawn } = require('child_process');
const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const program = new Command();

const defaultPorts = {
  auth: 8080,
  gem_cars: 8081,
  library: 8082,
  admin: 3000,
  user: 3001,
  shared: 3002,
};

const backend = ['auth', 'gem_cars','library']

// Function to create .env files with user-defined or default ports and MongoDB URIs
async function createEnvFiles() {
  const ports = {};
  const mongoUris = {};

  // Prompt user for port numbers
  const portQuestions = Object.keys(defaultPorts).map(service => ({
    type: 'input',
    name: service,
    message: `Enter port for ${service} (default ${defaultPorts[service]}):`,
    default: defaultPorts[service].toString(),
    validate: input => !isNaN(parseInt(input, 10)) ? true : 'Please enter a valid number.'
  }));

  // Prompt user for MongoDB URIs for backend services
  const mongoUriQuestions = backend.map(backend => ({
    type: 'input',
    name: backend,
    message: `Enter MongoDB URI for ${backend} (default mongodb://localhost:27017/${backend}-db):`,
    default: `mongodb://localhost:27017/${backend}-db`,
  }));

  const answers = await inquirer.prompt([...portQuestions]);
  const mongoanswers = await inquirer.prompt([...mongoUriQuestions]);

  Object.keys(defaultPorts).forEach(service => {
    const port = answers[service] || defaultPorts[service];
    ports[service] = parseInt(port, 10);

    let envFilePath;
    let envContent = `PORT=${ports[service]}`;

    // Determine if service is a backend and assign MongoDB URI if necessary
    if (backend.includes(service)) {
      envFilePath = path.join('./backend', service, '.env');
      envContent += `\nMONGO_URI=${mongoanswers[service]}`;
    } else {
      envFilePath = path.join('./frontend', service, '.env');
    }

    // Ensure the directory exists before creating the .env file
    fs.mkdirSync(path.dirname(envFilePath), { recursive: true });

    fs.writeFileSync(envFilePath, envContent, { encoding: 'utf8' });
    console.log(`Created .env file for ${service} with PORT=${ports[service]}${backend.includes(service) ? ` and MONGO_URI=${answers[service]}` : ''}`);
  });
}

// Function to run a specific service and stream the output
function runService(service) {
  if (service in services) {
    console.log(`Starting ${service}...`);

    // Set environment variables
    const env = { PORT: services[service].port };

    const [command, ...args] = services[service].command.split(' ');
    const serviceProcess = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, ...env }
    });

    serviceProcess.on('error', (error) => {
      console.error(`Error starting ${service}: ${error.message}`);
    });

    serviceProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`${service} exited with code ${code}`);
      }
    });
  } else {
    console.error(`Unknown service: ${service}`);
  }
}

// Function to run all services
function runAllServices() {
  Object.keys(services).forEach(runService);
}

// Function to interactively select a service to start
function promptServiceSelection() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'service',
        message: 'Select a service to run:',
        choices: [...Object.keys(services), 'All'],
      },
    ])
    .then((answers) => {
      if (answers.service === 'All') {
        runAllServices();
      } else {
        runService(answers.service);
      }
    });
}

// Define services
const services = {
  auth: {
    command: 'cd backend/auth && go run cmd/main.go',
    port: 8080
  },
  gem_cars: {
    command: 'cd backend/gem_cars && pnpm run start:dev',
    port: 8081
  },
  library: {
    command: 'cd backend/library && pnpm run start:dev',
    port: 8082
  },
  admin: {
    command: 'cd frontend/admin && pnpm run dev',
    port: 3000
  },
  user: {
    command: 'cd frontend/user && pnpm run dev',
    port: 3001
  },
  shared: {
    command: 'cd frontend/shared && pnpm run dev',
    port: 3002
  },
};

// Setup command to install dependencies and create .env files
program
  .command('setup')
  .description('Install all dependencies for each project and create .env files')
  .action(async () => {
    await createEnvFiles();
    const setupCommands = [
      'cd backend/auth && go get ./...',
      'cd backend/gem_cars && pnpm install',
      'cd frontend/admin && pnpm install',
      'cd frontend/user && pnpm install',
      'cd frontend/shared && pnpm install',
    ];

    console.log('Installing dependencies for all projects...');

    setupCommands.forEach((command) => {
      const [cmd, ...args] = command.split(' ');
      const setupProcess = spawn(cmd, args, { stdio: 'inherit', shell: true });

      setupProcess.on('error', (error) => {
        console.error(`Error during setup: ${error.message}`);
      });
    });
  });

// Setup command to install dependencies
program
  .command('install')
  .description('Install all dependencies for each project')
  .action(async () => {
    const setupCommands = [
      'cd backend/auth && go get ./...',
      'cd backend/gem_cars && pnpm install',
      'cd backend/library && pnpm install',
      'cd frontend/admin && pnpm install',
      'cd frontend/user && pnpm install',
      'cd frontend/shared && pnpm install',
    ];

    console.log('Installing dependencies for all projects...');

    setupCommands.forEach((command) => {
      const [cmd, ...args] = command.split(' ');
      const setupProcess = spawn(cmd, args, { stdio: 'inherit', shell: true });

      setupProcess.on('error', (error) => {
        console.error(`Error during setup: ${error.message}`);
      });
    });
  });

// Dev command to start services interactively
program
  .command('dev')
  .description('Select a service to start interactively')
  .action(() => {
    console.log('Running application in development...');
    promptServiceSelection();
  });

program.parse(process.argv);
