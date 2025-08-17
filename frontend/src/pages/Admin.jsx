import { useEffect } from "react";
import axios from "axios";

function Admin() {
    useEffect(() => {
        const fetchOrders = async (searchTerm = "", page = 1) => {
            try {
                const search = searchTerm.trim() || "all";
                const response = await axios.get(`http://localhost:8080/admin/${search}/${page}`);
                const data = await response.data;
                console.log(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }
        fetchOrders();
    }, [])
    const handleUpdatePaymentStatus = async (orderId) => {
        try {
        const response = await axios.patch(`http://localhost:8080/admin`, {
            order_id: orderId
        }, {
            headers: {
            'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            console.log('Payment status updated successfully');
        }
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    }
    return <div>Admin</div>
}   

export default Admin