const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const token = core.getInput('token');
const { Octokit } = require("@octokit/rest");


try {
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);

  let prom = pullRequests(github.context.repo.owner, github.context.repo.repo);

  prom.then(pullsList => {
    const pullz = JSON.stringify(pullsList, undefined, 2);

    fs.readFile('README.md', 'utf-8', (err, data) => {
      if (err) {
        throw err;
      }
      console.log("README.md data: ", data);
      // Replace text using regex: "Contributors: ...replace... ![Thank"
      const updatedMd = data.replace(/(?<=Contributors:\n)[\s\S]*(?=\!\[Thank)/gim, pullz);
      console.log("...............................");
      console.log("updatedMd: ", updatedMd);
      // Write the new README
      fs.writeFile('README.md', updatedMd, 'utf-8', (err) => {
        if (err) {
          throw err;
        }
        console.log('README update complete.');
      });
    });
  });
} catch (error) {
  core.setFailed(error.message);
}

function pullRequests(repoOwner, repo) {
  const octokit = new Octokit();

  let resp = octokit.pulls.list({
    owner: repoOwner,
    repo: repo
  })["catch"](function (e) {
    console.log(e.message);
  });

  return resp;
}
