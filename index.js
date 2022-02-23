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

app.get('/', (req, res) => res.send('Cool!!!'));

app.post('/request', async function (res, req) {
  console.log('hey')

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  var token = ''
  const ress = await axios
    .post(
      'http://41.79.226.28:8345/ebms_api/login',
      { username: 'ws400114529300018', password: ')2HIOm&d' },
      { headers },
    )
    .then((rep) => (token = rep.data.result.token))
    .catch((error) => console.log(error))

  if (token.length > 0) {
    const dataa = await axios
      .post(
        'http://41.79.226.28:8345/ebms_api/addInvoice',
        {
          invoice_number: '0001/2022',
          invoice_date: '2021-12-07 12:00:45',
          payment_type: 'En Espece',
          customer_name: 'NGARUKIYINTWARI WAKA',
          customer_TIN: '4000202020',
          customer_address: 'KIRUNDO',
          vat_customer_payer: '1',
          cancelled_invoice_ref: '',
          invoice_signature_date: '2021-12-07 12:00:45',
          invoice_signature: '4000202020/S00001/20211207120045/0001',
          invoices_item: [
            {
              item_designation: '10',
              item_quantity: '10',
              item_price: '500',
              item_ct: '0',
              item_tl: '0',
              item_price_nvat: '5000',
              vat: '18',
              item_price_wvat: '5900',
              item_total_amount: '5900',
            },
            {
              item_designation: '45',
              item_quantity: '10',
              item_price: '200',
              item_ct: '0',
              item_tl: '0',
              item_price_nvat: '90000',
              vat: '18',
              item_price_wvat: '106200',
              item_total_amount: '106200',
            },
          ],
          tp_type: '1',
          tp_name: 'NDIKUMANA JEAN MARIE',
          tp_TIN: '4000773244',
          tp_trade_number: '3333',
          tp_postal_number: '3256',
          tp_phone_number: '79959590',
          tp_address_province: 'BUJUMBURA',
          tp_address_commune: 'Bujumbura',
          tp_address_quartier: 'GIKUNGU',
          tp_address_avenue: 'MUYINGA',
          tp_address_rue: 'NYAMBUYE',
          tp_address_number: '12',
          vat_taxpayer: '1',
          ct_taxpayer: '0',
          tl_taxpayer: '0',
          tp_fiscal_center: 'DGC',
          tp_activity_sector: 'SERVICE MARCHAND',
          tp_legal_form: 'suprl',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((rep) => console.log(rep))
      .catch((error) => console.log(error))
  }
})

let port = 8000
app.listen(process.env.PORT || port, () => {
  console.log(`listen on ${port}`)
})
