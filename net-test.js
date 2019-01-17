const isPortReachable = require('is-port-reachable');
const chalk = require('chalk');
const ports = [80, 8080, 8443, 5445, 5446, 9150, 8787];

const checkPort = (portNumber) => {
	isPortReachable(portNumber, {
		host: 'qmaticcloud.qex.sk'
	}).then(reachable => {
		const text = `Port ${portNumber} is reachable: ${reachable}`;
		if(reachable) {
			console.log(chalk.green(text));
		} else {
			console.log(chalk.red(text));
		}
	});
}

const tests = ports.map((port) => {
	return checkPort(port);
})