class Customer {
  constructor(
    customer_id,
    first_name,
    last_name,
    email,
    password,
    phone_number,
    address
  ) {
    this.customer_id = customer_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.phone_number = phone_number;
    this.address = address;
  }

  static fromCustomerData(customerData) {
    return new Customer(
      customerData.customer_id,
      customerData.first_name,
      customerData.last_name,
      customerData.email,
      customerData.password,
      customerData.phone_number,
      customerData.address
    );
  }
}

module.exports = Customer;
