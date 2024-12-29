class Summary {
    constructor(
      order_number_total,
      order_number_in_a_year,
      order_amount_total,
      order_amount_in_a_year,
      top5_products,
      customer_number,

    ) {
      this.order_number_total = order_number_total;
      this.order_number_in_a_year = order_number_in_a_year;
      this.order_amount_total = order_amount_total;
      this.order_amount_in_a_year = order_amount_in_a_year;
      this.top5_products = top5_products;
      this.customer_number = customer_number;

    }   
  }
  
  module.exports = Summary;
  