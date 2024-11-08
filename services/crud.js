const { v4: uuidv4 } = require("uuid");
const { sql } = require("../configs/database");

const createNewCategory = async (userId, name, icon_name, color) => {
  const id = uuidv4();
  const result =
    await sql`insert into categories values (${id}, ${userId}, ${name}, ${icon_name}, ${color});`;
  return id;
};

async function readCategories(userId) {
  const result = await sql`select * from categories where userid = ${userId};`;
  return result;
}

const deleteCat = async (id) => {
  const result = await sql`delete from categories where categoryID = ${id}`;
  return result;
};

const editCat = async (id, name, icon_name, color) => {
  const result =
    await sql`update categories set name = ${name}, icon_name = ${icon_name}, color = ${color} where categoryid = ${id};`;
  return result;
};

module.exports = {
  createNewCategory,
  readCategories,
  deleteCat,
  editCat,
};
