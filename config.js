let environments = {};

environments.staging = {
    'envName': 'Staging',
    'port': 3000
}

environments.production = {
    'envName': 'Production',
    'port': 5000
}

let requestedEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

let environmentToExport = typeof (environments[requestedEnvironment]) == 'object' ? environments[requestedEnvironment] : environments.staging

module.exports = environmentToExport;