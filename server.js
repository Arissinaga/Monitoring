const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let dataProduksi = [];
let id = 1;

// USER LOGIN
let users = [
  {username: 'admin', password: '123', role: 'admin'},
  {username: 'operator', password: '123', role: 'operator'}
];

let currentUser = null;

// LOGIN
app.post('/login', (req,res)=>{
  const {username, password} = req.body;

  const user = users.find(u => 
    u.username === username && u.password === password
  );

  if(user){
    currentUser = user;
    res.json({status:'success'});
  } else {
    res.status(401).json({status:'error'});
  }
});

// AUTH CHECK
app.get('/auth', (req,res)=>{
  if(currentUser){
    res.json(currentUser);
  } else {
    res.status(401).json({error:'Unauthorized'});
  }
});

// LOGOUT
app.get('/logout', (req,res)=>{
  currentUser = null;
  res.json({status:'logout'});
});

// GET DATA
app.get('/produksi', (req,res)=>{
  const {tanggal} = req.query;

  let result = dataProduksi;

  if(tanggal){
    result = dataProduksi.filter(d => d.tanggal === tanggal);
  }

  res.json(result);
});

// POST DATA
app.post('/produksi', (req,res)=>{
  const {kebun, jumlah, shift, tanggal} = req.body;

  dataProduksi.push({
    id: id++,
    kebun,
    jumlah,
    shift,
    tanggal
  });

  res.json({status:'ok'});
});

// DELETE DATA
app.delete('/produksi/:id', (req,res)=>{
  const idHapus = parseInt(req.params.id);
  dataProduksi = dataProduksi.filter(d => d.id !== idHapus);
  res.json({status:'deleted'});
});

app.listen(3000, ()=>console.log('Server running di http://localhost:3000'));