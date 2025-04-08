My own automated backup service, built in TypeScript. Cobbled together in a day with rather poor error handling.

Uses child_processes.spawn() to execute rsync commands which pull from my Windows machine to the home server that this service is running on.


# How to use:

I didn't make this project with the intention of anybody besides me using it, but I guess you're free to try! Basically, you just add new entries to "paths.ts". The key for the object should be a cron expression. The value should be an array which contains "Backup" objects. Just read the examples and you'll get it. When you run the script it will create a cron schedule for each entry in paths.ts. That schedule will execute a backup on every source:destination pair associated with that cron.

It's a very elegant system, in my opinion. A benefit is that each key on an object has to be unique, which prevents you from accidentally using the same cron expression twice - any operation that runs every hour on the hour must be put under the same "0 * * * *" value in the Paths object. This helps keep everything organized as path.ts grows.

# Steam Screenshots

Steam screenshots are a special case. The way Steam stores your screenshots is that each game has its own folder, named as the game's ID. This makes finding a specific game quite annoying unless you memorize its ID. So, I chose not to copy the entire screenshots folder as is - instead, I get a list of every folder in my screenshots folder using sftp, and then I copy each of those folders to the destination with their folder name changed to the name of the game (which I retrieve via Steam API). This works nicely for Immich - if I enter Folder view, they're all laid out nicely. What's nice is that as I take screenshots in new games, it will just *work*. The new folder gets picked up by sftp, and the new name gets picked up from the Steam API.

# TODO

- Think of what other stuff should be backed up
- More robust error handling
- Generally organize everything better and rewrite functions
- Add a way to add a new backup without having to rebuild and restart the entire program