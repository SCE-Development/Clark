const axios = require('axios');

/**
 * Handles website's backend request to interface with Github's various APIs
 */
class SceGithubApiHandler {
  /**
   * Create SceGithubApiHandler object
   * @param {String} clientId Client ID generated from Github App
   * @param {String} clientSecret Client secret generated from Github App
   */
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  /**
   * Converts Github date format to MM-DD-YYYY format
   * @param {String} date Github's date string
   * e.g. "2011-04-14T16:00:49Z"
   * @returns {String} String of reformatted date
   */
  parseDate(date) {
    const formattedDate = date.split('T')[0].split('-');
    return `${formattedDate[1]}-${formattedDate[2]}-${formattedDate[0]}`;
  }

  /**
   * Gets top 5 ranked users that have contributed to the given repo
   * in the past 30 days
   * @param {String} repoName Name of SCE Github repo
   * @returns {Array<Object>|boolean} Array containing objects with
   * 2 properties user and commit. Array is ordered by commit count
   * e.g. [ {user: "user1", commits: 7}, {user: "user2", commits: 4}, ... ]
   */
  async getContributorsInPastMonthFromRepo(repoName) {
    return await axios
      .get(
        `https://api.github.com/repos/SCE-Development/${repoName}/commits` +
        `?client_id=${this.clientId}&client_secret=${this.clientSecret}`
      )
      .then(({ data }) => {
        if(!data.length) {
          return {};
        }

        const endDate = new Date(Date.now());
        const startDate = new Date(endDate - (2592000000)); // Subtract 30 days
        let commits = {};

        data = data.filter(commit => {
          const commitDate = new Date(commit.commit.author.date);
          return (startDate <= commitDate
            && commitDate <= endDate
            && !commit.author.login.includes('[bot]')
          );
        });

        // Create list of commits for each user
        data.forEach(commit => {
          commits[commit.author.login] = commits[commit.author.login] || [];
          commits[commit.author.login].push(commit);
        });

        const contributors = Object.keys(commits).map(user => (
          {
            user: user,
            avatarUrl: commits[user][0].author.avatar_url,
            commits: commits[user].length
          }
        ));

        // Sort array and reduce to top 5 contributors
        return contributors.sort((user1, user2) =>
          user2.commits - user1.commits
        ).slice(0, 5);
      })
      .catch(_ => {
        console.debug(_);
        return false;
      });
  }

  /**
   * Retrieves all open Pull Requests for a given repo
   * @param {String} repoName Name of SCE Github repo
   * @returns {Array<Object>|boolean} List of Pull Requests
   */
  async getPullRequestsFromRepo(repoName) {
    return await axios
      .get(
        `https://api.github.com/repos/SCE-Development/${repoName}/` +
        `pulls?client_id=${this.clientId}&client_secret=${this.clientSecret}`
      )
      .then(({ data }) => {
        const pullRequests = data.map(pr => {
          return {
            number: pr.number,
            title: pr.title,
            pullRequestUrl: pr.html_url
          };
        });
        return pullRequests;
      })
      .catch(_ => {
        return false;
      });
  }

  /**
   * Gets all commits merged into repos master branch
   * @param {String} repoName Name of SCE Github repo
   * @returns {Array<Object>|boolean} List containing commits
   */
  async getCommitsFromRepo(repoName) {
    return await axios
      .get(
        `https://api.github.com/repos/SCE-Development/${repoName}/commits` +
        `?client_id=${this.clientId}&client_secret=${this.clientSecret}`
      )
      .then(({ data }) => {
        if(!data.length) {
          return {};
        }

        const commits = data.map(commit => {
          return {
            user: commit.commit.author.name,
            message: commit.commit.message.split('\n')[0],
            commitUrl: commit.html_url
          };
        });

        return commits;
      })
      .catch(_ => {
        return false;
      });
  }
}

module.exports = { SceGithubApiHandler };
