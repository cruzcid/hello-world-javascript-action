const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const token = core.getInput('token');

try {
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);

  //const payload = JSON.stringify(github.context.payload, undefined, 2);
  //console.log(`The event payload: ${payload}`);

  let prom = pullRequests(github.context.repo.owner, github.context.repo.repo);

  prom.then(pulls =>{
    fs.writeFile('FirstFileCreated', pulls, 'utf-8', (err) => {

      if (err) {
        throw err;
      }
      console.log('README update complete.');

    });
  });
} catch (error) {
  core.setFailed(error.message);
}

function pullRequests(repoOwner, repo){
  const octokit = new github.GitHub(token);
  let resp = octokit.pulls.list({
    owner: repoOwner,
    repo: repo
  })["catch"](function (e) {
    console.log(e.message);
  });

  return resp;
}
