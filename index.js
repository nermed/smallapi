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

app.post('/request', async function (req, res) {
  var loginData = req.body.loginData
  var data = JSON.parse(req.body.data)
  var token = ''
  var error = false

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  const ress = await axios
    .post('http://41.79.226.28:8345/ebms_api/login', loginData, { headers })
    .then((rep) => (token = rep.data.result.token))
    .catch((error) => console.log(error))

  if (token.length > 0) {
    try {
      let t = 1;
      data.forEach(async (element) => {
        try {
          const dataa = await axios
            .post(
              'http://41.79.226.28:8345/ebms_api/addInvoice',
              JSON.stringify(element),
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  Authorization: 'Bearer ' + token,
                },
              },
            )
            .then((rep) => console.log(rep.data.msg))
            .catch((error) => {
              res.status(error.response.status).send(`Sur la ligne ${t} : ${error.response.data.msg}. Reessayez a partir de cette ligne`);
              return;
            })
            t++;
        } catch (error) {
          console.log('erreur');
        }
      })
    } catch (e) {
      res.status(e.response.status).send('erreur' + e.response.data.msg)
    }
  }
})

let port = 8000
app.listen(process.env.PORT || port, () => {
  console.log(`listen on ${port}`)
})
