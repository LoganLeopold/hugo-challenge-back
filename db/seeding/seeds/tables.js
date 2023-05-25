module.exports = {

  establishUuidsQuery: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
  
  // base table queries 
  createCustomerTableQuery: `CREATE TABLE IF NOT EXISTS customers (
    lastname varchar(255),
    firstname varchar(255),
    birthday varchar(10),
    street varchar(255),
    city varchar(255),
    state varchar(75),
    zipcode int,
    customer uuid DEFAULT uuid_generate_v4(),
    CONSTRAINT customer_table_key PRIMARY KEY (customer)
  );`,
  
  createVehicleTableQuery: `CREATE TABLE IF NOT EXISTS vehicles (
    vin varchar(225) PRIMARY KEY,
    year smallint,
    make varchar(150),
    model varchar(150)
  );`,
  
  createApplicationTableQuery: `CREATE TABLE IF NOT EXISTS applications (
    application uuid DEFAULT uuid_generate_v4(),
    CONSTRAINT application_table_key PRIMARY KEY (application)
  );`,
  
  createCustomerVehicleJoin: `CREATE TABLE customer_vehicle (
    customer uuid,
    vin varchar(225),
    PRIMARY KEY (customer, vin),
    CONSTRAINT k_customer FOREIGN KEY(customer) REFERENCES customers(customer) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT k_vin FOREIGN KEY(vin) REFERENCES vehicles(vin) ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  
  createCustomerApplicationJoin: `CREATE TABLE IF NOT EXISTS customer_application (
    customer uuid,
    application uuid,
    PRIMARY KEY (customer, application),
    CONSTRAINT k_customer FOREIGN KEY(customer) REFERENCES customers(customer) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT k_application FOREIGN KEY(application) REFERENCES applications(application) ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  
  createVehicleApplicationJoin: `CREATE TABLE IF NOT EXISTS vehicle_application (
    vin varchar(225),
    application uuid,
    PRIMARY KEY (vin, application),
    CONSTRAINT k_vin FOREIGN KEY(vin) REFERENCES vehicles(vin) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT k_application FOREIGN KEY(application) REFERENCES applications(application) ON UPDATE CASCADE ON DELETE CASCADE
  );`,
}