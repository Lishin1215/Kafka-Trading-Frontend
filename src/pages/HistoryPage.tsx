import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Order {
  id: number;
  asset: string;
  orderType: string;
  quantity: number;
  price: number;
  status: string;
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

  // If you want to enforce login, uncomment:
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId || !storedUsername) {
      navigate("/login");
    } else {
      setUsername(storedUsername);
      fetchOrders(storedUserId);
    }
  });

  const fetchOrders = async (userId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8082/api/order/history?userId=${userId}`
      );
      setOrders(response.data.orders);
    } catch (error) {
      alert("Failed to retrieve order history!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NavBar */}
      <nav className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-white text-xl font-bold">Order History</h1>
          <div className="space-x-3 flex items-center">
            <button
              onClick={() => navigate("/trade")}
              className="bg-white text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded font-semibold transition"
            >
              Back to Trade
            </button>
            <button
              onClick={handleLogout}
              className="bg-white text-red-600 hover:bg-red-100 px-4 py-2 rounded font-semibold transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Order History</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Asset</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr
                  key={order.id}
                  className={i % 2 === 0 ? "bg-white": "bg-gray-50"}
                >
                  <td className="py-2 px-4">{order.id}</td>
                  <td className="py-2 px-4">{order.asset}</td>
                  <td className="py-2 px-4">{order.orderType}</td>
                  <td className="py-2 px-4">{order.quantity}</td>
                  <td className="py-2 px-4">${order.price.toFixed(2)}</td>
                  <td className="py-2 px-4">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;