const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(express.json());

const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      const products = JSON.parse(data);
      res.json(products);
    }
  });
});

productsRouter.get('/:pid', (req, res) => {
  const pid = req.params.pid;
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      const products = JSON.parse(data);
      const product = products.find((p) => p.id === pid);
      if (product) {
        res.json(product);
      } else {
        res.status(404).send('Producto no encontrado');
      }
    }
  });
});

productsRouter.post('/', (req, res) => {
  const product = req.body;
  product.id = Date.now().toString(); 

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      const products = JSON.parse(data);
      products.push(product);

      fs.writeFile('productos.json', JSON.stringify(products), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error al guardar el producto');
        } else {
          res.status(201).json(product);
        }
      });
    }
  });
});

productsRouter.put('/:pid', (req, res) => {
  const pid = req.params.pid;
  const updatedProduct = req.body;

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      let products = JSON.parse(data);
      const index = products.findIndex((p) => p.id === pid);

      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };

        fs.writeFile('productos.json', JSON.stringify(products), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error al guardar el producto actualizado');
          } else {
            res.json(products[index]);
          }
        });
      } else {
        res.status(404).send('Producto no encontrado');
      }
    }
  });
});

productsRouter.delete('/:pid', (req, res) => {
  const pid = req.params.pid;

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      let products = JSON.parse(data);
      const index = products.findIndex((p) => p.id === pid);

      if (index !== -1) {
        products.splice(index, 1);

        fs.writeFile('productos.json', JSON.stringify(products), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error al eliminar el producto');
          } else {
            res.sendStatus(204);
          }
        });
      } else {
        res.status(404).send('Producto no encontrado');
      }
    }
  });
});

const cartsRouter = express.Router();

cartsRouter.get('/:cid', (req, res) => {
  const cid = req.params.cid;
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los carritos de compras');
    } else {
      const cartData = JSON.parse(data);
      const cart = cartData.carritos.find((c) => c.id === cid);
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).send('Carrito de compras no encontrado');
      }
    }
  });
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los carritos de compras');
    } else {
      let cartData = JSON.parse(data);
      const cart = cartData.carritos.find((c) => c.id === cid);
      if (cart) {
        const existingProduct = cart.products.find((p) => p.product === pid);
        if (existingProduct) {
          existingProduct.quantity++;
        } else {
          cart.products.push({ product: pid, quantity: 1 });
        }
        fs.writeFile('carrito.json', JSON.stringify(cartData), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error al guardar el carrito de compras');
          } else {
            res.status(201).json(cart);
          }
        });
      } else {
        res.status(404).send('Carrito de compras no encontrado');
      }
    }
  });
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
