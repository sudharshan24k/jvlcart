const express = require('express');
const { newOrder, getSingleOrder,myOrders,orders, updateOrder, deleteOrder } = require('../controllers/orderController');
const { isAuthenticatedUser, authoriseRoles } = require('../middlewares/authenticate');
const router= express.Router();

router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser,myOrders);

//Admin routes
router.route('/orders').get(isAuthenticatedUser,authoriseRoles('admin'),orders);
router.route('/order/:id').put(isAuthenticatedUser,authoriseRoles('admin'),updateOrder);
router.route('/order/:id').delete(isAuthenticatedUser,authoriseRoles('admin'),deleteOrder);


module.exports = router;
