const express = require('express')
const app = express()
const { v4: uuidv4 } = require('uuid')
const Joi = require('joi')

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

function validation(body) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    price: Joi.number().required(),
  })

  return schema.validate(body)
}

//Insert a product
app.use(express.json())
app.post('/api/products', (req, res) => {
  const { error } = validation(req.body)

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    })
  }
  const product = {
    id: uuidv4(),
    name: req.body.name,
    price: req.body.price,
  }
  products.push(product)
  return res.json(products)
})

//Update a product using PUT method
app.put('/api/products/:id', (req, res) => {
  const { error } = validation(req.body)

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    })
  }

  const index = products.findIndex((prod) => prod.id === req.params.id)
  if (index == -1) {
    return res.status(404).json({
      message: 'Product not available with this id',
    })
  }

  products[index].name = req.body.name
  products[index].price = req.body.price

  return res.json({
    product: products[index],
  })
})

//Update a product using PATCH method
app.patch('/api/products/:id', (req, res) => {
  const index = products.findIndex((prod) => prod.id === req.params.id)
  if (index == -1) {
    return res.status(404).json({
      message: 'Product not available with this id',
    })
  }

  let updateProduct = {
    ...products[index],
    ...req.body,
  }

  products[index] = updateProduct
  return res.json(updateProduct)
})

app.listen(3000, () => console.log('Server is running on port 3000'))
