const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const { v4: uuidv4 } = require("uuid");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_test_qNgNwaeMjtdQb4",
  key_secret: "o4quhi9gtJ7l6jJ779YHupHl",
});

router.post("/bookcar", async (req, res) => {
  const { token } = req.body;
  try {
    const options = {
      amount: req.body.totalAmount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: uuidv4(),
    };

    const order = await razorpay.orders.create(options);

    const newBooking = new Booking({
      // Populate with required booking data
      user: req.body.user,
      car: req.body.car,
      totalHours: req.body.totalHours,
      totalAmount: req.body.totalAmount,
      driverRequired: req.body.driverRequired,
      bookedTimeSlots: req.body.bookedTimeSlots,
      transactionId: order.id, // Use order id as transaction id for reference
    });

    await newBooking.save();

    const car = await Car.findOne({ _id: req.body.car });
    car.bookedTimeSlots.push(req.body.bookedTimeSlots);
    await car.save();

    res.json({ orderId: order.id }); // Return order ID for client-side processing
  } catch (error) {
    console.error("Error in booking:", error);
    res.status(500).send("Error in booking");
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("car");
    res.send(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).send("Error fetching bookings");
  }
});

module.exports = router;
