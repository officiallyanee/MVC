import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import CustomDropdown from "../components/DropDown";
import Item from "../components/Item";
import axios from "axios";
import { BackendUrlContext } from "../context/BackendUrl";
import { useLocation } from "react-router-dom";

function MenuPage() {
  const backendURL = useContext(BackendUrlContext)
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const fromHome = location.state?.from === 'home';
  const [selected, setSelected] = useState(null);
  const toastStyle = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  }
  const [itemList, setItemList] = useState(() => {
    try {
      const rawData = window.localStorage.getItem("itemList");
      return rawData ? JSON.parse(rawData) : [];
    } catch (error) {
      return [];
    }
  });
  const handleSelection = (category) => {
    setSelected(category.category);
  };


  useEffect(() => {
    const fetchItemList = async () => {
      try {
        const response = await axios.get(backendURL + "/menu");
        setMenuItems(response.data.items);
        setCategories(response.data.categories);
      } catch (error) {
        toast.error("Try again later", toastStyle);
      }
    }
    fetchItemList();
  }, []);



  useEffect(() => {
    try {
      const dataString = JSON.stringify(itemList);
      window.localStorage.setItem("itemList", dataString);
    } catch (error) {
      toast.error("Try again later", toastStyle);
    }
  }, [itemList]);

  const addQuantity = (productId) => {
    setItemList(prevList => {
      const existingItem = prevList.find(item => item.item_id === productId);

      if (existingItem) {
        return prevList.map(item =>
          item.item_id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevList, { item_id: productId, quantity: 1 }];
      }
    });
  };

  const subQuantity = (productId) => {
    setItemList(prevList => {
      const existingItem = prevList.find(item => item.item_id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevList.map(item =>
          item.item_id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else if (existingItem && existingItem.quantity === 1) {
        return prevList.filter(item => item.item_id !== productId);
      }

      return prevList;
    });
  };

  return (
    < >
      <motion.div
        className="absolute inset-0 pt-32 pb-8 px-4 sm:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={fromHome ? { delay: 2.6, duration: 0.5 } : { duration: 0.3 }}
      >
        <CustomDropdown
          categories={categories}
          onSelectCategory={handleSelection}
          setMenuItems={setMenuItems}
        />
        <div className="menu h-[calc(100vh-200px)] justify-items-center  w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 overflow-y-scroll pt-2 ">

          {menuItems.map((item) => {
            const quantity = itemList.find(itemList => itemList.item_id === item.item_id)?.quantity || 0;
            return (
              <Item
                key={item.item_id}
                id={item.item_id}
                name={item.name}
                imageSrc={item.image_url}
                status={item.availablity ? "Available" : "Unavailable"}
                quantity={quantity}
                price={item.price_per_item}
                description={item.description}
                addQuantity={addQuantity}
                subQuantity={subQuantity}
              />)
          })}

        </div>
      </motion.div>
    </>
  );
}

export default MenuPage