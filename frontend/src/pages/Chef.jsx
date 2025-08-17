import {  useEffect } from "react";
import axios from "axios";

function Chef() {
    useEffect(() => {
      const fetchAllPendingOrders = async () => {
        try {
          const response = await axios.get('http://localhost:8080/chef');
          const data = await response.data;
          console.log(data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }

      fetchAllPendingOrders();  
    },[])
    const handleUpdateChef=async(orderId,itemId) =>{
        try {
            const response = await axios.patch(`http://localhost:8080/chef`, {
                order_id: orderId,
                item_id: itemId
            }, {
                headers: {
                'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                console.log('Chef updated successfully');
            }
            } catch (error) {
                console.error('Error updating Chef:', error);
            }
    }
    return (
        <div>
            <h1>Chef</h1>
        </div>
    );
}    

export default Chef