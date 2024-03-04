const express = require('express');
const router = express.Router({mergeParams:true});

const {protect,authorize} = require('../middleware/auth');
const {getReserves,getReserve,addReserve,updateReserve,deleteReserve} = require('../controllers/reserves');

router.route('/').get(protect,getReserves).post(protect,authorize('admin','user'),addReserve);
router.route('/:id').get(protect,getReserve).put(protect,authorize('admin','user'),updateReserve).delete(protect,authorize('admin','user'),deleteReserve);

module.exports = router;