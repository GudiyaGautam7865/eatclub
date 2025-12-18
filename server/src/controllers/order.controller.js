import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  const order = await Order.create({
    items: req.body.items,
    total: req.body.total,
    address: req.body.address,
    status: "PLACED",
    currentLocation: null,
  });

  res.status(201).json({
    success: true,
    order: {
      _id: order._id,   // 🔑 ye hi tracking key hai
      status: order.status,
    },
  });
};
