# Create Pull Request

Create a pull request for current changes using the gh CLI.

## Workflow

1. **Review changes**
   - Run `git status` to see all staged and unstaged changes
   - Run `git diff` to see the actual changes

2. **Create commit message**
   - Analyze the changes
   - Write a clear, imperative mood commit message in English
   - Format: "Add feature X" / "Fix issue Y" / "Update component Z"
   - Keep it concise (one line summary)

3. **Commit changes**
   - Stage all changes: `git add .`
   - Commit with the message
   - Show the commit hash

4. **Push to remote**
   - Push to current branch: `git push -u origin HEAD`
   - Handle the case where branch doesn't exist on remote yet

5. **Create PR**
   - Use `gh pr create --title "title" --body "description"`
   - Title should match the commit message
   - Body should include:
     - Brief summary of changes
     - List of modified files/components
     - Any breaking changes or notes
   
6. **Return PR URL**
   - Display the PR URL so user can review it

## Example

When user types `/pr`, execute this workflow automatically, analyzing their changes and creating an appropriate PR.
