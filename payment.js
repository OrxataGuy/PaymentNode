const fs = require('fs'),
    express = require('express'),
    paypal = require('paypal-rest-sdk'),
    util = require('util'),
    dotenv = require('dotenv');
    dotenv.config()

    const PORT = process.env.PORT, 
    SITE = `${process.env.SITE}`,
    ERR = '000',
    SERVER = '001',
    PAYPAL = '010',
    REDSYS = '011',
    logs_dir = `${__dirname}/logs`,
    log_stdout = process.stdout;
   
    const products = [{
        'id': 'PRD001',
        'name': 'Par de calcetines',
        'price': '10.00',
        'currency': 'EUR',
        'description': 'Un par de calcetines bien calentitos.'
    },
    {
        'id': 'PRD002',
        'name': '3 Pares de calcetines',
        'price': '24.00',
        'currency': 'EUR',
        'description': '¡El triple de calcetines, el triple de comodidad!'
    },
    {
        'id': 'PRD003',
        'name': '5 Pares de calcetines',
        'price': '35.00',
        'currency': 'EUR',
        'description': '¡Mayor cantidad, menor precio! Con esta oferta nunca te faltarán calcetines.'
    }, ],
    app = express();
    var product;

    app.use(express.static('public'))
 
    function log (source, content) {
        const server_logs_dir = `${logs_dir}/app`,
            err_logs_dir = `${logs_dir}/error`,
            payment_logs_dir = `${logs_dir}/payments`,
            paypal_logs_dir = `${payment_logs_dir}/paypal`,
            redsys_logs_dir = `${payment_logs_dir}/redsys`;
            
        function time(format) {
            const date = new Date();
            const day = ('0' + date.getDate()).slice(-2), month = ('0' + (date.getMonth() + 1)).slice(-2), year = date.getFullYear(), hours = ('0' + date.getHours()).slice(-2), minutes = ('0' + date.getMinutes()).slice(-2), seconds = ('0' + date.getSeconds()).slice(-2);
            return format ? `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]` : `${year}${month}${day}`;

        }

        var dir = '';
        switch (source) {
            case SERVER:
                dir = server_logs_dir;
                break;
            case PAYPAL:
                dir = paypal_logs_dir;
                break;
            case REDSYS:
                dir = redsys_logs_dir;
                break;
            case ERR:
                dir = err_logs_dir;
                break;
        }

        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const log_file = fs.createWriteStream(`${dir}/${time()}.log`, {'flags': 'w'}),
        text = `${time(true)}: ${content}`;

        log_file.write(`${util.format(text)}\n`)
        log_stdout.write(`${util.format(content)}\n`)
    }

paypal.configure({
    'mode': 'sandbox', // sandbox or live
    'client_id': process.env.SANDBOX_CLIENT_ID, // client id
    'client_secret': process.env.SANDBOX_CLIENT_SECRET, // client secret
})

function send(res, page) {
    let data = fs.readFileSync(`${__dirname}/views/${page}`, 'utf8')
    if (data) {
        for (let p in products) {
            let product = products[p],
            keys = Object.keys(product),
            id = product.id;

            for (let k in keys) 
                data = data.split(`{${id}.${keys[k]}}`).join(product[keys[k]]) 
        }
        res.send(data)
    } else res.send(404);

    
}

app.get('/', (req, res) => send(res, `index.html`))
app.listen(PORT, () => log(SERVER, `Server launched on port: ${PORT}`))

app.post('/pay/paypal/single', (req, res) => {
    product = products[0]
    const create_payment_json = {
        'intent': 'sale',
        'payer': {
            'payment_method': 'paypal'
        },
        'redirect_urls': {
            'return_url': `${SITE}:${PORT}/success`,
            'cancel_url': `${SITE}:${PORT}/cancel`,
        },
        'transactions': [{
            'item_list': {
                'items': [{
                    'name': product.name,
                    'sku': product.id,
                    'price': product.price,
                    'currency': product.currency,
                    'quantity': 1
                }]
            },
            'amount': {
                'currency': product.currency,
                'total': product.price
            },
            'description': product.description
        }]
    }

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            log(ERR, error.response)
            throw error
        } else for (let i=0; i<payment.links.length; i++)
            if (payment.links[i].rel === 'approval_url')
                res.redirect(payment.links[i].href)
    })
})

app.post('/pay/paypal/triple', (req, res) => {
    product = products[1]
    const create_payment_json = {
        'intent': 'sale',
        'payer': {
            'payment_method': 'paypal'
        },
        'redirect_urls': {
            'return_url': `${SITE}:${PORT}/success`,
            'cancel_url': `${SITE}:${PORT}/cancel`,
        },
        'transactions': [{
            'item_list': {
                'items': [{
                    'name': product.name,
                    'sku': product.id,
                    'price': product.price,
                    'currency': product.currency,
                    'quantity': 1
                }]
            },
            'amount': {
                'currency': product.currency,
                'total': product.price
            },
            'description': product.description
        }]
    }

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            log(ERR, error.response)
            throw error
        } else for (let i=0; i<payment.links.length; i++)
            if (payment.links[i].rel === 'approval_url')
                res.redirect(payment.links[i].href)
    })
})

app.post('/pay/paypal/penta', (req, res) => {
    product = products[2]
    const create_payment_json = {
        'intent': 'sale',
        'payer': {
            'payment_method': 'paypal'
        },
        'redirect_urls': {
            'return_url': `${SITE}:${PORT}/success`,
            'cancel_url': `${SITE}:${PORT}/cancel`,
        },
        'transactions': [{
            'item_list': {
                'items': [{
                    'name': product.name,
                    'sku': product.id,
                    'price': product.price,
                    'currency': product.currency,
                    'quantity': 1
                }]
            },
            'amount': {
                'currency': product.currency,
                'total': product.price
            },
            'description': product.description
        }]
    }

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            log(ERR, error.response)
            throw error
        } else for (let i=0; i<payment.links.length; i++)
            if (payment.links[i].rel === 'approval_url')
                res.redirect(payment.links[i].href)
    })
})

app.get('/success', (req, res) => {
    const payerId = req.query.PayerID,
        paymentId = req.query.paymentId;
    const execute_payment_json = {
        'payer_id': payerId,
        'transactions': [{
            'amount': {
                'currency': product.currency,
                'total': product.price
            },
        }]
    }

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            log(ERR, error.response)
            throw error
        } else {
            log(PAYPAL, JSON.stringify(payment))
           send(res, `success.html`)
        }
    })
})

app.get('/cancel', (req, res) =>   send(res, `cancelled.html`))