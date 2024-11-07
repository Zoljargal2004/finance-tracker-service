const { v4: uuidv4 } = require("uuid");
const { sql } = require("../configs/database");

const addNewRecord = async (
  userid,
  name,
  amount,
  type,
  description,
  categoryID,
  date,
  time
) => {
  console.log(name, amount, type, description, categoryID, date, time);
  const id = uuidv4();

  try {
    // Ensure `type` is valid for the ENUM defined
    if (type !== "INCOME" && type !== "EXPENSE") {
      throw new Error("Invalid transaction type");
    }

    // Using explicit column names to avoid order issues
    await sql`
    INSERT INTO records (id, userid, name, amount, transactionType, description, transactionDate, transactionTime, categoryID)
    VALUES (${id}, ${userid}, ${name}, ${amount}, ${type}, ${description}, ${date}, ${time}, ${categoryID});
  `;

    return "success";
  } catch (error) {
    // Log or handle the error as needed
    console.error("Error adding new record:", error);
    throw new Error("Failed to add new record");
  }
};

const deleteRecord = async (id) => {
  try {
    // Using explicit column names to avoid order issues
    await sql`
            DELETE FROM records where id=${id}
        `;

    return "success";
  } catch (error) {
    // Log or handle the error as needed
    console.error("Error deleting record:", error);
    throw new Error("Failed to delete record");
  }
};

// const editRecord = async (
//   id,
//   name,
//   amount,
//   type,
//   description,
//   categoryID,
//   date,
//   time
// ) => {
//   try {
//     await sql`UPDATE records set name =${name}, amount=${amount}, transactionType =${type}, description =${description},
//          updatedDate = ${updatedDate}, categoryID = ${categoryID} where id = ${id}`;
//   } catch (error) {
//     console.error("Error: ", error);
//   }
// };

const getRecords = async (userid, day, cat, type, up, down) => {
  console.log(userid);
  try {
    let query = sql`SELECT *
    FROM records AS r
    LEFT JOIN categories AS c ON r.categoryid = c.categoryid
    WHERE r.userid = ${userid} `;
    if (day) {
      query = sql`${query} AND r.transactionDate=${day} `;
    }
    if (cat) {
      query = sql`${query} AND r.categoryid=${cat} `;
    }
    if (type && type != "All") {
      query = sql`${query} AND r.transactiontype = ${type.toUpperCase()} `;
    }
    if (up) {
      query = sql`${query} AND r.amount between ${up} and ${down}`;
    }
    const res = await query;

    return res;
  } catch (error) {
    console.error("Error: ", error);
  }
};

const totalAmount = async (userid, type, month) => {
  try {
    const res = await sql`
      SELECT SUM(amount) 
      FROM records 
      WHERE transactiontype = ${type} 
      AND transactiondate LIKE ${"%-" + month + "-%"} AND userid =${userid};
    `;
    return res[0]?.sum || 0;
  } catch (error) {
    console.error("Error in backend: ", error);
  }
};

const getRecordsByCategory = async (userid) => {
  try {
    const res =
      await sql`select c.name, sum(r.amount) from records  as r left join categories as c on r.categoryid = c.categoryid where c.userid = ${userid} group by c.categoryid`;
    return res;
  } catch (error) {
    console.error("BackendError: ", error);
  }
};

const getRecentRecords = async (number, userid) => {
  try {
    const res = await sql`SELECT *
FROM records
LEFT JOIN categories AS c ON records.categoryid = c.categoryid
WHERE c.userid = ${userid}
ORDER BY records.transactiondate DESC
LIMIT ${number};`;
    return res;
  } catch (error) {
    console.error("backend error: ", error);
  }
};
module.exports = {
  addNewRecord,
  deleteRecord,
  // editRecord,
  getRecordsByCategory,
  getRecentRecords,
  totalAmount,
  getRecords,
};
