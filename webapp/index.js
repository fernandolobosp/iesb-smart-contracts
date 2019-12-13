const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const products = require("./apis/products/packages.js");
// set default views folder
app.set('views', __dirname + "/views");
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// registra a sessão do usuário
app.use(session({
    secret: 'mysecret',
    saveUninitialized: false,
    resave: false
}));

const authRoutes = require('./apis/routes/auth.js');

app.get('/', (req, res) => {
    res.redirect('/api/auth');
});

// * Auth pages * //
app.use("/api/auth", authRoutes);

// * Package pages * //
app.get("/addPackage", products.renderAddPackage);
app.get("/getPackages", products.renderGetPackages);
app.get("/editPackage", products.renderEditPackage);
app.get("/getPackage", products.getPackage);

app.post("/addPackage", products.addPackage);
app.post("/updatePackage", products.updatePackage);
app.get("/listPackages", products.getPackages);


const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log(`App listening on port ${PORT}`);
})