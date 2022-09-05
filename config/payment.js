const Razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");

exports.razorpay = (req, res, next) => {
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  var options = {
    amount: req.body.amount * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: uuidv4(),
  };
  instance.orders.create(options, function (err, order) {
    if (err || !order) {
      return res.status(400).json({
        error: "Payment fail",
      });
    }
    next();
  });
};
