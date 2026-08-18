---
description:
globs:
alwaysApply: true
---

This CLI is responsible for handling publish from HTML5 games. I is called `vibeforge` or `vf` as an alias.

**IMPORTANT:** Always check for the User session with `vf login`.

1. `vf`: Show all the other commands available to start using the tool, is like a `help` command.
2. `vf login`: Ask for the user his email and password. If the user has not confirmed his email, prompt and error. Uses supabase to authenticate the user and save the session information to keep the user logged in, create a developer row for the user with a random username, the username must be unique in the DB.
3. `vf register`: If the user is already logged in, ask if he wants to logout and create a new account. Ask for the user's email and password. Confirm the password. Creates user on supabase and ask to confirm email and login.
4. `vf logout`: Clear the user's session. If the user is already logout, just warn the user that he is already logged out.
5. `vf whoami`: Print the user session with his developer information.
6. `vf help`: Display all available commands so far.
7. `vf games`: List all games from the logged in user.
8. `vf submit [path]`: Submit games and its versions and publish games.
9. `vf --version`: Show current version and check for updates.
10. `vf init [name]`: Initialize a new game from template.
