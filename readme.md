# Payment NodeJS
## First of all: Get your PayPal code 
First of all you should create your sandbox shop in PayPal. Just follow [this link](!https://developer.paypal.com), get into your account, and create your sandbox shop. After that, you might see your `client id` and your `client secret`. Keep an eye on these keys, because you'll need them in a few steps.

## Installing the application
It's an easy step, you just need to run this:
```
git clone https://github.com/OrxataGuy/PaypalNode
cd PaypalNode
npm install
cp .env.example .env
```
After that, you have to copy your `client id` and your `client secret` in the `SANDBOX_CLIENT_ID` and the `SANDBOX_CLIENT_SECRET` fields as well on your `.env` file.

You can set the `SITE` and the `PORT` by default if you want.

## Run the application
You've just to run:
```
node ./payment.js
```
The app will run on `http://localhost:3000`.

## Coming soon
Code integration with:
- Redsys
- Stripe
- Bizum