const { serial } = require("items-promise");



/** Overenie, ci boli zadane vstupne ID profilov */
const argv = process.argv.slice(2);

if (argv.length !== 2) {
  console.log(
    "Je potrebne zadat dva parametre. ID zdrojoveho profilu a cielovy profilu."
  );
  return;
}

const params = {
  sourceProfileID: parseInt(argv[0]),
  destinationProfileID: parseInt(argv[1]),
};

const newServices = [];

/**
 * Funkcia vytvori ServiceGroup v operacnom profile
 *
 * @param {Object} serviceGroup
 */
const createServiceGroup = serviceGroup => {
  return new Promise((resolve, reject) => {
    delete serviceGroup["id"];
    delete serviceGroup.defaultQueue["id"];

    const arguments = {
      headers: {
        "content-type": "application/json",
      },
      data: JSON.stringify(serviceGroup),
    };
    //console.log(arguments)
    console.log(
      "Vytvaram ServiceGroup/Queue: " + serviceGroup.defaultQueue.name
    );

    client.post(
      `${configuration.protocol}://${configuration.host}:${
        configuration.port
      }/qsystem/rest/config/operationProfiles/${
        params.destinationProfileID
      }/serviceGroups/`,
      arguments,
      (data, response) => {
        newServices.push(data);
        resolve(data);
      }
    );
  });
};

const createWorkProfiles = workProfile => {
  return new Promise((resolve, reject) => {
    delete workProfile["id"];

    if (workProfile.workProfileRules.ruleConditions) {
      workProfile.workProfileRules.ruleConditions.map(
        condition => delete condition["id"]
      );
    }
    if (workProfile.workProfileRules) {
      workProfile.workProfileRules.map(rule => {
        rule.ruleConditions.map(condition => delete condition["id"]);
        delete rule["id"];
      });
    }

    const arguments = {
      headers: {
        "content-type": "application/json",
      },
      data: JSON.stringify(workProfile),
    };
    console.log("Vytvaram WorkProfile: " + workProfile.name);

    client.post(
      `${configuration.protocol}://${configuration.host}:${
        configuration.port
      }/qsystem/rest/config/operationProfiles/${
        params.destinationProfileID
      }/workProfiles/`,
      arguments,
      (data, response) => {
        resolve(data);
      }
    );
  });
};

const getServices = profileId => {
  return new Promise((resolve, reject) => {
    client.get(
      `${configuration.protocol}://${configuration.host}:${
        configuration.port
      }/qsystem/rest/config/operationProfiles/${profileId}/serviceGroups/`,
      (data, response) => {
        resolve(data);
      }
    );
  });
};

const servicesMerge = async () => {
  const originalServices = await getServices(params.sourceProfileID);
  const newServices = await getServices(params.destinationProfileID);

  const mapping = [];
  originalServices.map(originalService => {
    newServices.map(newService => {
      if (originalService.defaultQueue.name === newService.defaultQueue.name) {
        mapping.push({
          original: originalService.defaultQueue.id,
          created: newService.defaultQueue.id,
        });
      }
    });
  });
  return mapping;
};

/* Show existing operation profiles
client.get(`${configuration.protocol}://${configuration.host}:${configuration.port}/qsystem/rest/config/operationProfiles/`, (data, response) => {
  console.log(data)
})*/

client.get(
  `${configuration.protocol}://${configuration.host}:${
    configuration.port
  }/qsystem/rest/config/operationProfiles/${
    params.sourceProfileID
  }/serviceGroups/`,
  (data, response) => {
    const serviceGroups = data;
    serial(serviceGroups, createServiceGroup);
  }
);

// Create workprfiles after services and queues
setTimeout(() => {
  servicesMerge().then(mapping => {
    client.get(
      `${configuration.protocol}://${configuration.host}:${
        configuration.port
      }/qsystem/rest/config/operationProfiles/${
        params.sourceProfileID
      }/workProfiles/`,
      (data, response) => {
        const workProfiles = data;
        workProfiles.map(profile => {
          profile.workProfileRules.map(rule => {
            rule.ruleAction.queues = rule.ruleAction.queues.map(queue => {
              const match = mapping.filter(mapped => {
                return mapped.original === queue;
              });
              if (match[0]) {
                return match[0].created;
              } else {
                return queue;
              }
            });
          });
        });

        serial(workProfiles, createWorkProfiles);
      }
    );
  });
}, configuration.serviceGroupCreationTimeout);