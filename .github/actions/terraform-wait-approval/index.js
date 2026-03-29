const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error('GITHUB_TOKEN is required');

    const issueNumber = core.getInput('issue-number', { required: true });
    const octokit = github.getOctokit(token);

    core.info(`Waiting for /approve comment on issue #${issueNumber}...`);

    // Poll every 30s, timeout after 3 days (4320 min)
    const timeoutMinutes = 4320;
    const pollInterval = 30 * 1000; // 30 seconds
    const maxPolls = (timeoutMinutes * 60 * 1000) / pollInterval;

    let polls = 0;
    while (polls < maxPolls) {
      const { data: comments } = await octokit.rest.issues.listComments({
        ...github.context.repo,
        issue_number: parseInt(issueNumber),
      });

      const approved = comments.some(c => c.body.trim() === '/approve');
      if (approved) {
        core.info('Approval received! Proceeding...');
        return;
      }

      polls++;
      core.info('Approval not yet received, waiting 30s...');
      await new Promise(r => setTimeout(r, pollInterval));
    }

    throw new Error(`Timeout: no /approve comment received on issue #${issueNumber}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();