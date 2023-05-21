const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

const products = [
  {
    id: '1',
    name: 'orange',
    price: 20,
  },
  {
    id: '2',
    name: 'apple',
    price: 30,
  },
]

//Show list of all products
app.get('/api/products', (req, res) => {
  res.json(products)
})

//Show specific products
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params
  const product = products.find((b) => b.id === id)

  if (!product) {
    return res.status(404).json({
      error: 'No product found with this ID',
    })
  }
  return res.json(product)
})
app.listen(3000, () => console.log('Server is running on port 3000'))
