anita max wyn 
`deltaspire`
glyzz
15
bork
botmaster69
lombster
awal
wuz here uwu ^_^

## instructions to run:
0. install mongo and node
1. switch to my branch
### nextjs setup
2. cd into Clark and run `npm i`
3. to your `.env` file, add:
```py
DATABASE_URL = "mongo_connection_string" # mine is mongodb://@localhost:27017/clark
NEXTAUTH_URL = "http://localhost:3000"
NEXTAUTH_SECRET = "secret_here" # generate a random base64 string, 172 bytes long. you can do so using openssl with the command: openssl rand -base64 172 (openssl needs to be installed on windows)
```
### mongodb setup
4. create mongodb database with `use ${db_name}`
5. run mongodb as a replica set. first, kill the mongod process (on systemd linux its `sudo systemctl stop mongod` and on SysVinit linux its `sudo service mongod stop`). then run mongo again with `sudo mongod --replSet rs`.
5.5. idk if this is required but in another terminal run the mongo cli with `mongosh`. then `use ${db_name}`. then run `rs.initiate()`
### prisma setup
6. now run `npx prisma generate` while in Clark
7. run `npx prisma migrate dev`
### run
8. you can now run the app with `npm run dev`.
### extra
prisma has an awesome way to interact with your database directly for testing, called prisma studio. run it with `npx prisma studio`