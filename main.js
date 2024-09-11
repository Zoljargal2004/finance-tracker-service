const { startApp } = require("./configs/basic");
const { sql } = require("./configs/database");

const {
  readCategories,
  createNewCategory,
  deleteCat,
  editCat,
} = require("./services/crud");
const {
  addNewRecord,
  editRecord,
  deleteRecord,
  getRecords,
} = require("./services/recordService");

const app = startApp();

app.get("/category/list", async (req, res) => {
  const list = await readCategories();
  res.json(list);
});

app.post("/category/add", async (req, res) => {
  const { name, icon_name, color } = req.body;
  const id = await createNewCategory(name, icon_name, color);
  res.status(201).json({ id });
});

app.put("/category/edit", (req, res) => {
  const { id, name, icon_name, color } = req.body;
  editCat(id, name, icon_name, color);
});

app.delete("/category/delete", (req, res) => {
  const { id } = req.body;
  deleteCat(id);
  res.json("success");
});

// Records

app.post("/record/add", async (req, res) => {
  const { name, amount, type, description, categoryID, date, time } = req.body;

  try {
    // Basic validation
    if (!name || !amount || !type) {
      return res
        .status(400)
        .json({ error: "Name, amount, and type are required" });
    }

    // Ensure type is valid
    if (type !== "INCOME" && type !== "EXPENSE") {
      return res.status(400).json({ error: "Invalid transaction type" });
    }

    // Call the async function and wait for it to complete

    await addNewRecord(name, amount, type, description, categoryID, date, time);

    // Send success response
    res.status(201).json({ message: "Record added successfully" });
  } catch (error) {
    // Handle any errors that occurred
    console.error("Error adding new record:", error);
    res.status(500).json({ error: "Failed to add new record" });
  }
});

app.delete("/record/delete", async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      return res.status(400).json({ error: "ID required" });
    }
    await deleteRecord(id);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(`Error: `, error);
    res.status(500).json({ error: "Failed to delete record" });
  }
});

app.put(`/record/edit`, async (req, res) => {
  const { id, name, amount, type, description, categoryID, date, time } =
    req.body;
  try {
    if (!id || !categoryID || !name || !amount || !type) {
      return res.status(400).json({ error: "REq error" });
    }
    await editRecord(
      id,
      name,
      amount,
      type,
      description,
      categoryID,
      date,
      time
    );
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Failed to edit" });
  }
});

app.get(`/record/list`, async (req, res) => {
  const { date, category, type, min, max } = req.query;

  try {
    const lis = await getRecords(date, category, type, min, max);
    res.status(200).json(lis);
  } catch (error) {
    res.status(404).json({ error: "couldnt find" });
  }
});
