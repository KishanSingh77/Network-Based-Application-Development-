const { getItems } = require("./itemDB");
let categories = [];

getAllCategories = async () => {
  let itemsList = await getItems();

  itemsList.forEach(x => {
    if (!categories.includes(x.catalogCategory)) {
      categories.push(x.catalogCategory);
    }
  });
};

getAllCategories();

module.exports.categories = categories;
