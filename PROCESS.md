# Freckle Vacations development process

## Feature Development

1. Pick a story and start it.

    Example:



    > `[#1](https://github.com/danrice92/freckle-vacations/issues/1)` Connect to Freckle API.

2. Create a local branch in your development environment to work on the story.

    Example:

        $ git checkout master
        $ git pull
        $ git checkout -b 1-connect-to-freckle-api

3. Implement your feature and satisfy relevant test(s).
4. Repeat 2 and 3 as needed.

    At the end of the day, WIP commit any pending work, preferably after an iteration of step 4, so that the tests guide the developer on how to complete the WIP work.

5. Commit branch to GitHub.

    Example:

        $ git add .     # make sure you only add what should be added
                        # add things to .gitignore if needed
        $ git diff      # sanity check changes
        $ git commit -am '#1 entries endpoint'
        $ git push

6. Create a pull request using the template.

    Use `master` as the root branch

    Prefix the title of your PR with the story number.

    See [PULL_REQUEST_TEMPLATE.md](PULL_REQUEST_TEMPLATE.md)

7. Ask someone to review your code, preferably using Slack. It is also useful to ask verbally.

8. Make any necessary changes.

    Address PR review comments. Any ignored comments should be discussed.

9. Repeat 7 and 8 as needed.

10. Request code merge.

    Ask the Developer Lead/Acting Developer Lead to merge your branch.

11. Close issue
