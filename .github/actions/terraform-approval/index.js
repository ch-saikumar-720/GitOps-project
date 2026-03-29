const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const environment = core.getInput('environment');
    const region = core.getInput('region');
    const planUrl = core.getInput('plan-url') || '';

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      core.setFailed("GITHUB_TOKEN is required");
      return;
    }

    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;

    const issueTitle = `Terraform Apply Approval Needed - ${environment}`;
    let issueBody = `Terraform plan has been generated for **${environment}** in **${region}** region.\n\n`;
    issueBody += "Please review the plan before approving.\n";
    issueBody += "Comment `approve` on this issue to trigger Terraform Apply.\n";
    if (planUrl) {
      issueBody += `\nPlan artifact: ${planUrl}`;
    }

    const issue = await octokit.rest.issues.create({
      owner,
      repo,
      title: issueTitle,
      body: issueBody,
      labels: ['terraform-approval']
    });

    core.setOutput('issue-number', issue.data.number);
    console.log(`Created issue #${issue.data.number} for Terraform approval`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
