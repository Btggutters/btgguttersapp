 

<IMPORTANT>
Here is the current living document of the postgres database, if any SQL Query is generated we need to make sure its correct here
,always give me the current table im working with select statement after giving any querys
</IMPORTANT>

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
    ready BOOLEAN,
    GutterFt INT CHECK (GutterFt >= 0),
    Downspout INT CHECK (Downspout >= 0),
    AElbow INT CHECK (AElbow >= 0),
    BElbow INT CHECK (BElbow >= 0),
    OutMiter INT CHECK (OutMiter >= 0),
    InMiter INT CHECK (InMiter >= 0),
    Filter INT CHECK (Filter >= 0),
    color VARCHAR(255),
    BigScrews INT CHECK (BigScrews >= 0),
    SmallScrews INT CHECK (SmallScrews >= 0),
    Caulk INT CHECK (Caulk >= 0),
    Adapter INT CHECK (Adapters >= 0),
    expect_cost DECIMAL(10, 2)
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);


CREATE TABLE material_prices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price_5in NUMERIC,
    price_6in NUMERIC,
    price NUMERIC
);



