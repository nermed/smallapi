const app = require('express')()
const cors = require('cors')
const axios = require('axios')
const bodyParser = require('body-parser')

app.use(
  cors({
    credentials: true,
    origin: true,
  }),
)
app.options('*', cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Cool!!!'))

app.post('/getInvoice', async function (req, res) {
  let token = ''
  let login = req.body.loginData;
  let signature = req.body.signature;
  // console.log(req.body.signature);return;
  await connect(login).then((data) => (token = data))
  if (token) {
    try {
      const ress = await axios
        .post(
          'http://41.79.226.28:8345/ebms_api/getInvoice',
          { invoice_signature: signature },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((rep) => {
          res.status(rep.status).send(rep.data.result.invoices)
        })
        .catch((error) => console.log(error))
    } catch (error) {
      console.log(error)
    }
  }
})

app.post('/check', async function (req, res) {
  let token = null
  let nif = req.body.nif
  let login = req.body.loginData
  await connect(login).then((data) => (token = data))

  if (token) {
    try {
      const verify = await axios
        .post(
          'http://41.79.226.28:8345/ebms_api/checkTIN',
          { tp_TIN: nif },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((rep) => {
          // console.log(rep.status)
          res.status(rep.status).send(rep.data.result)
        })
        .catch((err) => {
          // console.log(err.response)
          res.status(err.status).send(err.data.result)
        })
    } catch (e) {
      console.log(e)
    }
  }
})

app.post('/request', async function (req, res) {
  var loginData = req.body.loginData
  var data = req.body.data;
  var token = ''
  var error = false;

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  const ress = await axios
    .post('http://41.79.226.28:8345/ebms_api/login', loginData, { headers })
    .then((rep) => (token = rep.data.result.token))
    .catch((error) => console.log(error))

  if (token.length > 0) {
    try {
      const dataa = await axios
      .post(
        'http://41.79.226.28:8345/ebms_api/addInvoice',
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((rep) => {
        console.log('rep -> ', rep);
        res.status(rep.status).send(rep.data);
        return;
      })
      .catch((error) => {
        if(error.response) {
          console.log(error.response.status);
          res.status(error.response.status).send(`${error.response.data.msg} (${JSON.parse(data).invoice_number})`)
          return;
        }
      })
    } catch (e) {
      res.status(e).send('erreur' + e)
    }
  }
})

let port = 8000
app.listen(process.env.PORT || port, () => {
  console.log(`listen on ${port}`)
})

const requesting = async (datas, token, verify, t = 0) => {
  let errorRender = null;
  let status = null;
  const dataa = await axios
    .post(
      'http://41.79.226.28:8345/ebms_api/addInvoice',
      JSON.stringify(datas[t]),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + token,
        },
      },
    )
    .then((rep) => {
      verify = true;
    })
    .catch((error) => {
      errorRender = `${error.response.data.msg} (${datas[t].invoice_number})`;
      status = error.response.status
      verify = false;
    })
    if(verify) {
      let tt = t + 1;
      let end = false;
      console.log('ok ', datas[t].invoice_number);
      if(tt < datas.length) {
        requesting(datas, token, verify, tt);
        console.log('suivant -> ', datas[tt].invoice_number);
      } else {
        console.log('finis');
        return {errorRender:'Finis', verify: false, status: 201};
      }
    } else {
      return {errorRender, verify, status};
    }
}
async function connect(loginData) {
  let token = null

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  const ress = await axios
    .post('http://41.79.226.28:8345/ebms_api/login', loginData, { headers })
    .then((rep) => (token = rep.data.result.token))
    .catch((error) => console.log(error))

  if (token) {
    return token
  }
}