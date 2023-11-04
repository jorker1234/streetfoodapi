const router = require("express").Router();
const auth = require('./auth');
const user = require('./user');
const menu = require("./menu");
const shop = require("./shop");
const order = require("./order");
const bill = require("./bill");
const material = require("./material");

router.use('/auth', auth);
router.use('/users', user);
router.use("/menus", menu);
router.use("/shops", shop);
router.use("/orders", order);
router.use("/bills", bill);
router.use("/materials", material);

module.exports = router;
