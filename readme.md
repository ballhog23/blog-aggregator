# Blog Aggregator CLI - Gator

## Setup

1. Create a Postgres database

    - a. macOS: `brew install postgresql@16`
    - b. Linux / WSL (Debian): `sudo apt update && sudo apt install postgresql postgresql-contrib`
    - c. `psql --version`
    - d. Linux only: update postgres password to whatevery your desire. Save this for your database string in the next part:
      `sudo passwd postgres`
    - e. Start the Postgres server in the background:
        - Mac: `brew services start postgresql@16`
        - Linux: `sudo service postgresql start`
    - f. Enter the psql shell:
        - Mac: `psql postgres`
        - Linux: `sudo -u postgres psql`
    - g. postgres=# `CREATE DATABASE gator;`
    - h. `\c gator`
    - i. gator=# `ALTER USER postgres PASSWORD 'postgres';`
    - j. Ensure you are good to go: `SELECT version();`

2. From your home directory (cd ~)

    - a. `touch .gatorconfig.json`
    - b. `echo '{"db_url": "protocol://username:password@host:port/database?sslmode=disable"}' > .gatorconfig.json`

3. Clone repo into your home directory

    - a. HTTPS: `git clone https://github.com/ballhog23/blog-aggregator.git`
    - b. GitHub CLI: `gh repo clone ballhog23/blog-aggregator`

4. Change Directory to project: `cd blog-aggregator`

5. Run: `npm install`

    - Adds our dependencies.

6. To get started create a user: `npm run start register usernamehere`

    - `register` registers a user and sets the .gatorconfig.json file to reflect the current user.

7. Log in: `npm run start login usernamehere`

    - `login` does exactly what it says, it updates the .gatorconfig.json file to reflect the current user.

8. Add a feed `npm run start addfeed 'feed name here' <feed_url>`

    - a. Please note the url to a feed above is placeholer.
    - b. Adding a feed requires a user to be logged in, whenever you `addfeed` you will automatically follow that feed.

    - 'TechCrunch' https://techcrunch.com/feed/
    - 'Hacker News' https://news.ycombinator.com/rss
    - 'Boot.dev Blog' https://blog.boot.dev/index.xml

9. List Feed Follows: `npm run start following`

    - `following` lists all feeds a user follows.
    - `unfollow <feed_url>` unfollows a feed for a user.

10. Add posts to database: `npm run start agg 5s`

    - The `agg` command is meant to be left running in the background of another shell. It is preferable that you set the interval to 1h to avoid DOSing anyones server. If you are quickly trying to add posts to your database feel free to tweak that value.
    - `agg` aggregates posts from different feeds and saves them in the database, it also prints post data to the console.

11. `npm run start browse [limit]` limit defaults to 2.

    - `browse [limit]` limit dictates how many posts you'd like to retrieve for a user.

12. Now you have a basic understanding of how the program works, here are some additional commands:

    - `npm run start users` lists all users and lists who is the current user.
    - `npm run start follow <feed_url>` follows a feed by passing a feed_url, only one feed can exist in the database, this keeps the database clean and allows a many-to-many relationship between users and feeds.
    - `npm run start unfollow <feed_url>` allows a user to unfollow a feed.
    - `npm run start feeds` will list all feeds in the database and metadata pertaining to the feed.
    - `npm run start reset` will delete all rows from all tables in the database.
    - `npm run fresh` will allow you to get back up and running slightly quicker than typing in each command to register and create a user, and adding feeds. You will notice a bash script in ./scripts/fresh.sh, you can change the value of the user 'caleb' to whatever you please. This script is used to get your db up and running quickly in conjunction with `npm run start reset` if you plan on elaborating on the project, changing code, whatever. After running the script, you will need to `npm run start agg 5s` to fetch feeds and store in the database, then you are free to do as you please.
