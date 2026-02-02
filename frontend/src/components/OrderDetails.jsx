const OrderDetails = ({ order }) => {
  // 🔹 Main level data
  const {
    _id: orderId,
    totalAmount,
    paymentMethod,
    
    deliveryAddress,
    shopOrders,
  } = order;

  // 🔹 Address
  const { text, } = deliveryAddress || {};

  // 🔹 First shop order (kyunki array hai)
  const shopOrder = shopOrders?.[0];

  // 🔹 Shop order ke andar ka data
  const {
    deliveryAt,
    shopOrderItem,
  } = shopOrder || {};

  // 🔹 First item
  const item = shopOrderItem?.[0];

  return (
    <div style={{ padding: "16px", border: "1px solid #ccc" } } className="p-4 mb-3">
      <h3 className="font-bold mb-3 text-center text-[#ff4d2d]">Order Details</h3>

      <p><b>Order ID:</b> {orderId}</p>

      <p><b>Payment Method:</b> {paymentMethod}</p>


      <p><b>Name:</b> {item?.name}</p>
      <p><b>Quantity:</b> {item?.qnty}</p>
      <p className="line-clamp-1"><b>Address:</b> {text}</p>
      <p><b>Delivered At:</b> {deliveryAt}</p>
      <p><b>Total Amount:</b> ₹{totalAmount}</p>
    </div>
  );
};

export default OrderDetails;
