import { useEffect, useState } from "react";

function Admin() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    const fetchOrders = async (search = "", page = 1) => {
        try {
            setLoading(true);
            const searchParam = search.trim() || "all";
            const response = await fetch(`http://localhost:8080/admin/${searchParam}/${page}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            
            setOrders(data.orders || []);
            setTotalOrders(data.total || 0);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(searchTerm, currentPage);
    }, [searchTerm, currentPage]);

    const handleUpdatePaymentStatus = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:8080/admin`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_id: orderId
                })
            });
            
            if (response.ok) {
                console.log('Payment status updated successfully');
                // Refresh orders to show updated status
                fetchOrders(searchTerm, currentPage);
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    const handleReceive = async (orderId) => {
        try {
            // Assuming you have an endpoint for updating received status
            const response = await fetch(`http://localhost:8080/admin/receive`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_id: orderId
                })
            });
            
            if (response.ok) {
                console.log('Order received status updated successfully');
                fetchOrders(searchTerm, currentPage);
            }
        } catch (error) {
            console.error('Error updating received status:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "Not set";
        try {
            return new Date(dateTimeString).toLocaleString();
        } catch {
            return "Invalid date";
        }
    };

    return (
            <div className="max-w-7xl mx-auto">
                
                {/* Search Bar */}
                <div className="mb-8 flex justify-center">
                    <div className="relative w-96">
                        <input
                            type="text"
                            placeholder="Search by customer name..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full px-4 py-3 pl-12 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="text-center mb-6">
                    <p className="text-white font-['Pompiere'] text-xl">
                        {loading ? "Loading..." : ``}
                        {searchTerm && ` for "${searchTerm}"`}
                    </p>
                </div>

                {/* Orders Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-white text-2xl font-['Pompiere']">Loading orders...</div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-white text-2xl font-['Pompiere']">
                            {searchTerm ? `No orders found for "${searchTerm}"` : "No orders found"}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {orders.map((order, index) => (
                            <div key={order.order?.order_id || index} className="relative">
                                {/* Order Card */}
                                <div className="w-72 h-96 relative">
                                    {/* Background */}
                                    <div className="w-full h-full absolute bg-gradient-to-b from-black/25 to-black/30 shadow-[2px_2px_2px_0px_rgba(0,0,0,0.25)] shadow-[inset_0px_2px_2px_0px_rgba(255,255,255,0.08)] outline outline-1 outline-offset-[-0.50px] outline-white/10 backdrop-blur-[2px] rounded-lg" />
                                    
                                    {/* Order Number */}
                                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center text-yellow-300 text-2xl font-normal font-['Pompiere'] tracking-wide">
                                        Order #{order.order.order_id.slice(-8)}
                                    </div>

                                    {/* Customer Name */}
                                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center text-green-300 text-lg font-normal font-['Pompiere'] tracking-wide">
                                        Customer: {order.order?.customer_name || "Unknown"}
                                    </div>

                                    {/* Separator Line */}
                                    <div className="w-56 h-0 absolute left-1/2 transform -translate-x-1/2 top-20 outline outline-1 outline-offset-[-0.50px] outline-green-950" />
                                    
                                    {/* Items List */}
                                    <div className="w-64 absolute left-1/2 transform -translate-x-1/2 top-24 max-h-32 overflow-y-auto px-2">
                                        {order.sub_orders?.map((item) => (
                                            <div key={item.item_id} className="w-full flex justify-between items-start mb-2">
                                                <div className="flex-1 text-white text-lg font-normal font-['Pompiere'] tracking-wide">
                                                    {item.name} ({item.quantity})
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Times */}
                                    <div className="absolute top-44 left-4 right-4">
                                        <div className="text-white text-sm font-['Pompiere'] mb-1">
                                            <span className="text-yellow-300">Ordered:</span> {formatDateTime(order.order?.ordered_time)}
                                        </div>
                                        <div className="text-white text-sm font-['Pompiere']">
                                            <span className="text-blue-300">Received:</span> {
                                                order.order?.received_time.Valid ? formatDateTime(order.order.received_time) : "Not received"
                                            }
                                        </div>
                                    </div>

                                   

                                    {/* Separator Line */}
                                    <div className="w-56 h-0 absolute left-1/2 transform -translate-x-1/2 bottom-12 outline outline-1 outline-offset-[-0.50px] outline-green-950" />
                                     <div className="absolute bottom-4 left-4">
                                        {order.order?.payment_status === 'pending' ? (
                                            <button 
                                                className="px-4 py-2 bg-red-600 rounded-3xl text-white text-sm font-['Pompiere'] hover:bg-red-500 transition-colors" 
                                                onClick={() => handleUpdatePaymentStatus(order.order?.order_id)}
                                            >
                                                Mark Paid
                                            </button>
                                        ) : (
                                            <div className="px-4 py-2 bg-green-600 rounded-3xl text-white text-sm font-['Pompiere']">
                                                Paid
                                            </div>
                                        )}
                                    </div>
                                    {/* Total */}
                                    <div className="absolute bottom-4 right-4 transform -translate-x-1/2 flex justify-center items-center">
                                        <div className="text-white text-xl font-normal font-['Pompiere'] tracking-wide">Total: </div>
                                        <div className="text-white text-xl font-normal font-['Pompiere'] tracking-wide ml-2">
                                            ${order.order?.total_fare || '0.00'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalOrders > 8 && (
                    <div className="flex justify-center mt-8 space-x-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-yellow-600 text-white rounded disabled:bg-gray-600 disabled:cursor-not-allowed font-['Pompiere']"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-white font-['Pompiere']">
                            Page {currentPage} of {Math.ceil(totalOrders / 8)}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalOrders / 8)))}
                            disabled={currentPage >= Math.ceil(totalOrders / 8)}
                            className="px-4 py-2 bg-yellow-600 text-white rounded disabled:bg-gray-600 disabled:cursor-not-allowed font-['Pompiere']"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
    );
}

export default Admin;