import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import CustomDropdown from "../components/DropDown";
import Item from "../components/Item";
import axios from "axios";

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [itemList, setItemList] = useState(() => {
    try {
      const rawData = window.localStorage.getItem("itemList");
      return rawData ? JSON.parse(rawData) : [];
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return [];
    }
  });
  const handleSelection = (category) => {
    console.log("Selected category in App:", category.category);
    setSelected(category.category);
  };

  
  useEffect(() => {
    const fetchItemList = async () => {
      try {
        const response = await axios.get("http://localhost:8080/menu");
        setMenuItems(response.data.items);
        setCategories(response.data.categories);
      } catch (err) {
        console.log(err);
      }
    }
    fetchItemList();
  }
    , []);



  useEffect(() => {
    try {
      console.log(itemList);
      const dataString = JSON.stringify(itemList);
      window.localStorage.setItem("itemList", dataString);
    } catch (error) {
      console.error("Error writing cart to localStorage", error);
    }
  }, [itemList]);

  const addQuantity = (productId) => {
    setItemList(prevList => {
      const existingItem = prevList.find(item => item.item_id === productId);

      if (existingItem) {
        return prevList.map(item =>
          item.item_id === productId
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      } else {
        return [...prevList, { item_id: productId, qty: 1 }];
      }
    });
  };

  const subQuantity = (productId) => {
    setItemList(prevList => {
      const existingItem = prevList.find(item => item.item_id === productId);

      if (existingItem && existingItem.qty > 1) {
        return prevList.map(item =>
          item.item_id === productId ? { ...item, qty: item.qty - 1 } : item
        );
      } else if (existingItem && existingItem.qty === 1) {
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
        transition={{ delay: 2.6, duration: 0.5 }}
      >
        <CustomDropdown
          categories={categories}
          onSelectCategory={handleSelection}
          setMenuItems={setMenuItems}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 place-items-center">

          {menuItems.map((item) => {
            const quantity = itemList.find(itemList => itemList.item_id === item.item_id)?.qty || 0;
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