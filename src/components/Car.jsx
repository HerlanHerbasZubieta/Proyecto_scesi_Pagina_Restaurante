import React, { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import Order from "./Orders/Order";
import ViewError from "./Window/ViewError";
import { FaShoppingCart, FaRegComments } from "react-icons/fa";
import Comments from "./Comments/Comments";
import ViewBuy from "./Window/ViewBuy";

const Car = ({
  showOrder,
  setShowOrder,
  changeBackground,
  totalPrice,
  setTotalPrice,
}) => {
  const [comments, setComments] = useState(false);
  const [idMenu, setIdMenu] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [client, setClient] = useState([]);
  const [showError, setShowError] = useState(false);

  const user_global = JSON.parse(sessionStorage.getItem("user_logged"));
  var products = JSON.parse(sessionStorage.getItem("add_products"));

  const handleClickComments = () => {
    setComments(true);
  };

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/email/${user_global.email}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los datos del cliente");
        }
        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error("Error al obtener el correo del cliente:", error);
      }
    };

    fetchClient();
  }, []);

  const quitarCantidad = (productoId) => {
    // Buscar el producto por su ID en el array
    const index = products.findIndex(
      (producto) => producto.idMenu === productoId
    );

    if (index !== -1) {
      // Obtener el producto actual y su cantidad
      const productoActual = products[index];
      const nuevaCantidad = productoActual.cantidad - 1;
      setTotalPrice(totalPrice - productoActual.precioMenu);

      // Actualizar la cantidad y el precio total del producto
      if (nuevaCantidad > 0) {
        const productsActualizados = [...products];
        productsActualizados[index] = {
          ...productoActual,
          cantidad: nuevaCantidad,
          precioTotal: nuevaCantidad * productoActual.precioMenu,
        };
        console.log(productsActualizados);
        sessionStorage.setItem(
          "add_products",
          JSON.stringify(productsActualizados)
        );
      } else {
        // Si la cantidad llega a cero, eliminar el producto del array
        console.log("Productos " + products);
        const productsActualizados = products.filter(
          (producto) => producto.idMenu !== productoId
        );
        console.log("Productos actualizados " + productsActualizados);
        sessionStorage.setItem(
          "add_products",
          JSON.stringify(productsActualizados)
        );
      }
    }
  };
  useEffect(() => {
    if (products != null) {
      quitarCantidad(idMenu);
      setIdMenu(0);
    }
  });

  const handleCompraClick = () => {
    if (products.length == 0) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else {
      setShowButtons(true);
    }
  };

  return (
    <div
      className={` lg:col-span-2 fixed top-0 ${
        changeBackground ? "bg-stone-800" : "bg-orange-500"
      } w-full lg:w-96 lg:right-0 h-full transition-all z-20 ${
        showOrder ? "right-0" : "-right-full"
      }`}
    >
      <ViewError
        showError={showError}
        content={"Agrega productos al carrito de compra"}
      />
      <div className="relative pt-16 lg:pt-3 text-gray-300 p-8 h-full">
        <RiCloseLine
          onClick={() => setShowOrder(false)}
          className="lg:hidden absolute left-4 top-4 p-3 box-content text-black bg-slate-100 rounded-full text-xl cursor-pointer"
        />
        {/* Botones */}
        <div className={`flex items-center gap-4 flex-wrap mb-5`}>
          <button
            className={`${
              comments ? "bg-none border border-white" : "bg-[#1F1D2B]"
            } text-white p-3 py-2 px-4 rounded-xl`}
            onClick={() => setComments(false)}
          >
            <p className="mr-2 flex justify-center gap-4 items-center">
              Carrito
              <FaShoppingCart className="mr-3 text-[20px]" />
            </p>
          </button>
          <p></p>
          <button
            className={`${
              comments ? "bg-[#1F1D2B] " : "bg-none border border-white"
            } text-white p-2 py-2 px-4 rounded-xl `}
            onClick={handleClickComments}
          >
            <p className="flex justify-center gap-1 items-center">
              Comentarios
              <FaRegComments className="text-white text-[20px]" />
            </p>
          </button>
        </div>
        <div>
          <div
            className={`${comments ? "hidden" : "grid grid-cols-5 mb-2 p-4"} `}
          >
            <h5 className="col-span-4 text-white">Comida</h5>
            <h5 className="text-white">SubTotal</h5>
          </div>
          <div
            className={`${comments ? "flex justify-center p-3 " : "hidden"}`}
          >
            <h2 className="text-[18px] text-white">
              Comentarios de las personas
            </h2>
          </div>
          {/* Productos seleccionados */}
          <div
            className={`${
              comments ? "hidden" : "block"
            } h-[350px] md:h-[700px] lg:h-[490px] sm:h-[350px] overflow-auto`}
          >
            {products && products.length > 0 ? (
              products.map((orders, index) => (
                <Order
                  key={index}
                  order={orders}
                  idMenu={idMenu}
                  setIdMenu={setIdMenu}
                  changeBackground={changeBackground}
                />
              ))
            ) : (
              <div className="flex flex-col justify-center items-center h-full">
                <p className="text-[25px] text-slate-700 font-serif">
                  Carrito Vacio
                </p>
                <FaShoppingCart className="text-[28px] text-slate-700 mt-2" />
              </div>
            )}
          </div>
          <div
            className={`${
              comments ? "flex flex-col-reverse " : "hidden"
            } h-[470px] md:h-[700px] lg:h-[645px] overflow-y-scroll`}
          >
            <Comments />
          </div>
        </div>
        {/* Comprar */}
        <div
          className={`${changeBackground ? "bg-slate-600" : "bg-[#1F1D2B]"} ${
            comments
              ? "hidden"
              : "block relative w-full bottom-0 left-0 p-4 rounded-[10px]"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <p className="text-white pt-2 pb-2 text-[17px]">Total Pago</p>
            <span className="text-white text-[17px]">
              {Math.abs(totalPrice)}Bs
            </span>
          </div>
          <div>
            <button
              onClick={handleCompraClick}
              className="bg-sky-100 w-full py-2 px-4 rounded-lg text-black hover:bg-slate-500 hover:text-white text-[17px]"
            >
              Comprar
            </button>
          </div>
        </div>
      </div>
      <div
        className={`${
          showButtons
            ? "fixed inset-0 flex items-center justify-center z-50"
            : "hidden"
        }`}
      >
        <ViewBuy
          showButtons={showButtons}
          setShowButtons={setShowButtons}
          client={client}
          totalPrice={totalPrice}
        />
      </div>
    </div>
  );
};

export default Car;
