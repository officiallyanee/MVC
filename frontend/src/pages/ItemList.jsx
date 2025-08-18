import { useEffect, useState } from "react";
import axios from "axios";

function ItemList() {
    const [localItemList, setLocalItemList] = useState(() => {
        try {
            const rawData = window.localStorage.getItem("itemList");
            console.log(rawData);
            return rawData ? JSON.parse(rawData) : [];
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return [];
        }
    });
    const [itemPriceList, setItemPriceList] = useState([]);
    const [tableNo, setTableNo] = useState('');
    const [specifications, setSpecifications] = useState('');
    const [customerTableNo, setCustomerTableNo] = useState(null);

    const calculateTotal = () => {
        return itemPriceList.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    };

    const checkTableStatus = async (tableNumber) => {
        if (!tableNumber || tableNumber < 1 || tableNumber > 50) {
            return { valid: false, message: "Table number should be between 1 and 50" };
        }

        try {
            const response = await axios.get(`http://localhost:8080/itemList/tablestatus/${tableNumber}`);
            return { valid: response.data, message: response.data ? "" : "Table is not available" };
        } catch (error) {
            console.error("Error checking table status:", error);
            return { valid: false, message: "Error checking table availability" };
        }
    };

    const handlePlaceOrder = async() => {
        if (!tableNo || tableNo < 1 || tableNo > 50) {
            alert("Please enter a valid table number (1-50)");
            return;
        }
        try{
            const response = await axios.post("http://localhost:8080/itemList/order", {
                table_no: parseInt(tableNo),
                specifications: specifications, 
                ordered_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
                total_fare: calculateTotal(),
                item_list: itemPriceList
            }, {
            headers: {
                'Content-Type': 'application/json'
            }
            })
            console.log(response.data);
        } catch (err) {
            console.log(err);
        }
        alert(`Order placed successfully for Table ${tableNo}!`);
    };

    useEffect(() => {
        const fetchItemPriceList = async () => {
            try {
                const response = await axios.post("http://localhost:8080/itemList/itemPriceList", localItemList
                    , {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                console.log(response.data);
                setItemPriceList(response.data);
                const tableResponse = await axios.get("http://localhost:8080/itemList/customerTableNo");
                setCustomerTableNo(tableResponse.data);
                setTableNo(tableResponse.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchItemPriceList();
    }, [localItemList])

    const handleTableChange = async (e) => {
        const value = e.target.value;
        setTableNo(value);
        if (value && !customerTableNo) {
            const tableCheck = await checkTableStatus(value);
            if (!tableCheck.valid && value !== "") {
                alert(tableCheck.message);
            }
        }
    };
    return (
        <div className="min-h-screen w-full pt-16 sm:pt-20 lg:pt-24 p-2 sm:p-4 lg:p-8">
            <div className="relative w-full max-w-[1170px] mx-auto mt-4 sm:mt-6 lg:mt-8">
                <img className="w-full h-[400px] sm:h-[500px] lg:h-[600px] opacity-50 rounded-[32px] object-cover" src="/table.png" alt="Background" />
                <div className="absolute inset-0 opacity-90 bg-stone-900/90 rounded-[32px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shadow-[inset_0px_0px_4px_0px_rgba(255,255,255,0.25)] backdrop-blur-[2px] overflow-hidden">
                    <div className="w-full max-w-80 h-12 absolute left-1/2 transform -translate-x-1/2 top-[35px] sm:top-[35px] lg:top-[35px] text-center justify-center text-yellow-300 text-2xl sm:text-3xl lg:text-4xl font-normal font-['Pompiere'] tracking-wide">
                        ItemList
                    </div>

                    <div className="w-[90%] sm:w-[85%] lg:w-[995px] h-[1px] absolute left-1/2 transform -translate-x-1/2 top-[100px] sm:top-[100px] lg:top-[100px] bg-gradient-to-r from-[#312719] via-[#FFE74C] to-[#312719]"></div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-[120px] sm:top-[120px] lg:top-[120px] w-[90%] sm:w-[85%] lg:w-[927px] h-[120px] sm:h-[140px] lg:h-[160px] overflow-y-auto pr-2">
                        {itemPriceList.map((item) => (
                            <div
                                key={item.item_id}
                                className="w-full mb-4 sm:mb-5 lg:mb-6 inline-flex justify-between items-start"
                            >
                                <div className="w-44 sm:w-52 lg:w-64 h-12 justify-center text-white text-xl sm:text-2xl lg:text-3xl font-normal font-['Pompiere'] tracking-wide">
                                    {item.item_name}({item.quantity})
                                </div>
                                <div className="w-24 self-stretch text-right justify-center text-white text-xl sm:text-2xl lg:text-3xl font-normal font-['Pompiere'] tracking-wide">
                                    ${item.price * item.quantity}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-[260px] sm:top-[290px] lg:top-[320px] w-[90%] sm:w-[85%] lg:w-[927px] space-y-3">  
                        <div className="inline-flex justify-between items-center">
                            <label className="text-white text-xl sm:text-2xl lg:text-3xl font-normal font-['Pompiere'] tracking-wide">
                                Table No :
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={customerTableNo || tableNo}
                                onChange={customerTableNo ? null : handleTableChange}
                                readOnly={customerTableNo !== null}
                                className={`w-20 h-10 px-2 bg-stone-900/50 border border-stone-600/50 rounded-lg text-white text-xl sm:text-2xl font-normal font-['Pompiere'] tracking-wide text-center focus:outline-none focus:border-[#2D1B0F] focus:bg-stone-800 ${customerTableNo ? 'opacity-60' : ''}`}
                                placeholder="1-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-white text-xl sm:text-2xl lg:text-3xl font-normal font-['Pompiere'] tracking-wide">
                                Specifications :
                            </label>
                            <textarea
                                value={specifications}
                                onChange={(e) => setSpecifications(e.target.value)}
                                maxLength="200"
                                className="w-full h-16 px-3 py-2 bg-stone-900/50 border border-stone-600/50 rounded-lg text-white text-lg sm:text-xl font-normal font-['Pompiere'] tracking-wide resize-none focus:outline-none focus:border-yellow-300 focus:bg-stone-800"
                                placeholder="Any special instructions (max 200 characters)..."
                            />
                            <div className="text-right text-white text-sm font-['Pompiere']">
                                {specifications.length}/200
                            </div>
                        </div>
                    </div>

                    <div className="w-[90%] sm:w-[85%] lg:w-[927px] h-12 absolute left-1/2 transform -translate-x-1/2 bottom-[30px] sm:bottom-[35px] lg:bottom-[40px] inline-flex justify-between items-center">

                        <button
                            onClick={handlePlaceOrder}
                            className="h-12 sm:h-14 bg-yellow-300 hover:bg-yellow-400 transition-colors duration-200 rounded-3xl overflow-hidden cursor-pointer px-6"
                        >
                            <div className="h-full flex items-center justify-center text-stone-900 text-xl sm:text-2xl lg:text-3xl font-normal font-['Pompiere'] tracking-wide">
                                Place order
                            </div>
                        </button>
                        <div className="inline-flex items-center gap-4">
                            <div className="text-white text-xl sm:text-2xl lg:text-3xl font-normal font-['Pompiere'] tracking-wide">
                                Total :
                            </div>
                            <div className="text-white text-xl sm:text-2xl lg:text-3xl font-normal font-['Pompiere'] tracking-wide">
                                ${calculateTotal()}
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default ItemList