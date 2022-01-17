import React from "react";
import ProductInfoDialog from "./ProductInfoDialog";
const TransactionProducts = ({ transaction_items, grand_total }) => {
  return (
    <div>
      <hr />
      <h3>Item Details</h3>
      <table border="1" cellSpacing={1} className="transactionProductsTable">
        <thead>
          <tr>
            <th>SN</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price Per Unit</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {transaction_items.map((trans, index) => {
            return (
              <tr>
                <td>{index + 1}</td>
                <td>
                  <ProductInfoDialog
                    itemName={trans.item_name}
                    itemId={trans.item}
                  />
                </td>
                <td>{trans.units}</td>
                <td>Rs. {trans.price}</td>
                <td>{trans.price * trans.units}</td>
              </tr>
            );
          })}
          <tr>
            <td colspan={4}>
              <b>Grand Total</b>
            </td>
            <td>
              <b>Rs. {grand_total}</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TransactionProducts;
