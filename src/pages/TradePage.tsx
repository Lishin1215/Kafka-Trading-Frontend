import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Stock {
  symbol: string;
  price: number;
}

interface OrderUpdate {
  orderId: string;
  status: string;
}

const TradePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userid, setuserid] = useState("");
  const [balance, setBalance] = useState(0);
  const [asset, setAsset] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [orderUpdates, setOrderUpdates] = useState<OrderUpdate[]>([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const s = localStorage.getItem("token");
    const storeduserid = localStorage.getItem("userid");
    if (!storedUsername || !storeduserid) {
      navigate("/login");
    } else {
      setUsername(storedUsername);
      setuserid(storeduserid);
      fetchBalance(storedUsername);
      connectStockWebSocket();
    }
  }, [navigate]);

  // 取得使用者餘額
  const fetchBalance = async (userid: string) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/user/balance?userid=${userid}`);
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Failed to fetch balance", error);
    }
  };

  // WebSocket 連線至即時股票價格
  const connectStockWebSocket = () => {
    const socket = new WebSocket("ws://localhost:8082/ws/stocks");

    socket.onmessage = (event) => {
      const updatedStock = JSON.parse(event.data);
      setStocks((prevStocks) => {
        const updatedList = prevStocks.map(stock =>
          stock.symbol === updatedStock.symbol ? updatedStock : stock
        );
        if (!updatedList.find(stock => stock.symbol === updatedStock.symbol)) {
          updatedList.push(updatedStock);
        }
        return updatedList;
      });
    };

    socket.onerror = (error) => console.error("Stock WebSocket Error:", error);
    socket.onclose = () => {
      console.log("Stock WebSocket Disconnected. Reconnecting...");
      setTimeout(connectStockWebSocket, 5000);
    };
  };


  // 下單交易
  const handleTrade = async (orderType: "BUY" | "SELL") => {
    try {
      const response = await axios.post("http://localhost:8082/api/order/place", {
        userid,
        asset,
        orderType,
        quantity,
        price,
      });

      alert(`Order placed successfully!`);
    } catch (error) {
      alert("Trade request failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NavBar */}
      <nav className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-white text-xl font-bold">Trading Platform</h1>
          <div className="flex space-x-6 items-center">
            <span className="text-white font-semibold">Balance: ${balance.toFixed(2)}</span>
            <button
              onClick={() => navigate("/history")}
              className="bg-white text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded font-semibold transition"
            >
              History
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("username");
                localStorage.removeItem("userid");
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="bg-white text-red-600 hover:bg-red-100 px-4 py-2 rounded font-semibold transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Trade Center</h2>

        {/* 交易表單 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-1 text-gray-600 font-semibold">Stock Symbol</label>
            <input
              type="text"
              placeholder="e.g. AAPL, TSLA"
              className="w-full p-2 border border-gray-300 rounded"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600 font-semibold">Quantity</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
        </div>

        {/* 交易按鈕 */}
        <div className="flex space-x-4">
          <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded" onClick={() => handleTrade("BUY")}>
            Buy
          </button>
          <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded" onClick={() => handleTrade("SELL")}>
            Sell
          </button>
        </div>


        {/* 即時股價區塊 */}
        <div className="mt-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Live Stock Prices</h3>

        {stocks.length === 0 ? (
            <p className="text-gray-500">No stock price data available</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stocks.map((stock) => (
                <div
                // key={stock.symbol}
                className="flex justify-between items-center p-4 bg-gray-50 rounded shadow-sm"
                >
                <span className="font-semibold text-gray-700">{stock.symbol}</span>
                <span className="text-green-600 font-bold">
                    ${stock.price.toFixed(2)}
                </span>
                </div>
            ))}
            </div>
        )}
        </div>

      </main>
    </div>
  );
};

export default TradePage;