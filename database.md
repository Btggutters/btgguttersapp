-i will have our customers data in a database so please make sure all connections are secure  
-postgres is my database so if you need to make a new table or change a table please give me the sql query to do so

-Here is the current structure of the database, if anything is changed we need to update this document



CREATE TABLE material (
    id SERIAL PRIMARY KEY,
    size INT CHECK (size = 5 OR size = 6),
    color VARCHAR(255),
    item VARCHAR(255),
    qty INT CHECK (qty >= 0),
    location VARCHAR(255),
    job_id INT,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);


CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
    companyId INT,
    customerName VARCHAR(255),
    customerPhoneNumber VARCHAR(255),
    customerEmail VARCHAR(255),
    obtainedHow VARCHAR(255),
    FOREIGN KEY (companyId) REFERENCES company(id) ON DELETE SET NULL
);

CREATE TABLE company (
    id SERIAL PRIMARY KEY,
    companyName VARCHAR(255),
    companyAddress VARCHAR(255),
    five_inch_gutter NUMERIC,
    six_inch_gutter NUMERIC,
    five_inch_filter NUMERIC,
    six_inch_filter NUMERIC,
    fascia_wood NUMERIC,
    trim_metal NUMERIC
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    customerId INT NOT NULL,
    address VARCHAR(255),
    drawing VARCHAR(255),
    notes TEXT,
    status VARCHAR(255),
    typeOfWork VARCHAR(255),
    materialId INT,
    FOREIGN KEY (customerId) REFERENCES customer(id),
    FOREIGN KEY (materialId) REFERENCES material(id),
    insDate DATE,
    insStart TIME,
    insEnd TIME,
    estDate DATE,
    estStart TIME,
    estEnd TIME,
    price INT
);

CREATE TABLE job_orders (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL,
    size INT CHECK (size > 0),
    name VARCHAR(255),
    qty INT CHECK (qty >= 0),
    ready BOOLEAN,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE material_prices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price_5in NUMERIC,
    price_6in NUMERIC,
    price NUMERIC
);

accessoriesCost = gutterHangerCost + gutterBigScrewCost + downspoutBigScrewCost + downspoutSmallScrewCost + elbowsSmallScrewPrice + mitersSmallScrewPrice + mitersCaulkPrice + setsCaulkPrice


// At the end of fetchMaterialPrices and updateMaterialCostPriceButton
updateTotalFootageAndMaterialCharge();

// Inside the event listeners for '.inputField' and '#pricePerFootSelector'
document.querySelectorAll('.inputField, #pricePerFootSelector').forEach(input => {
  input.addEventListener('input', () => {
    updateCost(...); // Existing functionality
    updateMaterialCostPriceButton(); // Existing functionality
    updateTotalFootageAndMaterialCharge(); // Add this line
  });
});

