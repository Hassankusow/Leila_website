const express = require('express');                              
  const mongoose = require('mongoose');                            
  const cors = require('cors');                                    
  const path = require('path');                                    
  require('dotenv').config();                                      
                                                                   
  const app = express();                                           
  const PORT = process.env.PORT || 3000;                           
                                                                   
  // Middleware                                                    
  app.use(cors());                                                 
  app.use(express.json());                                         
  app.use(express.urlencoded({ extended: true }));                 
  app.use(express.static('.'));                                    
                                                                   
  // MongoDB connection                                            
  const MONGODB_URI = process.env.MONGODB_URI ||                   
  'mongodb://localhost:27017/leila_clothing';                      
                                                                   
  mongoose.connect(MONGODB_URI)                                    
    .then(() => console.log('Connected to MongoDB'))               
    .catch(err => console.error('MongoDB connection error:',       
  err));                                                           
                                                                   
  // Product Schema                                                
  const productSchema = new mongoose.Schema({                      
    name: { type: String, required: true },                        
    description: { type: String, required: true },                 
    price: { type: Number, required: true },                       
    category: { type: String, enum: ['men', 'women'], required:    
   true },                                                         
    image: { type: String, required: true },                       
    sizes: [{ type: String }],                                     
    inStock: { type: Boolean, default: true },                     
    featured: { type: Boolean, default: false },                   
    createdAt: { type: Date, default: Date.now }                   
  });                                                              
                                                                   
  const Product = mongoose.model('Product', productSchema);        
                                                                   
  // API Routes                                                    
  app.get('/api/products', async (req, res) => {                   
    try {                                                          
      const { category, featured } = req.query;                    
      let filter = {};                                             
                                                                   
      if (category) filter.category = category;                    
      if (featured) filter.featured = true;                        
                                                                   
      const products = await Product.find(filter).sort({           
  createdAt: -1 });                                                
      res.json(products);                                          
    } catch (error) {                                              
      res.status(500).json({ error: error.message });              
    }                                                              
  });                                                              
                                                                   
  app.get('/api/products/:id', async (req, res) => {               
    try {                                                          
      const product = await Product.findById(req.params.id);       
      if (!product) {                                              
        return res.status(404).json({ error: 'Product not          
  found' });                                                       
      }                                                            
      res.json(product);                                           
    } catch (error) {                                              
      res.status(500).json({ error: error.message });              
    }                                                              
  });                                                              
                                                                   
  app.post('/api/products', async (req, res) => {                  
    try {                                                          
      const product = new Product(req.body);                       
      await product.save();                                        
      res.status(201).json(product);                               
    } catch (error) {                                              
      res.status(400).json({ error: error.message });              
    }                                                              
  });                                                              
                                                                   
  app.put('/api/products/:id', async (req, res) => {               
    try {                                                          
      const product = await Product.findByIdAndUpdate(             
        req.params.id,                                             
        req.body,                                                  
        { new: true, runValidators: true }                         
      );                                                           
      if (!product) {                                              
        return res.status(404).json({ error: 'Product not          
  found' });                                                       
      }                                                            
      res.json(product);                                           
    } catch (error) {                                              
      res.status(400).json({ error: error.message });              
    }                                                              
  });                                                              
                                                                   
  app.delete('/api/products/:id', async (req, res) => {            
    try {                                                          
      const product = await                                        
  Product.findByIdAndDelete(req.params.id);                        
      if (!product) {                                              
        return res.status(404).json({ error: 'Product not          
  found' });                                                       
      }                                                            
      res.json({ message: 'Product deleted successfully' });       
    } catch (error) {                                              
      res.status(500).json({ error: error.message });              
    }                                                              
  });                                                              
                                                                   
  app.get('/admin', (req, res) => {                                
    res.sendFile(path.join(__dirname, 'admin.html'));              
  });                                                              
                                                                   
  app.get('/', (req, res) => {                                     
    res.sendFile(path.join(__dirname, 'clothing.html'));           
  });                                                              
                                                                   
  app.listen(PORT, () => {                                         
    console.log(`Server running on port ${PORT}`);                 
    console.log(`Main site: http://localhost:${PORT}`);            
    console.log(`Admin panel: http://localhost:${PORT}/admin`);    
  }); 
