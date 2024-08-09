# Emojive

The emojive project is a chat room where you can only communicate in emojis. This is the front-end git repo. The backend can be found at [emojive-backend](https://github.com/thomasy314/emojive-backend) and has a bit more information about the purpose of this project.

### Current state

A basic front-end has been has been created and is able to connect with the backend websocket.

### Planned Work

Functionality
- Add support for identifying who is sending each message
    - Allow users to select an emoji to represent them perhaps?
- Limit the messages to only allow emojis
- Create an easy way for people to search for emojis to send
- Give users a way to either randomly enter a chatroom or enter a session ID

Aesthetics
- Make things look a bit nicer. You know... make it not just black and white

DevOps:
- create environment variable to differentiate dev and prod stages for websocket endpoints

## Setup

### Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|REACT_APP_WEBSOCKET_ENDPOINT           | The endpoint hosting the emojive backend server            | `ws://127.0.0.1:8080`      |

### Development

Run developer server with:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production

Build and run production server with

```bash
npm run build
npm start
```