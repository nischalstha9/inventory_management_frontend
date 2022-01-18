import { Button } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import ProductInfoDialog from "./ProductInfoDialog";
const TransactionProducts = ({
  transaction_items,
  grand_total,
  action = false,
  changeTransactions = undefined,
}) => {
  const [items, setItems] = useState(transaction_items);
  const removeTransaction = (trans) => {
    let newTransItems = transaction_items.filter(
      (item) => item.id !== trans.id
    );
    setItems(newTransItems);
    changeTransactions(newTransItems);
  };
  return (
    <div>
      <table border="1" cellSpacing={1} className="transactionProductsTable">
        <thead>
          <tr>
            <th>SN</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price Per Unit</th>
            <th>Total</th>
            {action === true ? <th>Action</th> : ""}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            return (
              <tr>
                <td>{index + 1}</td>
                <td>
                  <ProductInfoDialog
                    itemName={item.item_name}
                    itemId={item.item}
                  />
                </td>
                <td>{item.units}</td>
                <td>Rs. {item.price}</td>
                <td>{item.price * item.units}</td>
                {action === true ? (
                  <td>
                    <Button onClick={() => removeTransaction(item)}>
                      {" X "}
                    </Button>
                  </td>
                ) : (
                  ""
                )}
              </tr>
            );
          })}
          <tr>
            <td colSpan={4}>
              <b>Grand Total</b>
            </td>
            <td colSpan={action === true ? 2 : 1}>
              <b>Rs. {grand_total}</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TransactionProducts;
