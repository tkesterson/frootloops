import React, { useState, useEffect } from "react";
import { Header, Main, Product, Cart, Auth } from "./";
import getAllProducts from "../api/products/getAllProducts.js";
import { getCurrentUser } from "../auth";
import ViewUsers from "./ViewUsers";
import AdminAddProduct from "./AdminAddProduct";
import AdminEditProduct from "./AdminEditProduct";
import getUserCart from "../api/cart/getUserCart";
import { AdminEditModal } from "./index";

const App = () => {
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(0);
  const [modalProduct, setModalProduct] = useState(null);
  const [openProduct, setOpenProduct] = useState(false);
  const [userCart, setUserCart] = useState(null);
  const [currentSearchText, setCurrentSearchText] = useState("");
  const [subCategory, setSubCategory] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showSignUp, setShowSignUp] = useState(false);
  const [showAuth, setShowAuth ] = useState(false);
  const [showLogIn, setShowLogIn ]= useState(false)
  
  const [openCart, setOpenCart] = useState(false);

  const [openUsers, setOpenUsers] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [editModal, setEditModal] = useState(false);

  //get all products and set the product state
  useEffect(() => {
    async function fetchProducts() {
      const data = await getAllProducts();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  //get user cart id and products in that cart
  useEffect(() => {
    async function fetchCart() {
      const data = await getUserCart(currentUser);
      setUserCart(data);
    }
    async function fetchEmptyCart() {
      //everyone starts out with an empty cart if they're logged in
      const data = await getUserCart(4); 
      setUserCart(data);
    }
    if (currentUser) fetchCart();
    if(!currentUser) fetchEmptyCart();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
  }, [currentUser]);

  const handleSearchTextChange = (e) => {
    const newSearchText = e.currentTarget.value;
    setCurrentSearchText((oldSearchText) => {
      // console.log(newSearchText);
      return newSearchText;
    });
  };

  const handleSubCategoryChange = (event) => {
    event.preventDefault();
    const subCategorySearch = event.target.value;
    setSubCategory(() => {
      return subCategorySearch;
    });
  };

  const filteredProducts = () => {
    let filteredResults = products;

    if (currentSearchText) {
      let searchTextLower = currentSearchText.toLowerCase();
      filteredResults = filteredResults.filter((item) => {
        return item.name.toLowerCase().includes(searchTextLower);
      });
    }

    if (subCategory.length) {
      filteredResults = filteredResults.filter((item) => {
        return subCategory.some((search) =>
          item.subCategory.startsWith(search)
        );
      });
    }
    return filteredResults;
  };

  return (
    <div className="App">
      <Header
        {...{
          userCart,
          currentUser,
          setCurrentUser,
          currentSearchText,
          handleSearchTextChange,
          products,
          setProducts,
          handleSubCategoryChange,
          subCategory,
          setShowAuth,
          setOpenCart,
          setOpenUsers,
          setAddProduct,
          setEditProduct,
          isAdmin
        }}
      />
      <Main
        {...{
          setOpenCart,
          setUserCart,
          userCart,
          currentUser,
          setModalProduct,
          setOpenProduct,
        }}
        products={filteredProducts()}
      />
      <Product
        {...{
          userCart,
          setUserCart,
          currentUser,
          modalProduct,
          openProduct,
          setOpenProduct,
        }}
      />

      {userCart ? (
        <Cart
          {...{
            currentUser,
            products,
            openCart,
            setOpenCart,
            userCart,
            setUserCart,
          }}
        />
      ) : (
        ""
      )}
      <Auth {...{ setCurrentUser, showAuth, setShowAuth, showLogIn, setShowLogIn, setIsAdmin}} />
      <ViewUsers openUsers={openUsers} setOpenUsers={setOpenUsers} />
      <AdminAddProduct {...{ addProduct, setAddProduct, products, setProducts }} />
      <AdminEditProduct {...{editProduct, setEditProduct, products, setProducts, setEditModal, rowData, setRowData}}/>
      <AdminEditModal {...{editModal, setEditModal, rowData, setRowData, products, setProducts}}/>
    </div>
  );
};
export default App;
